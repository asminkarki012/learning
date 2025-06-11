import copy


# Prototype Design Pattern Example:
# The Prototype pattern allows you to create new objects by copying existing ones (prototypes),
# instead of creating them from scratch. Here, we clone a 'Jedi' object to make a new, similar Jedi.
# define prototype
class Prototype:
    def clone(self):
        # shallow copy
        return copy.copy(self)


# simple use case for python no need to define interface
class Jedi(Prototype):
    def __init__(self, name, rank):
        self.name = name
        self.rank = rank

    def __str__(self):
        return f"name:{self.name} rank:{self.rank}"


if __name__ == "__main__":
    jedi1 = Jedi("Obi Wan Kenobi", "Jedi Master")
    jedi2 = jedi1.clone()
    jedi2.name = "Mace Windu"
    print(jedi1)
    print(jedi2)
