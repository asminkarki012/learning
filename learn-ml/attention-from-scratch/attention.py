from utils import (
    weighted_sum,
    matrix_vector_multiply,
    attention_score,
    softmax,
    get_shape,
)
import torch


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


def postional_encoding(embeddings):
    rows, cols = get_shape(embeddings)
    positions = torch.arange(rows).unsqueeze(1).expand_as(embeddings)
    dim_idx = torch.arange(cols).unsqueeze(0).expand_as(embeddings)
    dim_size = cols
    even_mask = dim_idx % 2 == 0

    return torch.where(
        even_mask,
        even_pe(positions, dim_idx, dim_size),
        odd_pe(positions, dim_idx, dim_size),
    )


def odd_pe(pos, dim_idx, dim_size):
    denominator = 10_000 ** (dim_idx / dim_size)
    return torch.cos(pos / denominator)


def even_pe(pos, dim_idx, dim_size):
    denominator = 10_000 ** (dim_idx / dim_size)
    return torch.sin(pos / denominator)
