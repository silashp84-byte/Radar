import { GoogleGenAI, Type } from "@google/genai";
import { Opportunity } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateOpportunities(context: string): Promise<Opportunity[]> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Você é o motor de análise do "Radar de Oportunidades". 
      Analise o contexto atual: ${context}.
      Gere 5 oportunidades reais e variadas (local, global, crypto, tendências).
      Retorne em JSON seguindo o esquema definido.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              profitLevel: { type: Type.STRING, enum: ['baixo', 'médio', 'alto'] },
              difficulty: { type: Type.STRING, enum: ['fácil', 'médio', 'difícil'] },
              executionPlan: { type: Type.ARRAY, items: { type: Type.STRING } },
              estimatedGain: { type: Type.STRING },
              category: { type: Type.STRING, enum: ['local', 'global', 'crypto', 'trends'] },
            },
            required: ['id', 'title', 'description', 'profitLevel', 'difficulty', 'executionPlan', 'estimatedGain', 'category']
          }
        }
      }
    });

    const data = JSON.parse(response.text);
    return data.map((op: any) => ({
      ...op,
      timestamp: Date.now()
    }));
  } catch (error) {
    console.error("Error generating opportunities:", error);
    return [];
  }
}

export async function askAI(question: string, history: { role: string, content: string }[]): Promise<string> {
  try {
    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: `Você é o assistente do "Radar de Oportunidades". Seu objetivo é ajudar o usuário a encontrar formas reais de ganhar dinheiro hoje. Seja direto, motivador e prático. Use dados fictícios baseados em tendências reais se necessário para ilustrar.`
      }
    });

    const response = await chat.sendMessage({
      message: question
    });

    return response.text;
  } catch (error) {
    console.error("Error in AI chat:", error);
    return "Desculpe, estou tendo problemas para processar sua pergunta agora.";
  }
}
