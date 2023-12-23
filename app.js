const gameOptionContainer = document.querySelector("#game-option");
const rotateButton = document.querySelector("#rotate");
const gameBoardsContainer = document.querySelector("#game-boards");

let angle = 0;

let width = 10;

function rotate() {
  // const optionShips = gameOptionContainer.children;
  //console.log(optionShips);
  //   for (const ship of optionShips) {
  //     console.log(ship.className);
  //     ship.style.transform = "rotate(90deg)";
  //   }
  const optionShips = Array.from(gameOptionContainer.children);
  angle = angle === 0 ? 90 : 0;
  optionShips.forEach(
    (optionShip) => (optionShip.style.transform = `rotate(${angle}deg)`)
  );
}

rotateButton.addEventListener("click", rotate);

function createBoard(color, user) {
  const gameBoard = document.createElement("div");
  gameBoard.classList.add("game-board");
  gameBoard.style.background = color;
  gameBoard.id = user;
  gameBoardsContainer.append(gameBoard);
  for (let i = 0; i < width * width; i++) {
    const block = document.createElement("div");
    block.classList.add("block");
    block.id = `block-${i}`;
    gameBoard.append(block);
  }
}

createBoard("tan", "human");
createBoard("pink", "computer");

class Ship {
  constructor(name, length) {
    this.name = name;
    this.length = length;
  }
}

const ship1 = new Ship("deck-one", 1);
const ship2 = new Ship("deck-one", 1);
const ship3 = new Ship("deck-three", 3);
const ship4 = new Ship("deck-three", 3);

const ships = [ship1, ship2, ship3, ship4];

let isHorisontal = true;

let notDropped;

function getValidity(allBoardBlocks, isHorisontal, startIndex, ship) {
  let validStart = isHorisontal
    ? startIndex <= width * width - ship.length
      ? startIndex
      : width * width - ship.length
    : startIndex <= width * width - width * ship.length
    ? startIndex
    : width * width - width * ship.length;
  console.log(validStart, isHorisontal);
  let shipBlocks = [];

  for (let i = 0; i < ship.length; i++) {
    if (isHorisontal) {
      //console.log(allBoardBlocks[randomStartIndex + i]);
      shipBlocks.push(allBoardBlocks[Number(validStart) + i]);
    } else {
      //console.log(allBoardBlocks[Number(randomStartIndex) + i * width]);
      shipBlocks.push(allBoardBlocks[Number(validStart) + i * width]);
    }
  }

  const notTaken = shipBlocks.every(
    (shipBlocks) => !shipBlocks.classList.contains("taken")
  );

  return { shipBlocks, notTaken };
}

function generate(user, ship, startId) {
  //   const allBoardBlocks = document.querySelectorAll("#computer div");
  //   let randomBoolean = Math.random() < 0.5;
  //   isHorisontal = randomBoolean;
  const allBoardBlocks = document.querySelectorAll(`#${user} div`);
  let randomBoolean = Math.random() < 0.5;
  isHorisontal = user === "human" ? angle === 0 : randomBoolean;
  let randomStartIndex = Math.floor(Math.random() * width * width);
  let startIndex = startId ? startId.substr(6) : randomStartIndex;

  const { shipBlocks, notTaken } = getValidity(
    allBoardBlocks,
    isHorisontal,
    startIndex,
    ship
  );

  if (notTaken) {
    shipBlocks.forEach((shipBlock) => {
      shipBlock.classList.add(ship.name);
      shipBlock.classList.add("taken");
    });
  } else {
    if (user === "computer") generate(user, ship);
    if (user === "human") notDropped = true;
  }

  console.log(shipBlocks);
  //   shipBlocks.forEach((shipBlock) => {
  //     shipBlock.classList.add(ship.name);
  //     shipBlock.classList.add("taken");
  //   });
}

//generate(ship3);
ships.forEach((ship) => generate("computer", ship));

let draggedShip;

const optionShips = Array.from(gameOptionContainer.children);

optionShips.forEach((optionShip) =>
  optionShip.addEventListener("dragstart", dragStart)
);

const allUserBlocks = document.querySelectorAll("#human div");
allUserBlocks.forEach((userBlock) => {
  userBlock.addEventListener("dragover", dragOver);
  userBlock.addEventListener("drop", dropShip);
});

function dragStart(event) {
  draggedShip = event.target;
  notDropped = false;
}

function dragOver(event) {
  event.preventDefault();
  const ship = ships[draggedShip.id.substr(5)];
  highlight(event.target.id.substr(6), ship);
}

function dropShip(event) {
  const startID = event.target.id;
  const ship = ships[draggedShip.id.substr(5)];
  generate("human", ship, startID);
  if (!notDropped) {
    draggedShip.remove();
  }
}

function highlight(startIndex, ship) {
  const allBoardBlocks = document.querySelectorAll("#human div");
  let isHorisontal = angle === 0;
  const { shipBlocks, notTaken } = getValidity(
    allBoardBlocks,
    isHorisontal,
    startIndex,
    ship
  );
  if (notTaken) {
    shipBlocks.forEach((shipBlock) => {
      shipBlock.classList.add("hover");
      setTimeout(() => shipBlock.classList.remove("hover"), 500);
    });
  }
}
