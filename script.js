let gameRunning = false;
let score = 0;
let timeRemaining = 30;
let dropMaker;
let timer;

const winningMessages = [
  "You made a splash! Every drop counts.",
  "Brilliant catch! Clean water for communities.",
  "Water champion! You reached the goal.",
];

const losingMessages = [
  "Good effort! Try again and beat 20 drops.",
  "Every drop matters. Give it another splash!",
  "The next round is yours. Try again!",
];

const startButton = document.getElementById("start-btn");
const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");
const gameContainer = document.getElementById("game-container");
const resultPanel = document.getElementById("game-result");
const resultMessage = document.getElementById("result-message");
const resultScore = document.getElementById("result-score");

startButton.addEventListener("click", startGame);

function startGame() {
  if (gameRunning) return;

  gameRunning = true;
  score = 0;
  timeRemaining = 30;
  scoreDisplay.textContent = score;
  timeDisplay.textContent = timeRemaining;
  startButton.disabled = true;
  startButton.textContent = "Game in Progress";
  resultPanel.hidden = true;
  gameContainer.querySelectorAll(".water-drop").forEach((drop) => drop.remove());

  createDrop();
  dropMaker = setInterval(createDrop, 1000);
  timer = setInterval(updateTimer, 1000);
}

function updateTimer() {
  timeRemaining -= 1;
  timeDisplay.textContent = timeRemaining;

  if (timeRemaining <= 0) endGame();
}

function endGame() {
  if (!gameRunning) return;

  gameRunning = false;
  clearInterval(dropMaker);
  clearInterval(timer);
  gameContainer.querySelectorAll(".water-drop").forEach((drop) => drop.remove());

  const messages = score >= 20 ? winningMessages : losingMessages;
  resultMessage.textContent = messages[Math.floor(Math.random() * messages.length)];
  resultScore.textContent = `Final score: ${score}`;
  resultPanel.hidden = false;
  timeDisplay.textContent = "0";
  startButton.disabled = false;
  startButton.textContent = "Play Again";
}

function createDrop() {
  if (!gameRunning) return;

  const drop = document.createElement("div");
  const isBadDrop = Math.random() < 0.25;
  drop.className = isBadDrop ? "water-drop bad-drop" : "water-drop";
  drop.setAttribute("role", "button");
  drop.setAttribute("aria-label", isBadDrop ? "Avoid bad water drop" : "Catch water drop");
  drop.tabIndex = 0;

  const initialSize = 60;
  const sizeMultiplier = Math.random() * 0.8 + 0.5;
  const size = initialSize * sizeMultiplier;
  drop.style.width = drop.style.height = `${size}px`;
  drop.style.setProperty("--drop-size", `${size}px`);
  drop.style.setProperty("--fall-distance", `${gameContainer.clientHeight + size}px`);

  const gameWidth = gameContainer.clientWidth;
  const xPosition = Math.random() * Math.max(0, gameWidth - size);
  drop.style.left = `${xPosition}px`;
  drop.style.animationDuration = "4s";

  let collected = false;
  const collectDrop = () => {
    if (!gameRunning || collected) return;

    collected = true;
    score = isBadDrop ? Math.max(0, score - 1) : score + 1;
    scoreDisplay.textContent = score;
    drop.remove();
  };

  drop.addEventListener("pointerdown", collectDrop);
  drop.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      collectDrop();
    }
  });
  drop.addEventListener("animationend", () => drop.remove());
  gameContainer.appendChild(drop);
}
