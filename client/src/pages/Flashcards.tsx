import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useFlashcards } from '@/hooks/useFlashcards';
import { useSubjects } from '@/hooks/useSubjects';
import { useAuth } from '@/hooks/useAuth';
import { Plus, Search, Eye, EyeOff, Bot } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { AIChat } from '@/components/AIChat';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Flashcards = () => {
  const { flashcards, loading, createFlashcard } = useFlashcards();
  const { subjects } = useSubjects();
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [showAnswer, setShowAnswer] = useState<{ [key: string]: boolean }>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [newCard, setNewCard] = useState({
    question: '',
    answer: '',
    subject_id: 'none',
    difficulty: 1,
    next_review_date: new Date().toISOString().split('T')[0]
  });

  const filteredCards = flashcards.filter(card => {
    const matchesSearch = card.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         card.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = !selectedSubject || selectedSubject === 'all' || card.subject_id === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const toggleAnswer = (cardId: string) => {
    setShowAnswer(prev => ({ ...prev, [cardId]: !prev[cardId] }));
  };

  const handleCreateCard = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const cardData = {
        ...newCard,
        subject_id: newCard.subject_id === 'none' ? null : newCard.subject_id,
        topic_id: null,
        user_id: user?.id || '',
        review_count: 0,
        correct_count: 0
      };

      await createFlashcard(cardData);
      
      toast({
        title: "Flashcard criado!",
        description: "Seu novo flashcard foi adicionado com sucesso.",
      });

      setNewCard({
        question: '',
        answer: '',
        subject_id: 'none',
        difficulty: 1,
        next_review_date: new Date().toISOString().split('T')[0]
      });
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao criar flashcard. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleAIFlashcardsGenerated = async (aiFlashcards: any[]) => {
    try {
      for (const card of aiFlashcards) {
        await createFlashcard({
          question: card.question,
          answer: card.answer,
          subject_id: null,
          topic_id: null,
          user_id: user?.id || '',
          difficulty: card.difficulty || 2,
          next_review_date: new Date().toISOString(),
          review_count: 0,
          correct_count: 0
        });
      }
      
      toast({
        title: "Flashcards criados!",
        description: `${aiFlashcards.length} flashcards foram adicionados à sua coleção.`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar os flashcards gerados pela IA.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Flashcards</h1>
          <p className="text-gray-600">Estude com repetição espaçada e IA</p>
        </div>
      </div>

      <Tabs defaultValue="flashcards" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="flashcards" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Meus Flashcards
          </TabsTrigger>
          <TabsTrigger value="ai-chat" className="flex items-center gap-2">
            <Bot className="w-4 h-4" />
            Chat com IA
          </TabsTrigger>
        </TabsList>

        <TabsContent value="flashcards" className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Flashcard
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Criar Novo Flashcard</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateCard} className="space-y-4">
                  <div>
                    <Label htmlFor="question">Pergunta</Label>
                    <Textarea
                      id="question"
                      value={newCard.question}
                      onChange={(e) => setNewCard({ ...newCard, question: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="answer">Resposta</Label>
                    <Textarea
                      id="answer"
                      value={newCard.answer}
                      onChange={(e) => setNewCard({ ...newCard, answer: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="subject">Matéria</Label>
                    <Select
                      value={newCard.subject_id}
                      onValueChange={(value) => setNewCard({ ...newCard, subject_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma matéria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Nenhuma matéria específica</SelectItem>
                        {subjects.map((subject) => (
                          <SelectItem key={subject.id} value={subject.id}>
                            {subject.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <Button type="submit" className="flex-1">Criar Flashcard</Button>
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancelar
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar flashcards..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Todas as matérias" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as matérias</SelectItem>
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCards.map((card) => (
              <Card key={card.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <Badge variant="outline">
                      {subjects.find(s => s.id === card.subject_id)?.name || 'Sem matéria'}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleAnswer(card.id)}
                    >
                      {showAnswer[card.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Pergunta:</h3>
                    <p className="text-gray-700">{card.question}</p>
                  </div>
                  
                  {showAnswer[card.id] && (
                    <div>
                      <h3 className="font-semibold mb-2">Resposta:</h3>
                      <p className="text-gray-700 bg-gray-50 p-3 rounded">{card.answer}</p>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Revisões: {card.review_count}</span>
                    <span>Acertos: {card.correct_count}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {filteredCards.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Nenhum flashcard encontrado</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="ai-chat" className="space-y-6">
          <AIChat onFlashcardsGenerated={handleAIFlashcardsGenerated} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Flashcards;