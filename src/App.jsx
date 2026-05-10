import { useState, useEffect } from 'react';
import { useGame } from './context/GameContext';
import HomePage from './components/HomePage';
import CaseFile from './components/CaseFile';
import ChatUI from './components/ChatUI';
import VerdictScreen from './components/VerdictScreen';
import RevealScreen from './components/RevealScreen';
import LoadingScreen from './components/LoadingScreen';

export default function App() {
  const { state } = useGame();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="app">
      {state.phase === 'HOME' && <HomePage />}
      {state.phase === 'BRIEFING' && <CaseFile />}
      {state.phase === 'INTERROGATION' && <ChatUI />}
      {state.phase === 'VERDICT' && <VerdictScreen />}
      {state.phase === 'REVEAL' && <RevealScreen />}
    </div>
  );
}