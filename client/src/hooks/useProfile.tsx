import { useQuery } from '@tanstack/react-query';

interface Profile {
  id: string;
  userId: string;
  fullName: string | null;
  email: string | null;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

interface UserProgress {
  id: string;
  userId: string;
  totalPoints: number;
  level: number;
  streakDays: number;
  lastStudyDate: string | null;
  totalStudyTimeMinutes: number;
  completedSessions: number;
  createdAt: string;
  updatedAt: string;
}

export const useProfile = () => {
  const {
    data,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ['/profile'],
    enabled: !!localStorage.getItem('authToken'),
  });

  return {
    profile: data?.profile as Profile | undefined,
    progress: data?.progress as UserProgress | undefined,
    loading,
    error,
  };
};