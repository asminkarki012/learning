import torch
import math


def dot_product(q, k):
    return torch.dot(q, k)


def attention_score(q, k):
    d_k = len(q)
    return dot_product(q, k) / math.sqrt(d_k)

def matrix_vector_multiply (matrix,vector):
    pass
    
