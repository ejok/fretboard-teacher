import { NOTE_NAMES } from '../lib/theory';
import './QuizPanel.css';

interface Props {
  answered: boolean;
  selectedNote: string | null;
  correctNote: string;
  onAnswer: (note: string) => void;
  onNext: () => void;
  compact?: boolean;
  timerEnabled?: boolean;
  timeLeft?: number;
}

export default function QuizPanel({
  answered,
  selectedNote,
  correctNote,
  onAnswer,
  onNext,
  compact = false,
  timerEnabled = false,
  timeLeft = 0,
}: Props) {
  // The button that advances to the next question: the one you picked, or —
  // if time ran out before you picked anything — the correct answer.
  const advanceNote = selectedNote ?? correctNote;
  const timedOut = answered && selectedNote === null;

  function handleClick(note: string) {
    if (!answered) {
      onAnswer(note);
    } else if (note === advanceNote) {
      onNext();
    }
  }

  const noteGrid = (
    <div className="note-grid">
      {NOTE_NAMES.map((note) => {
        let className = 'note-button';
        if (answered) {
          if (note === correctNote) className += ' note-button--correct';
          else if (note === selectedNote) className += ' note-button--incorrect';
        }
        return (
          <button
            key={note}
            type="button"
            className={className}
            disabled={answered && note !== advanceNote}
            onClick={() => handleClick(note)}
          >
            {note}
          </button>
        );
      })}
    </div>
  );

  const isCorrect = selectedNote === correctNote;
  const feedbackText = timedOut ? `Time's up — it was ${correctNote}` : isCorrect ? 'Correct!' : `Incorrect — it was ${correctNote}`;
  const compactFeedbackText = timedOut ? `Time's up: ${correctNote}` : isCorrect ? 'Correct!' : `It was ${correctNote}`;
  const feedbackClass = isCorrect ? 'feedback feedback--correct' : 'feedback feedback--incorrect';

  const countdown = timerEnabled && !answered && (
    <span className={`timer-countdown${timeLeft <= 2 ? ' timer-countdown--urgent' : ''}`}>{timeLeft}s</span>
  );

  if (compact) {
    return (
      <div className="quiz-panel quiz-panel--compact">
        <div className="quiz-status" aria-live="polite">
          {answered ? (
            <>
              <span className={feedbackClass}>{compactFeedbackText}</span>
              <button type="button" className="next-button" onClick={onNext}>
                Next
              </button>
            </>
          ) : (
            countdown
          )}
        </div>
        {noteGrid}
      </div>
    );
  }

  return (
    <div className="quiz-panel">
      <p className="quiz-prompt">
        Which note is marked on the fretboard?
        {countdown}
      </p>

      {noteGrid}

      <div className="quiz-feedback" aria-live="polite">
        {answered && (
          <>
            <span className={feedbackClass}>{feedbackText}</span>
            <button type="button" className="next-button" onClick={onNext}>
              Next
            </button>
          </>
        )}
      </div>
    </div>
  );
}
