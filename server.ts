import express, { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '1mb' }));

// Initialize Google GenAI client if GEMINI_API_KEY is available
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// Endpoint for AI Coach Analysis
app.post('/api/gemini/coach-analysis', async (req: Request, res: Response) => {
  try {
    const { summary, trends, recentAlerts } = req.body;

    if (!ai) {
      return res.status(503).json({
        error: 'no_api_key',
        message: 'Clé API Gemini non configurée sur le serveur. Utilisation du mode local.',
      });
    }

    const prompt = `
Tu es l'assistant IA bienveillant de TensiCoach, une application de prévention et de suivi tensionnel.
Voici les données consolidées anonymes d'un utilisateur de 32 ans :
- Période analysée : ${summary?.periodDays || 30} jours
- Moyenne globale : SYS ${summary?.avgSys ?? 'N/A'} mmHg, DIA ${summary?.avgDia ?? 'N/A'} mmHg, Pouls ${summary?.avgPulse ?? 'N/A'} bpm
- Moyenne matin : SYS ${summary?.morningSys ?? 'N/A'} / DIA ${summary?.morningDia ?? 'N/A'}
- Moyenne soir : SYS ${summary?.eveningSys ?? 'N/A'} / DIA ${summary?.eveningDia ?? 'N/A'}
- Tendance récente : ${trends?.direction || 'stable'} (${trends?.description || 'normal'})
- Habitudes récentes moyennes : Sommeil ${summary?.avgSleep ?? '7'}h, Pas ${summary?.avgSteps ?? '7500'}/jour, Stress ${summary?.avgStress ?? '3'}/5, Consommation de sel : ${summary?.saltProfile || 'modérée'}.
- Alertes récentes : ${recentAlerts || 'Aucune crise'}

Consignes impératives :
1. Rédige en français un bilan chaleureux, concis, structuré et encourageant (environ 150-200 mots).
2. Fournis 3 conseils d'hygiène de vie prioritaires et concrets (ex: hydratation, respiration anti-stress, marche, réduction du sodium au dîner).
3. Mentionne explicitement que ces observations sont indicatives et ne se substituent jamais à une consultation médicale.
4. Si des chiffres sont élevés, encourage avec délicatesse le partage du relevé lors de la prochaine visite chez le médecin traitant.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: `Tu es TensiCoach IA, un coach éducatif en prévention cardiovasculaire et bien-être. Tu n'es pas médecin, tu ne poses aucun diagnostic et tu ne modifies jamais de traitement. Tu adoptes un ton rassurant, motivant et scientifiquement rigoureux (recommandations ESH / HAS).`,
        temperature: 0.7,
      },
    });

    return res.json({
      text: response.text,
      source: 'gemini',
    });
  } catch (error: any) {
    console.error('Gemini Coach error:', error);
    return res.status(500).json({
      error: 'generation_failed',
      message: error?.message || 'Erreur lors de la génération avec Gemini. Passage en mode local.',
    });
  }
});

// Endpoint for Interactive Chat with Gemini
app.post('/api/gemini/chat', async (req: Request, res: Response) => {
  try {
    const { messages, userContext } = req.body;

    if (!ai) {
      return res.status(503).json({
        error: 'no_api_key',
        message: 'Clé API Gemini non configurée sur le serveur. Utilisation du mode local.',
      });
    }

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'invalid_messages', message: 'Messages requis' });
    }

    // Build context summary
    const contextPrompt = `
Contexte utilisateur (anonyme) :
- Âge : 32 ans
- Moyenne tension récente : SYS ${userContext?.avgSys || 122} / DIA ${userContext?.avgDia || 79} mmHg, Pouls ${userContext?.avgPulse || 70} bpm.
- Dernière mesure : SYS ${userContext?.lastSys || 120} / DIA ${userContext?.lastDia || 80} mmHg.
- Objectif : Prévention active, réduction du stress de bureau, hygiène de vie.

Règles de sécurité :
- Tu ne poses AUCUN diagnostic médical.
- Tu ne préconises AUCUN médicament ni ne modifies de traitement.
- En cas de mention de symptômes graves (douleur dans la poitrine, vertiges intenses, engourdissement du visage, tension >= 180/120), invite immédiatement à contacter le 15 (SAMU) ou les urgences locales (112).
- Réponds avec empathie, clarté et concision (1 ou 2 paragraphes courts + liste à puces si pertinent).
`;

    const chatHistory = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));

    // Add context to the latest message or system instruction
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: chatHistory,
      config: {
        systemInstruction: `Tu es l'assistant conversationnel de TensiCoach en français. ${contextPrompt}`,
        temperature: 0.7,
      },
    });

    return res.json({
      reply: response.text,
      source: 'gemini',
    });
  } catch (error: any) {
    console.error('Gemini Chat error:', error);
    return res.status(500).json({
      error: 'chat_failed',
      message: error?.message || 'Erreur lors du chat avec Gemini. Passage en mode local.',
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TensiCoach server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
