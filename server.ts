import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = new GoogleGenAI({
    apiKey: apiKey || "MOCK_KEY_FOR_DEV_WITHOUT_KEY",
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // API Route for chat
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, chatHistory } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Mensagem vazia." });
      }

      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        // Fallback robusto se a chave não estiver configurada no ambiente de preview
        return res.json({
          text: `Bora treinar! 💪 Atualmente estou operando no modo de demonstração off-line, mas aqui vai uma dica de ouro para você: Mantenha a constância! ${
            message.toLowerCase().includes("treino") 
              ? "Para esse seu objetivo de treino, faça 4 séries de 10-12 repetições focando na cadência perfeita (3 segundos na descida)." 
              : "Beba pelo menos 3 litros de água por dia e descanse de 7 a 8 horas para otimizar seus resultados!"
          } O que mais você gostaria de planejar hoje? 🤔`
        });
      }

      const systemInstruction = `Você é o Coach Lucas, um personal trainer de elite, energético, focado, amigável e motivador que fala português brasileiro.
      Você ajuda os clientes com dúvidas de treinamento físico, biomecânica, nutrição para hipertrofia/emagrecimento, consistência nos treinos e dicas de saúde.
      Suas respostas devem ser curtas (no máximo 3 parágrafos), diretas ao ponto, com dicas práticas de execução de exercícios e incentivos revigorantes.
      Use termos como "bora treinar!", "foco no objetivo!", "disciplina vence talento!", etc. Nunca use termos médicos ou farmacológicos fora de sua alçada.`;

      let prompt = message;
      if (chatHistory && chatHistory.length > 0) {
        const historyText = chatHistory
          .slice(-6)
          .map((m: any) => `${m.role === 'user' ? 'Cliente' : 'Coach Lucas'}: ${m.content}`)
          .join('\n');
        prompt = `Aqui está o histórico recente da conversa:\n${historyText}\n\nCliente: ${message}\nCoach Lucas:`;
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.8,
        }
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Erro no Chat Gemini:", error);
      res.json({ 
        text: "Opa, deu uma leve fadiga nos meus servidores! Mas o foco continua 100%! Bora fazer um agachamento enquanto eu restabeleço a conexão? Em resumo: consistência é tudo! Me pergunte de novo em alguns segundos!" 
      });
    }
  });

  // Serve static assets or mount Vite
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
