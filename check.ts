import { GoogleGenAI } from '@google/genai';
const aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function test() {
  const models = ['gemini-3.5-flash', 'gemini-2.5-flash', 'gemini-pro-latest', 'gemini-pro', 'gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-3.0-flash'];
  for (const m of models) {
    try {
       const res = await aiClient.models.generateContent({ model: m, contents: "say 1" });
       console.log("SUCCESS:", m, res.text);
    } catch(e) {
       console.log("FAIL:", m, e.message);
    }
  }
}
test();
