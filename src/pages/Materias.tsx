
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { FileText, Clock, Calendar } from 'lucide-react';

const Materias = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const subjects = [
    {
      id: 1,
      name: 'Matemática',
      progress: 75,
      totalTopics: 45,
      completedTopics: 34,
      hoursStudied: 128,
      lastStudied: '2 dias atrás',
      priority: 'alta',
      difficulty: 'Difícil',
      subtopics: [
        { name: 'Funções', completed: true },
        { name: 'Geometria', completed: true },
        { name: 'Trigonometria', completed: false },
        { name: 'Logaritmos', completed: false },
      ]
    },
    {
      id: 2,
      name: 'Português',
      progress: 90,
      totalTopics: 30,
      completedTopics: 27,
      hoursStudied: 95,
      lastStudied: '1 dia atrás',
      priority: 'média',
      difficulty: 'Médio',
      subtopics: [
        { name: 'Literatura', completed: true },
        { name: 'Gramática', completed: true },
        { name: 'Redação', completed: true },
        { name: 'Interpretação', completed: false },
      ]
    },
    {
      id: 3,
      name: 'Física',
      progress: 60,
      totalTopics: 40,
      completedTopics: 24,
      hoursStudied: 87,
      lastStudied: '3 dias atrás',
      priority: 'alta',
      difficulty: 'Difícil',
      subtopics: [
        { name: 'Mecânica', completed: true },
        { name: 'Termodinâmica', completed: false },
        { name: 'Eletricidade', completed: false },
        { name: 'Óptica', completed: false },
      ]
    },
    {
      id: 4,
      name: 'Química',
      progress: 45,
      totalTopics: 35,
      completedTopics: 16,
      hoursStudied: 62,
      lastStudied: '5 dias atrás',
      priority: 'alta',
      difficulty: 'Difícil',
      subtopics: [
        { name: 'Química Geral', completed: true },
        { name: 'Química Orgânica', completed: false },
        { name: 'Físico-Química', completed: false },
        { name: 'Química Inorgânica', completed: false },
      ]
    },
    {
      id: 5,
      name: 'Biologia',
      progress: 80,
      totalTopics: 38,
      completedTopics: 30,
      hoursStudied: 78,
      lastStudied: '1 dia atrás',
      priority: 'média',
      difficulty: 'Médio',
      subtopics: [
        { name: 'Citologia', completed: true },
        { name: 'Genética', completed: true },
        { name: 'Ecologia', completed: true },
        { name: 'Evolução', completed: false },
      ]
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'alta': return 'bg-red-100 text-red-800';
      case 'média': return 'bg-yellow-100 text-yellow-800';
      case 'baixa': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Difícil': return 'bg-red-100 text-red-800';
      case 'Médio': return 'bg-yellow-100 text-yellow-800';
      case 'Fácil': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredSubjects = subjects.filter(subject =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Matérias</h1>
          <p className="text-gray-600">Gerencie suas disciplinas e acompanhe o progresso</p>
        </div>
        <Button>+ Nova Matéria</Button>
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
          <Button variant="outline" size="sm">Todas</Button>
          <Button variant="outline" size="sm">Alta Prioridade</Button>
          <Button variant="outline" size="sm">Em Atraso</Button>
        </div>
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSubjects.map((subject) => (
          <Card key={subject.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">{subject.name}</h3>
                <div className="flex gap-2 mb-3">
                  <Badge className={getPriorityColor(subject.priority)}>
                    {subject.priority}
                  </Badge>
                  <Badge className={getDifficultyColor(subject.difficulty)}>
                    {subject.difficulty}
                  </Badge>
                </div>
              </div>
              <FileText className="w-6 h-6 text-gray-400" />
            </div>

            {/* Progress */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Progresso</span>
                <span>{subject.progress}%</span>
              </div>
              <Progress value={subject.progress} />
              <p className="text-xs text-gray-600 mt-1">
                {subject.completedTopics} de {subject.totalTopics} tópicos concluídos
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-600">Horas estudadas</p>
                  <p className="font-semibold">{subject.hoursStudied}h</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-600">Último estudo</p>
                  <p className="font-semibold text-xs">{subject.lastStudied}</p>
                </div>
              </div>
            </div>

            {/* Subtopics */}
            <div className="mb-4">
              <p className="text-sm font-medium mb-2">Tópicos principais:</p>
              <div className="space-y-1">
                {subject.subtopics.map((subtopic, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div className={`w-2 h-2 rounded-full ${
                      subtopic.completed ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                    <span className={subtopic.completed ? 'line-through text-gray-500' : ''}>
                      {subtopic.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button size="sm" className="flex-1">Estudar</Button>
              <Button variant="outline" size="sm">Editar</Button>
            </div>
          </Card>
        ))}
      </div>

      {/* AI Insights */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <h3 className="text-lg font-semibold mb-4 text-blue-900">📊 Insights da IA</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Matéria com maior necessidade</h4>
            <p className="text-sm text-gray-600">
              <strong>Química</strong> precisa de mais atenção. Considere aumentar o tempo de estudo.
            </p>
          </div>
          <div className="p-4 bg-white rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Padrão de estudo</h4>
            <p className="text-sm text-gray-600">
              Você estuda melhor pela <strong>manhã</strong>. Agende matérias difíceis neste período.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Materias;
