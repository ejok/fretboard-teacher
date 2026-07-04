export interface Range {
  min: number;
  max: number;
}

export interface Question {
  string: number;
  fret: number;
}

export function normalizeRange(a: number, b: number): Range {
  return { min: Math.min(a, b), max: Math.max(a, b) };
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateQuestion(stringRange: Range, fretRange: Range): Question {
  return {
    string: randInt(stringRange.min, stringRange.max),
    fret: randInt(fretRange.min, fretRange.max),
  };
}
