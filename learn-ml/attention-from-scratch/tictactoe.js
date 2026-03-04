/*
 * Implement tic tac toe logic here
 * implement positional encoding for tic tac toe
 * 3 X 3 tictactoe
 */

import { selfAttention } from "./attention.js"


// we hve 3 different symbol for TTT
const embeddings = {
  "empty": [0, 0, 1],
  "O": [0, 1, 0],
  "X": [1, 0, 0]
}

const SEQUENCE_LENGTH = 9

const Wq = [
  [0.1, 0.2, -0.1],
  [0.3, -0.1, 0.2],
  [-0.2, 0.1, 0.3]
]

const Wk = [
  [0.2, -0.1, 0.3],
  [0.1, 0.3, -0.2],
  [-0.1, 0.2, 0.1]
]

const Wv = [
  [0.3, 0.1, -0.2],
  [-0.1, 0.2, 0.1],
  [0.2, -0.3, 0.1]
]

const state = ["O", "X", "X", "O", "X", "O", "empty", "empty", "empty"]


const input = state.map(x => embeddings[x])

const finalOutput = selfAttention(input, Wq, Wk, Wv);
console.log(finalOutput[6])


