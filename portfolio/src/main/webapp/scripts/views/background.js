import { BACKGROUND_RANDOM_COLORS, NUMBER_OF_BACKGROUND_BALLS } from '../constants.js';
import { Coordinates } from '../models/coordinates.js'; 

const balls = [];

/**
 * @returns {object} 
 */
const generateRandomStyle = () => {
  const randomColorIndex = Math.floor(Math.random() * BACKGROUND_RANDOM_COLORS.length);
  const randomSize = `${Math.random()}em`;
  return {
    background: BACKGROUND_RANDOM_COLORS[randomColorIndex],
    left: `${Math.floor(Math.random() * 90)}vw`,
    top: `${Math.floor(Math.random() * 90)}vh`,
    transform: `scale(${Math.random()})`,
    width: randomSize,
    height: randomSize,
  }
}

for (let i = 0; i < NUMBER_OF_BACKGROUND_BALLS; i++) {
  const ball = document.createElement("div");
  ball.classList.add("ball");
  Object.assign(ball.style, generateRandomStyle())
  
  balls.push(ball);
  document.getElementById('content').append(ball);
}

// Keyframes
balls.forEach((element, i) => {
  const nextCoordinates = new Coordinates();
  nextCoordinates.calculateRandomCoordinates(i);

  element.animate(
    [
      { transform: "translate(0, 0)" },
      { transform: 
          `translate(${nextCoordinates.getX()}rem, ${nextCoordinates.getY()}rem)` 
      }
    ],
    {
      duration: (Math.random() + 1) * 2000, // random duration
      direction: "alternate",
      fill: "both",
      iterations: Infinity,
      easing: "ease-in-out"
    }
  );
});