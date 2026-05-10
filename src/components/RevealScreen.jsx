import { useGame } from '../context/GameContext';
import { motion } from 'framer-motion';

export default function RevealScreen() {
  const { state, dispatch } = useGame();
  const { selectedCase, score } = state;

  return (
    <motion.div
      className="reveal-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="reveal-stamp">CLASSIFIED — REVEALED</div>
      <h2>The Truth</h2>

      <motion.div
        className="truth-card"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <p>{selectedCase.truth}</p>
      </motion.div>

      <div className="final-score">
        <div className="final-score-label">Your Score</div>
        <div className="final-score-number">{score.total}</div>
<div className="final-score-rank">{score.grade.emoji} {score.grade.title}</div>
        <div className="final-score-sub" style={{
          fontSize: '13px',
          color: 'var(--text-muted)',
          marginTop: '6px'
        }}>
          {score.grade.sub}
        </div>
      </div>

      <div className="reveal-actions">
        <motion.button
          className="btn-secondary"
          whileTap={{ scale: 0.97 }}
          onClick={() => dispatch({ type: 'SELECT_CASE', payload: selectedCase })}
        >
          Try Again
        </motion.button>
        <motion.button
          className="btn-primary"
          whileTap={{ scale: 0.97 }}
          onClick={() => dispatch({ type: 'RESET' })}
        >
          New Case
        </motion.button>
      </div>
    </motion.div>
  );
}