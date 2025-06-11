from abc import ABC, abstractmethod


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
    def create_particle(self, particle_type):
        pass


# Single Concrete Factory
class ParticleFactory(ParticleCreator):
    def create_particle(self, particle_type):
        # only instance particle that are requested thus using lambda
        particles = {
            "electron": lambda: Electron(charge=-1, spin=0.5),
            "proton": lambda: Proton(charge=+1, spin=0.5),
            "neutron": lambda: Neutron(charge=0, spin=0.5),
        }
        try:
            return particles[particle_type.lower()]()
        except KeyError:
            raise ValueError(f"Unknown particle type: {particle_type}")


# Client Code
def client_code(creator: ParticleCreator, particle_type: str):
    particle = creator.create_particle(particle_type)
    print(particle)


if __name__ == "__main__":
    factory = ParticleFactory()
    client_code(factory, "electron")
    client_code(factory, "proton")
    client_code(factory, "neutron")
