import torch
import math


def dot_product(q, k):
    return torch.dot(q, k)


def attention_score(q, k):
    d_k = len(q)
    return dot_product(q, k) / math.sqrt(d_k)


def softmax(scores):
    scores_tensor = torch.stack(scores)
    return torch.softmax(scores_tensor, dim=0)

def matrix_vector_multiply(matrix, vector):
    return torch.mv(matrix, vector)


def weighted_sum(weights, vectors):
    vector_matrix = torch.stack(vectors)
    return torch.mv(vector_matrix.T, weights)


def get_shape(tensor):
    return tensor.shape
