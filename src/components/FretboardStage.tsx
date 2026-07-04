import Fretboard, { getFretboardNaturalSize, type Orientation } from './Fretboard';
import { useElementSize } from '../hooks/useElementSize';
import type { Range, Question } from '../lib/quiz';
import './FretboardStage.css';

interface Props {
  stringRange: Range;
  fretRange: Range;
  question: Question;
  revealed: boolean;
  correct: boolean | null;
  orientation: Orientation;
  fitToContainer: boolean;
}

export default function FretboardStage({ orientation, fitToContainer, ...fretboardProps }: Props) {
  const [containerRef, size] = useElementSize<HTMLDivElement>();

  let fitStyle: { width: number; height: number } | undefined;
  if (fitToContainer && size.width > 0 && size.height > 0) {
    const natural = getFretboardNaturalSize(orientation);
    const scale = Math.min(size.width / natural.width, size.height / natural.height);
    fitStyle = { width: natural.width * scale, height: natural.height * scale };
  }

  return (
    <div
      ref={containerRef}
      className={`fretboard-wrap${fitToContainer ? ' fretboard-wrap--fit' : ''}`}
    >
      <div className="fretboard-fit" style={fitStyle}>
        <Fretboard orientation={orientation} {...fretboardProps} />
      </div>
    </div>
  );
}
