import { decideWinner, wait, getGesture } from './utils.js';

const GESTURE_TO_IMAGE = {
  rock: "assets/rock.png",
  paper: "assets/paper.png",
  scissors: "assets/scissors.png",
};
const aiMoves = ["rock", "paper", "scissors"];

const playBtn = document.getElementById('startButton');
const aiImage = document.getElementById('aiImage');
const countDownEl = document.getElementById('countdown');
const resultEl = document.getElementById("result");
const playerResult = document.getElementById("playerResult");
const aiResult = document.getElementById("aiResult");

let isCountingDown = false;
let playerMove = null;
let latestLandmarks = null;

function setupTheCanvas() {
  const video = document.getElementById('video');
  const canvas = document.getElementById('overlay');

  
  const ctx = canvas.getContext('2d');

  const hands = new Hands({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
  });
  hands.setOptions({
    maxNumHands: 1,
    modelComplexity: 1,
    minDetectionConfidence: 0.7,
    minTrackingConfidence: 0.7
  });

  hands.onResults(results => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!results.multiHandLandmarks || !results.multiHandLandmarks.length) return;
    const landmarks = results.multiHandLandmarks[0];
    latestLandmarks = landmarks;

    drawConnectors(ctx, landmarks, HAND_CONNECTIONS, {
        color: '#00FF00',
        lineWidth: 2
    });
    drawLandmarks(ctx, landmarks, {
        color: '#FF0000',
        lineWidth: 1
    });
  });

  const camera = new Camera(video, {
    onFrame: async () => {
      await hands.send({image: video});
    },
    width: 640,
    height: 480
  });
  camera.start();
}

playBtn.addEventListener("click", async () => {
  if (isCountingDown) return;
  playerResult.classList.add("hidden");
  aiResult.classList.add("hidden");
    resultEl.classList.add("hidden");
  if (!latestLandmarks) {
    alert("Show your hand first!");
    return;
  }

  isCountingDown = true;

  aiImage.classList.add("hidden");
  countDownEl.classList.remove("hidden");

  for (let i = 3; i >= 1; i--) {
    countDownEl.textContent = i;
    await wait(700);
  }

  countDownEl.classList.add("hidden");
  aiImage.classList.remove("hidden");

  playerMove = getGesture(latestLandmarks);

  if (!playerMove) {
    alert("Gesture not detected");
    isCountingDown = false;
    return;
  }

const aiMove = aiMoves[Math.floor(Math.random() * aiMoves.length)];
aiImage.src = GESTURE_TO_IMAGE[aiMove];

const result = decideWinner(playerMove, aiMove);
playerResult.textContent = `You chose: ${playerMove}`;
playerResult.classList.remove("hidden");
aiResult.textContent = `AI chose: ${aiMove}`;
aiResult.classList.remove("hidden");
resultEl.textContent = result;
resultEl.classList.remove("hidden");

isCountingDown = false;
});
window.onload = setupTheCanvas;