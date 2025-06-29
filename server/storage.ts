import { supabase } from "./db";
import type {
  User,
  InsertUser,
  Profile,
  InsertProfile,
  Subject,
  InsertSubject,
  StudySession,
  InsertStudySession,
  Flashcard,
  InsertFlashcard,
  UserProgress,
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
    const { data, error } = await supabase
      .from('auth_users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) return undefined;
    return data as User;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('auth_users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error || !data) return undefined;
    return data as User;
  }

  async createUser(user: InsertUser): Promise<User> {
    const { data, error } = await supabase
      .from('auth_users')
      .insert(user)
      .select()
      .single();
    
    if (error) throw error;
    return data as User;
  }

  // Profile management
  async getProfile(userId: string): Promise<Profile | undefined> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error || !data) return undefined;
    return data as Profile;
  }

  async createProfile(profile: InsertProfile): Promise<Profile> {
    const { data, error } = await supabase
      .from('profiles')
      .insert(profile)
      .select()
      .single();
    
    if (error) throw error;
    return data as Profile;
  }

  async updateProfile(userId: string, updates: Partial<InsertProfile>): Promise<Profile> {
    const { data, error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data as Profile;
  }

  // Subject management
  async getSubjects(userId: string): Promise<Subject[]> {
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    return data as Subject[];
  }

  async getSubject(id: string, userId: string): Promise<Subject | undefined> {
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();
    
    if (error || !data) return undefined;
    return data as Subject;
  }

  async createSubject(subject: InsertSubject): Promise<Subject> {
    const { data, error } = await supabase
      .from('subjects')
      .insert(subject)
      .select()
      .single();
    
    if (error) throw error;
    return data as Subject;
  }

  async updateSubject(id: string, userId: string, updates: Partial<InsertSubject>): Promise<Subject> {
    const { data, error } = await supabase
      .from('subjects')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data as Subject;
  }

  async deleteSubject(id: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('subjects')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);
    
    if (error) throw error;
  }

  // Study session management
  async getStudySessions(userId: string): Promise<StudySession[]> {
    const { data, error } = await supabase
      .from('study_sessions')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    return data as StudySession[];
  }

  async getStudySession(id: string, userId: string): Promise<StudySession | undefined> {
    const { data, error } = await supabase
      .from('study_sessions')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();
    
    if (error || !data) return undefined;
    return data as StudySession;
  }

  async createStudySession(session: InsertStudySession): Promise<StudySession> {
    const { data, error } = await supabase
      .from('study_sessions')
      .insert(session)
      .select()
      .single();
    
    if (error) throw error;
    return data as StudySession;
  }

  async updateStudySession(id: string, userId: string, updates: Partial<InsertStudySession>): Promise<StudySession> {
    const { data, error } = await supabase
      .from('study_sessions')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data as StudySession;
  }

  async deleteStudySession(id: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('study_sessions')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);
    
    if (error) throw error;
  }

  // Flashcard management
  async getFlashcards(userId: string): Promise<Flashcard[]> {
    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId);
    
    if (error) throw error;
    return data as Flashcard[];
  }

  async getFlashcard(id: string, userId: string): Promise<Flashcard | undefined> {
    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();
    
    if (error || !data) return undefined;
    return data as Flashcard;
  }

  async createFlashcard(flashcard: InsertFlashcard): Promise<Flashcard> {
    const { data, error } = await supabase
      .from('flashcards')
      .insert(flashcard)
      .select()
      .single();
    
    if (error) throw error;
    return data as Flashcard;
  }

  async updateFlashcard(id: string, userId: string, updates: Partial<InsertFlashcard>): Promise<Flashcard> {
    const { data, error } = await supabase
      .from('flashcards')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data as Flashcard;
  }

  async deleteFlashcard(id: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('flashcards')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);
    
    if (error) throw error;
  }

  // User progress
  async getUserProgress(userId: string): Promise<UserProgress | undefined> {
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error || !data) return undefined;
    return data as UserProgress;
  }

  async updateUserProgress(userId: string, updates: Partial<UserProgress>): Promise<UserProgress> {
    const { data, error } = await supabase
      .from('user_progress')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data as UserProgress;
  }
}

export const storage = new DatabaseStorage();