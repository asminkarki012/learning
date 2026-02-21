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
  //vectors[0].length -> length of each vector
  const vectorColCount = vectors[0].length
  for (let i = 0; i < vectorColCount; i++) {
    let sum = 0
    for (let j = 0; j < weights.length; j++) {
      sum += weights[i] * vectors[i][j]
    }
    output.push(sum)
  }
  return output
}

const getShape = (arr) => {
  if (!Array.isArray(arr)) return "not an array"
  if (!Array.isArray(arr[0])) return [arr.length]  // 1D
  return [arr.length, arr[0].length]  // 2D
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

console.log("shape of V_the", getShape(V_the));


// Compute how much "the" should attend to each word in the sentence
// given by q and k when calculating attentionScore
scores_the = []
scores_the.push(attentionScore(Q_the, K_the))
scores_the.push(attentionScore(Q_the, K_cat))
scores_the.push(attentionScore(Q_the, K_sat))

// calculating 
const weights_the = softmax(scores_the);
console.log('weights_the', getShape(weights_the))


//in attention out_the is calculated a weighted sum of the values
output_the = weightedSum(weights_the, [V_the, V_cat, V_sat])
console.log('output_the', output_the)





