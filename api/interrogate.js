/* global process */
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { messages, characterPrompt } = req.body;

  const geminiMessages = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }));

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: characterPrompt }] },
        contents: geminiMessages,
        generationConfig: { maxOutputTokens: 300, temperature: 0.9 }
      })
    }
  );

  const data = await response.json();

  if (data.error) {
    return res.status(500).json({ reply: "I need a moment. [System interrupted]" });
  }

  const reply = data.candidates?.[0]?.content?.parts?.[0]?.text 
    ?? "I... have nothing to say to that.";

  res.status(200).json({ reply });
}