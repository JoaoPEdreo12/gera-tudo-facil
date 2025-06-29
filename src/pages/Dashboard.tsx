
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  Clock, 
  FileText, 
  User 
} from 'lucide-react';

const Dashboard = () => {
  const todayTasks = [
    { id: 1, subject: 'Matemática', topic: 'Funções Quadráticas', duration: '2h', completed: false },
    { id: 2, subject: 'Português', topic: 'Literatura Brasileira', duration: '1h30', completed: true },
    { id: 3, subject: 'Física', topic: 'Cinemática', duration: '1h45', completed: false },
    { id: 4, subject: 'Química', topic: 'Estequiometria', duration: '2h', completed: false },
  ];

  const weeklyProgress = [
    { subject: 'Matemática', progress: 75, color: 'bg-blue-500' },
    { subject: 'Português', progress: 90, color: 'bg-green-500' },
    { subject: 'Física', progress: 60, color: 'bg-purple-500' },
    { subject: 'Química', progress: 45, color: 'bg-orange-500' },
    { subject: 'Biologia', progress: 80, color: 'bg-teal-500' },
  ];

  const completedTasks = todayTasks.filter(task => task.completed).length;
  const totalTasks = todayTasks.length;
  const completionRate = (completedTasks / totalTasks) * 100;

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-blue-600 text-white p-8 rounded-xl">
        <h1 className="text-3xl font-bold mb-2">Bem-vindo de volta!</h1>
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
              <p className="text-2xl font-bold">{completedTasks}/{totalTasks}</p>
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
              <p className="text-2xl font-bold">6.5h</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Sequência</p>
              <p className="text-2xl font-bold">12 dias</p>
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
              <p className="text-2xl font-bold">Avançado</p>
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
            {todayTasks.map((task) => (
              <div
                key={task.id}
                className={`p-4 rounded-lg border ${
                  task.completed 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`font-medium ${
                      task.completed ? 'text-green-800 line-through' : 'text-gray-900'
                    }`}>
                      {task.subject} - {task.topic}
                    </h3>
                    <p className="text-sm text-gray-600">{task.duration}</p>
                  </div>
                  <Button
                    variant={task.completed ? "outline" : "default"}
                    size="sm"
                  >
                    {task.completed ? 'Concluído' : 'Iniciar'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Weekly Progress */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">Progresso Semanal</h2>
          <div className="space-y-6">
            {weeklyProgress.map((item) => (
              <div key={item.subject}>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">{item.subject}</span>
                  <span className="text-sm text-gray-600">{item.progress}%</span>
                </div>
                <Progress value={item.progress} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button className="h-20 flex-col space-y-2">
            <Calendar className="w-6 h-6" />
            <span>Cronograma</span>
          </Button>
          <Button variant="outline" className="h-20 flex-col space-y-2">
            <FileText className="w-6 h-6" />
            <span>Nova Matéria</span>
          </Button>
          <Button variant="outline" className="h-20 flex-col space-y-2">
            <Clock className="w-6 h-6" />
            <span>Timer</span>
          </Button>
          <Button variant="outline" className="h-20 flex-col space-y-2">
            <User className="w-6 h-6" />
            <span>Flashcards</span>
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
