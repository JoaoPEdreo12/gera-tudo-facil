import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFlashcards } from '@/hooks/useFlashcards';
import { useSubjects } from '@/hooks/useSubjects';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface FlashcardFormProps {
  onClose: () => void;
  editingFlashcard?: any;
}

export const FlashcardForm = ({ onClose, editingFlashcard }: FlashcardFormProps) => {
  const { createFlashcard, updateFlashcard, isCreating, isUpdating } = useFlashcards();
  const { subjects } = useSubjects();
  const { user } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    question: editingFlashcard?.question || '',
    answer: editingFlashcard?.answer || '',
    subject_id: editingFlashcard?.subject_id || '',
    difficulty: editingFlashcard?.difficulty || 1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({ 
        title: "Erro", 
        description: "Usuário não autenticado",
        variant: "destructive" 
      });
      return;
    }
    
    try {
      const flashcardData = {
        ...formData,
        user_id: user.id,
        topic_id: null,
        next_review_date: new Date().toISOString(),
        review_count: 0,
        correct_count: 0
      };
      
      if (editingFlashcard) {
        await updateFlashcard({ id: editingFlashcard.id, ...flashcardData });
        toast({ title: "Flashcard atualizado com sucesso!" });
      } else {
        await createFlashcard(flashcardData);
        toast({ title: "Flashcard criado com sucesso!" });
      }
      onClose();
    } catch (error: any) {
      toast({ 
        title: "Erro", 
        description: error.message || "Não foi possível salvar o flashcard",
        variant: "destructive" 
      });
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full max-w-md mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">
        {editingFlashcard ? 'Editar Flashcard' : 'Novo Flashcard'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="question">Pergunta</Label>
          <Textarea
            id="question"
            value={formData.question}
            onChange={(e) => handleInputChange('question', e.target.value)}
            placeholder="Digite a pergunta do flashcard..."
            rows={3}
            required
          />
        </div>

        <div>
          <Label htmlFor="answer">Resposta</Label>
          <Textarea
            id="answer"
            value={formData.answer}
            onChange={(e) => handleInputChange('answer', e.target.value)}
            placeholder="Digite a resposta..."
            rows={4}
            required
          />
        </div>

        <div>
          <Label htmlFor="subject">Matéria</Label>
          <Select value={formData.subject_id} onValueChange={(value) => handleInputChange('subject_id', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma matéria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Nenhuma matéria específica</SelectItem>
              {subjects?.map((subject) => (
                <SelectItem key={subject.id} value={subject.id}>
                  {subject.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="difficulty">Dificuldade</Label>
          <Select value={formData.difficulty.toString()} onValueChange={(value) => handleInputChange('difficulty', parseInt(value))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Muito Fácil</SelectItem>
              <SelectItem value="2">Fácil</SelectItem>
              <SelectItem value="3">Médio</SelectItem>
              <SelectItem value="4">Difícil</SelectItem>
              <SelectItem value="5">Muito Difícil</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2 pt-4">
          <Button 
            type="submit" 
            disabled={isCreating || isUpdating}
            className="flex-1"
          >
            {isCreating || isUpdating ? 'Salvando...' : (editingFlashcard ? 'Atualizar' : 'Criar Flashcard')}
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </form>
    </Card>
  );
};