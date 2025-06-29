
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  FileText, 
  User, 
  Grid2x2,
  Settings 
} from 'lucide-react';

const Index = () => {
  const features = [
    {
      icon: Calendar,
      title: 'Cronograma Inteligente',
      description: 'IA personalizada que cria o cronograma perfeito baseado no seu perfil e objetivos.'
    },
    {
      icon: Grid2x2,
      title: 'Dashboard Completo',
      description: 'Acompanhe seu progresso em tempo real com métricas detalhadas e insights.'
    },
    {
      icon: FileText,
      title: 'Gestão de Matérias',
      description: 'Organize todas as disciplinas com subtópicos, prioridades e acompanhamento.'
    },
    {
      icon: Clock,
      title: 'Relatórios de Performance',
      description: 'Análises profundas do seu desempenho com gráficos e recomendações.'
    },
    {
      icon: User,
      title: 'Flashcards Inteligentes',
      description: 'Sistema de repetição espaçada que otimiza sua memorização.'
    },
    {
      icon: Settings,
      title: 'Gamificação Completa',
      description: 'Sistema de pontos, níveis e conquistas que mantém você motivado.'
    },
  ];

  const stats = [
    { number: '10.000+', label: 'Estudantes Ativos' },
    { number: '95%', label: 'Taxa de Aprovação' },
    { number: '2M+', label: 'Horas de Estudo' },
    { number: '4.9/5', label: 'Avaliação Média' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center justify-between border-b bg-white/80 backdrop-blur-sm">
        <div className="flex items-center justify-center">
          <span className="text-2xl font-bold text-primary">StudyFlow</span>
        </div>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link to="/dashboard">
            <Button>Entrar</Button>
          </Link>
          <Button variant="outline">Cadastrar</Button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="px-4 lg:px-6 py-24 text-center">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Sua jornada rumo ao{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                ENEM e Vestibulares
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              A plataforma definitiva para organizar, acompanhar e otimizar seus estudos. 
              Com IA personalizada, gamificação e relatórios completos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/dashboard">
                <Button size="lg" className="px-8 py-3 text-lg">
                  Começar Gratuitamente
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="px-8 py-3 text-lg">
                Ver Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 lg:px-6 py-16 bg-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 lg:px-6 py-24">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Tudo que você precisa para ser aprovado
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Uma plataforma completa com ferramentas inteligentes para maximizar 
              sua preparação e garantir resultados excepcionais.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 lg:px-6 py-24 bg-gradient-to-r from-primary to-blue-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pronto para transformar seus estudos?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Junte-se a milhares de estudantes que já estão utilizando o StudyFlow 
            para alcançar seus objetivos acadêmicos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard">
              <Button size="lg" variant="secondary" className="px-8 py-3 text-lg">
                Começar Agora
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="px-8 py-3 text-lg border-white text-white hover:bg-white hover:text-primary">
              Falar com Especialista
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 lg:px-6 py-12 bg-gray-900 text-white">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center justify-center mb-4 md:mb-0">
              <span className="text-2xl font-bold">StudyFlow</span>
            </div>
            <div className="text-center md:text-right text-gray-400">
              <p>&copy; 2024 StudyFlow. Todos os direitos reservados.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
