import { useEffect, useMemo, useState } from 'react';
import FretboardStage from './components/FretboardStage';
import RangeControls from './components/RangeControls';
import TimerControls from './components/TimerControls';
import QuizPanel from './components/QuizPanel';
import { generateQuestion, normalizeRange, type Question } from './lib/quiz';
import { noteNameAt } from './lib/theory';
import { useMediaQuery } from './hooks/useMediaQuery';
import './App.css';

const DEFAULT_TIMER_SECONDS = 5;

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

  const [timerEnabled, setTimerEnabled] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(DEFAULT_TIMER_SECONDS);
  const [timeLeft, setTimeLeft] = useState(DEFAULT_TIMER_SECONDS);

  const correctNote = noteNameAt(question.string, question.fret);
  const correct = answered ? selectedNote === correctNote : null;

  // Count down for the current question whenever timer mode is on and the
  // round hasn't been answered yet. Restarts on every new question, and on
  // any change to the configured duration. The timeout itself is handled
  // right here in the tick, rather than in a separate effect watching
  // timeLeft — otherwise a stale timeLeft of 0 can be read by such an
  // effect in the same render where a fresh question just reset `answered`
  // to false, re-triggering a timeout instantly.
  useEffect(() => {
    if (!timerEnabled || answered) return;
    setTimeLeft(timerSeconds);
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(interval);
          setSelectedNote(null);
          setAnswered(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [question, timerEnabled, answered, timerSeconds]);

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
    <div className={`app${isNarrowViewport ? ' app--compact' : ''}`}>
      <header className="app-header">
        <h1>Fretboard Teacher</h1>
        <p>Find the highlighted note on the fretboard.</p>
      </header>

      <div className="top-controls">
        <RangeControls
          stringFrom={stringFrom}
          stringTo={stringTo}
          fretFrom={fretFrom}
          fretTo={fretTo}
          onChange={handleRangeChange}
        />
        <TimerControls
          enabled={timerEnabled}
          seconds={timerSeconds}
          onToggle={setTimerEnabled}
          onSecondsChange={setTimerSeconds}
        />
      </div>

      <div className="quiz-row">
        <FretboardStage
          stringRange={stringRange}
          fretRange={fretRange}
          question={question}
          revealed={answered}
          correct={correct}
          orientation={orientation}
          fitToContainer={isNarrowViewport}
        />

        <QuizPanel
          answered={answered}
          selectedNote={selectedNote}
          correctNote={correctNote}
          onAnswer={handleAnswer}
          onNext={handleNext}
          compact={isNarrowViewport}
          timerEnabled={timerEnabled}
          timeLeft={timeLeft}
        />
      </div>
    </div>
  );
}
