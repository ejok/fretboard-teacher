import { STRINGS, MAX_FRET } from '../lib/theory';
import './RangeControls.css';

interface Props {
  stringFrom: number;
  stringTo: number;
  fretFrom: number;
  fretTo: number;
  onChange: (next: { stringFrom: number; stringTo: number; fretFrom: number; fretTo: number }) => void;
}

const stringNumbers = STRINGS.map((s) => s.number); // [6,5,4,3,2,1]
const fretNumbers = Array.from({ length: MAX_FRET + 1 }, (_, i) => i);

export default function RangeControls({ stringFrom, stringTo, fretFrom, fretTo, onChange }: Props) {
  return (
    <div className="range-controls">
      <div className="range-group">
        <span className="range-group-label">Strings</span>
        <label>
          From
          <select
            value={stringFrom}
            onChange={(e) => onChange({ stringFrom: Number(e.target.value), stringTo, fretFrom, fretTo })}
          >
            {stringNumbers.map((n) => {
              const s = STRINGS.find((s) => s.number === n)!;
              return (
                <option key={n} value={n}>
                  {n} ({s.label})
                </option>
              );
            })}
          </select>
        </label>
        <label>
          To
          <select
            value={stringTo}
            onChange={(e) => onChange({ stringFrom, stringTo: Number(e.target.value), fretFrom, fretTo })}
          >
            {stringNumbers.map((n) => {
              const s = STRINGS.find((s) => s.number === n)!;
              return (
                <option key={n} value={n}>
                  {n} ({s.label})
                </option>
              );
            })}
          </select>
        </label>
      </div>

      <div className="range-group">
        <span className="range-group-label">Frets</span>
        <label>
          From
          <select
            value={fretFrom}
            onChange={(e) => onChange({ stringFrom, stringTo, fretFrom: Number(e.target.value), fretTo })}
          >
            {fretNumbers.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <label>
          To
          <select
            value={fretTo}
            onChange={(e) => onChange({ stringFrom, stringTo, fretFrom, fretTo: Number(e.target.value) })}
          >
            {fretNumbers.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
