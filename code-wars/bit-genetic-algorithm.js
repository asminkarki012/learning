//https://www.codewars.com/kata/526f35b9c103314662000007
const GeneticAlgorithm = function () {};

GeneticAlgorithm.prototype.generate = function (length) {
  // TODO: Implement the generate method
  let bitString = "";
  for (let i = 0; i < length; i++) {
    bitString += Math.floor(Math.random() * 2);
  }
  return bitString;
};

const geneticAlgorithm = new GeneticAlgorithm();

GeneticAlgorithm.prototype.select = function (population, fitnesses) {
  // TODO: Implement the select method
};

console.log(geneticAlgorithm.select(["11001111"]));
// console.log(geneticAlgorithm.generate(10));

GeneticAlgorithm.prototype.mutate = function (chromosome, p) {
  // TODO: Implement the mutate method
};

GeneticAlgorithm.prototype.crossover = function (chromosome1, chromosome2) {
  // TODO: Implement the crossover method
};

GeneticAlgorithm.prototype.run = function (
  fitness,
  length,
  p_c,
  p_m,
  iterations
) {
  // TODO: Implement the run method
};
