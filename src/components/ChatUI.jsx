import { useState, useRef, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import PressureMeter from './PressureMeter';
import { motion, AnimatePresence } from 'framer-motion';

const CONTRADICTION_KEYWORDS = [
  'that\'s not what', 'you just said', 'earlier you', 'contradicts',
  'you told me', 'that doesn\'t match', 'inconsistent', 'you lied',
  'that\'s a lie', 'prove it', 'impossible', 'can\'t be right'
];

const ChatUI = () => {
  const { state, dispatch } = useGame();
  const [input, setInput] = useState('');
  const [showEarlyVerdict, setShowEarlyVerdict] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.messages]);

  const showVerdictPrompt = state.questionsLeft === 0 || state.phase === 'VERDICT' || showEarlyVerdict;

  const detectPressure = (text) => {
    const lower = text.toLowerCase();
    const hasContradiction = CONTRADICTION_KEYWORDS.some(kw => lower.includes(kw));
    if (hasContradiction) return 20;
    if (lower.includes('?') && lower.length > 80) return 8;
    return 3;
  };

  const sendMessage = async () => {
    if (!input.trim() || state.isLoading || state.questionsLeft === 0) return;

    const userMsg = { role: 'user', content: input.trim() };
    dispatch({ type: 'ADD_MESSAGE', payload: userMsg });
    dispatch({ type: 'USE_QUESTION' });

    const pressureDelta = detectPressure(input);
    dispatch({ type: 'ADD_PRESSURE', payload: pressureDelta });

    setInput('');
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const { askGemini } = await import('../api/gemini.js');
      const reply = await askGemini(
        [...state.messages, userMsg], 
        state.selectedCase.characterPrompt
      );
      dispatch({ type: 'ADD_MESSAGE', payload: { role: 'assistant', content: reply } });
    } catch (e) {
      console.error(e);
      dispatch({ type: 'ADD_MESSAGE', payload: { 
        role: 'assistant', 
        content: "I... I need a moment." 
      }});
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  return (
    <div className="chat-ui">
      <div className="chat-header">
        <div className="suspect-info">
          <div className="suspect-avatar">
            {state.selectedCase.briefing.suspect.charAt(0)}
          </div>
          <div>
            <div className="suspect-name">
              {state.selectedCase.briefing.suspect.split(',')[0]}
            </div>
            <div className="suspect-status">In interrogation</div>
          </div>
        </div>
        <div className="case-title">{state.selectedCase.title}</div>
      </div>

      <PressureMeter />

      <div className="messages-container">
        <motion.div
          className="system-message"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          You enter the interrogation room. The suspect looks up.
        </motion.div>

        <AnimatePresence>
          {state.messages.map((msg, i) => (
            <motion.div
              key={i}
              className={`message ${msg.role}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="message-label">
                {msg.role === 'user' ? 'Detective Reyes' : state.selectedCase.briefing.suspect.split(',')[0]}
              </div>
              <div className="message-content">{msg.content}</div>
            </motion.div>
          ))}
        </AnimatePresence>

        {state.isLoading && (
          <motion.div className="typing-indicator" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <span/><span/><span/>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {!showVerdictPrompt ? (
        <div className="chat-input-area">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
            placeholder={`Ask your question... (${state.questionsLeft} left)`}
            disabled={state.isLoading}
            rows={2}
          />
          <div className="input-actions">
            <button
              className="btn-flag"
              onClick={() => dispatch({ type: 'ADD_PRESSURE', payload: 15 })}
              title="Flag a contradiction"
              style={{flex: 'none', background: 'rgba(239, 68, 68, 0.15)', color: 'var(--danger)', border: '1px solid var(--danger)'}}
            >
              🚩 Catch Contradiction
            </button>
            <button
              className="btn-send"
              onClick={sendMessage}
              disabled={state.isLoading || !input.trim()}
            >
              Ask →
            </button>
          </div>
          <button
            className="btn-verdict-early"
            onClick={() => setShowEarlyVerdict(true)}
          >
            I've heard enough — Deliver Verdict
          </button>
        </div>
      ) : (
        <motion.div
          className="verdict-prompt"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p>You've completed your interrogation. What's your verdict?</p>
          <div className="verdict-buttons">
            <motion.button
              className="btn-guilty"
              whileTap={{ scale: 0.96 }}
              onClick={() => dispatch({ type: 'SUBMIT_VERDICT', payload: 'guilty' })}
            >
              GUILTY
            </motion.button>
            <motion.button
              className="btn-innocent"
              whileTap={{ scale: 0.96 }}
              onClick={() => dispatch({ type: 'SUBMIT_VERDICT', payload: 'innocent' })}
            >
              INNOCENT
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ChatUI;