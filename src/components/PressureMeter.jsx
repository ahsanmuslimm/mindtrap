import { useGame } from '../context/GameContext';
import { motion } from 'framer-motion';

export default function PressureMeter() {
  const { state } = useGame();
  const { pressureLevel, questionsLeft, contradictions } = state;
  
  const color = pressureLevel < 40 ? '#22c55e' : pressureLevel < 70 ? '#f59e0b' : '#ef4444';

  return (
    <div className="pressure-meter">
      <div className="meter-row">
        <span className="meter-label">PRESSURE</span>
        <span className="meter-label">{contradictions} contradiction{contradictions !== 1 ? 's' : ''} caught</span>
      </div>
      <div className="meter-track">
        <motion.div
          className="meter-fill"
          animate={{ width: `${pressureLevel}%`, backgroundColor: color }}
          transition={{ duration: 0.4 }}
        />
      </div>
      <div className="meter-row">
        <span className="questions-left">{questionsLeft} questions remaining</span>
        {pressureLevel > 70 && (
          <motion.span
            className="cracking-label"
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
          >
            SUSPECT CRACKING
          </motion.span>
        )}
      </div>
    </div>
  );
}