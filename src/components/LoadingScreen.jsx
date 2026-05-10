import { motion } from 'framer-motion';

export default function LoadingScreen() {
  return (
    <motion.div
      className="loading-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="loading-logo"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        🔍
      </motion.div>
      <h2>MIND<span>TRAP</span></h2>
      <p className="loading-text">Initializing interrogation...</p>
    </motion.div>
  );
}