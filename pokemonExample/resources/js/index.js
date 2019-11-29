
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const addName = (name) => () => {
  document.getElementById("name1").innerText = name;
  document.getElementById("name2").innerText = name;
  document.getElementById("pokemonContainer").classList.add("hover");
}

const removeName = () => {
  document.getElementById("pokemonContainer").classList.remove("hover");
}

const loadPokemon = () => {
  var pokemonContainer = document.getElementById("pokemonContainer");
  pokemonContainer.classList.add("loading");

  const pokemonIndex = getRandomInt(1, allPokemon.length) - 1;
  // const pokemonIndex = 124; // for manual testing
  const pokemon = allPokemon[pokemonIndex];

  const imageUrl = "resources/images/pokemon/"+pokemon.number+".png";
  new pngMaskByUrl(imageUrl, {
    debug: true,
    mappingTolerance: 1,
    multiplePaths: pokemon.multiplePaths,
    searchTolerance: pokemon.searchTolerance,
    additionalSearchRows: pokemon.additionalSearchRows,
    alphaTolerance: pokemon.alphaTolerance,
    mask: true
  }).then(function(imageElements){
    var pokemonDiv = document.getElementById("pokemon");
    pokemonDiv.innerHTML = "";
    for (var i in imageElements) {
      var element = imageElements[i];
      element.addEventListener('mouseover', addName(pokemon.name));
      element.addEventListener('mouseout', removeName);
      pokemonDiv.appendChild(imageElements[i]);
    }
    pokemonContainer.classList.remove("loading");
  });
}

loadPokemon();