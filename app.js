const gameOptionContainer = document.querySelector("#game-option");
const rotateButton = document.querySelector("#rotate");

function rotate() {
  const optionShips = gameOptionContainer.children;
  //console.log(optionShips);
  for (const ship of optionShips) {
    console.log(ship.className);
  }
}

rotateButton.addEventListener("click", rotate);
