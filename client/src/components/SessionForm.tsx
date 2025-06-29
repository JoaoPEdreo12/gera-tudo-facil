import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStudySessions } from '@/hooks/useStudySessions';
import { useSubjects } from '@/hooks/useSubjects';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface SessionFormProps {
  onClose: () => void;
  editingSession?: any;
}

export const SessionForm = ({ onClose, editingSession }: SessionFormProps) => {
  const { createSession, updateSession, isCreating, isUpdating } = useStudySessions();
  const { subjects } = useSubjects();
  const { user } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: editingSession?.title || '',
    description: editingSession?.description || '',
    subject_id: editingSession?.subject_id || '',
    scheduled_date: editingSession?.scheduled_date || new Date().toISOString().split('T')[0],
    scheduled_time: editingSession?.scheduled_time || '09:00',
    duration_minutes: editingSession?.duration_minutes || 60,
    type: editingSession?.type || 'study',
    priority: editingSession?.priority || 1,
    status: editingSession?.status || 'pending'
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
      const sessionData = {
        ...formData,
        user_id: user.id,
        topic_id: null,
        completed_at: null
      };
      
      if (editingSession) {
        await updateSession({ id: editingSession.id, ...sessionData });
        toast({ title: "Sessão atualizada com sucesso!" });
      } else {
        await createSession(sessionData);
        toast({ title: "Sessão criada com sucesso!" });
      }
      onClose();
    } catch (error: any) {
      toast({ 
        title: "Erro", 
        description: error.message || "Não foi possível salvar a sessão",
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
        {editingSession ? 'Editar Sessão' : 'Nova Sessão de Estudo'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Título</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="Ex: Revisão de Matemática"
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Detalhes sobre o que será estudado..."
            rows={3}
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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="date">Data</Label>
            <Input
              id="date"
              type="date"
              value={formData.scheduled_date}
              onChange={(e) => handleInputChange('scheduled_date', e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="time">Horário</Label>
            <Input
              id="time"
              type="time"
              value={formData.scheduled_time}
              onChange={(e) => handleInputChange('scheduled_time', e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="duration">Duração (minutos)</Label>
          <Input
            id="duration"
            type="number"
            value={formData.duration_minutes}
            onChange={(e) => handleInputChange('duration_minutes', parseInt(e.target.value))}
            min="15"
            max="480"
            step="15"
            required
          />
        </div>

        <div>
          <Label htmlFor="type">Tipo</Label>
          <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="study">Estudo</SelectItem>
              <SelectItem value="review">Revisão</SelectItem>
              <SelectItem value="exercise">Exercícios</SelectItem>
              <SelectItem value="exam">Prova</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="priority">Prioridade</Label>
          <Select value={formData.priority.toString()} onValueChange={(value) => handleInputChange('priority', parseInt(value))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Baixa</SelectItem>
              <SelectItem value="2">Média</SelectItem>
              <SelectItem value="3">Alta</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2 pt-4">
          <Button 
            type="submit" 
            disabled={isCreating || isUpdating}
            className="flex-1"
          >
            {isCreating || isUpdating ? 'Salvando...' : (editingSession ? 'Atualizar' : 'Criar Sessão')}
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </form>
    </Card>
  );
};