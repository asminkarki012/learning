import os
import json
import torch
import torch.nn as nn
from attention import self_attention

TOKEN_TO_IDX = {"X": 0, "O": 1, "_": 2}
RESULT_TO_IDX = {"X": 1, "O": -1, "_": 0}  # for game result


def load_training_data(file_path):
    if not os.path.exists(file_path):
        raise ValueError("File does not exists")
    with open(file_path, "r") as f:
        data = json.load(f)

    for each in data:
        each["board_indices"] = torch.tensor(
            [TOKEN_TO_IDX[val] for val in each["board"]]
        )
        each["result_index"] = torch.tensor(RESULT_TO_IDX[each["result"]])
        each["move"] = torch.tensor(each["move"])
    return data


class TicTacToeModel(nn.Module):
    def __init__(self, *args, **kwargs) -> None:
        super().__init__(*args, **kwargs)
        self.W_Q = nn.Parameter(torch.randn(3, 3))
        self.W_K = nn.Parameter(torch.randn(3, 3))
        self.W_V = nn.Parameter(torch.randn(3, 3))
        self.embeddings = nn.Embedding(3, 3)
        self.output_layer = nn.Linear(3, 1)

    def forward(self, x):
        x = self.embeddings(x)
        print("embedding tensors", x.shape)
        x = torch.stack(self_attention(x, self.W_Q, self.W_K, self.W_V))
        print("after attention tensors shape", x.shape)
        y = self.output_layer(x)
        y = y.squeeze(1)
        print("output layer", y.shape)
        return y


file_path = "../../algorithms/uct-mcts/mcts_tictactoe_training.json"
training_data = load_training_data(file_path)

# print(training_data[0])

model = TicTacToeModel()
optimizer = torch.optim.Adam(model.parameters(), lr=1e-4, betas=(0.9, 0.98), eps=1e-9)
criterion = torch.nn.CrossEntropyLoss()

x = training_data[0]["board_indices"]
y = training_data[0]["move"]

logits = model(x)
loss = criterion(logits, y)

print("logits", logits)
print("loss", loss)
optimizer.zero_grad()
loss.backward()
optimizer.step()
