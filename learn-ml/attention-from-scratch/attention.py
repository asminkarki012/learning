from utils import (
    weighted_sum,
    matrix_vector_multiply,
    attention_score,
    softmax,
)
import torch
import math


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
    weights = softmax(scores)
    output = weighted_sum(weights, values)
    return (output, weights)


def self_attention(embeddings, W_Q, W_K, W_V) -> tuple[torch.Tensor, torch.Tensor]:
    queries, keys, values = compute_qkv(embeddings, W_Q, W_K, W_V)
    results = [compute_attention(q, keys, values) for q in queries]
    outputs = torch.stack([o for o, _ in results])
    weights = torch.stack([w for _, w in results])
    return outputs, weights


def self_attention_torch(q, k, v) -> tuple[torch.Tensor, torch.Tensor]:
    d_k = q.shape[-1]
    scores = (q @ k.transpose(-2, -1)) / math.sqrt(d_k)
    weights = torch.softmax(scores, dim=-1)  # each row sums to 1
    outputs = weights @ v  # [9, 16] — all context vectors at once
    return outputs, weights


def positional_encoding(embeddings) -> torch.Tensor:
    seq_len, d_model = embeddings.shape
    positions = (
        torch.arange(seq_len, device=embeddings.device)
        .unsqueeze(1)
        .expand_as(embeddings)
    )
    dim_idx = (
        torch.arange(d_model, device=embeddings.device)
        .unsqueeze(0)
        .expand_as(embeddings)
    )
    return compute_pe(positions, dim_idx, d_model)


def compute_pe(pos, dim_idx, d_model):
    i = dim_idx // 2  # pair index: (sin, cos) share the same frequency
    denominator = 10_000 ** (i / d_model)
    angle = pos / denominator
    return torch.where(dim_idx % 2 == 0, torch.sin(angle), torch.cos(angle))
