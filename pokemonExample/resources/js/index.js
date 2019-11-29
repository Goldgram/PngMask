const allPokemon = [
  {number:"001", name:"Bulbasaur"},
  {number:"002", name:"Ivysaur"},
  {number:"003", name:"Venusaur", multiplePaths:true, searchTolerance:2},
  {number:"004", name:"Charmander"},
  {number:"005", name:"Charmeleon", multiplePaths:true, additionalSearchRows:[320]},
  {number:"006", name:"Charizard", multiplePaths:true},
  {number:"007", name:"Squirtle"},
  {number:"008", name:"Wartortle"},
  {number:"009", name:"Blastoise"},
  {number:"010", name:"Caterpie"},
  {number:"011", name:"Metapod"},
  {number:"012", name:"Butterfree"},
  {number:"013", name:"Weedle"},
  {number:"014", name:"Kakuna"},
  {number:"015", name:"Beedrill"},
  {number:"016", name:"Pidgey", multiplePaths:true, additionalSearchRows:[385,403]},
  {number:"017", name:"Pidgeotto", multiplePaths:true, searchTolerance:2},
  {number:"018", name:"Pidgeot", multiplePaths:true, additionalSearchRows:[168,200]},
  {number:"019", name:"Rattata", multiplePaths:true, additionalSearchRows:[351]},
  {number:"020", name:"Raticate"},
  {number:"021", name:"Spearow"},
  {number:"022", name:"Fearow"},
  {number:"023", name:"Ekans"},
  {number:"024", name:"Arbok"},
  {number:"025", name:"Pikachu"},
  {number:"026", name:"Raichu", multiplePaths:true, searchTolerance:3},
  {number:"027", name:"Sandshrew"},
  {number:"028", name:"Sandslash"},
  {number:"029", name:"Nidoran♀"},
  {number:"030", name:"Nidorina"},
  {number:"031", name:"Nidoqueen"},
  {number:"032", name:"Nidoran♂"},
  {number:"033", name:"Nidorino"},
  {number:"034", name:"Nidoking", multiplePaths:true, additionalSearchRows:[220,250]},
  {number:"035", name:"Clefairy"},
  {number:"036", name:"Clefable"},
  {number:"037", name:"Vulpix"},
  {number:"038", name:"Ninetales", multiplePaths:true, additionalSearchRows:[170,305,380]},
  {number:"039", name:"Jigglypuff"},
  {number:"040", name:"Wigglytuff"},
  {number:"041", name:"Zubat"},
  {number:"042", name:"Golbat"},
  {number:"043", name:"Oddish"},
  {number:"044", name:"Gloom"},
  {number:"045", name:"Vileplume"},
  {number:"046", name:"Paras"},
  {number:"047", name:"Parasect", multiplePaths:true, additionalSearchRows:[282]},
  {number:"048", name:"Venonat"},
  {number:"049", name:"Venomoth"},
  {number:"050", name:"Diglett"},
  {number:"051", name:"Dugtrio"},
  {number:"052", name:"Meowth", multiplePaths:true, additionalSearchRows:[140,180,208]},
  {number:"053", name:"Persian", multiplePaths:true, searchTolerance:2},
  {number:"054", name:"Psyduck"},
  {number:"055", name:"Golduck", multiplePaths:true, additionalSearchRows:[204]},
  {number:"056", name:"Mankey"},
  {number:"057", name:"Primeape", multiplePaths:true, additionalSearchRows:[110,220,330]},
  {number:"058", name:"Growlithe"},
  {number:"059", name:"Arcanine", multiplePaths:true, additionalSearchRows:[210,362]},
  {number:"060", name:"Poliwag", multiplePaths:true, additionalSearchRows:[300]},
  {number:"061", name:"Poliwhirl"},
  {number:"062", name:"Poliwrath"},
  {number:"063", name:"Abra"},
  {number:"064", name:"Kadabra", multiplePaths:true, additionalSearchRows:[140]},
  {number:"065", name:"Alakazam", multiplePaths:true, additionalSearchRows:[269]},
  {number:"066", name:"Machop"},
  {number:"067", name:"Machoke", multiplePaths:true, additionalSearchRows:[200]},
  {number:"068", name:"Machamp"},
  {number:"069", name:"Bellsprout", multiplePaths:true, searchTolerance:2},
  {number:"070", name:"Weepinbell"},
  {number:"071", name:"Victreebel", multiplePaths:true},
  {number:"072", name:"Tentacool"},
  {number:"073", name:"Tentacruel", multiplePaths:true, additionalSearchRows:[252,267,293,330]},
  {number:"074", name:"Geodude"},
  {number:"075", name:"Graveler"},
  {number:"076", name:"Golem"},
  {number:"077", name:"Ponyta", multiplePaths:true, additionalSearchRows:[260,370]},
  {number:"078", name:"Rapidash", multiplePaths:true, searchTolerance:2},
  {number:"079", name:"Slowpoke"},
  {number:"080", name:"Slowbro"},
  {number:"081", name:"Magnemite"},
  {number:"082", name:"Magneton"},
  {number:"083", name:"Farfetch'd", multiplePaths:true, additionalSearchRows:[175,375]},
  {number:"084", name:"Doduo", multiplePaths:true, additionalSearchRows:[340]},
  {number:"085", name:"Dodrio", multiplePaths:true, additionalSearchRows:[61,100,116,160]},
  {number:"086", name:"Seel"},
  {number:"087", name:"Dewgong"},
  {number:"088", name:"Grimer"},
  {number:"089", name:"Muk"},
  {number:"090", name:"Shellder"},
  {number:"091", name:"Cloyster"},
  {number:"092", name:"Gastly", multiplePaths:true, additionalSearchRows:[38,158,208,408,434]},
  {number:"093", name:"Haunter", multiplePaths:true},
  {number:"094", name:"Gengar"},
  {number:"095", name:"Onix"},
  {number:"096", name:"Drowzee"},
  {number:"097", name:"Hypno", multiplePaths:true, additionalSearchRows:[225]},
  {number:"098", name:"Krabby", multiplePaths:true, additionalSearchRows:[287,302,314]},
  {number:"099", name:"Kingler", multiplePaths:true, additionalSearchRows:[260,309,322]},
  {number:"100", name:"Voltorb"},
  {number:"101", name:"Electrode"},
  {number:"102", name:"Exeggcute"},
  {number:"103", name:"Exeggutor"},
  {number:"104", name:"Cubone"},
  {number:"105", name:"Marowak"},
  {number:"106", name:"Hitmonlee", multiplePaths:true, additionalSearchRows:[170]},
  {number:"107", name:"Hitmonchan"},
  {number:"108", name:"Lickitung"},
  {number:"109", name:"Koffing", multiplePaths:true, additionalSearchRows:[100,200,230,390,408]},
  {number:"110", name:"Weezing", multiplePaths:true, additionalSearchRows:[75,125,200,270,360,384]},
  {number:"111", name:"Rhyhorn"},
  {number:"112", name:"Rhydon"},
  {number:"113", name:"Chansey"},
  {number:"114", name:"Tangela"},
  {number:"115", name:"Kangaskhan"},
  {number:"116", name:"Horsea"},
  {number:"117", name:"Seadra"},
  {number:"118", name:"Goldeen", multiplePaths:true, additionalSearchRows:[270]},
  {number:"119", name:"Seaking"},
  {number:"120", name:"Staryu"},
  {number:"121", name:"Starmie"},
  {number:"122", name:"Mr. Mime", multiplePaths:true, additionalSearchRows:[96,146,396,403]},
  {number:"123", name:"Scyther", multiplePaths:true, additionalSearchRows:[148,270,340]},
  {number:"124", name:"Jynx"},
  {number:"125", name:"Electabuzz", multiplePaths:true, additionalSearchRows:[90,136,360]},
  {number:"126", name:"Magmar", multiplePaths:true, additionalSearchRows:[244,249]},
  {number:"127", name:"Pinsir"},
  {number:"128", name:"Tauros"},
  {number:"129", name:"Magikarp", multiplePaths:true, additionalSearchRows:[335]},
  {number:"130", name:"Gyarados", multiplePaths:true, additionalSearchRows:[210]},
  {number:"131", name:"Lapras"},
  {number:"132", name:"Ditto"},
  {number:"133", name:"Eevee"},
  {number:"134", name:"Vaporeon"},
  {number:"135", name:"Jolteon"},
  {number:"136", name:"Flareon", multiplePaths:true, additionalSearchRows:[192]},
  {number:"137", name:"Porygon"},
  {number:"138", name:"Omanyte"},
  {number:"139", name:"Omastar"},
  {number:"140", name:"Kabuto", multiplePaths:true, additionalSearchRows:[335,355]},
  {number:"141", name:"Kabutops", multiplePaths:true, additionalSearchRows:[320]},
  {number:"142", name:"Aerodactyl", multiplePaths:true, additionalSearchRows:[220]},
  {number:"143", name:"Snorlax"},
  {number:"144", name:"Articuno", multiplePaths:true, searchTolerance:2},
  {number:"145", name:"Zapdos", multiplePaths:true, additionalSearchRows:[250,281]},
  {number:"146", name:"Moltres", multiplePaths:true, additionalSearchRows:[252,278]},
  {number:"147", name:"Dratini"},
  {number:"148", name:"Dragonair"},
  {number:"149", name:"Dragonite"},
  {number:"150", name:"Mewtwo", multiplePaths:true, additionalSearchRows:[125]},
  {number:"151", name:"Mew", multiplePaths:true, additionalSearchRows:[170]},
];

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