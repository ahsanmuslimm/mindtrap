import { useGame } from '../context/GameContext';
import { motion } from 'framer-motion';

export default function CaseFile() {
  const { state, dispatch } = useGame();
  const { briefing, title } = state.selectedCase;

  return (
    <motion.div
      className="case-file"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="file-stamp">CLASSIFIED</div>
      <h2>Case File: {title}</h2>

      <div className="file-section">
        <label>CRIME</label>
        <p>{briefing.crime}</p>
      </div>

      <div className="file-section">
        <label>SUSPECT</label>
        <p>{briefing.suspect}</p>
      </div>

      <div className="file-section">
        <label>BASIS FOR DETENTION</label>
        <p>{briefing.accusation}</p>
      </div>

      <div className="file-section mission">
        <label>YOUR MISSION</label>
        <p>{briefing.yourRole}</p>
      </div>

      <div className="file-rules">
        <span>⏱ 10 questions max</span>
        <span>🎯 Catch contradictions</span>
        <span>⚡ Speed bonus applies</span>
      </div>

      <motion.button
        className="btn-primary"
        whileTap={{ scale: 0.97 }}
        onClick={() => dispatch({ type: 'START_INTERROGATION' })}
      >
        Enter Interrogation Room
      </motion.button>
    </motion.div>
  );
}