from data_generation_script.tic_tac_toe import Tictactoe
from data_generation_script.uct_mcts import MCTSNode
from copy import deepcopy
import json
import random


def run_mcts_vs_mcts(simulations=10, temperature_moves=2):
    game = Tictactoe()
    training_data = []
    count = 0
    while not game.is_gameover():
        count += 1
        root = MCTSNode(state=game)
        best_move = root.best_action(simulations_number=simulations)
        # calculate pie as
        # pi = root.visit_counts / sum (child.visit for child in root.children)
        total_visits = sum(child.visit_counts for child in root.children)

        pi = {
            child.parent_action: child.visit_counts / total_visits
            for child in root.children
        }

        pi_value: list[float] = [0] * 9
        for move, prob in pi.items():
            if move is not None:
                pi_value[move] = prob

        player_turn = root.player

        # if count <= temperature_moves:
        #     best_move = random.choices(range(9), weights=pi_value)[0]
        # else:
            # best_move = pi_value.index(max(pi_value))
            # best_move =
            #pass

        training_data.append(
            {
                "board": deepcopy(game.board),
                "move": best_move,
                "pi": pi_value,
                "turn": player_turn,
            }
        )
        game.make_move(best_move)

    for entry in training_data:
        entry["result"] = game.winner
    return training_data, game.winner


def generate_training_data(
    filename=None,
    num_games=100,
    simulations=10,
):
    # 2d array each game are stored in batch wise
    all_data = []
    results = {"X": 0, "O": 0, "draw": 0}

    for _ in range(num_games):
        training_data, winner = run_mcts_vs_mcts(simulations)

        all_data.append(training_data)

        if winner in ["X", "O"]:
            results[winner] += 1
        else:
            results["draw"] += 1

    print(f"\ngame win summary {results}")
    if not filename:
        return

    with open(filename, "w") as f:
        json.dump(all_data, f)

    print(f"mcts training data saved {filename}")


if __name__ == "__main__":
    generate_training_data(
        "./data_generation_script/mcts_training_with_temperature_moves_with_mcts_best_action.json",
        2000,
        200,
    )
