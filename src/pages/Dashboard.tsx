import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Clock, 
  Target, 
  TrendingUp, 
  Calendar,
  FileText,
  Plus,
  ChevronRight
} from "lucide-react";

export default function Dashboard() {
  const stats = [
    {
      title: "Disciplinas Ativas",
      value: 6,
      icon: BookOpen,
      trend: { value: 12, label: "vs mês anterior", isPositive: true }
    },
    {
      title: "Horas de Estudo",
      value: "24h",
      icon: Clock,
      trend: { value: 8, label: "esta semana", isPositive: true }
    },
    {
      title: "Tarefas Concluídas",
      value: "85%",
      icon: Target,
      trend: { value: 15, label: "vs semana anterior", isPositive: true }
    },
    {
      title: "Produtividade",
      value: "92%",
      icon: TrendingUp,
      trend: { value: 5, label: "melhoria contínua", isPositive: true }
    }
  ];

  const recentActivities = [
    { title: "Cálculo I - Aula 5 concluída", time: "2 horas atrás", type: "completed" },
    { title: "Química Orgânica - Novo arquivo adicionado", time: "4 horas atrás", type: "upload" },
    { title: "Física II - Timer de 25min concluído", time: "6 horas atrás", type: "timer" },
    { title: "Algoritmos - Anotação criada", time: "1 dia atrás", type: "note" },
  ];

  const upcomingTasks = [
    { title: "Prova de Cálculo I", date: "Amanhã", progress: 75 },
    { title: "Trabalho de Química", date: "3 dias", progress: 40 },
    { title: "Apresentação de Física", date: "1 semana", progress: 20 },
  ];

  return (
    <div className="flex flex-col space-y-8 p-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Bem-vindo de volta, <span className="text-gradient">Guilherme</span>! 👋
        </h1>
        <p className="text-muted-foreground">
          Aqui está um resumo do seu progresso acadêmico hoje.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div key={stat.title} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
            <StatCard {...stat} />
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activities */}
        <Card className="lg:col-span-2 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Atividades Recentes
              </CardTitle>
              <CardDescription>
                Suas últimas ações na plataforma
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              Ver todas
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 rounded-lg border p-3 transition-colors hover:bg-muted/50"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  {activity.type === "completed" && <Target className="h-4 w-4 text-primary" />}
                  {activity.type === "upload" && <FileText className="h-4 w-4 text-primary" />}
                  {activity.type === "timer" && <Clock className="h-4 w-4 text-primary" />}
                  {activity.type === "note" && <FileText className="h-4 w-4 text-primary" />}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Próximas Tarefas
            </CardTitle>
            <CardDescription>
              Organize seu cronograma
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingTasks.map((task, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{task.title}</p>
                  <span className="text-xs text-muted-foreground">{task.date}</span>
                </div>
                <Progress value={task.progress} className="h-2" />
                <p className="text-xs text-muted-foreground">{task.progress}% concluído</p>
              </div>
            ))}
            <Button className="w-full mt-4" variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Nova Tarefa
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>
            Acesse rapidamente suas ferramentas favoritas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button className="h-20 flex-col space-y-2" variant="outline">
              <BookOpen className="h-6 w-6" />
              <span>Nova Disciplina</span>
            </Button>
            <Button className="h-20 flex-col space-y-2" variant="outline">
              <Clock className="h-6 w-6" />
              <span>Iniciar Timer</span>
            </Button>
            <Button className="h-20 flex-col space-y-2" variant="outline">
              <FileText className="h-6 w-6" />
              <span>Nova Anotação</span>
            </Button>
            <Button className="h-20 flex-col space-y-2" variant="outline">
              <Calendar className="h-6 w-6" />
              <span>Agendar Evento</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}