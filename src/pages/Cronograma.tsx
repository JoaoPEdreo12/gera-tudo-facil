
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, FileText } from 'lucide-react';

const Cronograma = () => {
  const [view, setView] = useState<'day' | 'week' | 'month'>('week');
  
  const scheduleData = [
    {
      id: 1,
      time: '08:00 - 10:00',
      subject: 'Matemática',
      topic: 'Funções Quadráticas',
      type: 'Estudo',
      priority: 'alta',
      completed: false,
    },
    {
      id: 2,
      time: '10:30 - 12:00',
      subject: 'Português',
      topic: 'Literatura Brasileira',
      type: 'Revisão',
      priority: 'média',
      completed: true,
    },
    {
      id: 3,
      time: '14:00 - 16:00',
      subject: 'Física',
      topic: 'Cinemática',
      type: 'Exercícios',
      priority: 'alta',
      completed: false,
    },
    {
      id: 4,
      time: '16:30 - 18:00',
      subject: 'Química',
      topic: 'Estequiometria',
      type: 'Estudo',
      priority: 'baixa',
      completed: false,
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'alta': return 'bg-red-100 text-red-800 border-red-200';
      case 'média': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'baixa': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Estudo': return 'bg-blue-100 text-blue-800';
      case 'Revisão': return 'bg-purple-100 text-purple-800';
      case 'Exercícios': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
              <p className="text-2xl font-bold">4</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <Clock className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-sm text-gray-600">Horas Planejadas</p>
              <p className="text-2xl font-bold">7.5h</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <FileText className="w-8 h-8 text-purple-500" />
            <div>
              <p className="text-sm text-gray-600">Concluídas</p>
              <p className="text-2xl font-bold">25%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Schedule */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Segunda-feira, 15 de Janeiro</h2>
          <Button>+ Adicionar Sessão</Button>
        </div>

        <div className="space-y-4">
          {scheduleData.map((session) => (
            <div
              key={session.id}
              className={`p-4 rounded-lg border transition-all ${
                session.completed 
                  ? 'bg-green-50 border-green-200 opacity-75' 
                  : 'bg-white border-gray-200 hover:shadow-md'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-medium text-gray-900">{session.time}</span>
                    <Badge className={getPriorityColor(session.priority)}>
                      {session.priority}
                    </Badge>
                    <Badge className={getTypeColor(session.type)}>
                      {session.type}
                    </Badge>
                  </div>
                  
                  <h3 className={`text-lg font-semibold ${
                    session.completed ? 'line-through text-gray-600' : 'text-gray-900'
                  }`}>
                    {session.subject} - {session.topic}
                  </h3>
                </div>
                
                <div className="flex gap-2">
                  {session.completed ? (
                    <Badge className="bg-green-100 text-green-800">Concluído</Badge>
                  ) : (
                    <>
                      <Button variant="outline" size="sm">Editar</Button>
                      <Button size="sm">Iniciar</Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* AI Suggestions */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">💡 Sugestões da IA</h3>
          <p className="text-blue-800 text-sm">
            Com base no seu desempenho, recomendamos focar mais em Química esta semana. 
            Considere adicionar uma sessão extra de revisão amanhã.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Cronograma;
