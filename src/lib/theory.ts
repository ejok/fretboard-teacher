export const NOTE_NAMES = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B',
] as const;

/** Same 12 notes, reordered starting from A, for the answer button grid. */
export const ANSWER_NOTE_ORDER: readonly string[] = [
  ...NOTE_NAMES.slice(NOTE_NAMES.indexOf('A')),
  ...NOTE_NAMES.slice(0, NOTE_NAMES.indexOf('A')),
];

export interface StringDef {
  /** Standard guitar string number: 6 = low E, 1 = high E */
  number: number;
  /** Open string note name */
  label: string;
  /** Open string note index into NOTE_NAMES */
  openNoteIndex: number;
}

/** Ordered top-to-bottom as rendered on the fretboard (low E on top). */
export const STRINGS: StringDef[] = [
  { number: 6, label: 'E', openNoteIndex: 4 },
  { number: 5, label: 'A', openNoteIndex: 9 },
  { number: 4, label: 'D', openNoteIndex: 2 },
  { number: 3, label: 'G', openNoteIndex: 7 },
  { number: 2, label: 'B', openNoteIndex: 11 },
  { number: 1, label: 'E', openNoteIndex: 4 },
];

export const MAX_FRET = 15;
export const FRET_SINGLE_MARKERS = [3, 5, 7, 9, 15];
export const FRET_DOUBLE_MARKERS = [12];

export function noteIndexAt(stringNumber: number, fret: number): number {
  const string = STRINGS.find((s) => s.number === stringNumber);
  if (!string) throw new Error(`Unknown string number: ${stringNumber}`);
  return (string.openNoteIndex + fret) % 12;
}

export function noteNameAt(stringNumber: number, fret: number): string {
  return NOTE_NAMES[noteIndexAt(stringNumber, fret)];
}
