import random
from typing import Any

PLAYER_X = "X"
PLAYER_O = "O"

class MinimaxAgent:
    """
    Exact Minimax agent for Tic-Tac-Toe using memoization (transposition table).
    Evaluates game states from Player X's perspective: +1 (X win), 0 (draw), -1 (O win).
    """

    def __init__(self):
        self.cache: dict[tuple[tuple[Any, ...], str], int] = {}

    def get_state_value(self, state) -> int:
        """Computes the minimax value of a board state from Player X's perspective."""
        cache_key = (tuple(state.board), state.turn)
        if cache_key in self.cache:
            return self.cache[cache_key]

        if state.is_gameover():
            return state.game_result()  # Assumes +1 for X win, 0 for draw, -1 for O win

        legal_moves = state.get_legal_moves()
        child_values = [
            self.get_state_value(state.next_state(move)) 
            for move in legal_moves
        ]

        # Player X maximizes score (+1); Player O minimizes score (-1)
        best_value = max(child_values) if state.turn == PLAYER_X else min(child_values)
        
        self.cache[cache_key] = best_value
        return best_value

    def get_optimal_moves(self, state) -> list[int]:
        """Returns all legal moves that yield the best minimax value."""
        legal_moves = state.get_legal_moves()
        move_values = [
            self.get_state_value(state.next_state(move)) 
            for move in legal_moves
        ]

        target_value = max(move_values) if state.turn == PLAYER_X else min(move_values)
        return [move for move, val in zip(legal_moves, move_values) if val == target_value]

    def best_action(self, state) -> int:
        """Selects a random move among all optimal minimax moves."""
        optimal_choices = self.get_optimal_moves(state)
        return random.choice(optimal_choices)
