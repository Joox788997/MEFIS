import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./src/db/schema.ts";
import { eq, sql } from "drizzle-orm";
import { GoogleGenAI } from "@google/genai";

const { Pool } = pg;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Gemini Setup
  const genAI = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || "",
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // Database Connection
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  const db = drizzle(pool, { schema });

  // API Routes
  
  // Gemini Chat
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history } = req.body;
      
      const model = "gemini-3-flash-preview";
      const systemInstruction = `You are MEFIS (Multi-Entity Financial Intelligence System) Research Assistant.
      You help users analyze financial data across multiple entities (businesses/organizations).
      The database schema includes:
      - entities: (id, name, type, metadata)
      - departments: (id, entityId, name, budget)
      - transactions: (id, entityId, departmentId, amount, type (income/expense), category, description, confidenceScore)
      - users: (id, fullName, email)
      
      Provide concise, technical, and data-driven insights. If the user asks for analysis, explain the trends you might find in such a dataset.
      Respond in Markdown and use monospace for data points. Be helpful and professional.`;

      const chat = genAI.chats.create({
        model,
        config: { systemInstruction },
        history: history || []
      });

      const result = await chat.sendMessage({ message });
      res.json({ text: result.text });
    } catch (error) {
      console.error("Gemini Error:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // Entities
  app.get("/api/entities", async (req, res) => {
    try {
      const allEntities = await db.select().from(schema.entities);
      res.json(allEntities);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.post("/api/entities", async (req, res) => {
    try {
      const { name, type, metadata } = req.body;
      const newEntity = await db.insert(schema.entities).values({ name, type, metadata }).returning();
      res.json(newEntity[0]);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.put("/api/entities/:id", async (req, res) => {
    try {
      const { name, type, metadata } = req.body;
      const updatedEntity = await db.update(schema.entities)
        .set({ name, type, metadata })
        .where(eq(schema.entities.id, req.params.id))
        .returning();
      res.json(updatedEntity[0]);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // Departments
  app.get("/api/entities/:entityId/departments", async (req, res) => {
    try {
      const deps = await db.select().from(schema.departments).where(eq(schema.departments.entityId, req.params.entityId));
      res.json(deps);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // Transactions
  app.get("/api/transactions", async (req, res) => {
    try {
      const { entityId, limit } = req.query;
      let query = db.select().from(schema.transactions);
      if (entityId) {
        // @ts-ignore
        query = query.where(eq(schema.transactions.entityId, entityId));
      }
      // @ts-ignore
      const results = await query.limit(Number(limit) || 50).orderBy(sql`${schema.transactions.createdAt} DESC`);
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.post("/api/transactions", async (req, res) => {
    try {
      const { entityId, departmentId, amount, type, category, rawCategory, description, notes, confidenceScore } = req.body;
      const newTx = await db.insert(schema.transactions).values({
        entityId,
        departmentId,
        amount: String(amount),
        type,
        category,
        rawCategory,
        description,
        notes,
        confidenceScore: confidenceScore ? String(confidenceScore) : null,
      }).returning();
      res.json(newTx[0]);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // Analysis / Stats
  app.get("/api/analysis/summary", async (req, res) => {
    try {
      const { entityId } = req.query;
      const condition = entityId ? sql`entity_id = ${entityId}` : sql`1=1`;
      
      const stats = await db.execute(sql`
        SELECT 
          SUM(CASE WHEN type = 'income' THEN amount::numeric ELSE 0 END) as total_income,
          SUM(CASE WHEN type = 'expense' THEN amount::numeric ELSE 0 END) as total_expenses,
          COUNT(*) as transaction_count
        FROM transactions
        WHERE ${condition}
      `);
      
      res.json(stats.rows[0]);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.get("/api/analysis/categories", async (req, res) => {
    try {
        const { entityId } = req.query;
        const condition = entityId ? sql`entity_id = ${entityId}` : sql`1=1`;
        const results = await db.execute(sql`
            SELECT category, SUM(amount::numeric) as total
            FROM transactions
            WHERE ${condition} AND type = 'expense'
            GROUP BY category
            ORDER BY total DESC
        `);
        res.json(results.rows);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
  });

  // User Profile / Settings
  app.get("/api/users/me", async (req, res) => {
    try {
      let currentUser = await db.select().from(schema.users).limit(1);
      if (currentUser.length === 0) {
        // Create a default user if none exists
        const newUser = await db.insert(schema.users).values({
          email: "user@example.com",
          fullName: "John Doe",
          avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
          preferences: {
            studyTimer: 25,
            breakTimer: 5,
            reminders: true,
            notifications: {
              tasks: true,
              schedule: true,
              study: true
            }
          }
        }).returning();
        currentUser = newUser;
      }
      res.json(currentUser[0]);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.put("/api/users/me", async (req, res) => {
    try {
      const { fullName, email, avatarUrl } = req.body;
      const currentUser = await db.select().from(schema.users).limit(1);
      if (currentUser.length === 0) return res.status(404).json({ error: "User not found" });
      
      const updatedUser = await db.update(schema.users)
        .set({ fullName, email, avatarUrl })
        .where(eq(schema.users.id, currentUser[0].id))
        .returning();
      res.json(updatedUser[0]);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.put("/api/users/me/preferences", async (req, res) => {
    try {
      const { preferences, theme } = req.body;
      const currentUser = await db.select().from(schema.users).limit(1);
      if (currentUser.length === 0) return res.status(404).json({ error: "User not found" });

      const updatedUser = await db.update(schema.users)
        .set({ preferences, theme })
        .where(eq(schema.users.id, currentUser[0].id))
        .returning();
      res.json(updatedUser[0]);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.put("/api/users/me/security", async (req, res) => {
    try {
      // In a real app we'd handle password changes here
      res.json({ message: "Security settings updated (simulated)" });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
