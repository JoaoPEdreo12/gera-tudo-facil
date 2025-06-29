
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSubjects } from '@/hooks/useSubjects';
import { useStudySessions } from '@/hooks/useStudySessions';
import { useToast } from '@/hooks/use-toast';

interface SessionFormProps {
  onClose: () => void;
  editingSession?: any;
}

export const SessionForm = ({ onClose, editingSession }: SessionFormProps) => {
  const { subjects } = useSubjects();
  const { createSession, updateSession } = useStudySessions();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: editingSession?.title || '',
    description: editingSession?.description || '',
    subject_id: editingSession?.subject_id || '',
    scheduled_date: editingSession?.scheduled_date || new Date().toISOString().split('T')[0],
    scheduled_time: editingSession?.scheduled_time || '',
    duration_minutes: editingSession?.duration_minutes || 60,
    type: editingSession?.type || 'study',
    priority: editingSession?.priority || 1,
    status: editingSession?.status || 'pending'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingSession) {
        const { error } = await updateSession(editingSession.id, formData);
        if (error) throw error;
        toast({ title: "Sessão atualizada com sucesso!" });
      } else {
        const { error } = await createSession(formData);
        if (error) throw error;
        toast({ title: "Sessão criada com sucesso!" });
      }
      onClose();
    } catch (error) {
      toast({ 
        title: "Erro", 
        description: "Não foi possível salvar a sessão",
        variant: "destructive" 
      });
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Título</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="subject">Matéria</Label>
          <Select
            value={formData.subject_id}
            onValueChange={(value) => setFormData({ ...formData, subject_id: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma matéria" />
            </SelectTrigger>
            <SelectContent>
              {subjects.map((subject) => (
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
              onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="time">Horário</Label>
            <Input
              id="time"
              type="time"
              value={formData.scheduled_time}
              onChange={(e) => setFormData({ ...formData, scheduled_time: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="duration">Duração (min)</Label>
            <Input
              id="duration"
              type="number"
              min="15"
              max="240"
              value={formData.duration_minutes}
              onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
            />
          </div>

          <div>
            <Label htmlFor="type">Tipo</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value })}
            >
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
        </div>

        <div>
          <Label htmlFor="priority">Prioridade</Label>
          <Select
            value={formData.priority.toString()}
            onValueChange={(value) => setFormData({ ...formData, priority: parseInt(value) })}
          >
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

        <div className="flex gap-3 pt-4">
          <Button type="submit" className="flex-1">
            {editingSession ? 'Atualizar' : 'Criar'} Sessão
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </form>
    </Card>
  );
};
