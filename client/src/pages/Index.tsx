
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from 'wouter';
import { 
  Calendar, 
  BookOpen, 
  Target, 
  Award,
  BarChart3,
  Brain
} from 'lucide-react';

const Index = () => {
  const features = [
    {
      icon: Calendar,
      title: 'Cronograma Inteligente',
      description: 'Sistema automatizado de planejamento de estudos com IA'
    },
    {
      icon: BookOpen,
      title: 'Gestão de Matérias',
      description: 'Organize disciplinas, tópicos e prioridades de forma eficiente'
    },
    {
      icon: Target,
      title: 'Metas Personalizadas',
      description: 'Defina objetivos e acompanhe seu progresso em tempo real'
    },
    {
      icon: Award,
      title: 'Gamificação',
      description: 'Sistema de pontuação, níveis e conquistas para motivar'
    },
    {
      icon: BarChart3,
      title: 'Relatórios Detalhados',
      description: 'Análises completas do seu desempenho e produtividade'
    },
    {
      icon: Brain,
      title: 'Flashcards Inteligentes',
      description: 'Sistema de repetição espaçada para fixação de conteúdo'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-2xl font-bold text-primary">Estudos</div>
            <div className="space-x-4">
              <Link to="/auth">
                <Button variant="outline">Entrar</Button>
              </Link>
              <Link to="/auth">
                <Button>Começar Agora</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Sua Plataforma de
            <span className="text-primary block">Gestão de Estudos</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Organize, planeje e otimize sua rotina de estudos para o ENEM e vestibulares. 
            Uma ferramenta completa com IA para maximizar seu desempenho acadêmico.
          </p>
          <div className="space-x-4">
            <Link to="/auth">
              <Button size="lg" className="px-8">
                Começar Gratuitamente
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="px-8">
              Ver Demonstração
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <feature.icon className="w-8 h-8 text-primary mr-3" />
                <h3 className="text-lg font-semibold">{feature.title}</h3>
              </div>
              <p className="text-gray-600">{feature.description}</p>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-primary text-white rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Pronto para Transformar seus Estudos?
          </h2>
          <p className="text-xl opacity-90 mb-8">
            Junte-se a milhares de estudantes que já estão usando nossa plataforma
          </p>
          <Link to="/auth">
            <Button size="lg" variant="secondary" className="px-12">
              Criar Conta Gratuita
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 Estudos. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
