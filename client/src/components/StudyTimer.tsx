
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, Square, RotateCcw } from 'lucide-react';

interface StudyTimerProps {
  duration?: number; // duração em minutos
  onComplete?: () => void;
}

export const StudyTimer = ({ duration = 25, onComplete }: StudyTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(duration * 60); // converter para segundos
  const [isRunning, setIsRunning] = useState(false);
  const [totalTime] = useState(duration * 60);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      intervalId = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            setIsRunning(false);
            onComplete?.();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [isRunning, timeLeft, onComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleStop = () => {
    setIsRunning(false);
    setTimeLeft(totalTime);
  };
  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(totalTime);
  };

  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  return (
    <Card className="p-6 text-center">
      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-bold mb-2">Timer de Estudo</h3>
          <div className="text-4xl font-mono font-bold text-primary">
            {formatTime(timeLeft)}
          </div>
        </div>

        <Progress value={progress} className="w-full" />

        <div className="flex justify-center gap-3">
          {!isRunning ? (
            <Button onClick={handleStart} disabled={timeLeft === 0}>
              <Play className="w-4 h-4 mr-2" />
              Iniciar
            </Button>
          ) : (
            <Button onClick={handlePause}>
              <Pause className="w-4 h-4 mr-2" />
              Pausar
            </Button>
          )}
          
          <Button variant="outline" onClick={handleStop}>
            <Square className="w-4 h-4 mr-2" />
            Parar
          </Button>
          
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reiniciar
          </Button>
        </div>
      </div>
    </Card>
  );
};
