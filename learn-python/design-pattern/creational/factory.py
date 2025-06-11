from abc import ABC, abstractmethod

"""
This script demonstrates the Factory Method design pattern using subatomic particles.

- Particle is the abstract base class (Product).
- Electron, Proton, and Neutron are concrete implementations (Concrete Products).
- ParticleCreator is the abstract creator.
- ElectronCreator, ProtonCreator, and NeutronCreator are concrete factories (Creators) that instantiate specific particles.

The client code interacts only with the creator interface and does not depend on concrete classes directly.
"""


# Product Interface
class Particle(ABC):
    def __init__(self, charge, spin):
        self.charge = charge
        self.spin = spin

    def __str__(self):
        return f"{self.__class__.__name__}(charge={self.charge}, spin={self.spin})"


# Concrete Products
class Electron(Particle):
    pass


class Proton(Particle):
    pass


class Neutron(Particle):
    pass


# Creator (Factory)
class ParticleCreator(ABC):
    @abstractmethod
    def create_particle(self):
        pass


# Concrete Factories
class ElectronCreator(ParticleCreator):
    def create_particle(self):
        return Electron(charge=-1, spin=0.5)


class ProtonCreator(ParticleCreator):
    def create_particle(self):
        return Proton(charge=+1, spin=0.5)


class NeutronCreator(ParticleCreator):
    def create_particle(self):
        return Neutron(charge=0, spin=0.5)


# Client Code
def client_code(creator: ParticleCreator):
    particle = creator.create_particle()
    print(particle)


if __name__ == "__main__":
    client_code(ElectronCreator())  # Electron(charge=-1, spin=0.5)
    client_code(ProtonCreator())  # Proton(charge=1, spin=0.5)
    client_code(NeutronCreator())  # Neutron(charge=0, spin=0.5)
