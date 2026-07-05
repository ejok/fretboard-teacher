import { useEffect, useState } from 'react';
import './TimerControls.css';

interface Props {
  enabled: boolean;
  seconds: number;
  onToggle: (enabled: boolean) => void;
  onSecondsChange: (seconds: number) => void;
}

export default function TimerControls({ enabled, seconds, onToggle, onSecondsChange }: Props) {
  // Keep the input's raw text separate from the committed number so the
  // field can be freely cleared/edited without React snapping it back to
  // the old value on every keystroke.
  const [rawValue, setRawValue] = useState(String(seconds));

  useEffect(() => {
    setRawValue(String(seconds));
  }, [seconds]);

  function handleChange(value: string) {
    setRawValue(value);
    const parsed = Math.round(Number(value));
    if (value.trim() !== '' && Number.isFinite(parsed) && parsed >= 1) {
      onSecondsChange(Math.min(parsed, 60));
    }
  }

  function handleBlur() {
    setRawValue(String(seconds));
  }

  return (
    <div className="timer-controls">
      <label className="timer-toggle">
        <input type="checkbox" checked={enabled} onChange={(e) => onToggle(e.target.checked)} />
        Timer mode
      </label>
      {enabled && (
        <label className="timer-seconds">
          <input
            type="number"
            min={1}
            max={60}
            value={rawValue}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={handleBlur}
          />
          sec
        </label>
      )}
    </div>
  );
}
