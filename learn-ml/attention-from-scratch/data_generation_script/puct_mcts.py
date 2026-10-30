import random

# import graphviz
from math import sqrt

import numpy as np
import torch
from data_generation_script.tic_tac_toe import Tictactoe

# UCT-MCTS Implementation for tic-tac-toe
C_puct = 2.0  # EXPLORATION_CONSTANT from Bandit based Monte-Carlo Planning


TOKEN_TO_IDX = {"X": 0, "O": 1, "_": 2}
RESULT_TO_IDX = {"X": 1, "O": -1, "_": 0}  # for game result
X = "X"
O = "O"
EMPTY = "_"

EPSILON = 0.25

# higher value means lower uneven noise and vice versa
DIRICHLET_TOTAL_CONCENTRATION = 10.0


class PUCTNode:
    def __init__(
        self,
        state: Tictactoe,
        model,  # this model should be in model.eval()
        parent=None,
        parent_action=None,
        value=0.0,
        prior_prob=0.0,
    ):
        self.state = state
        self.parent = parent
        self.player = state.turn
        self.parent_action = parent_action
        self.W = 0.0
        self.value = value
        self.prior_prob = prior_prob
        self.model = model
        self.children: list[PUCTNode] = []
        self.visit_counts = 0

    def visits(self):
        return self.visit_counts

    def expand(self):

        model_device = next(self.model.parameters()).device
        game_states = torch.tensor(
            [(TOKEN_TO_IDX[move]) for move in self.state.board], device=model_device
        )

        # Add batch dimension because the model expects input shaped [batch, seq_len].
        # PUCT evaluates one board at a time, so batch size is 1 here.
        # since the model should be in evaluation mode backprop, batchnorm are off for eval mode
        with torch.no_grad():
            log_probs, value, _ = self.model(game_states.unsqueeze(0))

        legal_moves = self.state.get_legal_moves()
        legal_log_probs = log_probs[0, legal_moves]
        legal_probs = torch.exp(legal_log_probs)
        legal_probs = legal_probs / (legal_probs.sum() + 1e-8)
        self.value = value.item()

        # make sure legal moves are properly normalized assert that value
        assert torch.isclose(legal_probs.sum(), torch.tensor(1.0)), (
            f"Probabilities sum to {legal_probs.sum()}, expected 1.0!"
        )

        # legal_probs[idx] is the renormalized prior for legal_moves[idx]
        for idx, action in enumerate(legal_moves):
            # Remove the batch dimension; PUCT works with one board's 9 move probabilities.
            prior_prob = legal_probs[idx].item()
            next_state = self.state.next_state(action)
            child_node = PUCTNode(
                next_state,
                parent=self,
                parent_action=action,
                prior_prob=prior_prob,
                model=self.model,
            )
            self.children.append(child_node)

    def is_terminal_node(self):
        return self.state.is_gameover()

    def backpropagate(self, result):
        self.visit_counts += 1
        self.W += result

        # when traversing upward for each turn need to flip the perspective
        if self.parent:
            self.parent.backpropagate(
                -result if self.player != self.parent.player else result
            )

    def is_fully_expanded(self):
        return len(self.children) > 0

    def evaluate(self):
        if self.is_terminal_node():
            result = self.state.game_result()
            # because right now ttt is only from perspective of X so need to flip
            return result if self.player == X else -result

        return self.value

    def best_child(self):
        puct_scores = [self.calculate_puct_score(child) for child in self.children]
        best_score = np.argmax(puct_scores)
        return self.children[best_score]

    def calculate_puct_score(self, child: "PUCTNode"):
        W = child.W
        n = child.visits()
        P = child.prior_prob
        assert child.parent is not None
        N = child.parent.visits()

        sign = -1 if child.player != self.player else 1
        Q = sign * W / n if n != 0 else 0  # avg reward
        U = C_puct * P * (sqrt(N) / (1 + n))
        puct_score = Q + U
        return puct_score

    def tree_policy(self) -> "PUCTNode":
        current_node = self
        while not current_node.is_terminal_node():
            if not current_node.is_fully_expanded():
                current_node.expand()
                return current_node

            current_node = current_node.best_child()
        return current_node

    def most_visited_child(self) -> "PUCTNode":
        return max(self.children, key=lambda child: child.visits())

    def total_child_visits(self) -> int:
        return sum(child.visits() for child in self.children)

    def calculate_pi(self):
        total_child_visits = self.total_child_visits()

        if total_child_visits == 0:
            raise ValueError(
                "cannot calculate policy distribution without any child visit"
            )

        pi = {
            child.parent_action: (child.visit_counts / total_child_visits)
            for child in self.children
        }

        assert np.isclose(sum(pi.values()), 1.0), (
            f"Policy probabilities must sum to 1. Got {sum(pi.values())}"
        )

        # for all tic tac toe action eg. for size 3 = 9 actions
        total_actions = self.state.SIZE**2
        pi_value = [0.0] * total_actions
        for move, prob in pi.items():
            if move is not None:
                pi_value[move] = prob

        return pi_value

    def add_dirichlet_noise(self):
        legal_moves_count = len(self.children)
        # concentration parameters given as 10/legal_moves
        # scaled inversely with number of moves
        alpha = torch.full(
            (legal_moves_count,),
            DIRICHLET_TOTAL_CONCENTRATION / legal_moves_count,
        )
        dirichlet_noise = torch.distributions.dirichlet.Dirichlet(alpha).sample()

        for child_idx in range(legal_moves_count):
            prior_prob = (1 - EPSILON) * self.children[
                child_idx
            ].prior_prob + EPSILON * dirichlet_noise[child_idx]
            self.children[child_idx].prior_prob = prior_prob.item()

    def best_action(self, simulations_number=10, is_training=False, move_count=0):
        for sim_idx in range(simulations_number):
            if not self.children and not self.is_terminal_node():
                self.expand()

            # accn to paper dirichlet noise is added after root expand for first sim
            # This helps the search explore different moves.
            if sim_idx == 0 and is_training and self.children:
                self.add_dirichlet_noise()

            selected_node = self.tree_policy()
            reward = selected_node.evaluate()
            selected_node.backpropagate(reward)

        pi = self.calculate_pi()

        if is_training and move_count <= 2:
            best_action = np.random.choice(len(pi), p=np.array(pi))
        else:
            best_action = pi.index(max(pi))

        print("parent action", self.most_visited_child().parent_action)

        return best_action, pi

    # def visualize_tree(self, filename=None, selected_node: Optional["PUCTNode"] = None):
    #     dot = graphviz.Digraph()
    #
    #     def add_nodes(node, parent_id=None):
    #         node_id = str(id(node))
    #         label = f"Move: {node.parent_action}\nV: {node.visit_counts}\nR: {node.reward()}"
    #     label = (
    #     f"Move: {node.parent_action} (Player: {node.state.turn})\n"
    #     f"N: {node.visits_count} | P: {node.prior_prob:.2f}\n"
    #     f"W: {node.W:.2f} | Q: {node.Q:.2f}\n"
    #     f"PUCT: {node.puct_score:.2f}"
    # )
    #
    #         if node == selected_node:
    #             dot.node(
    #                 node_id,
    #                 label,
    #                 color="green",
    #                 style="filled",
    #                 fillcolor="lightgreen",
    #             )
    #         else:
    #             dot.node(node_id, label)
    #
    #         if parent_id:
    #             dot.edge(parent_id, node_id)
    #
    #         for child in node.children:
    #             add_nodes(child, node_id)
    #
    #     add_nodes(self)
    #     if filename:
    #         dot.render(filename, view=True)
    #     return dot
