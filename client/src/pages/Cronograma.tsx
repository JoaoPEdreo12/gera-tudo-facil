
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, FileText, Plus, Edit } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { SessionForm } from '@/components/SessionForm';
import { StudyTimer } from '@/components/StudyTimer';
import { useStudySessions } from '@/hooks/useStudySessions';
import { useSubjects } from '@/hooks/useSubjects';
import { useAI } from '@/hooks/useAI';
import { useToast } from '@/hooks/use-toast';
import { format, isToday, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const Cronograma = () => {
  const [view, setView] = useState<'day' | 'week' | 'month'>('week');
  const [isSessionDialogOpen, setIsSessionDialogOpen] = useState(false);
  const [isTimerDialogOpen, setIsTimerDialogOpen] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  
  const { sessions, loading, completeSession } = useStudySessions();
  const { subjects } = useSubjects();
  const { askAI, loading: aiLoading } = useAI();
  const { toast } = useToast();

  const todaySessions = sessions.filter(session => 
    isToday(parseISO(session.scheduled_date))
  );

  const completedToday = todaySessions.filter(session => 
    session.status === 'completed'
  ).length;

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 3: return 'bg-red-100 text-red-800 border-red-200';
      case 2: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 1: return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'study': return 'bg-blue-100 text-blue-800';
      case 'review': return 'bg-purple-100 text-purple-800';
      case 'exercise': return 'bg-orange-100 text-orange-800';
      case 'exam': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStartSession = (session: any) => {
    setSelectedSession(session);
    setIsTimerDialogOpen(true);
  };

  const handleCompleteSession = async (sessionId: string) => {
    try {
      await completeSession(sessionId);
      toast({ title: "Sessão concluída com sucesso!" });
      setIsTimerDialogOpen(false);
    } catch (error) {
      toast({ 
        title: "Erro", 
        description: "Não foi possível concluir a sessão",
        variant: "destructive" 
      });
    }
  };

  const generateAISuggestion = async () => {
    const subjectNames = subjects.map(s => s.name);
    const completionRate = todaySessions.length > 0 ? (completedToday / todaySessions.length) * 100 : 0;
    
    const prompt = `Com base no progresso do estudante (${completionRate.toFixed(0)}% das tarefas de hoje concluídas) e suas matérias (${subjectNames.join(', ')}), dê uma sugestão motivadora e prática para otimizar os estudos.`;
    
    const result = await askAI(prompt);
    if (result.response) {
      toast({ 
        title: "💡 Sugestão da IA", 
        description: result.response,
        duration: 8000
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
          <h1 className="text-3xl font-bold">Cronograma de Estudos</h1>
          <p className="text-gray-600">Organize e acompanhe sua rotina de estudos</p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={view === 'day' ? 'default' : 'outline'}
            onClick={() => setView('day')}
          >
            Dia
          </Button>
          <Button
            variant={view === 'week' ? 'default' : 'outline'}
            onClick={() => setView('week')}
          >
            Semana
          </Button>
          <Button
            variant={view === 'month' ? 'default' : 'outline'}
            onClick={() => setView('month')}
          >
            Mês
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <Calendar className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-sm text-gray-600">Sessões Hoje</p>
              <p className="text-2xl font-bold">{todaySessions.length}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <Clock className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-sm text-gray-600">Horas Planejadas</p>
              <p className="text-2xl font-bold">
                {(todaySessions.reduce((acc, s) => acc + s.duration_minutes, 0) / 60).toFixed(1)}h
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <FileText className="w-8 h-8 text-purple-500" />
            <div>
              <p className="text-sm text-gray-600">Concluídas</p>
              <p className="text-2xl font-bold">
                {todaySessions.length > 0 ? Math.round((completedToday / todaySessions.length) * 100) : 0}%
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Schedule */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {format(new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR })}
          </h2>
          <div className="flex gap-2">
            <Button onClick={generateAISuggestion} disabled={aiLoading}>
              💡 Sugestão IA
            </Button>
            <Dialog open={isSessionDialogOpen} onOpenChange={setIsSessionDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Sessão
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Nova Sessão de Estudo</DialogTitle>
                </DialogHeader>
                <SessionForm 
                  onClose={() => setIsSessionDialogOpen(false)}
                  editingSession={editingSession}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="space-y-4">
          {todaySessions.map((session) => {
            const subject = subjects.find(s => s.id === session.subject_id);
            return (
              <div
                key={session.id}
                className={`p-4 rounded-lg border transition-all ${
                  session.status === 'completed' 
                    ? 'bg-green-50 border-green-200 opacity-75' 
                    : 'bg-white border-gray-200 hover:shadow-md'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-medium text-gray-900">
                        {session.scheduled_time || 'Sem horário'}
                      </span>
                      <Badge className={getPriorityColor(session.priority)}>
                        {session.priority === 3 ? 'Alta' : session.priority === 2 ? 'Média' : 'Baixa'}
                      </Badge>
                      <Badge className={getTypeColor(session.type)}>
                        {session.type === 'study' ? 'Estudo' : 
                         session.type === 'review' ? 'Revisão' : 
                         session.type === 'exercise' ? 'Exercícios' : 'Prova'}
                      </Badge>
                      {subject && (
                        <Badge variant="outline" style={{ borderColor: subject.color }}>
                          {subject.name}
                        </Badge>
                      )}
                    </div>
                    
                    <h3 className={`text-lg font-semibold ${
                      session.status === 'completed' ? 'line-through text-gray-600' : 'text-gray-900'
                    }`}>
                      {session.title}
                    </h3>
                    
                    {session.description && (
                      <p className="text-gray-600 text-sm mt-1">{session.description}</p>
                    )}
                    
                    <p className="text-sm text-gray-500 mt-1">
                      Duração: {session.duration_minutes} minutos
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    {session.status === 'completed' ? (
                      <Badge className="bg-green-100 text-green-800">Concluído</Badge>
                    ) : (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setEditingSession(session);
                            setIsSessionDialogOpen(true);
                          }}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Editar
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => handleStartSession(session)}
                        >
                          Iniciar
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {todaySessions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhuma sessão agendada para hoje</p>
          </div>
        )}
      </Card>

      {/* Timer Dialog */}
      <Dialog open={isTimerDialogOpen} onOpenChange={setIsTimerDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedSession?.title}
            </DialogTitle>
          </DialogHeader>
          <StudyTimer 
            duration={selectedSession?.duration_minutes}
            onComplete={() => handleCompleteSession(selectedSession?.id)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Cronograma;
