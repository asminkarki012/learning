from typing import Optional
import numpy as np

# import graphviz
from math import sqrt, log
from collections import defaultdict
from data_generation_script.tic_tac_toe import Tictactoe
import torch

# UCT-MCTS Implementation for tic-tac-toe
C_puct = 1 / sqrt(2)  # EXPLORATION_CONSTANT from Bandit based Monte-Carlo Planning


TOKEN_TO_IDX = {"X": 0, "O": 1, "_": 2}
RESULT_TO_IDX = {"X": 1, "O": -1, "_": 0}  # for game result
X = "X"
O = "O"
EMPTY = "_"


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

    def best_action(self, simulations_number=2):
        for _ in range(simulations_number):
            selected_node = self.tree_policy()
            reward = selected_node.evaluate()
            selected_node.backpropagate(reward)

        best_child = self.best_child()
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
