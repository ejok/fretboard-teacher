import { NOTE_NAMES } from '../lib/theory';
import './QuizPanel.css';

interface Props {
  answered: boolean;
  selectedNote: string | null;
  correctNote: string;
  onAnswer: (note: string) => void;
  onNext: () => void;
  compact?: boolean;
}

export default function QuizPanel({ answered, selectedNote, correctNote, onAnswer, onNext, compact = false }: Props) {
  function handleClick(note: string) {
    if (!answered) {
      onAnswer(note);
    } else if (note === selectedNote) {
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
            disabled={answered && note !== selectedNote}
            onClick={() => handleClick(note)}
          >
            {note}
          </button>
        );
      })}
    </div>
  );

  if (compact) {
    return (
      <div className="quiz-panel quiz-panel--compact">
        <div className="quiz-status" aria-live="polite">
          {answered && (
            <>
              <span className={selectedNote === correctNote ? 'feedback feedback--correct' : 'feedback feedback--incorrect'}>
                {selectedNote === correctNote ? 'Correct!' : `It was ${correctNote}`}
              </span>
              <button type="button" className="next-button" onClick={onNext}>
                Next
              </button>
            </>
          )}
        </div>
        {noteGrid}
      </div>
    );
  }

  return (
    <div className="quiz-panel">
      <p className="quiz-prompt">Which note is marked on the fretboard?</p>

      {noteGrid}

      <div className="quiz-feedback" aria-live="polite">
        {answered && (
          <>
            <span className={selectedNote === correctNote ? 'feedback feedback--correct' : 'feedback feedback--incorrect'}>
              {selectedNote === correctNote ? 'Correct!' : `Incorrect — it was ${correctNote}`}
            </span>
            <button type="button" className="next-button" onClick={onNext}>
              Next
            </button>
          </>
        )}
      </div>
    </div>
  );
}
