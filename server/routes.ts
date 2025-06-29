import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertUserSchema,
  insertProfileSchema,
  insertSubjectSchema,
  insertStudySessionSchema,
  insertFlashcardSchema,
} from "@shared/schema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-for-development";

// Simple auth middleware
async function authenticate(req: any, res: any, next: any) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { email, password, fullName } = req.body;
      
      // Check if user exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password and create user
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await storage.createUser({ email, password: hashedPassword });
      
      // Create profile
      await storage.createProfile({
        userId: user.id,
        fullName,
        email,
      });

      // Generate token
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });
      
      res.json({ user: { id: user.id, email: user.email }, token });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });
      
      res.json({ user: { id: user.id, email: user.email }, token });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Profile routes
  app.get("/api/profile", authenticate, async (req: any, res) => {
    try {
      const profile = await storage.getProfile(req.userId);
      const progress = await storage.getUserProgress(req.userId);
      res.json({ profile, progress });
    } catch (error) {
      console.error('Profile fetch error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/api/profile", authenticate, async (req: any, res) => {
    try {
      const updates = insertProfileSchema.parse(req.body);
      const profile = await storage.updateProfile(req.userId, updates);
      res.json(profile);
    } catch (error) {
      console.error('Profile update error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Subject routes
  app.get("/api/subjects", authenticate, async (req: any, res) => {
    try {
      const subjects = await storage.getSubjects(req.userId);
      res.json(subjects);
    } catch (error) {
      console.error('Subjects fetch error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/subjects", authenticate, async (req: any, res) => {
    try {
      const subjectData = insertSubjectSchema.parse({ ...req.body, userId: req.userId });
      const subject = await storage.createSubject(subjectData);
      res.json(subject);
    } catch (error) {
      console.error('Subject creation error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/api/subjects/:id", authenticate, async (req: any, res) => {
    try {
      const updates = insertSubjectSchema.partial().parse(req.body);
      const subject = await storage.updateSubject(req.params.id, req.userId, updates);
      res.json(subject);
    } catch (error) {
      console.error('Subject update error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/subjects/:id", authenticate, async (req: any, res) => {
    try {
      await storage.deleteSubject(req.params.id, req.userId);
      res.json({ success: true });
    } catch (error) {
      console.error('Subject deletion error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Study session routes
  app.get("/api/study-sessions", authenticate, async (req: any, res) => {
    try {
      const sessions = await storage.getStudySessions(req.userId);
      res.json(sessions);
    } catch (error) {
      console.error('Study sessions fetch error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/study-sessions", authenticate, async (req: any, res) => {
    try {
      const sessionData = insertStudySessionSchema.parse({ ...req.body, userId: req.userId });
      const session = await storage.createStudySession(sessionData);
      res.json(session);
    } catch (error) {
      console.error('Study session creation error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/api/study-sessions/:id", authenticate, async (req: any, res) => {
    try {
      const updates = insertStudySessionSchema.partial().parse(req.body);
      const session = await storage.updateStudySession(req.params.id, req.userId, updates);
      res.json(session);
    } catch (error) {
      console.error('Study session update error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/study-sessions/:id", authenticate, async (req: any, res) => {
    try {
      await storage.deleteStudySession(req.params.id, req.userId);
      res.json({ success: true });
    } catch (error) {
      console.error('Study session deletion error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Flashcard routes
  app.get("/api/flashcards", authenticate, async (req: any, res) => {
    try {
      const flashcards = await storage.getFlashcards(req.userId);
      res.json(flashcards);
    } catch (error) {
      console.error('Flashcards fetch error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/flashcards", authenticate, async (req: any, res) => {
    try {
      const flashcardData = insertFlashcardSchema.parse({ ...req.body, userId: req.userId });
      const flashcard = await storage.createFlashcard(flashcardData);
      res.json(flashcard);
    } catch (error) {
      console.error('Flashcard creation error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/api/flashcards/:id", authenticate, async (req: any, res) => {
    try {
      const updates = insertFlashcardSchema.partial().parse(req.body);
      const flashcard = await storage.updateFlashcard(req.params.id, req.userId, updates);
      res.json(flashcard);
    } catch (error) {
      console.error('Flashcard update error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/flashcards/:id", authenticate, async (req: any, res) => {
    try {
      await storage.deleteFlashcard(req.params.id, req.userId);
      res.json({ success: true });
    } catch (error) {
      console.error('Flashcard deletion error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // AI helper route (replacing Supabase Edge Function)
  app.post("/api/ai-helper", authenticate, async (req: any, res) => {
    try {
      const { prompt, type = 'general' } = req.body;
      
      // This will need an OpenAI API key to be provided by the user
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ message: "OpenAI API key not configured" });
      }

      let systemPrompt = '';
      
      switch (type) {
        case 'schedule':
          systemPrompt = 'Você é um assistente especializado em criar cronogramas de estudo otimizados. Ajude o usuário a organizar sua rotina de estudos de forma eficiente.';
          break;
        case 'flashcard':
          systemPrompt = 'Você é um especialista em criar flashcards educativos. Crie perguntas e respostas claras e objetivas para facilitar a memorização.';
          break;
        case 'explanation':
          systemPrompt = 'Você é um professor experiente. Explique conceitos de forma clara, didática e com exemplos práticos.';
          break;
        default:
          systemPrompt = 'Você é um assistente de estudos especializado em ajudar estudantes brasileiros que se preparam para o ENEM e vestibulares. Seja didático, motivador e forneça dicas práticas.';
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
          ],
          max_tokens: 1000,
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Erro na API do OpenAI');
      }

      const aiResponse = data.choices[0].message.content;
      res.json({ response: aiResponse });
    } catch (error) {
      console.error('AI helper error:', error);
      res.status(500).json({ message: "AI service error" });
    }
  });

  const httpServer = createServer(app);
  // AI helper route (replaces Supabase Edge Functions)
  app.post("/api/ai-study-helper", authenticate, async (req, res) => {
    try {
      const { action, data } = req.body;
      
      const openaiApiKey = process.env.OPENAI_API_KEY;
      if (!openaiApiKey) {
        return res.status(500).json({ error: 'OpenAI API key not configured' });
      }

      let prompt = '';
      let systemPrompt = 'Você é um assistente de IA especializado em otimização de estudos. Responda sempre em português brasileiro de forma clara e motivadora.';

      switch (action) {
        case 'generate_schedule':
          systemPrompt = `Você é um especialista em planejamento de estudos. Crie cronogramas personalizados baseados nos dados do aluno. 
          Responda APENAS com um JSON válido no formato:
          {
            "schedule": [
              {
                "date": "2025-01-01",
                "time": "09:00",
                "duration": 60,
                "subject": "Matemática",
                "type": "study",
                "priority": 2,
                "description": "Revisão de funções quadráticas"
              }
            ],
            "recommendations": ["Recomendação 1", "Recomendação 2"],
            "analysis": {
              "totalHours": 10,
              "subjectDistribution": {"Matemática": 4, "História": 3},
              "suggestions": ["Sugestão 1", "Sugestão 2"]
            }
          }`;
          
          prompt = `Com base nos dados do aluno:
          - Matérias: ${JSON.stringify(data.subjects)}
          - Horas disponíveis por dia: ${data.availableHoursPerDay}
          - Objetivos: ${data.studyGoals}
          - Preferências: ${JSON.stringify(data.preferences)}
          
          Crie um cronograma de estudos para os próximos 7 dias, distribuindo equilibradamente as matérias e respeitando as prioridades.`;
          break;

        case 'generate_feedback':
          systemPrompt = `Você é um mentor de estudos motivacional. Analise o progresso do aluno e forneça feedback personalizado.
          Responda APENAS com um JSON válido no formato:
          {
            "motivationalMessage": "Mensagem motivacional personalizada",
            "streakInfo": {
              "current": 5,
              "message": "Você está numa sequência incrível!"
            },
            "performanceAnalysis": {
              "strongSubjects": ["Matemática", "Física"],
              "needsAttention": ["História"],
              "recommendations": ["Dedique mais tempo à História", "Continue o ótimo trabalho em Matemática"]
            },
            "nextSteps": ["Próximo passo 1", "Próximo passo 2"]
          }`;
          
          prompt = `Analise o progresso do aluno:
          - Dados de progresso: ${JSON.stringify(data)}
          
          Forneça feedback motivacional e orientações específicas baseadas no desempenho.`;
          break;

        case 'generate_report':
          systemPrompt = `Você é um analista de desempenho acadêmico. Gere relatórios detalhados sobre o progresso dos estudos.
          Responda APENAS com um JSON válido no formato:
          {
            "summary": {
              "totalStudyTime": 120,
              "completionRate": 85,
              "consistencyScore": 78
            },
            "subjectAnalysis": [
              {
                "subject": "Matemática",
                "timeSpent": 40,
                "completionRate": 90,
                "trend": "improving"
              }
            ],
            "insights": ["Insight 1", "Insight 2"],
            "recommendations": ["Recomendação 1", "Recomendação 2"]
          }`;
          
          prompt = `Gere um relatório de desempenho para o período: ${data.period}
          Analise consistência, distribuição de tempo por matéria e tendências de progresso.`;
          break;

        case 'generate_flashcards':
          systemPrompt = `Você é um especialista em criação de flashcards educativos.
          Responda APENAS com um JSON válido no formato:
          {
            "flashcards": [
              {
                "question": "Pergunta do flashcard",
                "answer": "Resposta detalhada",
                "difficulty": 2,
                "tags": ["tag1", "tag2"]
              }
            ]
          }`;
          
          prompt = `Crie flashcards para:
          - Matéria: ${data.subject}
          - Conteúdo: ${data.content}
          
          Gere 5-10 flashcards com perguntas progressivas do básico ao avançado.`;
          break;

        case 'explain_concept':
          systemPrompt = `Você é um professor especialista que explica conceitos de forma didática.
          Responda APENAS com um JSON válido no formato:
          {
            "explanation": "Explicação detalhada do conceito",
            "examples": ["Exemplo 1", "Exemplo 2"],
            "keyPoints": ["Ponto importante 1", "Ponto importante 2"],
            "relatedTopics": ["Tópico relacionado 1", "Tópico relacionado 2"],
            "practiceQuestions": ["Pergunta 1", "Pergunta 2"]
          }`;
          
          prompt = `Explique o conceito:
          - Matéria: ${data.subject}
          - Tópico: ${data.topic}
          - Nível: ${data.level}
          
          Adapte a explicação ao nível solicitado e inclua exemplos práticos.`;
          break;

        default:
          return res.status(400).json({ error: 'Ação não reconhecida' });
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const aiResponse = await response.json();
      const aiContent = aiResponse.choices[0].message.content;

      // Parse JSON response from AI
      let result;
      try {
        result = JSON.parse(aiContent);
      } catch (e) {
        result = { 
          error: 'Resposta inválida da IA',
          raw_response: aiContent 
        };
      }

      res.json(result);

    } catch (error) {
      console.error('Error in ai-study-helper:', error);
      res.status(500).json({ 
        error: error.message || 'Erro interno do servidor',
        details: error.toString()
      });
    }
  });

  return httpServer;
}
