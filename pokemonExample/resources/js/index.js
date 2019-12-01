const defaultTitle = "Who's That Pokemon?";

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const changeTitle = (name) => () => {
  var classes = document.getElementsByClassName("title");
  for (var i in classes) {
    classes[i].innerText = name;
  }
}

const loadPokemon = () => {
  var pokemonContainer = document.getElementById("pokemonContainer");
  pokemonContainer.classList.add("loading");

  const pokemonIndex = getRandomInt(1, allPokemon.length) - 1;
  // const pokemonIndex = 5; // for manual testing
  const pokemon = allPokemon[pokemonIndex];

  const imageUrl = "resources/images/pokemon/"+pokemon.number+".png";
  new pngMaskByUrl(imageUrl, {
    // debug: true,
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
      element.addEventListener('mouseover', changeTitle(pokemon.name));
      element.addEventListener('mouseout', changeTitle(defaultTitle));
      pokemonDiv.appendChild(imageElements[i]);
    }
    pokemonContainer.classList.remove("loading");
  });
}

// initial load
loadPokemon();