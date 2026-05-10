# MIND TRAP

An AI interrogation game where you must determine if a suspect is human or AI. The twist: the suspect is powered by Claude and actively adapts its lies based on your questioning style.

## Game Overview

You are Detective Reyes, interrogating suspects in 3 cases:
1. **The Missing Drive** (Easy) - Corporate espionage
2. **The Poisoned Vintage** (Medium) - Aristocratic poisoning
3. **The Phantom Transfer** (Hard) - Financial fraud

## Tech Stack

- **React + Vite** - Frontend framework
- **Framer Motion** - Animations
- **Vercel Serverless Functions** - API backend
- **Claude 3.5 Sonnet** - AI suspect engine

## Local Development

```bash
npm install
npm run dev
```

Set `ANTHROPIC_API_KEY` in your `.env.local` for local testing.

## Deployment

Deploy to Vercel with the ANTHROPIC_API_KEY environment variable set in Project Settings.

## How to Win

- Catch contradictions in the suspect's story
- Deliver the correct verdict (guilty/innocent)
- Score based on accuracy, contradictions found, and speed