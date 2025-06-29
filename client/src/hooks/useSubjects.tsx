import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';

interface Subject {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  color: string;
  priority: number;
  createdAt: string;
  updatedAt: string;
}

export const useSubjects = () => {
  const {
    data: subjects = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ['/subjects'],
    enabled: !!localStorage.getItem('authToken'),
  });

  const createSubjectMutation = useMutation({
    mutationFn: (subjectData: Partial<Subject>) =>
      apiRequest('/subjects', {
        method: 'POST',
        body: JSON.stringify(subjectData),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/subjects'] });
    },
  });

  const updateSubjectMutation = useMutation({
    mutationFn: ({ id, ...updates }: { id: string } & Partial<Subject>) =>
      apiRequest(`/subjects/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/subjects'] });
    },
  });

  const deleteSubjectMutation = useMutation({
    mutationFn: (id: string) =>
      apiRequest(`/subjects/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/subjects'] });
    },
  });

  return {
    subjects,
    loading,
    error,
    createSubject: createSubjectMutation.mutateAsync,
    updateSubject: updateSubjectMutation.mutateAsync,
    deleteSubject: deleteSubjectMutation.mutateAsync,
    isCreating: createSubjectMutation.isPending,
    isUpdating: updateSubjectMutation.isPending,
    isDeleting: deleteSubjectMutation.isPending,
  };
};