import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Send, Bot, User, BookOpen, Brain, Target, Lightbulb } from 'lucide-react';
import { useAI } from '@/hooks/useAI';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type?: 'explanation' | 'flashcards' | 'general';
}

interface AIChatProps {
  onFlashcardsGenerated?: (flashcards: any[]) => void;
}

export const AIChat = ({ onFlashcardsGenerated }: AIChatProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Olá! Sou seu assistente de estudos com IA. Posso ajudar você a:\n\n• Explicar conceitos de qualquer matéria\n• Criar flashcards personalizados\n• Dar dicas de estudo\n• Responder dúvidas específicas\n\nO que gostaria de aprender hoje?',
      timestamp: new Date(),
      type: 'general'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { explainConcept, generateFlashcards } = useAI();
  const { toast } = useToast();

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const detectIntention = (message: string) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('flashcard') || lowerMessage.includes('cartão') || lowerMessage.includes('criar cards')) {
      return 'flashcards';
    }
    
    if (lowerMessage.includes('explica') || lowerMessage.includes('o que é') || lowerMessage.includes('como funciona') || lowerMessage.includes('conceito')) {
      return 'explanation';
    }
    
    return 'general';
  };

  const extractSubjectAndTopic = (message: string) => {
    // Patterns for subject detection
    const subjectPatterns = {
      matemática: ['matemática', 'math', 'álgebra', 'geometria', 'cálculo', 'função', 'equação'],
      física: ['física', 'physics', 'mecânica', 'termodinâmica', 'eletricidade', 'força', 'energia'],
      química: ['química', 'chemistry', 'átomo', 'molécula', 'reação', 'elemento', 'ligação'],
      biologia: ['biologia', 'biology', 'célula', 'dna', 'genética', 'evolução', 'anatomia'],
      história: ['história', 'history', 'guerra', 'império', 'revolução', 'século'],
      geografia: ['geografia', 'geography', 'país', 'continente', 'clima', 'relevo'],
      português: ['português', 'portuguese', 'gramática', 'literatura', 'texto', 'redação'],
      inglês: ['inglês', 'english', 'vocabulary', 'grammar', 'verb', 'tense']
    };

    let detectedSubject = 'Geral';
    const lowerMessage = message.toLowerCase();

    for (const [subject, keywords] of Object.entries(subjectPatterns)) {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        detectedSubject = subject.charAt(0).toUpperCase() + subject.slice(1);
        break;
      }
    }

    return {
      subject: detectedSubject,
      topic: message.trim()
    };
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const intention = detectIntention(currentInput);
      let response = '';
      let responseType: 'explanation' | 'flashcards' | 'general' = 'general';

      if (intention === 'flashcards') {
        const { subject, topic } = extractSubjectAndTopic(currentInput);
        
        const result = await generateFlashcards({
          subject,
          content: topic
        });

        if (result.flashcards && result.flashcards.length > 0) {
          response = `Criei ${result.flashcards.length} flashcards sobre "${topic}" para você! Os flashcards foram gerados com diferentes níveis de dificuldade.`;
          responseType = 'flashcards';
          
          if (onFlashcardsGenerated) {
            onFlashcardsGenerated(result.flashcards);
          }
        } else {
          response = 'Não consegui gerar flashcards para esse tópico. Pode tentar reformular sua pergunta?';
        }
      } else if (intention === 'explanation') {
        const { subject, topic } = extractSubjectAndTopic(currentInput);
        
        const result = await explainConcept({
          subject,
          topic,
          level: 'intermediate'
        });

        if (result.explanation) {
          response = `**${topic}**\n\n${result.explanation}`;
          
          if (result.keyPoints && result.keyPoints.length > 0) {
            response += `\n\n**Pontos importantes:**\n${result.keyPoints.map((point: string) => `• ${point}`).join('\n')}`;
          }
          
          if (result.examples && result.examples.length > 0) {
            response += `\n\n**Exemplos:**\n${result.examples.map((example: string) => `• ${example}`).join('\n')}`;
          }
          
          responseType = 'explanation';
        } else {
          response = 'Não consegui explicar esse conceito no momento. Pode tentar reformular sua pergunta?';
        }
      } else {
        // General conversation - simple responses for now
        const responses = [
          'Interessante! Sobre qual matéria você gostaria de saber mais?',
          'Posso ajudar você a estudar qualquer tópico. Que tal me contar o que está estudando?',
          'Estou aqui para ajudar! Pode me fazer perguntas sobre qualquer matéria ou pedir para criar flashcards.',
          'Vamos estudar juntos! O que você gostaria de aprender hoje?'
        ];
        response = responses[Math.floor(Math.random() * responses.length)];
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        type: responseType
      };

      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error('Erro ao processar mensagem:', error);
      toast({
        title: "Erro",
        description: "Não consegui processar sua mensagem. Tente novamente.",
        variant: "destructive",
      });

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Desculpe, tive um problema ao processar sua mensagem. Pode tentar novamente?',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getMessageIcon = (message: Message) => {
    if (message.role === 'user') return <User className="w-4 h-4" />;
    
    switch (message.type) {
      case 'explanation':
        return <BookOpen className="w-4 h-4" />;
      case 'flashcards':
        return <Brain className="w-4 h-4" />;
      default:
        return <Bot className="w-4 h-4" />;
    }
  };

  const getMessageBadge = (message: Message) => {
    if (message.role === 'user') return null;
    
    switch (message.type) {
      case 'explanation':
        return <Badge variant="secondary" className="mb-2"><Lightbulb className="w-3 h-3 mr-1" />Explicação</Badge>;
      case 'flashcards':
        return <Badge variant="secondary" className="mb-2"><Target className="w-3 h-3 mr-1" />Flashcards</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="w-5 h-5" />
          Assistente de IA
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${
                  message.role === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.role === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted'
                }`}>
                  {getMessageIcon(message)}
                </div>
                
                <div className={`flex-1 ${message.role === 'user' ? 'text-right' : ''}`}>
                  {getMessageBadge(message)}
                  <div className={`rounded-lg p-3 max-w-[80%] ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground ml-auto'
                      : 'bg-muted'
                  }`}>
                    <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                    <span className="text-xs opacity-70 mt-1 block">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua pergunta ou peça para criar flashcards..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              size="icon"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="mt-2 text-xs text-muted-foreground">
            Dicas: "Explica fotossíntese" • "Cria flashcards de matemática" • "O que é DNA?"
          </div>
        </div>
      </CardContent>
    </Card>
  );
};