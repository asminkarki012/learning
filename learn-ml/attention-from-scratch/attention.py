from utils import weighted_sum, matrix_vector_multiply, attention_score, softmax

def compute_qkv(embeddings, W_Q, W_K, W_V):
    q = []
    k = []
    v = []
    for embedding in embeddings:
        q.append(matrix_vector_multiply(W_Q, embedding))
        k.append(matrix_vector_multiply(W_K, embedding))
        v.append(matrix_vector_multiply(W_V, embedding))
    return q, k, v

def compute_attention(query, keys, values):
    scores = [attention_score(query, key) for key in keys]
    weight = softmax(scores)
    output = weighted_sum(weight, values)
    return output

def self_attention(embeddings, W_Q, W_K, W_V):
    queries, keys, values = compute_qkv(embeddings, W_Q, W_K, W_V)
    outputs = [compute_attention(q, keys, values) for q in queries]
    return outputs
