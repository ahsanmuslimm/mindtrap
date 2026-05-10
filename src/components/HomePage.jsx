import { useGame } from '../context/GameContext';
import { cases } from '../data/cases';
import { motion } from 'framer-motion';

const difficultyColor = { Easy: '#22c55e', Medium: '#f59e0b', Hard: '#ef4444' };

export default function HomePage() {
  const { dispatch } = useGame();

  return (
    <div className="home-page">
      <motion.div
        className="home-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="logo">🔍</div>
        <h1>MIND<span>TRAP</span></h1>
        <p className="tagline">Can you break an AI that's built to lie?</p>
      </motion.div>

      <div className="case-grid">
        {cases.map((c, i) => (
          <motion.div
            key={c.id}
            className="case-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => dispatch({ type: 'SELECT_CASE', payload: c })}
          >
            <div className="case-card-header">
              <span className="case-number">Case {String(i + 1).padStart(2, '0')}</span>
              <span className="difficulty" style={{ color: difficultyColor[c.difficulty] }}>
                {c.difficulty}
              </span>
            </div>
            <h3>{c.title}</h3>
            <p>{c.briefing.crime.substring(0, 80)}...</p>
            <div className="card-cta">Begin Interrogation →</div>
          </motion.div>
        ))}
      </div>

      <p className="home-footer">
        Powered by Claude AI · The suspect is real AI · No scripts
      </p>
    </div>
  );
}