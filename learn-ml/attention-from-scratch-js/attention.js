const sentence = "the cat sat"

const embeddings = {
  "the": [1, 0, 0],
  "cat": [0, 1, 0],
  "sat": [0, 0, 1],
}
d_k = 3

// learnable parameters
const W_Q = [
  [0.2, 0.5, 0.1],
  [0.4, 0.3, 0.6],
  [0.7, 0.2, 0.4]
]

const W_K = [
  [0.3, 0.1, 0.8],
  [0.5, 0.4, 0.2],
  [0.1, 0.6, 0.5]
]

const W_V = [
  [0.6, 0.2, 0.3],
  [0.1, 0.7, 0.4],
  [0.4, 0.3, 0.8]
]

const matrixVectorMultiply = (matrix, vector) => {
  const result = []
  for (let i = 0; i < matrix.length; i++) {
    result.push(dotProduct(matrix[i], vector))

  }
  return result

}

const dotProduct = (q, k) => {
  let result = 0
  for (let i = 0; i < q.length; i++) {
    result += q[i] * k[i]
  }
  return result;
}


const softmax = (scores) => {
  const sumExp = scores.reduce((total, num) => total + Math.exp(num), 0)
  return scores.map((num) => Math.exp(num) / sumExp)
}

const attentionScore = (q, k) => {
  return dotProduct(q, k) / Math.sqrt(d_k)
}

const weightedSum = (weights, vectors) => {
  const output = []
  for (let i = 0; i < weights.length; i++) {

  }
  return output
}


const Q_the = matrixVectorMultiply(W_Q, embeddings["the"])
const K_the = matrixVectorMultiply(W_K, embeddings["the"])
const V_the = matrixVectorMultiply(W_V, embeddings["the"])

const Q_cat = matrixVectorMultiply(W_Q, embeddings["cat"])
const K_cat = matrixVectorMultiply(W_K, embeddings["cat"])
const V_cat = matrixVectorMultiply(W_V, embeddings["cat"])

const Q_sat = matrixVectorMultiply(W_Q, embeddings["sat"])
const K_sat = matrixVectorMultiply(W_K, embeddings["sat"])
const V_sat = matrixVectorMultiply(W_V, embeddings["sat"])

//finding attention score for the
scores_the = []
scores_the.push(attentionScore(Q_the, K_the))
scores_the.push(attentionScore(Q_the, K_cat))
scores_the.push(attentionScore(Q_the, K_sat))

const weights_the = softmax(scores_the);






