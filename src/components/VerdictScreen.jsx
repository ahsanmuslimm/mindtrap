import { useGame } from '../context/GameContext';
import { motion } from 'framer-motion';

export default function VerdictScreen() {
  const { state, dispatch } = useGame();
  const { score, verdict, selectedCase } = state;
  const correct = verdict === (selectedCase.guiltyVerdict ? 'guilty' : 'innocent');
  const { grade } = score;

  return (
    <motion.div
      className="verdict-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className={`verdict-result ${correct ? 'correct' : 'wrong'}`}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
      >
        {grade.emoji}
      </motion.div>

      <h2>{grade.title}</h2>
      <p className="verdict-subtitle">{grade.sub}</p>

      <div className="score-breakdown">
        <div className="score-row">
          <span>Correct verdict</span>
          <span className={correct ? 'pts-positive' : 'pts-zero'}>
            {correct ? '+40' : '+0'} pts
          </span>
        </div>
        <div className="score-row">
          <span>Contradictions caught ({score.contradictions})</span>
          <span className={score.contradictions > 0 ? 'pts-positive' : 'pts-zero'}>
            +{Math.min(score.contradictions * 10, 30)} pts
          </span>
        </div>
        <div className="score-row">
          <span>Efficiency ({10 - score.questionsLeft} questions used)</span>
          <span className={score.questionsLeft > 3 ? 'pts-positive' : 'pts-zero'}>
            +{Math.round((score.questionsLeft / 10) * 20)} pts
          </span>
        </div>
        <div className="score-row">
          <span>Speed bonus</span>
          <span className={score.timeBonus > 0 ? 'pts-positive' : 'pts-zero'}>
            +{score.timeBonus} pts
          </span>
        </div>
        {!correct && (
          <div className="score-row wrong-verdict-row">
            <span>Wrong verdict penalty</span>
            <span className="pts-zero">Score capped at {score.total}</span>
          </div>
        )}
        <div className="score-total">
          <span>TOTAL</span>
          <span style={{ color: correct ? 'var(--success)' : 'var(--danger)' }}>
            {score.total}
          </span>
        </div>
      </div>

      <motion.button
        className="btn-primary"
        whileTap={{ scale: 0.97 }}
        onClick={() => dispatch({ type: 'GO_REVEAL' })}
      >
        See the Truth →
      </motion.button>
    </motion.div>
  );
}