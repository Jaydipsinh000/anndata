import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

async function test() {
   const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
   try {
      const response = await ai.models.generateContent({
         model: 'gemini-2.0-flash',
         contents: "hello"
      });
      console.log("2.0 flash success:", response.text);
   } catch(e) {
      console.log("2.0 error:", e?.message);
   }

   try {
      const response = await ai.models.generateContent({
         model: 'gemini-1.5-flash-latest',
         contents: "hello"
      });
      console.log("1.5 latest flash success:", response.text);
   } catch(e) {
      console.log("1.5 latest error:", e?.message);
   }
}

test();
