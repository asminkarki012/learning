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

export {
  dotProduct,
  softmax,
  attentionScore,
  weightedSum,
  getShape,
  matrixVectorMultiply
}
