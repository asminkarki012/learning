# Single-Head Attention
- For my scope, I do not think I will be implementing multi-head attention for now.

## Core Concept
Attention allows each word to "look at" other words and decide how much to focus on them.

## Example: "the cat sat"

### Step 1: Create Q, K, V vectors
For each word, we have three vectors:
- **Query (Q)**: "What am I looking for?"
- **Key (K)**: "What do I contain?"
- **Value (V)**: "What do I offer?"

### Step 2: Calculate attention scores
For the word "sat", compute how much it should attend to each word:
```
score_the = Q_sat · K_the
score_cat = Q_sat · K_cat  
score_sat = Q_sat · K_sat
```

### Step 3: Scale the scores
```
scaled_scores = scores / sqrt(d_k)
```
Where d_k is the dimension of the key vectors i.e vector embedding dimension. This prevents very large values.

### Step 4: Apply softmax
Convert scores to weights that sum to 1:
```
weights = softmax(scaled_scores)
// Example result: [0.1, 0.6, 0.3]
```

### Step 5: Weighted sum of values
The new representation of "sat" is:
```
output_sat = 0.1 * V_the + 0.6 * V_cat + 0.3 * V_sat
```

## Key Insight
"sat" now contains information from "cat" (weight 0.6), making it aware that a cat is doing the sitting.

## The Formula
Attention(Q, K, V) = softmax(Q · K^T / sqrt(d_k)) · V

## References:
- [Attention is all you need](https://arxiv.org/pdf/1706.03762)
