
import { GoogleGenAI, Type } from "@google/genai";
import { Recipe, Workout } from "../types";

// Always use process.env.API_KEY directly as a named parameter
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getHealthyRecipes(
  type: string, 
  preferences: string = "", 
  restrictions: string = ""
): Promise<Recipe[]> {
  const context = `
    Preferências: ${preferences || 'Nenhuma especificada'}.
    Restrições: ${restrictions || 'Nenhuma especificada'}.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Sugira 6 receitas saudáveis e variadas de ${type} para emagrecimento.
    CRÍTICO: Priorize ingredientes ACESSÍVEIS, BARATOS e COMUNS em supermercados populares (ex: ovos, frango, legumes da época, arroz integral, feijão, aveia, banana).
    EVITE: Ingredientes caros ou "gourmet" como salmão, aspargos, quinoa, farinhas de amêndoas, sementes de chia ou óleos caros.
    Considere o seguinte perfil do usuário: ${context}.
    Garanta que as receitas respeitem as restrições e alinhem-se às preferências.
    Inclua contagem calórica aproximada. Retorne apenas JSON.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            calories: { type: Type.STRING },
            ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
            instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
            type: { type: Type.STRING }
          },
          required: ["name", "calories", "ingredients", "instructions", "type"]
        }
      }
    }
  });
  
  try {
    return JSON.parse(response.text || '[]');
  } catch (e) {
    console.error("Failed to parse recipes", e);
    return [];
  }
}

export async function getAIAssistantRecipe(
  userInput: string,
  preferences: string = "", 
  restrictions: string = ""
): Promise<Recipe | null> {
  const context = `Preferências: ${preferences}, Restrições: ${restrictions}.`;
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Crie uma receita saudável baseada no seguinte pedido: "${userInput}". 
    Considere este perfil: ${context}. 
    Use ingredientes simples e baratos. Retorne apenas JSON seguindo o esquema de Recipe.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          calories: { type: Type.STRING },
          ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
          instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
          type: { type: Type.STRING }
        },
        required: ["name", "calories", "ingredients", "instructions", "type"]
      }
    }
  });

  try {
    return JSON.parse(response.text || 'null');
  } catch (e) {
    return null;
  }
}

export async function getWorkoutTips(fitnessLevel: string): Promise<Workout[]> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Sugira 3 rotinas de exercícios curtos para alguém com nível de condicionamento ${fitnessLevel}. Foque em queima de gordura e exercícios que podem ser feitos em casa sem equipamentos. Retorne apenas JSON.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            duration: { type: Type.STRING },
            intensity: { type: Type.STRING },
            description: { type: Type.STRING },
            exercises: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["title", "duration", "intensity", "description", "exercises"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text || '[]');
  } catch (e) {
    console.error("Failed to parse workouts", e);
    return [];
  }
}

export async function getMotivation(userName: string, progress: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Gere uma frase de motivação curta, poderosa e inspiradora para ${userName}. O contexto de progresso é: ${progress}. A frase deve focar em disciplina, resiliência ou amor próprio.`,
    config: { temperature: 1 }
  });
  return response.text || 'Sua única competição é quem você era ontem.';
}
