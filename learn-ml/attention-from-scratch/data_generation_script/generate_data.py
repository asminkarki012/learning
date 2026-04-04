from tic_tac_toe import Tictactoe
from uct_mcts import MCTSNode
from copy import deepcopy
import json


def run_mcts_vs_mcts(simulations=10):
    game = Tictactoe()
    training_data = []
    count = 0
    while not game.is_gameover():
        count += 1
        root = MCTSNode(state=game)
        best_move = root.best_action(simulations_number=simulations)
        training_data.append({"board": deepcopy(game.board), "move": best_move})
        game.make_move(best_move)

    for entry in training_data:
        entry["result"] = game.winner
    return training_data, game.winner


def generate_training_data(
    filename=None,
    num_games=100,
    simulations=10,
):
    all_data = []
    results = {"X": 0, "O": 0, "draw": 0}

    for _ in range(num_games):
        training_data, winner = run_mcts_vs_mcts(simulations)
        all_data.extend(training_data)

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
    generate_training_data("mcts_training_data.json",1000,20)
