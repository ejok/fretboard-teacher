import { useMemo, useState } from 'react';
import Fretboard from './components/Fretboard';
import RangeControls from './components/RangeControls';
import QuizPanel from './components/QuizPanel';
import { generateQuestion, normalizeRange, type Question } from './lib/quiz';
import { noteNameAt } from './lib/theory';
import { useMediaQuery } from './hooks/useMediaQuery';
import './App.css';

export default function App() {
  const isNarrowViewport = useMediaQuery('(max-width: 640px)');
  const orientation = isNarrowViewport ? 'vertical' : 'horizontal';

  const [stringFrom, setStringFrom] = useState(6);
  const [stringTo, setStringTo] = useState(1);
  const [fretFrom, setFretFrom] = useState(0);
  const [fretTo, setFretTo] = useState(15);

  const stringRange = useMemo(() => normalizeRange(stringFrom, stringTo), [stringFrom, stringTo]);
  const fretRange = useMemo(() => normalizeRange(fretFrom, fretTo), [fretFrom, fretTo]);

  const [question, setQuestion] = useState<Question>(() => generateQuestion(stringRange, fretRange));
  const [answered, setAnswered] = useState(false);
  const [selectedNote, setSelectedNote] = useState<string | null>(null);

  const correctNote = noteNameAt(question.string, question.fret);
  const correct = answered ? selectedNote === correctNote : null;

  function handleRangeChange(next: { stringFrom: number; stringTo: number; fretFrom: number; fretTo: number }) {
    setStringFrom(next.stringFrom);
    setStringTo(next.stringTo);
    setFretFrom(next.fretFrom);
    setFretTo(next.fretTo);
    const nextStringRange = normalizeRange(next.stringFrom, next.stringTo);
    const nextFretRange = normalizeRange(next.fretFrom, next.fretTo);
    setQuestion(generateQuestion(nextStringRange, nextFretRange));
    setAnswered(false);
    setSelectedNote(null);
  }

  function handleAnswer(note: string) {
    if (answered) return;
    setSelectedNote(note);
    setAnswered(true);
  }

  function handleNext() {
    setQuestion(generateQuestion(stringRange, fretRange));
    setAnswered(false);
    setSelectedNote(null);
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Fretboard Teacher</h1>
        <p>Find the highlighted note on the fretboard.</p>
      </header>

      <RangeControls
        stringFrom={stringFrom}
        stringTo={stringTo}
        fretFrom={fretFrom}
        fretTo={fretTo}
        onChange={handleRangeChange}
      />

      <div className={`fretboard-wrap${orientation === 'vertical' ? ' fretboard-wrap--vertical' : ''}`}>
        <Fretboard
          stringRange={stringRange}
          fretRange={fretRange}
          question={question}
          revealed={answered}
          correct={correct}
          orientation={orientation}
        />
      </div>

      <QuizPanel
        answered={answered}
        selectedNote={selectedNote}
        correctNote={correctNote}
        onAnswer={handleAnswer}
        onNext={handleNext}
      />
    </div>
  );
}
