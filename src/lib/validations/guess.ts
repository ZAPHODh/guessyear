interface GuessValidationResult {
  valid: boolean;
  year?: number;
  error?: 'invalidYear' | 'yearOutOfRange' | 'yearTooOld' | 'yearInFuture';
}

export function validateGuess(guess: string): GuessValidationResult {
  const year = parseInt(guess);

  if (isNaN(year)) {
    return { valid: false, error: 'invalidYear' };
  }

  if (year < 1800) {
    return { valid: false, error: 'yearTooOld' };
  }

  if (year > 2030) {
    return { valid: false, error: 'yearInFuture' };
  }

  return { valid: true, year };
}
