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
  // Mock data - replace with real data from backend
  const stats = [
    {
      title: "Matérias Ativas",
      value: "12",
      description: "3 concluídas este mês",
      icon: BookOpen,
      trend: { value: 8, label: "8% mais que mês passado", isPositive: true }
    },
    {
      title: "Horas Estudadas",
      value: "127h",
      description: "Esta semana: 23h",
      icon: Clock,
      trend: { value: 12, label: "12% de aumento", isPositive: true }
    },
    {
      title: "Tarefas Concluídas",
      value: "89%",
      description: "24 de 27 tarefas",
      icon: Target,
      trend: { value: 4, label: "4% de melhoria", isPositive: true }
    },
    {
      title: "Sequência de Estudos",
      value: "15 dias",
      description: "Parabéns! Continue assim",
      icon: TrendingUp,
      trend: { value: 15, label: "Recorde pessoal!", isPositive: true }
    }
  ];

  const recentActivities: Activity[] = [
    {
      id: "1",
      type: "study",
      title: "Matemática - Álgebra Linear",
      description: "Completou 3 exercícios sobre matrizes",
      timestamp: "há 2 horas",
      icon: <BookOpen className="h-4 w-4 text-primary" />
    },
    {
      id: "2", 
      type: "note",
      title: "Anotação criada",
      description: "Resumo da aula de Física Quântica",
      timestamp: "há 4 horas",
      icon: <FileText className="h-4 w-4 text-secondary" />
    },
    {
      id: "3",
      type: "calendar",
      title: "Prova de História",
      description: "Evento agendado para amanhã às 14:00",
      timestamp: "há 6 horas",
      icon: <Calendar className="h-4 w-4 text-orange-500" />
    }
  ];

  const upcomingTasks: Task[] = [
    {
      id: "1",
      title: "Estudar para prova de Cálculo",
      dueDate: "Amanhã",
      progress: 75,
      priority: "high"
    },
    {
      id: "2",
      title: "Entregar projeto de Programação",
      dueDate: "Em 3 dias",
      progress: 50,
      priority: "medium"
    },
    {
      id: "3",
      title: "Ler capítulo 5 de Biologia",
      dueDate: "Esta semana",
      progress: 25,
      priority: "low"
    }
  ];

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