
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { FileText, Clock, Calendar, Plus, Edit, Filter } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SubjectForm } from '@/components/SubjectForm';
import { useSubjects } from '@/hooks/useSubjects';
import { useStudySessions } from '@/hooks/useStudySessions';
import { useAI } from '@/hooks/useAI';
import { useToast } from '@/hooks/use-toast';

const Materias = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [isSubjectDialogOpen, setIsSubjectDialogOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  
  const { subjects, loading } = useSubjects();
  const { sessions } = useStudySessions();
  const { generateStudyPlan, loading: aiLoading } = useAI();
  const { toast } = useToast();

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 3: return 'bg-red-100 text-red-800';
      case 2: return 'bg-yellow-100 text-yellow-800';
      case 1: return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSubjectProgress = (subjectId: string) => {
    const subjectSessions = sessions.filter(s => s.subject_id === subjectId);
    const completedSessions = subjectSessions.filter(s => s.status === 'completed').length;
    const totalSessions = subjectSessions.length;
    return totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0;
  };

  const getStudyTime = (subjectId: string) => {
    const completedSessions = sessions.filter(s => 
      s.subject_id === subjectId && s.status === 'completed'
    );
    return completedSessions.reduce((acc, s) => acc + s.duration_minutes, 0);
  };

  const filteredSubjects = subjects.filter(subject => {
    const matchesSearch = subject.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = !priorityFilter || priorityFilter === 'all' || subject.priority.toString() === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  const generateAIStudyPlan = async () => {
    if (subjects.length === 0) {
      toast({ 
        title: "Erro", 
        description: "Adicione algumas matérias primeiro",
        variant: "destructive" 
      });
      return;
    }

    const subjectNames = subjects.map(s => s.name);
    const result = await generateStudyPlan(subjectNames, 4, "Preparação para ENEM");
    
    if (result.response) {
      toast({ 
        title: "📚 Plano de Estudos Personalizado", 
        description: result.response,
        duration: 10000
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Matérias</h1>
          <p className="text-gray-600">Gerencie suas disciplinas e acompanhe o progresso</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={generateAIStudyPlan} disabled={aiLoading} variant="outline">
            🤖 Plano IA
          </Button>
          <Dialog open={isSubjectDialogOpen} onOpenChange={setIsSubjectDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nova Matéria
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingSubject ? 'Editar Matéria' : 'Nova Matéria'}
                </DialogTitle>
              </DialogHeader>
              <SubjectForm 
                onClose={() => {
                  setIsSubjectDialogOpen(false);
                  setEditingSubject(null);
                }}
                editingSubject={editingSubject}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Buscar matérias..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        
        <div className="flex gap-2">
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrar por prioridade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as prioridades</SelectItem>
              <SelectItem value="3">Alta Prioridade</SelectItem>
              <SelectItem value="2">Média Prioridade</SelectItem>
              <SelectItem value="1">Baixa Prioridade</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Mais Filtros
          </Button>
        </div>
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSubjects.map((subject) => {
          const progress = getSubjectProgress(subject.id);
          const studyTime = getStudyTime(subject.id);
          
          return (
            <Card key={subject.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{subject.name}</h3>
                  <div className="flex gap-2 mb-3">
                    <Badge className={getPriorityColor(subject.priority)}>
                      {subject.priority === 3 ? 'Alta' : subject.priority === 2 ? 'Média' : 'Baixa'}
                    </Badge>
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: subject.color }}
                    />
                  </div>
                </div>
                <FileText className="w-6 h-6 text-gray-400" />
              </div>

              {subject.description && (
                <p className="text-gray-600 text-sm mb-4">{subject.description}</p>
              )}

              {/* Progress */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Progresso</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-600">Tempo estudado</p>
                    <p className="font-semibold">{Math.round(studyTime / 60)}h</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-600">Sessões</p>
                    <p className="font-semibold">
                      {sessions.filter(s => s.subject_id === subject.id).length}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button size="sm" className="flex-1">Estudar</Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setEditingSubject(subject);
                    setIsSubjectDialogOpen(true);
                  }}
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredSubjects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Nenhuma matéria encontrada</p>
        </div>
      )}

      {/* AI Insights */}
      {subjects.length > 0 && (
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <h3 className="text-lg font-semibold mb-4 text-blue-900">📊 Insights da IA</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Matéria com maior necessidade</h4>
              <p className="text-sm text-gray-600">
                <strong>{subjects.sort((a, b) => b.priority - a.priority)[0]?.name}</strong> precisa de mais atenção.
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Dica de produtividade</h4>
              <p className="text-sm text-gray-600">
                Use a técnica Pomodoro para manter o foco durante as sessões de estudo.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Materias;
