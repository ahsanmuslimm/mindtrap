const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export async function askGemini(messages, characterPrompt) {
  const geminiMessages = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }));

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`,
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
  if (data.error) throw new Error(data.error.message);
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "...";
}
