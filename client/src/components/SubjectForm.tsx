
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSubjects } from '@/hooks/useSubjects';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface SubjectFormProps {
  onClose: () => void;
  editingSubject?: any;
}

export const SubjectForm = ({ onClose, editingSubject }: SubjectFormProps) => {
  const { createSubject, updateSubject, isCreating, isUpdating } = useSubjects();
  const { user } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: editingSubject?.name || '',
    description: editingSubject?.description || '',
    color: editingSubject?.color || '#3B82F6',
    priority: editingSubject?.priority || 1
  });

  const colors = [
    { name: 'Azul', value: '#3B82F6' },
    { name: 'Vermelho', value: '#EF4444' },
    { name: 'Verde', value: '#10B981' },
    { name: 'Amarelo', value: '#F59E0B' },
    { name: 'Roxo', value: '#8B5CF6' },
    { name: 'Rosa', value: '#EC4899' },
    { name: 'Laranja', value: '#F97316' },
    { name: 'Cyan', value: '#06B6D4' }
  ];

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
      const subjectData = {
        ...formData,
        user_id: user.id
      };
      
      if (editingSubject) {
        await updateSubject({ id: editingSubject.id, ...subjectData });
        toast({ title: "Matéria atualizada com sucesso!" });
      } else {
        await createSubject(subjectData);
        toast({ title: "Matéria criada com sucesso!" });
      }
      onClose();
    } catch (error: any) {
      toast({ 
        title: "Erro", 
        description: error.message || "Não foi possível salvar a matéria",
        variant: "destructive" 
      });
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Nome da Matéria</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Descreva os objetivos e conteúdos desta matéria..."
          />
        </div>

        <div>
          <Label htmlFor="color">Cor</Label>
          <Select
            value={formData.color}
            onValueChange={(value) => setFormData({ ...formData, color: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {colors.map((color) => (
                <SelectItem key={color.value} value={color.value}>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: color.value }}
                    />
                    {color.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
            {editingSubject ? 'Atualizar' : 'Criar'} Matéria
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </form>
    </Card>
  );
};
