import {
  STRINGS,
  MAX_FRET,
  FRET_SINGLE_MARKERS,
  FRET_DOUBLE_MARKERS,
  noteNameAt,
} from '../lib/theory';
import type { Range, Question } from '../lib/quiz';
import './Fretboard.css';

export type Orientation = 'horizontal' | 'vertical';

interface Props {
  stringRange: Range;
  fretRange: Range;
  question: Question;
  revealed: boolean;
  correct: boolean | null;
  orientation: Orientation;
}

const OPEN_ZONE = 40;
const NUT_POS = 64;
const FRET_SPACING = 46;
const STRING_SPACING = 30;
const SECONDARY_MARGIN_START = 20;
const PRIMARY_MARGIN_END = 20;
const SECONDARY_MARGIN_END = 45;
const NECK_INSET = 14;
const LABEL_PRIMARY = 20;

const NECK_SEC_START = SECONDARY_MARGIN_START - NECK_INSET;
const NECK_SEC_LENGTH = (STRINGS.length - 1) * STRING_SPACING + NECK_INSET * 2;
const NECK_SEC_END = NECK_SEC_START + NECK_SEC_LENGTH;
const NECK_PRI_START = NUT_POS - OPEN_ZONE;
const NECK_PRI_END = NUT_POS + MAX_FRET * FRET_SPACING;

const PRIMARY_TOTAL = NECK_PRI_END + PRIMARY_MARGIN_END;
const SECONDARY_TOTAL = SECONDARY_MARGIN_START + (STRINGS.length - 1) * STRING_SPACING + SECONDARY_MARGIN_END;

const STRING_THICKNESS: Record<number, number> = {
  6: 3, 5: 2.6, 4: 2.2, 3: 1.8, 2: 1.4, 1: 1,
};

function fretLinePos(fret: number): number {
  return NUT_POS + fret * FRET_SPACING;
}

function fretCenterPos(fret: number): number {
  if (fret === 0) return NUT_POS - OPEN_ZONE / 2;
  return (fretLinePos(fret - 1) + fretLinePos(fret)) / 2;
}

function stringSecPos(index: number): number {
  return SECONDARY_MARGIN_START + index * STRING_SPACING;
}

export default function Fretboard({ stringRange, fretRange, question, revealed, correct, orientation }: Props) {
  const isVertical = orientation === 'vertical';

  function axisPoint(primary: number, secondary: number): { x: number; y: number } {
    return isVertical ? { x: secondary, y: primary } : { x: primary, y: secondary };
  }

  const width = isVertical ? SECONDARY_TOTAL : PRIMARY_TOTAL;
  const height = isVertical ? PRIMARY_TOTAL : SECONDARY_TOTAL;

  const dotStringIndex = STRINGS.findIndex((s) => s.number === question.string);
  const neckSecCenter = (NECK_SEC_START + NECK_SEC_END) / 2;

  const dotClass = !revealed
    ? 'fretboard-dot fretboard-dot--pending'
    : correct
      ? 'fretboard-dot fretboard-dot--correct'
      : 'fretboard-dot fretboard-dot--incorrect';

  const neckStart = axisPoint(NECK_PRI_START, NECK_SEC_START);
  const neckEnd = axisPoint(NECK_PRI_END, NECK_SEC_END);
  const neckRect = {
    x: Math.min(neckStart.x, neckEnd.x),
    y: Math.min(neckStart.y, neckEnd.y),
    width: Math.abs(neckEnd.x - neckStart.x),
    height: Math.abs(neckEnd.y - neckStart.y),
  };

  const dotPos = axisPoint(fretCenterPos(question.fret), stringSecPos(dotStringIndex));
  const labelPos = axisPoint(fretCenterPos(question.fret), stringSecPos(dotStringIndex) - 18);

  return (
    <svg
      className="fretboard"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label="Guitar fretboard"
    >
      <rect {...neckRect} className="fretboard-bg" />

      {Array.from({ length: MAX_FRET + 1 }, (_, fret) => {
        const inRange = fret >= fretRange.min && fret <= fretRange.max;
        if (inRange) return null;
        const p0 = fret === 0 ? NECK_PRI_START : fretLinePos(fret - 1);
        const p1 = fret === 0 ? NUT_POS : fretLinePos(fret);
        const a = axisPoint(p0, NECK_SEC_START);
        const b = axisPoint(p1, NECK_SEC_END);
        return (
          <rect
            key={`dim-${fret}`}
            x={Math.min(a.x, b.x)}
            y={Math.min(a.y, b.y)}
            width={Math.abs(b.x - a.x)}
            height={Math.abs(b.y - a.y)}
            className="fretboard-dim"
          />
        );
      })}

      {FRET_SINGLE_MARKERS.map((f) => {
        const c = axisPoint(fretCenterPos(f), neckSecCenter);
        return <circle key={`m-${f}`} cx={c.x} cy={c.y} r={5} className="fret-marker" />;
      })}
      {FRET_DOUBLE_MARKERS.map((f) => {
        const c1 = axisPoint(fretCenterPos(f), neckSecCenter - 10);
        const c2 = axisPoint(fretCenterPos(f), neckSecCenter + 10);
        return (
          <g key={`m2-${f}`}>
            <circle cx={c1.x} cy={c1.y} r={5} className="fret-marker" />
            <circle cx={c2.x} cy={c2.y} r={5} className="fret-marker" />
          </g>
        );
      })}

      {Array.from({ length: MAX_FRET + 1 }, (_, i) => {
        const a = axisPoint(fretLinePos(i), NECK_SEC_START);
        const b = axisPoint(fretLinePos(i), NECK_SEC_END);
        return (
          <line
            key={`fret-${i}`}
            x1={a.x} y1={a.y} x2={b.x} y2={b.y}
            className={i === 0 ? 'nut-line' : 'fret-line'}
          />
        );
      })}

      {STRINGS.map((s, idx) => {
        const a = axisPoint(NECK_PRI_START, stringSecPos(idx));
        const b = axisPoint(NECK_PRI_END, stringSecPos(idx));
        return (
          <line
            key={s.number}
            x1={a.x} y1={a.y} x2={b.x} y2={b.y}
            strokeWidth={STRING_THICKNESS[s.number]}
            className={
              s.number >= stringRange.min && s.number <= stringRange.max
                ? 'string-line'
                : 'string-line string-line--dim'
            }
          />
        );
      })}

      {STRINGS.map((s, idx) => {
        const p = axisPoint(LABEL_PRIMARY, stringSecPos(idx));
        return (
          <text key={`label-${s.number}`} x={p.x} y={p.y} className="string-label">
            {s.number}
          </text>
        );
      })}

      {[3, 5, 7, 9, 12, 15].map((f) => {
        const p = axisPoint(fretCenterPos(f), NECK_SEC_END + 20);
        return (
          <text key={`fnum-${f}`} x={p.x} y={p.y} className="fret-number">
            {f}
          </text>
        );
      })}

      <circle cx={dotPos.x} cy={dotPos.y} r={11} className={dotClass} />
      {revealed && (
        <text x={labelPos.x} y={labelPos.y} className="fretboard-answer-label">
          {noteNameAt(question.string, question.fret)}
        </text>
      )}
    </svg>
  );
}
