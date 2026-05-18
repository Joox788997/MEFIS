import { pgTable, text, timestamp, numeric, uuid, integer, jsonb } from "drizzle-orm/pg-core";

export const entities = pgTable("entities", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  type: text("type", { enum: ["individual", "company", "factory", "hospital", "school", "university", "organization"] }).notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const departments = pgTable("departments", {
  id: uuid("id").primaryKey().defaultRandom(),
  entityId: uuid("entity_id").references(() => entities.id).notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const transactions = pgTable("transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  entityId: uuid("entity_id").references(() => entities.id).notNull(),
  departmentId: uuid("department_id").references(() => departments.id),
  amount: numeric("amount").notNull(),
  type: text("type", { enum: ["income", "expense"] }).notNull(),
  category: text("category").notNull(),
  rawCategory: text("raw_category"),
  description: text("description"),
  notes: text("notes"),
  confidenceScore: numeric("confidence_score"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const normalizedCategories = pgTable("normalized_categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
  aliases: text("aliases").array(), // Use array of aliases for matching
});

export const normalizationLogs = pgTable("normalization_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  rawInput: text("raw_input").notNull(),
  normalizedResult: jsonb("normalized_result").notNull(),
  confidence: numeric("confidence"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  fullName: text("full_name"),
  avatarUrl: text("avatar_url"),
  preferences: jsonb("preferences").default({
    studyTimer: 25,
    breakTimer: 5,
    reminders: true,
    notifications: {
      tasks: true,
      schedule: true,
      study: true
    }
  }),
  theme: text("theme", { enum: ["light", "dark", "system"] }).default("system"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
