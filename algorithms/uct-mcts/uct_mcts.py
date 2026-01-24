from typing import Optional
import numpy as np
import graphviz
from math import sqrt, log
from collections import defaultdict
from tic_tac_toe import Tictactoe

# UCT-MCTS Implementation for tic-tac-toe
C_p = 1 / sqrt(2)  # EXPLORATION_CONSTANT from Bandit based Monte-Carlo Planning


class MCTSNode:
    def __init__(self, state: Tictactoe, parent=None, parent_action=None):
        self.state = state
        self.parent = parent
        self.parent_action = parent_action
        self.children: list[MCTSNode] = []
        self.visit_counts = 0
        self.results = defaultdict(int)  # store simulation outcome
        # initial root state no simulation
        self.results[1] = 0  # X wins
        self.results[-1] = 0  # X loses
        self.untried_actions = (
            state.get_legal_moves()
        )  # should to fetch all the legals move from the game

    def reward(self):
        wins = self.results[1]
        loses = self.results[-1]
        return wins - loses

    def visits(self):
        return self.visit_counts

    def expand(self):
        action = self.untried_actions.pop()
        next_state = self.state.next_state(action)
        child_node = MCTSNode(next_state, parent=self, parent_action=action)
        self.children.append(child_node)
        return child_node

    def is_terminal_node(self):
        return self.state.is_gameover()

    def simulation(self):
        curr_sim_state = self.state
        while not curr_sim_state.is_gameover():
            possible_moves = curr_sim_state.get_legal_moves()
            action = self.default_policy(possible_moves)
            curr_sim_state = curr_sim_state.next_state(action)

        return curr_sim_state.game_result()

    def default_policy(self, possible_moves):
        random_move_idx = np.random.randint(len(possible_moves))
        return possible_moves[random_move_idx]

    def backpropagate(self, result):
        self.visit_counts += 1
        self.results[result] += 1
        if self.parent:
            self.parent.backpropagate(result)

    def is_fully_expanded(self):
        return len(self.untried_actions) == 0

    def best_child(self):
        uct_scores = [self.calculate_uct_score(child) for child in self.children]
        best_score = np.argmax(uct_scores)
        return self.children[best_score]

    def calculate_uct_score(self, child: "MCTSNode"):
        w = child.reward()
        n = child.visits()
        assert child.parent is not None
        N = child.parent.visits()
        if n == 0:
            return float("inf")
        exploitation = w / n  # avg reward
        exploration = 2 * C_p * sqrt(2 * log(N) / n)
        uct_score = exploitation + exploration
        return uct_score

    def tree_policy(self):
        current_node = self
        while not current_node.is_terminal_node():
            if not current_node.is_fully_expanded():
                return current_node.expand()
            else:
                current_node = current_node.best_child()
        return current_node

    def best_action(self, simulations_number=2):
        for i in range(simulations_number):
            selected_node = self.tree_policy()
            reward = selected_node.simulation()
            selected_node.backpropagate(reward)

        best_child = self.best_child()
        return best_child.parent_action

    def visualize_tree(self, filename=None, selected_node: Optional["MCTSNode"] = None):
        dot = graphviz.Digraph()

        def add_nodes(node, parent_id=None):
            node_id = str(id(node))
            label = f"Move: {node.parent_action}\nV: {node.visit_counts}\nR: {node.reward()}"

            if node == selected_node:
                dot.node(
                    node_id,
                    label,
                    color="green",
                    style="filled",
                    fillcolor="lightgreen",
                )
            else:
                dot.node(node_id, label)

            if parent_id:
                dot.edge(parent_id, node_id)

            for child in node.children:
                add_nodes(child, node_id)

        add_nodes(self)
        if filename:
            dot.render(filename, view=True)
        return dot
