import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAI } from '@/hooks/useAI';
import { useSubjects } from '@/hooks/useSubjects';
import { useStudySessions } from '@/hooks/useStudySessions';
import { useProfile } from '@/hooks/useProfile';
import { useToast } from '@/hooks/use-toast';
import { Brain, Calendar, BookOpen, BarChart3, Lightbulb, Target } from 'lucide-react';

export const AIAssistant = () => {
  const { 
    generateSchedule, 
    generateFeedback, 
    generateReport, 
    generateFlashcards,
    explainConcept,
    isGeneratingSchedule,
    isGeneratingFeedback,
    isGeneratingReport,
    isGeneratingFlashcards,
    isExplaining
  } = useAI();
  
  const { subjects } = useSubjects();
  const { sessions } = useStudySessions();
  const { profile, progress } = useProfile();
  const { toast } = useToast();

  const [scheduleRequest, setScheduleRequest] = useState({
    availableHoursPerDay: 4,
    studyGoals: '',
    preferences: {
      studyDuration: 60,
      breakDuration: 15,
      preferredTimes: ['09:00', '14:00', '19:00']
    }
  });

  const [flashcardTopic, setFlashcardTopic] = useState({
    subject: '',
    content: ''
  });

  const [conceptRequest, setConceptRequest] = useState({
    subject: '',
    topic: '',
    level: 'basic' as 'basic' | 'intermediate' | 'advanced'
  });

  const [aiResponse, setAiResponse] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('schedule');

  const handleGenerateSchedule = async () => {
    try {
      const response = await generateSchedule({
        subjects: subjects?.map(s => ({
          id: s.id,
          name: s.name,
          priority: s.priority,
          color: s.color
        })) || [],
        ...scheduleRequest,
        currentProgress: progress
      });
      setAiResponse(response);
      toast({ title: "Cronograma gerado com sucesso!" });
    } catch (error: any) {
      toast({ 
        title: "Erro", 
        description: error.message || "Erro ao gerar cronograma",
        variant: "destructive" 
      });
    }
  };

  const handleGenerateFeedback = async () => {
    try {
      const response = await generateFeedback({
        sessions,
        subjects,
        progress,
        profile
      });
      setAiResponse(response);
      toast({ title: "Feedback gerado com sucesso!" });
    } catch (error: any) {
      toast({ 
        title: "Erro", 
        description: error.message || "Erro ao gerar feedback",
        variant: "destructive" 
      });
    }
  };

  const handleGenerateReport = async (period: 'week' | 'month') => {
    try {
      const response = await generateReport(period);
      setAiResponse(response);
      toast({ title: "Relatório gerado com sucesso!" });
    } catch (error: any) {
      toast({ 
        title: "Erro", 
        description: error.message || "Erro ao gerar relatório",
        variant: "destructive" 
      });
    }
  };

  const handleGenerateFlashcards = async () => {
    try {
      const response = await generateFlashcards(flashcardTopic);
      setAiResponse(response);
      toast({ title: "Flashcards gerados com sucesso!" });
    } catch (error: any) {
      toast({ 
        title: "Erro", 
        description: error.message || "Erro ao gerar flashcards",
        variant: "destructive" 
      });
    }
  };

  const handleExplainConcept = async () => {
    try {
      const response = await explainConcept(conceptRequest);
      setAiResponse(response);
      toast({ title: "Conceito explicado com sucesso!" });
    } catch (error: any) {
      toast({ 
        title: "Erro", 
        description: error.message || "Erro ao explicar conceito",
        variant: "destructive" 
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Assistente de IA
          </CardTitle>
          <CardDescription>
            Use a inteligência artificial para otimizar seus estudos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 w-full mb-4">
              <TabsTrigger value="schedule" className="text-xs">
                <Calendar className="h-4 w-4 mr-1" />
                Cronograma
              </TabsTrigger>
              <TabsTrigger value="feedback" className="text-xs">
                <BarChart3 className="h-4 w-4 mr-1" />
                Feedback
              </TabsTrigger>
              <TabsTrigger value="tools" className="text-xs">
                <Lightbulb className="h-4 w-4 mr-1" />
                Ferramentas
              </TabsTrigger>
            </TabsList>

            <TabsContent value="schedule" className="space-y-4">
              <div>
                <Label>Horas disponíveis por dia</Label>
                <Input
                  type="number"
                  value={scheduleRequest.availableHoursPerDay}
                  onChange={(e) => setScheduleRequest(prev => ({
                    ...prev,
                    availableHoursPerDay: parseInt(e.target.value)
                  }))}
                  min="1"
                  max="12"
                />
              </div>
              
              <div>
                <Label>Objetivos de estudo</Label>
                <Textarea
                  value={scheduleRequest.studyGoals}
                  onChange={(e) => setScheduleRequest(prev => ({
                    ...prev,
                    studyGoals: e.target.value
                  }))}
                  placeholder="Ex: Focar em matemática para a prova do ENEM..."
                  rows={3}
                />
              </div>

              <Button 
                onClick={handleGenerateSchedule}
                disabled={isGeneratingSchedule}
                className="w-full"
              >
                {isGeneratingSchedule ? 'Gerando...' : 'Gerar Cronograma Personalizado'}
              </Button>
            </TabsContent>

            <TabsContent value="feedback" className="space-y-4">
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  Receba feedback personalizado sobre seu progresso nos estudos
                </p>
                
                <Button 
                  onClick={handleGenerateFeedback}
                  disabled={isGeneratingFeedback}
                  className="w-full"
                >
                  {isGeneratingFeedback ? 'Analisando...' : 'Gerar Feedback Motivacional'}
                </Button>

                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline"
                    onClick={() => handleGenerateReport('week')}
                    disabled={isGeneratingReport}
                    size="sm"
                  >
                    Relatório Semanal
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => handleGenerateReport('month')}
                    disabled={isGeneratingReport}
                    size="sm"
                  >
                    Relatório Mensal
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="tools" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Gerar Flashcards</Label>
                  <div className="space-y-2 mt-2">
                    <Select 
                      value={flashcardTopic.subject} 
                      onValueChange={(value) => setFlashcardTopic(prev => ({ ...prev, subject: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma matéria" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects?.map((subject) => (
                          <SelectItem key={subject.id} value={subject.name}>
                            {subject.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Input
                      placeholder="Tópico específico..."
                      value={flashcardTopic.content}
                      onChange={(e) => setFlashcardTopic(prev => ({ ...prev, content: e.target.value }))}
                    />
                    
                    <Button 
                      onClick={handleGenerateFlashcards}
                      disabled={isGeneratingFlashcards}
                      size="sm"
                      className="w-full"
                    >
                      {isGeneratingFlashcards ? 'Gerando...' : 'Gerar Flashcards'}
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Explicar Conceito</Label>
                  <div className="space-y-2 mt-2">
                    <Input
                      placeholder="Matéria"
                      value={conceptRequest.subject}
                      onChange={(e) => setConceptRequest(prev => ({ ...prev, subject: e.target.value }))}
                    />
                    
                    <Input
                      placeholder="Conceito a explicar"
                      value={conceptRequest.topic}
                      onChange={(e) => setConceptRequest(prev => ({ ...prev, topic: e.target.value }))}
                    />
                    
                    <Select 
                      value={conceptRequest.level} 
                      onValueChange={(value: 'basic' | 'intermediate' | 'advanced') => 
                        setConceptRequest(prev => ({ ...prev, level: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">Básico</SelectItem>
                        <SelectItem value="intermediate">Intermediário</SelectItem>
                        <SelectItem value="advanced">Avançado</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button 
                      onClick={handleExplainConcept}
                      disabled={isExplaining}
                      size="sm"
                      className="w-full"
                    >
                      {isExplaining ? 'Explicando...' : 'Explicar Conceito'}
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {aiResponse && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Resposta da IA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {aiResponse.motivationalMessage && (
                <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                    Mensagem Motivacional
                  </h3>
                  <p className="text-blue-800 dark:text-blue-200">
                    {aiResponse.motivationalMessage}
                  </p>
                </div>
              )}

              {aiResponse.schedule && (
                <div>
                  <h3 className="font-medium mb-3">Cronograma Sugerido</h3>
                  <div className="space-y-2">
                    {aiResponse.schedule.slice(0, 3).map((item: any, index: number) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{item.subject}</p>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          </div>
                          <Badge variant="secondary">
                            {item.duration}min
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {item.date} às {item.time}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {aiResponse.recommendations && (
                <div>
                  <h3 className="font-medium mb-2">Recomendações</h3>
                  <ul className="space-y-1">
                    {aiResponse.recommendations.slice(0, 3).map((rec: string, index: number) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {aiResponse.flashcards && (
                <div>
                  <h3 className="font-medium mb-2">Flashcards Gerados</h3>
                  <p className="text-sm text-muted-foreground">
                    {aiResponse.flashcards.length} flashcards criados com sucesso!
                  </p>
                </div>
              )}

              {aiResponse.explanation && (
                <div>
                  <h3 className="font-medium mb-2">Explicação</h3>
                  <p className="text-sm">{aiResponse.explanation}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};