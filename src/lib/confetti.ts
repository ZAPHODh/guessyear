import confetti from 'canvas-confetti';

export const celebrateWinner = (rank: number) => {
  const duration = 3000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  if (rank === 1) {
    // Gold confetti for 1st place
    const interval: NodeJS.Timeout = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#FFD700', '#FFA500', '#FF8C00']
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#FFD700', '#FFA500', '#FF8C00']
      });
    }, 250);
  } else if (rank === 2) {
    // Silver confetti for 2nd place
    confetti({
      ...defaults,
      particleCount: 100,
      origin: { y: 0.6 },
      colors: ['#C0C0C0', '#A8A8A8', '#D3D3D3']
    });
  } else if (rank === 3) {
    // Bronze confetti for 3rd place
    confetti({
      ...defaults,
      particleCount: 75,
      origin: { y: 0.6 },
      colors: ['#CD7F32', '#B8860B', '#D4A574']
    });
  }
};

export const celebratePerfectGuess = () => {
  // Special effect for exact year guess
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    zIndex: 9999
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio)
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
    colors: ['#10b981', '#22c55e', '#4ade80']
  });
  fire(0.2, {
    spread: 60,
    colors: ['#10b981', '#22c55e', '#4ade80']
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
    colors: ['#10b981', '#22c55e', '#4ade80']
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
    colors: ['#10b981', '#22c55e', '#4ade80']
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
    colors: ['#10b981', '#22c55e', '#4ade80']
  });
};

export const celebrateGameEnd = () => {
  // Fireworks effect for game end
  const duration = 5000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  const interval: NodeJS.Timeout = setInterval(function() {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);

    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.9), y: Math.random() - 0.2 }
    });
  }, 250);
};
