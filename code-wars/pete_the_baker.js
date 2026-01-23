//The Hashtag Generator
function cakes(recipe, available) {
  let isCakePossible;
  Object.keys(recipe).forEach((key) => {
    isCakePossible = available[key] && available[key] !== 0 ? true : false;
  });
  if (!isCakePossible) {
    return 0;
  }
  const howManyCakes = Object.keys(recipe).map((key) => {
    return Math.floor(available[key] / recipe[key]);
  });

  return Math.min(...howManyCakes);
}

console.log(
  cakes(
    { flour: 500, sugar: 200, eggs: 1 },
    { flour: 1200, sugar: 1200, eggs: 5, milk: 200 }
  )
);
