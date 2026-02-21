const sentence = "the cat sat"

const embeddings = {
  "the": [1, 0, 0],
  "cat": [0, 1, 0],
  "sat": [0, 0, 1],
}
// learnable parameters
const W_Q = [
  [0.2, 0.5, 0.1],
  [0.4, 0.3, 0.6], // // Make Q_cat similar to K_sat so "cat" attends to "sat"
  [0.7, 0.2, 0.4]
]

const W_K = [
  [0.3, 0.1, 0.8],
  [0.5, 0.4, 0.2],
  [0.4, 0.3, 0.6]
]

const W_V = [
  [0.6, 0.2, 0.3],
  [0.1, 0.7, 0.4],
  [0.4, 0.3, 0.8]
]

/*
 * utils functions
 */
const matrixVectorMultiply = (matrix, vector) => {
  const result = []
  for (let i = 0; i < matrix.length; i++) {
    result.push(dotProduct(matrix[i], vector))

  }
  return result
}

const dotProduct = (q, k) => {
  let result = 0
  // console.log("q,k", q, k)
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
  // console.log('attentionsscore', q, k)
  const d_k = q.length;
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
  if (!Array.isArray(arr)) throw new Error("Not an Array")
  if (!Array.isArray(arr[0])) return [arr.length]  // 1D
  return [arr.length, arr[0].length]  // 2D
}

// manaual attention computation for understanding attention
/*
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
const scores_the = []
scores_the.push(attentionScore(Q_the, K_the))
scores_the.push(attentionScore(Q_the, K_cat))
scores_the.push(attentionScore(Q_the, K_sat))

// calculating 
const weights_the = softmax(scores_the);
console.log('weights the', weights_the)

//in attention out_the is calculated a weighted sum of the values
const output_the = weightedSum(weights_the, [V_the, V_cat, V_sat])

const all_keys = [K_the, K_cat, K_sat]
const all_values = [V_the, V_cat, V_sat]

const scores_cat = all_keys.map((key) => attentionScore(Q_cat, key))
const weights_cat = softmax(scores_cat);
const output_cat = weightedSum(weights_cat, all_values)
console.log('weights cat', weights_cat)


const scores_sat = all_keys.map((key) => attentionScore(Q_sat, key))
const weights_sat = softmax(scores_sat);
const output_sat = weightedSum(weights_sat, all_values)
console.log('weights sat', weights_sat)
*/


/*
 * core attention functions refactored
 */
const computeQKV = (embeddings, W_Q, W_K, W_V) => {
  const q = []
  const k = []
  const v = []

  Object.keys(embeddings).forEach((key) => {
    q.push(matrixVectorMultiply(W_Q, embeddings[key]))
    k.push(matrixVectorMultiply(W_K, embeddings[key]))
    v.push(matrixVectorMultiply(W_V, embeddings[key]))
  })

  return { queries: q, keys: k, values: v }
}

const computeAttention = (query, keys, values) => {
  const scores = keys.map((key) => attentionScore(query, key))
  const weight = softmax(scores)
  const output = weightedSum(weight, values)
  return output
}

const selfAttention = (embeddings, W_Q, W_K, W_V) => {
  const { queries, keys, values } = computeQKV(embeddings, W_Q, W_K, W_V)
  const outputs = queries.map((q) => computeAttention(q, keys, values))
  return outputs
}
// console.log('===full attention forward pass===')
// console.log(selfAttention(embeddings, W_Q, W_K, W_V))

export {
  computeAttention,
  computeQKV,
  selfAttention
}

