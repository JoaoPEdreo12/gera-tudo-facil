import { db } from "./db";
import { eq, and } from "drizzle-orm";
import {
  users,
  profiles,
  subjects,
  studySessions,
  flashcards,
  userProgress,
  type User,
  type InsertUser,
  type Profile,
  type InsertProfile,
  type Subject,
  type InsertSubject,
  type StudySession,
  type InsertStudySession,
  type Flashcard,
  type InsertFlashcard,
  type UserProgress,
} from "@shared/schema";

export interface IStorage {
  // User management
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Profile management
  getProfile(userId: string): Promise<Profile | undefined>;
  createProfile(profile: InsertProfile): Promise<Profile>;
  updateProfile(userId: string, updates: Partial<InsertProfile>): Promise<Profile>;
  
  // Subject management
  getSubjects(userId: string): Promise<Subject[]>;
  getSubject(id: string, userId: string): Promise<Subject | undefined>;
  createSubject(subject: InsertSubject): Promise<Subject>;
  updateSubject(id: string, userId: string, updates: Partial<InsertSubject>): Promise<Subject>;
  deleteSubject(id: string, userId: string): Promise<void>;
  
  // Study session management
  getStudySessions(userId: string): Promise<StudySession[]>;
  getStudySession(id: string, userId: string): Promise<StudySession | undefined>;
  createStudySession(session: InsertStudySession): Promise<StudySession>;
  updateStudySession(id: string, userId: string, updates: Partial<InsertStudySession>): Promise<StudySession>;
  deleteStudySession(id: string, userId: string): Promise<void>;
  
  // Flashcard management
  getFlashcards(userId: string): Promise<Flashcard[]>;
  getFlashcard(id: string, userId: string): Promise<Flashcard | undefined>;
  createFlashcard(flashcard: InsertFlashcard): Promise<Flashcard>;
  updateFlashcard(id: string, userId: string, updates: Partial<InsertFlashcard>): Promise<Flashcard>;
  deleteFlashcard(id: string, userId: string): Promise<void>;
  
  // User progress
  getUserProgress(userId: string): Promise<UserProgress | undefined>;
  updateUserProgress(userId: string, updates: Partial<UserProgress>): Promise<UserProgress>;
}

export class DatabaseStorage implements IStorage {
  // User management
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  // Profile management
  async getProfile(userId: string): Promise<Profile | undefined> {
    const result = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1);
    return result[0];
  }

  async createProfile(profile: InsertProfile): Promise<Profile> {
    const result = await db.insert(profiles).values(profile).returning();
    return result[0];
  }

  async updateProfile(userId: string, updates: Partial<InsertProfile>): Promise<Profile> {
    const result = await db
      .update(profiles)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(profiles.userId, userId))
      .returning();
    return result[0];
  }

  // Subject management
  async getSubjects(userId: string): Promise<Subject[]> {
    return await db.select().from(subjects).where(eq(subjects.userId, userId));
  }

  async getSubject(id: string, userId: string): Promise<Subject | undefined> {
    const result = await db
      .select()
      .from(subjects)
      .where(and(eq(subjects.id, id), eq(subjects.userId, userId)))
      .limit(1);
    return result[0];
  }

  async createSubject(subject: InsertSubject): Promise<Subject> {
    const result = await db.insert(subjects).values(subject).returning();
    return result[0];
  }

  async updateSubject(id: string, userId: string, updates: Partial<InsertSubject>): Promise<Subject> {
    const result = await db
      .update(subjects)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(eq(subjects.id, id), eq(subjects.userId, userId)))
      .returning();
    return result[0];
  }

  async deleteSubject(id: string, userId: string): Promise<void> {
    await db.delete(subjects).where(and(eq(subjects.id, id), eq(subjects.userId, userId)));
  }

  // Study session management
  async getStudySessions(userId: string): Promise<StudySession[]> {
    return await db.select().from(studySessions).where(eq(studySessions.userId, userId));
  }

  async getStudySession(id: string, userId: string): Promise<StudySession | undefined> {
    const result = await db
      .select()
      .from(studySessions)
      .where(and(eq(studySessions.id, id), eq(studySessions.userId, userId)))
      .limit(1);
    return result[0];
  }

  async createStudySession(session: InsertStudySession): Promise<StudySession> {
    const result = await db.insert(studySessions).values(session).returning();
    return result[0];
  }

  async updateStudySession(id: string, userId: string, updates: Partial<InsertStudySession>): Promise<StudySession> {
    const result = await db
      .update(studySessions)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(eq(studySessions.id, id), eq(studySessions.userId, userId)))
      .returning();
    return result[0];
  }

  async deleteStudySession(id: string, userId: string): Promise<void> {
    await db.delete(studySessions).where(and(eq(studySessions.id, id), eq(studySessions.userId, userId)));
  }

  // Flashcard management
  async getFlashcards(userId: string): Promise<Flashcard[]> {
    return await db.select().from(flashcards).where(eq(flashcards.userId, userId));
  }

  async getFlashcard(id: string, userId: string): Promise<Flashcard | undefined> {
    const result = await db
      .select()
      .from(flashcards)
      .where(and(eq(flashcards.id, id), eq(flashcards.userId, userId)))
      .limit(1);
    return result[0];
  }

  async createFlashcard(flashcard: InsertFlashcard): Promise<Flashcard> {
    const result = await db.insert(flashcards).values(flashcard).returning();
    return result[0];
  }

  async updateFlashcard(id: string, userId: string, updates: Partial<InsertFlashcard>): Promise<Flashcard> {
    const result = await db
      .update(flashcards)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(eq(flashcards.id, id), eq(flashcards.userId, userId)))
      .returning();
    return result[0];
  }

  async deleteFlashcard(id: string, userId: string): Promise<void> {
    await db.delete(flashcards).where(and(eq(flashcards.id, id), eq(flashcards.userId, userId)));
  }

  // User progress
  async getUserProgress(userId: string): Promise<UserProgress | undefined> {
    const result = await db.select().from(userProgress).where(eq(userProgress.userId, userId)).limit(1);
    return result[0];
  }

  async updateUserProgress(userId: string, updates: Partial<UserProgress>): Promise<UserProgress> {
    const result = await db
      .update(userProgress)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(userProgress.userId, userId))
      .returning();
    return result[0];
  }
}

export const storage = new DatabaseStorage();
