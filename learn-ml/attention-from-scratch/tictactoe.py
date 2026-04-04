import torch
from attention import self_attention

embeddings = {
    "empty": torch.tensor([0.0, 0.0, 1.0]),
    "O":     torch.tensor([0.0, 1.0, 0.0]),
    "X":     torch.tensor([1.0, 0.0, 0.0])
}

SEQUENCE_LENGTH = 9

Wq = torch.tensor([
    [0.1,  0.2, -0.1],
    [0.3, -0.1,  0.2],
    [-0.2, 0.1,  0.3]
])

Wk = torch.tensor([
    [0.2, -0.1,  0.3],
    [0.1,  0.3, -0.2],
    [-0.1, 0.2,  0.1]
])

Wv = torch.tensor([
    [0.3,  0.1, -0.2],
    [-0.1, 0.2,  0.1],
    [0.2, -0.3,  0.1]
])

state = ["O", "X", "X", "O", "X", "O", "empty", "empty", "empty"]
input = [embeddings[x] for x in state]

final_output = self_attention(input, Wq, Wk, Wv)
print(final_output[6])

