
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useProfile } from '@/hooks/useProfile';
import { useStudySessions } from '@/hooks/useStudySessions';
import { useSubjects } from '@/hooks/useSubjects';
import { useAI } from '@/hooks/useAI';
import { 
  Calendar, 
  Clock, 
  FileText, 
  User,
  TrendingUp,
  Timer
} from 'lucide-react';
import { format, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { StudyTimer } from '@/components/StudyTimer';

const Dashboard = () => {
  const { profile, progress, loading: profileLoading } = useProfile();
  const { sessions, loading: sessionsLoading, completeSession } = useStudySessions();
  const { subjects } = useSubjects();
  const { askAI } = useAI();
  const [isTimerDialogOpen, setIsTimerDialogOpen] = useState(false);

  if (profileLoading || sessionsLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const todaySessions = sessions.filter(session => 
    isToday(new Date(session.scheduled_date))
  );

  const completedToday = todaySessions.filter(session => 
    session.status === 'completed'
  ).length;

  const totalToday = todaySessions.length;
  const completionRate = totalToday > 0 ? (completedToday / totalToday) * 100 : 0;

  const subjectsWithProgress = subjects.map(subject => {
    const subjectSessions = sessions.filter(s => s.subject_id === subject.id);
    const completedSessions = subjectSessions.filter(s => s.status === 'completed').length;
    const totalSessions = subjectSessions.length;
    const progressPercent = totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0;
    
    return {
      ...subject,
      progress: Math.round(progressPercent)
    };
  });

  const handleStartSession = async (sessionId: string) => {
    await completeSession(sessionId);
    setIsTimerDialogOpen(false);
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-blue-600 text-white p-8 rounded-xl">
        <h1 className="text-3xl font-bold mb-2">
          Bem-vindo de volta, {profile?.full_name || 'Estudante'}!
        </h1>
        <p className="text-lg opacity-90">
          Continue sua jornada rumo ao ENEM. Você está no caminho certo!
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Tarefas Hoje</p>
              <p className="text-2xl font-bold">{completedToday}/{totalToday}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Horas Estudadas</p>
              <p className="text-2xl font-bold">
                {Math.round((progress?.total_study_time_minutes || 0) / 60)}h
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Sequência</p>
              <p className="text-2xl font-bold">{progress?.streak_days || 0} dias</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <User className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Nível</p>
              <p className="text-2xl font-bold">{progress?.level || 1}</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Today's Tasks */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Tarefas de Hoje</h2>
            <div className="text-sm text-gray-600">
              {Math.round(completionRate)}% concluído
            </div>
          </div>
          
          <Progress value={completionRate} className="mb-6" />
          
          <div className="space-y-4">
            {todaySessions.length > 0 ? (
              todaySessions.map((session) => (
                <div
                  key={session.id}
                  className={`p-4 rounded-lg border ${
                    session.status === 'completed'
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className={`font-medium ${
                        session.status === 'completed' 
                          ? 'text-green-800 line-through' 
                          : 'text-gray-900'
                      }`}>
                        {session.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {session.duration_minutes} min • {session.type}
                      </p>
                    </div>
                    <Button
                      variant={session.status === 'completed' ? "outline" : "default"}
                      size="sm"
                      disabled={session.status === 'completed'}
                      onClick={() => handleStartSession(session.id)}
                    >
                      {session.status === 'completed' ? 'Concluído' : 'Iniciar'}
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">
                Nenhuma sessão agendada para hoje
              </p>
            )}
          </div>
        </Card>

        {/* Weekly Progress */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">Progresso por Matéria</h2>
          <div className="space-y-6">
            {subjectsWithProgress.length > 0 ? (
              subjectsWithProgress.map((subject) => (
                <div key={subject.id}>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{subject.name}</span>
                    <span className="text-sm text-gray-600">{subject.progress}%</span>
                  </div>
                  <Progress value={subject.progress} />
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">
                Nenhuma matéria cadastrada ainda
              </p>
            )}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button className="h-20 flex-col space-y-2" asChild>
            <a href="/cronograma">
              <Calendar className="w-6 h-6" />
              <span>Cronograma</span>
            </a>
          </Button>
          <Button variant="outline" className="h-20 flex-col space-y-2" asChild>
            <a href="/materias">
              <FileText className="w-6 h-6" />
              <span>Matérias</span>
            </a>
          </Button>
          <Dialog open={isTimerDialogOpen} onOpenChange={setIsTimerDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <Timer className="w-6 h-6" />
                <span>Timer</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Timer de Estudo</DialogTitle>
              </DialogHeader>
              <StudyTimer />
            </DialogContent>
          </Dialog>
          <Button variant="outline" className="h-20 flex-col space-y-2" asChild>
            <a href="/flashcards">
              <User className="w-6 h-6" />
              <span>Flashcards</span>
            </a>
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
