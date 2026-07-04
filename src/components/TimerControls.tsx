import './TimerControls.css';

interface Props {
  enabled: boolean;
  seconds: number;
  onToggle: (enabled: boolean) => void;
  onSecondsChange: (seconds: number) => void;
}

export default function TimerControls({ enabled, seconds, onToggle, onSecondsChange }: Props) {
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
            value={seconds}
            onChange={(e) => {
              const value = Math.round(Number(e.target.value));
              if (Number.isFinite(value) && value >= 1) {
                onSecondsChange(Math.min(value, 60));
              }
            }}
          />
          sec
        </label>
      )}
    </div>
  );
}
