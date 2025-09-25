import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Timer as TimerIcon,
  Coffee,
  Target,
  TrendingUp,
  Clock
} from "lucide-react";
import { toast } from "sonner";

interface TimerSession {
  id: string;
  type: 'work' | 'break';
  duration: number;
  completedAt: string;
}

const Timer = () => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [customMinutes, setCustomMinutes] = useState(25);
  const [timerType, setTimerType] = useState<'pomodoro' | 'break' | 'custom'>('pomodoro');
  const [completedSessions, setCompletedSessions] = useState<TimerSession[]>([]);
  const [currentSession, setCurrentSession] = useState(1);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const presets = {
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15
  };

  useEffect(() => {
    if (isRunning && (minutes > 0 || seconds > 0)) {
      intervalRef.current = setInterval(() => {
        setSeconds(prev => {
          if (prev > 0) {
            return prev - 1;
          } else if (minutes > 0) {
            setMinutes(m => m - 1);
            return 59;
          } else {
            // Timer finished
            setIsRunning(false);
            handleTimerComplete();
            return 0;
          }
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, minutes, seconds]);

  const handleTimerComplete = () => {
    // Play notification sound
    if (audioRef.current) {
      audioRef.current.play().catch(console.error);
    }

    // Show notification
    toast.success("Timer finalizado!", {
      description: `${timerType === 'pomodoro' ? 'Sessão de estudo' : 'Pausa'} concluída com sucesso!`
    });

    // Save session
    const session: TimerSession = {
      id: Date.now().toString(),
      type: timerType === 'pomodoro' ? 'work' : 'break',
      duration: totalSeconds / 60,
      completedAt: new Date().toISOString()
    };
    setCompletedSessions(prev => [...prev, session]);

    // Auto-start next session in Pomodoro technique
    if (timerType === 'pomodoro') {
      setCurrentSession(prev => prev + 1);
      // After 4 pomodoros, suggest long break
      if (currentSession % 4 === 0) {
        setTimerType('break');
        startTimer(presets.longBreak);
      } else {
        setTimerType('break');
        startTimer(presets.shortBreak);
      }
    } else if (timerType === 'break') {
      setTimerType('pomodoro');
      startTimer(presets.pomodoro);
    }
  };

  const startTimer = (customDuration?: number) => {
    const duration = customDuration || (timerType === 'custom' ? customMinutes : presets.pomodoro);
    setMinutes(duration);
    setSeconds(0);
    setTotalSeconds(duration * 60);
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    const duration = timerType === 'custom' ? customMinutes : presets.pomodoro;
    setMinutes(duration);
    setSeconds(0);
    setTotalSeconds(duration * 60);
  };

  const formatTime = (mins: number, secs: number) => {
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    const current = minutes * 60 + seconds;
    return ((totalSeconds - current) / totalSeconds) * 100;
  };

  const getTodaysSessions = () => {
    const today = new Date().toDateString();
    return completedSessions.filter(session => 
      new Date(session.completedAt).toDateString() === today
    );
  };

  const getTotalStudyTime = () => {
    return getTodaysSessions()
      .filter(session => session.type === 'work')
      .reduce((total, session) => total + session.duration, 0);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Hidden audio element for notification */}
      <audio ref={audioRef} preload="auto">
        <source src="/notification.mp3" type="audio/mpeg" />
      </audio>

      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center space-x-3">
          <TimerIcon className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-gradient">Timer Pomodoro</h1>
        </div>
        <p className="text-muted-foreground">
          Use a técnica Pomodoro para aumentar sua produtividade nos estudos
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Timer */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>
                  {timerType === 'pomodoro' ? '🍅 Sessão de Estudo' : 
                   timerType === 'break' ? '☕ Pausa' : '⏱️ Timer Personalizado'}
                </CardTitle>
                <CardDescription>
                  {timerType === 'pomodoro' ? `Sessão ${currentSession}` : 
                   timerType === 'break' ? 'Momento de descanso' : 'Timer customizado'}
                </CardDescription>
              </div>
              <Badge variant={timerType === 'pomodoro' ? 'default' : 'secondary'}>
                {timerType === 'pomodoro' ? 'Foco' : 'Pausa'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-6">
              {/* Timer Display */}
              <div className="space-y-4">
                <div className="text-6xl font-mono font-bold text-gradient">
                  {formatTime(minutes, seconds)}
                </div>
                <Progress value={getProgress()} className="h-2" />
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center space-x-4">
                <Button
                  onClick={() => isRunning ? pauseTimer() : startTimer()}
                  size="lg"
                  className="h-12 px-8"
                >
                  {isRunning ? (
                    <>
                      <Pause className="h-5 w-5 mr-2" />
                      Pausar
                    </>
                  ) : (
                    <>
                      <Play className="h-5 w-5 mr-2" />
                      Iniciar
                    </>
                  )}
                </Button>
                <Button onClick={resetTimer} variant="outline" size="lg" className="h-12">
                  <RotateCcw className="h-5 w-5" />
                </Button>
              </div>

              {/* Timer Presets */}
              <Tabs value={timerType} onValueChange={(value) => setTimerType(value as any)} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="pomodoro">Pomodoro (25min)</TabsTrigger>
                  <TabsTrigger value="break">Pausa (5min)</TabsTrigger>
                  <TabsTrigger value="custom">Personalizado</TabsTrigger>
                </TabsList>
                
                <TabsContent value="custom" className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Label htmlFor="custom-time">Minutos:</Label>
                    <Input
                      id="custom-time"
                      type="number"
                      min="1"
                      max="180"
                      value={customMinutes}
                      onChange={(e) => setCustomMinutes(Number(e.target.value))}
                      className="w-20"
                    />
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setMinutes(customMinutes);
                        setSeconds(0);
                        setTotalSeconds(customMinutes * 60);
                      }}
                    >
                      Definir
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="space-y-6">
          {/* Today's Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Hoje</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Sessões</span>
                  <span className="font-semibold">
                    {getTodaysSessions().filter(s => s.type === 'work').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Tempo total</span>
                  <span className="font-semibold">
                    {Math.round(getTotalStudyTime())}min
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Meta diária</span>
                  <span className="text-sm">
                    {Math.round((getTotalStudyTime() / 120) * 100)}% de 2h
                  </span>
                </div>
              </div>
              <Progress value={(getTotalStudyTime() / 120) * 100} className="h-2" />
            </CardContent>
          </Card>

          {/* Recent Sessions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Sessões Recentes</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getTodaysSessions().slice(-5).reverse().map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-2 rounded bg-muted/50">
                    <div className="flex items-center space-x-2">
                      {session.type === 'work' ? (
                        <Target className="h-4 w-4 text-primary" />
                      ) : (
                        <Coffee className="h-4 w-4 text-secondary" />
                      )}
                      <span className="text-sm">
                        {session.type === 'work' ? 'Estudo' : 'Pausa'}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{session.duration}min</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(session.completedAt).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                ))}
                {getTodaysSessions().length === 0 && (
                  <div className="text-center text-sm text-muted-foreground py-4">
                    Nenhuma sessão hoje
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Timer;