import { NOTE_NAMES } from '../lib/theory';
import './QuizPanel.css';

interface Props {
  answered: boolean;
  selectedNote: string | null;
  correctNote: string;
  onAnswer: (note: string) => void;
  onNext: () => void;
}

export default function QuizPanel({ answered, selectedNote, correctNote, onAnswer, onNext }: Props) {
  return (
    <div className="quiz-panel">
      <p className="quiz-prompt">Which note is marked on the fretboard?</p>

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
              disabled={answered}
              onClick={() => onAnswer(note)}
            >
              {note}
            </button>
          );
        })}
      </div>

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
