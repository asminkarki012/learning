"""
    What ?
-> lets you construct complex object step by step,allowing you to produce different types and representations of an object.

 Why is it needed?
Problem:
Creating complex objects with many parameters leads to long, confusing constructors, numerous overloads, and error-prone initialization.

Solution:
The Builder pattern separates object construction into clear, step-by-step methods in a builder class, allowing flexible, readable, and safe creation of complex objects without constructor overload.


Implementation:
Lunch Builder Example with:
- Custom Pizza Builder
- Custom Burger Builder
"""

from abc import ABC, abstractmethod


class Lunch:
    def __init__(self, lunch_name):
        self.components = []
        self._lunch_name = lunch_name

    def add_component(self, component):
        self.components.append(component)

    def __str__(self):
        return f"{self._lunch_name.capitalize()} with: {', '.join(self.components)}"


# Lunch Builder Interface
class LunchBuilder(ABC):
    @abstractmethod
    def prepare_base(self, base: str) -> "LunchBuilder":
        pass

    @abstractmethod
    def add_cheese(self, cheese: str) -> "LunchBuilder":
        pass

    @abstractmethod
    def add_meat(self, meat: str) -> "LunchBuilder":
        pass

    @abstractmethod
    def add_toppings(self, toppings: str) -> "LunchBuilder":
        pass

    @abstractmethod
    def get_lunch(self) -> Lunch:
        pass


# Act as directory for proper instructions for building
class LunchDirector:
    def __init__(self, builder):
        self._builder: LunchBuilder = builder

    def construct_standard_lunch(self, *args) -> Lunch:
        base, cheese, meat, topping = args
        if self._builder is None:
            raise ValueError("select lunch builder first")
        return (
            self._builder.prepare_base(base)
            .add_cheese(cheese)
            .add_meat(meat)
            .add_toppings(topping)
            .get_lunch()
        )


class PizzaBuilder(LunchBuilder):
    def __init__(self):
        self._lunch = Lunch("pizza")

    def prepare_base(self, base):
        self._lunch.components.append(base)
        return self

    def add_cheese(self, cheese):
        self._lunch.components.append(cheese)
        return self

    def add_meat(self, meat):
        self._lunch.components.append(meat)
        return self

    def add_toppings(self, topping):
        self._lunch.components.append(topping)
        return self

    def get_lunch(self):
        return self._lunch


if __name__ == "__main__":
    pizza_builder = PizzaBuilder()
    director = LunchDirector(pizza_builder)

    pizza_args = (
        "wheat flour",
        "extra cheese",
        "no meat",
        "olives and peppers",
    )

    pizza = director.construct_standard_lunch(*pizza_args)
