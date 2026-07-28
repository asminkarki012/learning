from typing import Optional
from matplotlib.pylab import dirichlet
import numpy as np

# import graphviz
from math import sqrt, log
from collections import defaultdict
from data_generation_script.tic_tac_toe import Tictactoe
import torch

# UCT-MCTS Implementation for tic-tac-toe
C_puct = 2.0  # EXPLORATION_CONSTANT from Bandit based Monte-Carlo Planning


TOKEN_TO_IDX = {"X": 0, "O": 1, "_": 2}
RESULT_TO_IDX = {"X": 1, "O": -1, "_": 0}  # for game result
X = "X"
O = "O"
EMPTY = "_"

EPSILON = 0.25


class PUCTNode:
    def __init__(
        self,
        state: Tictactoe,
        model,
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
        game_states = torch.tensor([(TOKEN_TO_IDX[move]) for move in self.state.board])

        log_probs, value, _ = self.model(game_states)

        legal_moves = self.state.get_legal_moves()
        self.value = value.item()

        for action in legal_moves:
            prior_prob = torch.exp(log_probs[action]).item()
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
            self.parent.backpropagate(-result)

    def is_fully_expanded(self):
        return len(self.children) > 0

    def evaluate(self):
        if self.is_terminal_node():
            result = self.state.game_result()
            # because right now ttt is only from perspective of X so need to flip
            if self.player == X:
                return result
            return -result

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

        Q = W / n if n != 0 else 0  # avg reward
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

    def best_action(self, simulations_number=2, is_training=False):
        for sim_idx in range(simulations_number):
            selected_node = self.tree_policy()
            reward = selected_node.evaluate()
            selected_node.backpropagate(reward)
            # add dirichlet noise that only affects the root node
            # after children have been expanded
            if sim_idx == 0 and is_training:
                num_legal_moves = len(self.children)
                # concentration parameters given as 10/legal_moves
                # scaled inversely with number of moves
                alpha = torch.full((num_legal_moves,), 10 / num_legal_moves)
                dirichlet_noise = torch.distributions.dirichlet.Dirichlet(
                    alpha
                ).sample()

                # print("before:", [c.prior_prob for c in self.children])

                for child_idx in range(num_legal_moves):
                    prior_prob = (1 - EPSILON) * self.children[
                        child_idx
                    ].prior_prob + EPSILON * dirichlet_noise[child_idx]
                    self.children[child_idx].prior_prob = prior_prob.item()

                # print("after:", [c.prior_prob for c in self.children])

        best_child = self.most_visited_child()
        return best_child.parent_action

    # def visualize_tree(self, filename=None, selected_node: Optional["MCTSNode"] = None):
    #     dot = graphviz.Digraph()
    #
    #     def add_nodes(node, parent_id=None):
    #         node_id = str(id(node))
    #         label = f"Move: {node.parent_action}\nV: {node.visit_counts}\nR: {node.reward()}"
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
