export function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
export function decideWinner(player, ai) {
  if (player === ai) return "It's a tie!";
  if (
    (player === "rock" && ai === "scissors") ||
    (player === "scissors" && ai === "paper") ||
    (player === "paper" && ai === "rock")
  ) return "You win!";
  return "AI wins!";
}

export function getGesture(landmarks) {
  const isOpen = (tip, pip) => landmarks[tip].y < landmarks[pip].y;

  const index = isOpen(8, 6);
  const middle = isOpen(12, 10);
  const ring = isOpen(16, 14);
  const pinky = isOpen(20, 18);

  if (!index && !middle && !ring && !pinky) return "rock";
  if (index && middle && ring && pinky) return "paper";
  if (index && middle && !ring && !pinky) return "scissors";

  return null;
}