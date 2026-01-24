# UCT-MCTS (Monte Carlo Tree Search)

## What is it?

- Action selection and planning algorithm for Markov Decision Processes (MDPs)
- Widely used in game-playing and reinforcement learning

## Algorithm

- Selection and Expansion governed by tree policy -> uses UCT engine to balances exploitation and exploration tradeoff
- Simulation governed by default policy
- Backpropagation update the reward and visited counts from the terminal node to root node; no policy is applied in this phase, only statistics are updated

## References:

- https://ai-boson.github.io/mcts/
- http://www.incompleteideas.net/609%20dropbox/other%20readings%20and%20resources/MCTS-survey.pdf
