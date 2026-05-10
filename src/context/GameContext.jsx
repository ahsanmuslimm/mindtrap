import { createContext, useContext, useReducer } from 'react';

const GameContext = createContext(null);

const initialState = {
  phase: 'HOME',
  selectedCase: null,
  messages: [],
  questionsLeft: 10,
  pressureLevel: 0,
  contradictions: 0,
  startTime: null,
  verdict: null,
  score: null,
  isLoading: false,
};

function getGrade(score, correct) {
  if (!correct) {
    if (score <= 5)  return { emoji: '💀', title: 'The AI Owned You',       sub: "You didn't catch a single lie. The suspect walked." };
    if (score <= 12) return { emoji: '😶', title: 'Completely Fooled',      sub: 'Wrong verdict. The AI had you the entire time.' };
    return            { emoji: '🤔', title: 'Wrong Call',               sub: "You caught some lies but still got the verdict wrong." };
  }
  if (score >= 95)  return { emoji: '🏆', title: 'Flawless Interrogation', sub: 'Perfect read. The AI never stood a chance.' };
  if (score >= 80)  return { emoji: '🥇', title: 'Master Detective',       sub: 'Sharp, efficient, ruthless. Textbook interrogation.' };
  if (score >= 65)  return { emoji: '🔍', title: 'Good Detective',         sub: 'Solid work. You got there, but left points on the table.' };
  if (score >= 50)  return { emoji: '📋', title: 'Junior Detective',       sub: "Correct verdict, but the AI made you work for it." };
  return              { emoji: '😅', title: 'Lucky Guess',              sub: "Right answer, wrong reasons. The AI nearly had you." };
}

const calculateScore = (correct, contradictions, questionsLeft, timeElapsed) => {
  // Wrong verdict = you failed. Period.
  if (!correct) {
    const consolation = contradictions * 3; // tiny credit for catching lies
    const total = Math.min(consolation, 18); // hard cap at 18 if wrong
    return {
      total,
      correct,
      contradictions,
      questionsLeft,
      timeBonus: 0,
      grade: getGrade(total, correct)
    };
  }

  // Correct verdict — now measure HOW WELL
  let score = 40; // base for correct verdict (not 50 — must be earned)

  // Contradictions caught: high value, max 30 pts
  const contScore = Math.min(contradictions * 10, 30);
  score += contScore;

  // Efficiency: reward using FEWER questions (sharp detective)
  // Used all 10 = 0 pts. Used only 3 = 20 pts.
  const efficiencyScore = Math.round((questionsLeft / 10) * 20);
  score += efficiencyScore;

  // Speed bonus: only if solved quickly AND correctly
  const timeBonus = timeElapsed < 120 ? 10 :
                    timeElapsed < 240 ? 5  : 0;
  score += timeBonus;

  return {
    total: Math.min(score, 100),
    correct,
    contradictions,
    questionsLeft,
    timeBonus,
    grade: getGrade(score, correct)
  };
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SELECT_CASE':
      return { ...initialState, phase: 'BRIEFING', selectedCase: action.payload };
    case 'START_INTERROGATION':
      return { ...state, phase: 'INTERROGATION', startTime: Date.now() };
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'USE_QUESTION':
      return { ...state, questionsLeft: state.questionsLeft - 1 };
    case 'ADD_PRESSURE':
      return {
        ...state,
        pressureLevel: Math.min(100, state.pressureLevel + action.payload),
        contradictions: state.contradictions + (action.payload >= 15 ? 1 : 0)
      };
    case 'SUBMIT_VERDICT': {
      const timeElapsed = (Date.now() - state.startTime) / 1000;
      const correct = action.payload === (state.selectedCase.guiltyVerdict ? 'guilty' : 'innocent');
      const score = calculateScore(correct, state.contradictions, state.questionsLeft, timeElapsed);
      return { ...state, phase: 'VERDICT', verdict: action.payload, score, correct };
    }
    case 'GO_REVEAL':
      return { ...state, phase: 'REVEAL' };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
};

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <GameContext.Provider value={{ state, dispatch }}>{children}</GameContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useGame = () => useContext(GameContext);