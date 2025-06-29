import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';

interface Flashcard {
  id: string;
  userId: string;
  subjectId: string | null;
  topicId: string | null;
  question: string;
  answer: string;
  difficulty: number;
  nextReviewDate: string;
  reviewCount: number;
  correctCount: number;
  createdAt: string;
  updatedAt: string;
}

export const useFlashcards = () => {
  const {
    data: flashcards = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ['/flashcards'],
    enabled: !!localStorage.getItem('authToken'),
  });

  const createFlashcardMutation = useMutation({
    mutationFn: (flashcardData: Partial<Flashcard>) =>
      apiRequest('/flashcards', {
        method: 'POST',
        body: JSON.stringify(flashcardData),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/flashcards'] });
    },
  });

  const updateFlashcardMutation = useMutation({
    mutationFn: ({ id, ...updates }: { id: string } & Partial<Flashcard>) =>
      apiRequest(`/flashcards/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/flashcards'] });
    },
  });

  const deleteFlashcardMutation = useMutation({
    mutationFn: (id: string) =>
      apiRequest(`/flashcards/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/flashcards'] });
    },
  });

  return {
    flashcards,
    loading,
    error,
    createFlashcard: createFlashcardMutation.mutateAsync,
    updateFlashcard: updateFlashcardMutation.mutateAsync,
    deleteFlashcard: deleteFlashcardMutation.mutateAsync,
    isCreating: createFlashcardMutation.isPending,
    isUpdating: updateFlashcardMutation.isPending,
    isDeleting: deleteFlashcardMutation.isPending,
  };
};