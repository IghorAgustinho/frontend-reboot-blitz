import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings as SettingsIcon, User, Bell, Palette, Database, Key } from "lucide-react";
import { toast } from "sonner";

const Settings = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: ""
  });

  const [notifications, setNotifications] = useState({
    studyReminders: true,
    taskDeadlines: true,
    weeklyReport: false
  });

  const [preferences, setPreferences] = useState({
    darkMode: false,
    language: "pt-BR",
    pomodoroLength: 25,
    shortBreakLength: 5,
    longBreakLength: 15
  });

  const handleSaveProfile = async () => {
    // TODO: Integrate with backend API
    toast.success("Perfil atualizado com sucesso!");
  };

  const handleSaveNotifications = async () => {
    // TODO: Integrate with backend API
    toast.success("Preferências de notificação salvas!");
  };

  const handleSavePreferences = async () => {
    // TODO: Integrate with backend API
    toast.success("Preferências salvas!");
  };

  const handleConnectGoogle = async () => {
    // TODO: Integrate with Google OAuth
    toast.info("Conectando ao Google Calendar...");
  };

  const handleDisconnectGoogle = async () => {
    // TODO: Integrate with backend API
    toast.success("Google Calendar desconectado!");
  };

  const handleExportData = async () => {
    // TODO: Integrate with backend API
    toast.success("Dados exportados com sucesso!");
  };

  const handleDeleteAccount = async () => {
    if (confirm("Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.")) {
      // TODO: Integrate with backend API
      toast.success("Conta excluída com sucesso!");
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center space-x-3">
          <SettingsIcon className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-gradient">Configurações</h1>
        </div>
        <p className="text-muted-foreground">
          Gerencie suas preferências e configurações da conta
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">
            <User className="h-4 w-4 mr-2" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="preferences">
            <Palette className="h-4 w-4 mr-2" />
            Preferências
          </TabsTrigger>
          <TabsTrigger value="integrations">
            <Key className="h-4 w-4 mr-2" />
            Integrações
          </TabsTrigger>
          <TabsTrigger value="data">
            <Database className="h-4 w-4 mr-2" />
            Dados
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Perfil</CardTitle>
              <CardDescription>
                Atualize suas informações pessoais
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  placeholder="Seu nome completo"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  placeholder="(00) 00000-0000"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                />
              </div>
              <Button onClick={handleSaveProfile}>Salvar Alterações</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Preferências de Notificação</CardTitle>
              <CardDescription>
                Configure como você deseja receber notificações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Lembretes de Estudo</Label>
                  <p className="text-sm text-muted-foreground">
                    Receba lembretes para suas sessões de estudo
                  </p>
                </div>
                <Switch
                  checked={notifications.studyReminders}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, studyReminders: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Prazos de Tarefas</Label>
                  <p className="text-sm text-muted-foreground">
                    Seja notificado sobre prazos próximos
                  </p>
                </div>
                <Switch
                  checked={notifications.taskDeadlines}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, taskDeadlines: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Relatório Semanal</Label>
                  <p className="text-sm text-muted-foreground">
                    Receba um resumo semanal do seu progresso
                  </p>
                </div>
                <Switch
                  checked={notifications.weeklyReport}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, weeklyReport: checked })
                  }
                />
              </div>
              <Button onClick={handleSaveNotifications}>Salvar Preferências</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Preferências do Sistema</CardTitle>
              <CardDescription>
                Personalize sua experiência de uso
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Modo Escuro</Label>
                  <p className="text-sm text-muted-foreground">
                    Ativar tema escuro
                  </p>
                </div>
                <Switch
                  checked={preferences.darkMode}
                  onCheckedChange={(checked) =>
                    setPreferences({ ...preferences, darkMode: checked })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pomodoro-length">Duração do Pomodoro (minutos)</Label>
                <Input
                  id="pomodoro-length"
                  type="number"
                  min="1"
                  max="60"
                  value={preferences.pomodoroLength}
                  onChange={(e) =>
                    setPreferences({ ...preferences, pomodoroLength: parseInt(e.target.value) })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="short-break">Pausa Curta (minutos)</Label>
                <Input
                  id="short-break"
                  type="number"
                  min="1"
                  max="30"
                  value={preferences.shortBreakLength}
                  onChange={(e) =>
                    setPreferences({ ...preferences, shortBreakLength: parseInt(e.target.value) })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="long-break">Pausa Longa (minutos)</Label>
                <Input
                  id="long-break"
                  type="number"
                  min="1"
                  max="60"
                  value={preferences.longBreakLength}
                  onChange={(e) =>
                    setPreferences({ ...preferences, longBreakLength: parseInt(e.target.value) })
                  }
                />
              </div>
              <Button onClick={handleSavePreferences}>Salvar Preferências</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>Integrações</CardTitle>
              <CardDescription>
                Conecte serviços externos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <h4 className="font-semibold">Google Calendar</h4>
                  <p className="text-sm text-muted-foreground">
                    Sincronize eventos com sua Google Agenda
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleConnectGoogle}>
                    Conectar
                  </Button>
                  <Button variant="destructive" onClick={handleDisconnectGoogle}>
                    Desconectar
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <h4 className="font-semibold">Google Drive</h4>
                  <p className="text-sm text-muted-foreground">
                    Armazene arquivos no Google Drive
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleConnectGoogle}>
                    Conectar
                  </Button>
                  <Button variant="destructive" onClick={handleDisconnectGoogle}>
                    Desconectar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Tab */}
        <TabsContent value="data">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Dados</CardTitle>
              <CardDescription>
                Exporte ou delete seus dados
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Exportar Dados</h4>
                <p className="text-sm text-muted-foreground">
                  Baixe todos os seus dados em formato JSON
                </p>
                <Button variant="outline" onClick={handleExportData}>
                  Exportar Dados
                </Button>
              </div>
              <div className="space-y-2 pt-4 border-t">
                <h4 className="font-semibold text-destructive">Zona de Perigo</h4>
                <p className="text-sm text-muted-foreground">
                  Excluir sua conta removerá permanentemente todos os seus dados
                </p>
                <Button variant="destructive" onClick={handleDeleteAccount}>
                  Excluir Conta
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
