import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  FileText, 
  TrendingUp, 
  Target,
  CheckCircle2,
  AlertCircle,
  Plus,
  Timer,
  Notebook,
  CalendarDays
} from "lucide-react";

interface Activity {
  id: string;
  type: 'study' | 'note' | 'calendar';
  title: string;
  description: string;
  timestamp: string;
  icon: React.ReactNode;
}

interface Task {
  id: string;
  title: string;
  dueDate: string;
  progress: number;
  priority: 'low' | 'medium' | 'high';
}

const Dashboard = () => {
  // Data will be loaded from backend API
  const stats = [
    {
      title: "Matérias Ativas",
      value: "0",
      description: "Nenhuma concluída ainda",
      icon: BookOpen,
      trend: { value: 0, label: "Comece agora!", isPositive: true }
    },
    {
      title: "Horas Estudadas",
      value: "0h",
      description: "Esta semana: 0h",
      icon: Clock,
      trend: { value: 0, label: "Inicie seu primeiro timer", isPositive: true }
    },
    {
      title: "Tarefas Concluídas",
      value: "0%",
      description: "0 de 0 tarefas",
      icon: Target,
      trend: { value: 0, label: "Crie suas primeiras tarefas", isPositive: true }
    },
    {
      title: "Sequência de Estudos",
      value: "0 dias",
      description: "Comece sua jornada!",
      icon: TrendingUp,
      trend: { value: 0, label: "Sua primeira sequência", isPositive: true }
    }
  ];

  const recentActivities: Activity[] = [];

  const upcomingTasks: Task[] = [];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gradient">Dashboard</h1>
        <p className="text-muted-foreground">
          Bem-vindo de volta! Aqui está um resumo do seu progresso acadêmico.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Recent Activities */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
            <CardDescription>
              Suas últimas ações no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentActivities.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">Nenhuma atividade ainda</h3>
                <p className="text-sm text-muted-foreground">
                  Suas atividades recentes aparecerão aqui
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-shrink-0 mt-1">
                      {activity.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {activity.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {activity.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {activity.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Próximas Tarefas</CardTitle>
            <CardDescription>
              Suas pendências importantes
            </CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Target className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">Nenhuma tarefa</h3>
                <p className="text-sm text-muted-foreground">
                  Suas tarefas pendentes aparecerão aqui
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingTasks.map((task) => (
                  <div key={task.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{task.title}</p>
                      <Badge variant={getPriorityColor(task.priority) as any} className="text-xs">
                        {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Média' : 'Baixa'}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1">
                        <div className="h-2 bg-muted rounded-full">
                          <div 
                            className="h-2 bg-primary rounded-full transition-all"
                            style={{ width: `${task.progress}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {task.progress}%
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {task.dueDate}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>
            Acesse rapidamente as principais funcionalidades
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button className="h-20 flex-col space-y-2" variant="outline">
              <BookOpen className="h-6 w-6" />
              <span>Nova Matéria</span>
            </Button>
            <Button className="h-20 flex-col space-y-2" variant="outline">
              <Timer className="h-6 w-6" />
              <span>Iniciar Timer</span>
            </Button>
            <Button className="h-20 flex-col space-y-2" variant="outline">
              <Notebook className="h-6 w-6" />
              <span>Nova Anotação</span>
            </Button>
            <Button className="h-20 flex-col space-y-2" variant="outline">
              <CalendarDays className="h-6 w-6" />
              <span>Agendar Evento</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;