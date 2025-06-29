import { pgTable, text, uuid, integer, boolean, timestamp, date, time } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Profiles table
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().unique(),
  fullName: text("full_name"),
  email: text("email"),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Subjects table
export const subjects = pgTable("subjects", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  color: text("color").default("#3B82F6"),
  priority: integer("priority").default(1),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Topics table
export const topics = pgTable("topics", {
  id: uuid("id").primaryKey().defaultRandom(),
  subjectId: uuid("subject_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  completed: boolean("completed").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Study sessions table
export const studySessions = pgTable("study_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  subjectId: uuid("subject_id"),
  topicId: uuid("topic_id"),
  title: text("title").notNull(),
  description: text("description"),
  scheduledDate: date("scheduled_date").notNull(),
  scheduledTime: time("scheduled_time"),
  durationMinutes: integer("duration_minutes").default(60),
  status: text("status").default("pending"),
  priority: integer("priority").default(1),
  type: text("type").default("study"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Flashcards table
export const flashcards = pgTable("flashcards", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  subjectId: uuid("subject_id"),
  topicId: uuid("topic_id"),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  difficulty: integer("difficulty").default(1),
  nextReviewDate: date("next_review_date").defaultNow(),
  reviewCount: integer("review_count").default(0),
  correctCount: integer("correct_count").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// User progress table
export const userProgress = pgTable("user_progress", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().unique(),
  totalPoints: integer("total_points").default(0),
  level: integer("level").default(1),
  streakDays: integer("streak_days").default(0),
  lastStudyDate: date("last_study_date"),
  totalStudyTimeMinutes: integer("total_study_time_minutes").default(0),
  completedSessions: integer("completed_sessions").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Legacy users table for basic auth (if needed)
export const users = pgTable("auth_users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas
export const insertProfileSchema = createInsertSchema(profiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSubjectSchema = createInsertSchema(subjects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertStudySessionSchema = createInsertSchema(studySessions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFlashcardSchema = createInsertSchema(flashcards).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

// Types
export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = z.infer<typeof insertProfileSchema>;

export type Subject = typeof subjects.$inferSelect;
export type InsertSubject = z.infer<typeof insertSubjectSchema>;

export type StudySession = typeof studySessions.$inferSelect;
export type InsertStudySession = z.infer<typeof insertStudySessionSchema>;

export type Flashcard = typeof flashcards.$inferSelect;
export type InsertFlashcard = z.infer<typeof insertFlashcardSchema>;

export type UserProgress = typeof userProgress.$inferSelect;

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
