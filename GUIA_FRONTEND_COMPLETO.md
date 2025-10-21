# 📘 GUIA COMPLETO DO FRONTEND - SKILLIUM

> **ÚLTIMA ATUALIZAÇÃO:** 2025-10-21  
> **VERSÃO:** 1.0  
> Este documento contém TODA a informação sobre o frontend do Skillium para implementação correta do backend.

---

## 🎯 VISÃO GERAL DO PROJETO

**Skillium** é uma plataforma de gestão acadêmica para estudantes, focada em:
- Organização de disciplinas e conteúdos
- Cronômetro Pomodoro para sessões de estudo
- Sistema de notas e anotações
- Calendário de eventos acadêmicos
- Dashboard com estatísticas e atividades recentes
- Modo foco com alerta sonoro

**Stack Tecnológica:**
- React 18.3.1
- TypeScript
- Vite
- Tailwind CSS
- React Router DOM 6.30.1
- shadcn/ui (componentes)
- Lucide React (ícones)
- TanStack Query 5.83.0
- date-fns 3.6.0

---

## 📁 ESTRUTURA DE ARQUIVOS

```
src/
├── App.tsx                          # Configuração principal de rotas
├── main.tsx                         # Entry point da aplicação
├── index.css                        # Design system e tokens CSS
├── contexts/
│   └── FocusModeContext.tsx        # Contexto global do modo foco
├── hooks/
│   ├── useFocusMode.tsx            # Hook para alerta sonoro de foco
│   ├── use-mobile.tsx              # Hook para detecção mobile
│   └── use-toast.ts                # Hook para notificações toast
├── components/
│   ├── layout/
│   │   ├── AppLayout.tsx           # Layout principal com sidebar
│   │   └── AppSidebar.tsx          # Sidebar de navegação
│   └── ui/                          # Componentes shadcn/ui (40+ componentes)
├── pages/
│   ├── Login.tsx                   # Página de login/cadastro
│   ├── Dashboard.tsx               # Dashboard principal
│   ├── Subjects.tsx                # Gestão de disciplinas
│   ├── Calendar.tsx                # Calendário de eventos
│   ├── Timer.tsx                   # Cronômetro Pomodoro
│   ├── Notes.tsx                   # Sistema de notas
│   ├── Settings.tsx                # Configurações do usuário
│   ├── Index.tsx                   # Rota raiz (redireciona para Dashboard)
│   └── NotFound.tsx                # Página 404
├── lib/
│   └── utils.ts                    # Utilitários (cn para classNames)
└── public/
    └── focus-alert.mp3             # Som de alerta do modo foco
```

---

## 🎨 DESIGN SYSTEM

### Paleta de Cores (HSL - index.css)

```css
:root {
  /* Cores Principais */
  --background: 0 0% 100%;           /* Branco */
  --foreground: 240 10% 3.9%;        /* Quase preto */
  
  --primary: 262 83% 58%;            /* Roxo vibrante (#8B5CF6) */
  --primary-foreground: 0 0% 100%;   /* Branco */
  
  --secondary: 240 4.8% 95.9%;       /* Cinza claro */
  --secondary-foreground: 240 5.9% 10%; /* Cinza escuro */
  
  --accent: 240 4.8% 95.9%;          /* Cinza claro */
  --accent-foreground: 240 5.9% 10%; /* Cinza escuro */
  
  --muted: 240 4.8% 95.9%;           /* Cinza claro */
  --muted-foreground: 240 3.8% 46.1%; /* Cinza médio */
  
  --card: 0 0% 100%;                 /* Branco */
  --card-foreground: 240 10% 3.9%;   /* Quase preto */
  
  --border: 240 5.9% 90%;            /* Cinza claro */
  --input: 240 5.9% 90%;             /* Cinza claro */
  --ring: 262 83% 58%;               /* Roxo (focus) */
  
  /* Gradientes Personalizados */
  --gradient-aurora: linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%);
  --gradient-subtle: linear-gradient(180deg, rgba(139, 92, 246, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%);
}

.dark {
  /* Modo escuro */
  --background: 240 10% 3.9%;
  --foreground: 0 0% 98%;
  --primary: 262 83% 58%;
  --primary-foreground: 0 0% 100%;
  /* ... demais cores adaptadas para dark mode */
}
```

### Gradiente Aurora (Roxo → Azul)

Usado em botões principais de ação:
```tsx
className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
```

**Onde é aplicado:**
- Botões "Create Event" (Calendar)
- Botões "New Note" (Notes)
- Botões "Add Study Unit" (Subjects)
- Botão "Sign In" / "Sign Up" (Login)
- Logo do Skillium (gradiente no texto)

### Animações Disponíveis

```css
/* Fade In */
@keyframes fade-in {
  0% { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
}

/* Scale In */
@keyframes scale-in {
  0% { transform: scale(0.95); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

/* Slide In Right */
@keyframes slide-in-right {
  0% { transform: translateX(100%); }
  100% { transform: translateX(0); }
}

/* Accordion */
@keyframes accordion-down { /* expansão de acordeão */ }
@keyframes accordion-up { /* colapso de acordeão */ }
```

**Classes Tailwind:**
- `animate-fade-in` - Fade in suave
- `animate-scale-in` - Scale in
- `animate-slide-in-right` - Slide da direita
- `hover-scale` - Scale no hover
- `transition-all duration-300` - Transição padrão

---

## 🧩 CONTEXTOS E HOOKS CUSTOMIZADOS

### FocusModeContext

**Arquivo:** `src/contexts/FocusModeContext.tsx`

**Propósito:** Gerenciar o estado global do "Modo Foco" que reproduz um alerta sonoro após 15 segundos de inatividade.

**Interface:**
```typescript
interface FocusModeContextType {
  focusModeEnabled: boolean;
  toggleFocusMode: () => void;
}
```

**Uso:**
```typescript
const { focusModeEnabled, toggleFocusMode } = useFocusModeContext();
```

**Persistência:** `localStorage` com chave `focusModeEnabled`

---

### useFocusMode Hook

**Arquivo:** `src/hooks/useFocusMode.tsx`

**Propósito:** Implementa a lógica do modo foco - detecta quando a janela perde foco e inicia um timer de 15 segundos. Se não houver retorno, toca `/focus-alert.mp3` em loop.

**Lógica:**
1. Escuta eventos `blur` (janela perde foco)
2. Inicia timeout de 15 segundos
3. Se não houver `focus` (retorno), toca áudio em loop
4. Ao retornar (`focus`), cancela timeout e para áudio

**Uso:**
```typescript
useFocusMode(focusModeEnabled); // No AppLayout
```

---

## 📄 PÁGINAS DETALHADAS

### 1. Login.tsx

**Rota:** `/login`

**Funcionalidades:**
- Toggle entre "Sign In" e "Sign Up" com animação suave
- Campos:
  - **Sign In:** Email, Password
  - **Sign Up:** Name, Email, Password, Confirm Password
- "Forgot Password?" abre modal com campo de email
- "Terms of Use" e "Privacy Policy" abrem modais (conteúdo placeholder)
- Checkbox "Remember me" (Sign In)
- Checkbox "I agree to terms" (Sign Up)

**Estados Locais:**
```typescript
const [isSignUp, setIsSignUp] = useState(false);
const [showForgotPassword, setShowForgotPassword] = useState(false);
const [showTerms, setShowTerms] = useState(false);
const [showPrivacy, setShowPrivacy] = useState(false);
```

**Design:**
- Fundo: Dois shapes sharp invertidos (topo e base), blobs animados, dots pattern
- Conteúdo centralizado com Card branco
- Logo "Skillium" com gradiente aurora no topo (rotação 0deg)
- Contraste suavizado (bg-white/90, text-gray-700)
- Transições suaves ao alternar Sign In/Up

**Ações:**
- `handleSignIn()` - Navega para "/" após "login"
- `handleSignUp()` - Navega para "/" após "cadastro"
- `handleForgotPassword()` - Toast de sucesso (não implementado backend)

**Importante para Backend:**
- Precisa endpoint de autenticação (login/cadastro)
- Validação de email/senha
- Sistema de recuperação de senha
- Sessão de usuário (JWT ou similar)

---

### 2. Dashboard.tsx

**Rota:** `/` ou `/dashboard`

**Layout:** Usa `<AppLayout>` (sidebar + conteúdo)

**Seções:**

#### A. Header
```tsx
<h1>Welcome back, Student! 👋</h1>
<p>Here's what's happening with your studies today</p>
```

#### B. Stats Grid (StatCard)
```typescript
// Dados mockados atualmente
stats = [
  { title: "Active Subjects", value: "6", icon: BookOpen, trend: "+2" },
  { title: "Study Hours", value: "24h", icon: Clock, trend: "+5h" },
  { title: "Tasks Completed", value: "12/18", icon: CheckCircle, trend: "67%" },
  { title: "Current Streak", value: "7 days", icon: TrendingUp, trend: "+2" }
]
```

**IMPORTANTE:** Estes valores precisam vir do backend (estudos, horas, tarefas, streak).

#### C. Recent Activities
```typescript
interface Activity {
  type: string;
  title: string;
  description: string;
  timestamp: string;
  icon: LucideIcon;
}
```

**Estado atual:** Array vazio `[]`  
**Esperado do backend:** Lista de atividades recentes do usuário (últimos estudos, notas criadas, eventos, etc.)

#### D. Upcoming Tasks
```typescript
interface Task {
  title: string;
  dueDate: string;
  progress: number;
  priority: 'high' | 'medium' | 'low';
}
```

**Estado atual:** Array vazio `[]`  
**Esperado do backend:** Lista de tarefas pendentes com prioridade e progresso.

#### E. Quick Actions
- "New Subject" → Navega para `/subjects`
- "Start Timer" → Navega para `/timer`
- "New Note" → Navega para `/notes`
- "Schedule Event" → Navega para `/calendar`

**Dados que o Backend DEVE fornecer:**
```typescript
{
  activeSubjects: number,
  studyHoursThisWeek: number,
  tasksCompleted: number,
  totalTasks: number,
  currentStreak: number,
  recentActivities: Activity[],
  upcomingTasks: Task[]
}
```

---

### 3. Subjects.tsx

**Rota:** `/subjects`

**Estrutura de Dados:**

```typescript
interface StudyFile {
  id: string;
  name: string;
  type: 'pdf' | 'video' | 'link' | 'other';
  completed: boolean;
}

interface StudyContent {
  id: string;
  title: string;
  description: string;
  progress: number; // 0-100
  files: StudyFile[];
}

interface Subject {
  id: string;
  name: string;
  professor: string;
  color: string; // hex color
  contents: StudyContent[];
}

interface StudyUnit {
  id: string;
  title: string;
  description: string;
  progress: number; // 0-100
  subjects: Subject[];
  expanded: boolean; // estado UI
}
```

**Estado Local:**
```typescript
const [studyUnits, setStudyUnits] = useState<StudyUnit[]>([]);
```

**Funcionalidades:**

1. **Adicionar Study Unit** (Modal placeholder - não implementado)
2. **Expandir/Colapsar Unit** (`toggleUnit`)
3. **Marcar File como Completo** (`toggleFileCompletion`)
4. **Dropdown Actions:**
   - Edit (não implementado)
   - Archive (não implementado)
   - Delete (não implementado)

**Visual:**
- Cards com borda colorida (cor da disciplina)
- Progress bars para unidades e conteúdos
- Ícones por tipo de arquivo (FileText, Video, Link, File)
- Botão "Add Study Unit" com gradiente aurora
- Badges com status de conclusão

**Dados que o Backend DEVE fornecer:**
```typescript
GET /api/study-units
Response: {
  studyUnits: StudyUnit[]
}

POST /api/study-units
Body: { title, description }

PUT /api/study-units/:id/subjects/:subjectId/contents/:contentId/files/:fileId/toggle
// Toggle completion

DELETE /api/study-units/:id
```

**Cálculo de Progresso:**
- Progresso do conteúdo = (arquivos completos / total arquivos) * 100
- Progresso da unidade = média dos progressos das disciplinas

---

### 4. Calendar.tsx

**Rota:** `/calendar`

**Estrutura de Dados:**

```typescript
interface CalendarEvent {
  id: string;
  title: string;
  date: string; // "YYYY-MM-DD"
  time: string; // "HH:MM"
  location?: string;
  description?: string;
}
```

**Estados Locais:**
```typescript
const [currentDate, setCurrentDate] = useState(new Date());
const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
const [showCreateModal, setShowCreateModal] = useState(false);
const [showDetailsModal, setShowDetailsModal] = useState(false);
const [events, setEvents] = useState<CalendarEvent[]>([]);
```

**Funcionalidades:**

1. **Visualização Mensal:** Grid 7x6 com dias do mês
2. **Navegação:** Botões Previous/Next mês
3. **Criar Evento:** Modal com campos (title, date, time, location, description)
4. **Ver Detalhes:** Click em evento abre modal com informações
5. **Indicadores:**
   - Hoje: borda azul
   - Dia com eventos: badge com contador
   - Eventos: lista abaixo do dia no grid

**Funções Auxiliares:**
```typescript
getDaysInMonth(date: Date): Date[]
getEventsForDay(day: Date): CalendarEvent[]
isToday(day: Date): boolean
navigateMonth(direction: 'prev' | 'next'): void
```

**Dados que o Backend DEVE fornecer:**
```typescript
GET /api/events?month=YYYY-MM
Response: { events: CalendarEvent[] }

POST /api/events
Body: { title, date, time, location?, description? }

GET /api/events/:id
Response: CalendarEvent

DELETE /api/events/:id
```

**Validações Necessárias:**
- Data não pode ser no passado
- Horário deve ser válido
- Título obrigatório

---

### 5. Timer.tsx

**Rota:** `/timer`

**Estrutura de Dados:**

```typescript
interface TimerSession {
  id: string;
  type: 'pomodoro' | 'break' | 'custom';
  duration: number; // em minutos
  completedAt: string; // ISO timestamp
}
```

**Estados Locais:**
```typescript
const [minutes, setMinutes] = useState(25);
const [seconds, setSeconds] = useState(0);
const [isRunning, setIsRunning] = useState(false);
const [timerType, setTimerType] = useState<'pomodoro' | 'break' | 'custom'>('pomodoro');
const [completedSessions, setCompletedSessions] = useState<TimerSession[]>([]);
```

**Presets:**
- **Pomodoro:** 25 minutos
- **Short Break:** 5 minutos
- **Long Break:** 15 minutos
- **Custom:** Input manual (1-120 minutos)

**Funcionalidades:**

1. **Start/Pause/Reset Timer**
2. **Alerta Sonoro:** Toca `/focus-alert.mp3` ao completar
3. **Persistência:** Salva estado em `localStorage`:
   - `pomodoroState`: { minutes, seconds, isRunning, timerType }
   - `completedSessions`: array de sessões
4. **Estatísticas do Dia:**
   - Total de sessões
   - Tempo total estudado
   - Média de duração

**Visual:**
- Círculo de progresso (SVG)
- Display grande do tempo (MM:SS)
- Botões de controle com ícones
- Grid de presets
- Cards de estatísticas

**Dados que o Backend DEVE fornecer:**
```typescript
POST /api/timer/sessions
Body: { type, duration, completedAt }

GET /api/timer/sessions?date=YYYY-MM-DD
Response: { sessions: TimerSession[] }

GET /api/timer/stats?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
Response: {
  totalSessions: number,
  totalMinutes: number,
  averageDuration: number,
  sessionsByDay: { date: string, count: number }[]
}
```

**Importante:** As sessões devem ser salvas APENAS quando completas (não canceladas).

---

### 6. Notes.tsx

**Rota:** `/notes`

**Estrutura de Dados:**

```typescript
interface Note {
  id: string;
  title: string;
  content: string;
  category: 'personal' | 'academic' | 'work' | 'other';
  tags: string[];
  pinned: boolean;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}
```

**Estados Locais:**
```typescript
const [notes, setNotes] = useState<Note[]>([]);
const [searchTerm, setSearchTerm] = useState('');
const [selectedCategory, setSelectedCategory] = useState<string>('all');
const [showCreateModal, setShowCreateModal] = useState(false);
const [editingNote, setEditingNote] = useState<Note | null>(null);
```

**Funcionalidades:**

1. **CRUD Completo:**
   - Create: Modal com title, category, tags (comma-separated), content
   - Read: Grid de cards
   - Update: Mesmo modal, populado com dados
   - Delete: Confirmação implícita

2. **Filtros:**
   - Busca por título/conteúdo
   - Filtro por categoria (all, personal, academic, work, other)

3. **Ordenação:**
   - Pinned primeiro
   - Depois por updatedAt (mais recente)

4. **Pin/Unpin:** Toggle rápido

**Visual:**
- Grid responsivo (1-3 colunas)
- Cards com hover effect (revela ações)
- Badges de categoria coloridos
- Tags como chips
- Ícone de pin para notas fixadas
- Conteúdo truncado (150 chars)

**Funções Auxiliares:**
```typescript
formatDate(dateString: string): string // "Jan 15, 2024"
truncateContent(content: string, maxLength: number): string
```

**Dados que o Backend DEVE fornecer:**
```typescript
GET /api/notes
Response: { notes: Note[] }

POST /api/notes
Body: { title, content, category, tags }

PUT /api/notes/:id
Body: { title?, content?, category?, tags?, pinned? }

DELETE /api/notes/:id
```

---

### 7. Settings.tsx

**Rota:** `/settings`

**Estrutura de Dados:**

```typescript
interface UserProfile {
  name: string;
  email: string;
  university: string;
  course: string;
  semester: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  studyReminders: boolean;
  weeklyReport: boolean;
}

interface SystemPreferences {
  focusModeEnabled: boolean;
  language: 'en' | 'pt';
  theme: 'light' | 'dark' | 'system';
}
```

**Abas (Tabs):**

1. **Profile:**
   - Name, Email (disabled), University, Course, Semester
   - Botão "Save Changes"

2. **Notifications:**
   - Switches para: Email, Push, Study Reminders, Weekly Report
   - Botão "Save Preferences"

3. **Preferences:**
   - Focus Mode toggle (integrado com FocusModeContext)
   - Language select (PT/EN)
   - Theme select (Light/Dark/System)
   - Botão "Save Preferences"

4. **Integrations:**
   - Google Calendar (Connect/Disconnect)
   - Placeholder para futuras integrações

5. **Data:**
   - "Export My Data" (JSON)
   - "Delete Account" (confirmação)

**Ações:**
```typescript
handleSaveProfile(): void
handleSaveNotifications(): void
handleSavePreferences(): void
handleConnectGoogleCalendar(): void
handleExportData(): void
handleDeleteAccount(): void
```

**Dados que o Backend DEVE fornecer:**
```typescript
GET /api/user/profile
Response: UserProfile

PUT /api/user/profile
Body: { name?, university?, course?, semester? }

GET /api/user/settings
Response: { notifications: NotificationSettings, preferences: SystemPreferences }

PUT /api/user/settings
Body: { notifications?, preferences? }

POST /api/user/export
Response: { data: JSON blob }

DELETE /api/user/account
```

---

## 🗺️ SISTEMA DE ROTAS

**Arquivo:** `src/App.tsx`

```typescript
<Routes>
  <Route path="/" element={<AppLayout><Dashboard /></AppLayout>} />
  <Route path="/login" element={<Login />} />
  <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
  <Route path="/subjects" element={<AppLayout><Subjects /></AppLayout>} />
  <Route path="/calendar" element={<AppLayout><Calendar /></AppLayout>} />
  <Route path="/timer" element={<AppLayout><Timer /></AppLayout>} />
  <Route path="/notes" element={<AppLayout><Notes /></AppLayout>} />
  <Route path="/settings" element={<AppLayout><Settings /></AppLayout>} />
  <Route path="*" element={<NotFound />} />
</Routes>
```

**Proteção de Rotas:**  
❌ **AINDA NÃO IMPLEMENTADO**  
Todas as rotas estão públicas. Backend deve fornecer sistema de autenticação e frontend deve verificar token/sessão antes de renderizar rotas protegidas.

---

## 🎨 COMPONENTES UI (shadcn/ui)

Todos os componentes em `src/components/ui/` seguem o padrão shadcn/ui:

**Componentes Críticos Usados:**
- `Button` - Botões estilizados com variantes
- `Card, CardHeader, CardTitle, CardContent` - Containers
- `Dialog, DialogContent, DialogHeader, DialogTitle` - Modais
- `Input, Label` - Formulários
- `Select, SelectTrigger, SelectValue, SelectContent, SelectItem` - Dropdowns
- `Tabs, TabsList, TabsTrigger, TabsContent` - Navegação por abas
- `Progress` - Barras de progresso
- `Badge` - Etiquetas coloridas
- `Switch` - Toggle switches
- `Textarea` - Campos de texto multilinhas
- `DropdownMenu` - Menus contextuais
- `Separator` - Divisores visuais
- `Alert, AlertDescription` - Alertas
- `StatCard` - Card customizado para estatísticas (Dashboard)

**Variantes de Button:**
- `default` - Roxo sólido
- `outline` - Borda roxa
- `ghost` - Sem fundo
- `destructive` - Vermelho (delete)
- `secondary` - Cinza

---

## 🧭 NAVEGAÇÃO (AppSidebar)

**Arquivo:** `src/components/layout/AppSidebar.tsx`

**Itens do Menu:**
```typescript
const menuItems = [
  { icon: Home, label: "Dashboard", path: "/" },
  { icon: BookOpen, label: "Subjects", path: "/subjects" },
  { icon: Calendar, label: "Calendar", path: "/calendar" },
  { icon: Timer, label: "Timer", path: "/timer" },
  { icon: FileText, label: "Notes", path: "/notes" },
  { icon: Settings, label: "Settings", path: "/settings" },
];
```

**Funcionalidades:**
- Highlight da rota ativa (usa `useLocation`)
- Collapse/Expand sidebar
- Logo no topo (gradiente aurora)
- Ícone de usuário no rodapé

**Estados:**
- `collapsed`: boolean (controlado pelo AppLayout)

---

## 📦 DEPENDÊNCIAS IMPORTANTES

### React Query (TanStack Query)
**Usado para:** Gerenciamento de estado assíncrono (ainda não implementado, mas configurado)

**Setup:**
```typescript
const queryClient = new QueryClient();
<QueryClientProvider client={queryClient}>
```

**Como usar no futuro:**
```typescript
const { data, isLoading } = useQuery({
  queryKey: ['notes'],
  queryFn: () => fetch('/api/notes').then(res => res.json())
});
```

### Date-fns
**Usado para:** Formatação de datas

```typescript
import { format, parseISO, isToday } from 'date-fns';

format(new Date(), 'MMM dd, yyyy'); // "Jan 15, 2024"
isToday(new Date()); // true/false
```

### React Hook Form + Zod
**Instalado mas não usado ainda**  
Pode ser implementado para validação de formulários no futuro.

---

## 🔐 AUTENTICAÇÃO (A IMPLEMENTAR)

**Estado Atual:** Não há autenticação real. Login apenas navega para dashboard.

**O que o Backend DEVE fornecer:**

1. **Endpoints:**
```typescript
POST /api/auth/register
Body: { name, email, password }
Response: { token, user }

POST /api/auth/login
Body: { email, password }
Response: { token, user }

POST /api/auth/forgot-password
Body: { email }
Response: { message }

POST /api/auth/logout
Headers: { Authorization: "Bearer {token}" }
```

2. **Token Management:**
- JWT com expiração
- Refresh token (opcional)
- Armazenar em `localStorage` ou `httpOnly cookie`

3. **Frontend deve implementar:**
- AuthContext para gerenciar usuário logado
- ProtectedRoute component
- Interceptor para adicionar token em requests
- Redirect para /login se não autenticado

**Exemplo de implementação futura:**
```typescript
// AuthContext.tsx
const AuthContext = createContext<{
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}>();

// ProtectedRoute.tsx
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};
```

---

## 📊 INTEGRAÇÕES FUTURAS

### 1. Lovable Cloud (Backend)
- Base de dados PostgreSQL
- Edge Functions para lógica serverless
- Storage para arquivos (PDFs, vídeos)
- Autenticação integrada

### 2. Google Calendar (Opcional)
- OAuth 2.0
- Sincronização bidirecional de eventos
- Botão em Settings > Integrations

### 3. Exportação de Dados
- JSON completo do perfil
- Relatórios em PDF (futuro)

---

## 🎯 FLUXOS DE USUÁRIO PRINCIPAIS

### Fluxo 1: Novo Usuário
1. Acessa `/login`
2. Clica "Sign Up"
3. Preenche Name, Email, Password, Confirm Password
4. Marca "I agree to terms"
5. Clica "Sign Up"
6. → Redireciona para `/` (Dashboard)
7. Vê mensagem de boas-vindas
8. Explora Quick Actions

### Fluxo 2: Estudar com Pomodoro
1. Dashboard → "Start Timer"
2. Timer página carrega (preset 25min)
3. Clica "Start"
4. Timer conta regressivamente
5. Ao completar: som toca, sessão salva
6. Estatísticas atualizam

### Fluxo 3: Criar Nota de Estudo
1. Dashboard → "New Note" OU Sidebar → Notes
2. Clica "New Note"
3. Modal abre
4. Preenche: Title, Category, Tags, Content
5. Clica "Create Note"
6. Nota aparece no grid
7. Pode Pin, Edit, Delete

### Fluxo 4: Organizar Disciplinas
1. Sidebar → Subjects
2. Clica "Add Study Unit"
3. Adiciona Unit com título/descrição
4. Expande Unit
5. Adiciona Subject com nome/professor/cor
6. Adiciona Content com arquivos
7. Marca arquivos como completos
8. Progress bar atualiza automaticamente

### Fluxo 5: Modo Foco Ativo
1. Sidebar → Settings → Preferences
2. Ativa "Enable Focus Mode"
3. Volta ao estudo (qualquer página)
4. Muda de aba/janela (blur)
5. Após 15s: som de alerta toca em loop
6. Retorna à aba: som para
7. Continua estudando

---

## 🐛 PROBLEMAS CONHECIDOS / TODO

### Funcionalidades Mockadas (precisam backend):
- [ ] Dashboard statistics (hardcoded)
- [ ] Recent Activities (array vazio)
- [ ] Upcoming Tasks (array vazio)
- [ ] Study Units CRUD (apenas UI)
- [ ] Notes CRUD (apenas localStorage)
- [ ] Calendar Events (apenas localStorage)
- [ ] Timer Sessions (apenas localStorage)
- [ ] User Profile (hardcoded)

### Não Implementado:
- [ ] Autenticação real
- [ ] Rotas protegidas
- [ ] Recuperação de senha funcional
- [ ] Validação de formulários com Zod
- [ ] Upload de arquivos (PDFs, vídeos)
- [ ] Notificações push
- [ ] Export de dados real
- [ ] Google Calendar integration
- [ ] Dark mode toggle funcional (preparado mas não conectado)
- [ ] Internacionalização (PT/EN)

### Melhorias Futuras:
- [ ] Skeleton loaders durante fetch
- [ ] Error boundaries
- [ ] Offline mode (PWA)
- [ ] Drag & drop para reordenar
- [ ] Rich text editor para Notes
- [ ] Gráficos de progresso histórico
- [ ] Gamificação (badges, níveis)

---

## 📝 CONVENÇÕES DE CÓDIGO

### Nomenclatura:
- Componentes: PascalCase (`Dashboard.tsx`)
- Funções: camelCase (`handleSubmit`)
- Interfaces: PascalCase com `interface` keyword
- Hooks: camelCase com `use` prefix (`useFocusMode`)
- Constantes: UPPER_SNAKE_CASE (rare)

### Estrutura de Componentes:
```typescript
// 1. Imports
import { useState } from 'react';
import { Button } from '@/components/ui/button';

// 2. Types/Interfaces
interface Props { ... }

// 3. Component
const Component = ({ prop }: Props) => {
  // 3.1. State
  const [state, setState] = useState();
  
  // 3.2. Handlers
  const handleAction = () => { ... };
  
  // 3.3. Effects
  useEffect(() => { ... }, []);
  
  // 3.4. Render
  return <div>...</div>;
};

// 4. Export
export default Component;
```

### Estilo:
- Usar `className` com `cn()` utility para merge condicional
- Preferir Tailwind sobre CSS customizado
- Usar tokens do design system (--primary, --background, etc.)
- Componentes < 300 linhas (quebrar se maior)

---

## 🚀 PRÓXIMOS PASSOS PARA INTEGRAÇÃO BACKEND

### Prioridade 1 - Essencial:
1. **Autenticação completa** (register, login, logout, forgot-password)
2. **CRUD de Notas** com banco de dados
3. **CRUD de Study Units/Subjects/Contents** com banco de dados
4. **CRUD de Calendar Events** com banco de dados
5. **Salvar Timer Sessions** no banco
6. **Dashboard Stats** dinâmicos do banco

### Prioridade 2 - Importante:
7. **User Profile** editável e persistente
8. **Settings** (notifications, preferences) no banco
9. **Upload de arquivos** (PDFs, vídeos) para Study Contents
10. **Recent Activities** automáticas (baseadas em ações do usuário)

### Prioridade 3 - Nice-to-have:
11. **Export de dados** real (JSON/PDF)
12. **Google Calendar sync**
13. **Email notifications** (reminders, weekly report)
14. **Dark mode** funcional

---

## 📞 ESTRUTURA DE COMUNICAÇÃO FRONTEND ↔ BACKEND

### Headers Padrão:
```typescript
{
  'Content-Type': 'application/json',
  'Authorization': 'Bearer {token}'
}
```

### Formato de Respostas:
```typescript
// Sucesso
{
  success: true,
  data: { ... }
}

// Erro
{
  success: false,
  error: {
    code: "VALIDATION_ERROR",
    message: "Email already exists",
    fields: { email: "This email is already registered" }
  }
}
```

### Tratamento de Erros no Frontend:
```typescript
try {
  const response = await fetch('/api/endpoint', { ... });
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error.message);
  }
  
  // Sucesso
  toast({ title: "Success", description: data.message });
} catch (error) {
  toast({ 
    title: "Error", 
    description: error.message, 
    variant: "destructive" 
  });
}
```

---

## 🎓 CONSIDERAÇÕES FINAIS

Este documento foi criado para ser **COMPLETO e DEFINITIVO**. Toda alteração no frontend deve gerar um **mini-guia complementar** descrevendo:
- O que mudou
- Por que mudou
- Como afeta a integração backend

**Mantenha sempre sincronizado:** Frontend ↔ Backend ↔ Documentação

---

**Versão:** 1.0  
**Data:** 2025-10-21  
**Autor:** IA Lovable  
**Projeto:** Skillium - Plataforma de Gestão Acadêmica

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO BACKEND

Use este checklist para garantir que tudo está coberto:

### Autenticação:
- [ ] POST /api/auth/register
- [ ] POST /api/auth/login
- [ ] POST /api/auth/logout
- [ ] POST /api/auth/forgot-password
- [ ] Middleware de autenticação (token validation)

### User:
- [ ] GET /api/user/profile
- [ ] PUT /api/user/profile
- [ ] GET /api/user/settings
- [ ] PUT /api/user/settings
- [ ] POST /api/user/export
- [ ] DELETE /api/user/account

### Notes:
- [ ] GET /api/notes (list all user notes)
- [ ] POST /api/notes (create)
- [ ] GET /api/notes/:id (get one)
- [ ] PUT /api/notes/:id (update)
- [ ] DELETE /api/notes/:id (delete)

### Study Units:
- [ ] GET /api/study-units (with subjects, contents, files)
- [ ] POST /api/study-units (create unit)
- [ ] PUT /api/study-units/:id (update unit)
- [ ] DELETE /api/study-units/:id (delete unit)
- [ ] POST /api/study-units/:id/subjects (add subject)
- [ ] PUT /api/subjects/:id (update subject)
- [ ] DELETE /api/subjects/:id (delete subject)
- [ ] POST /api/subjects/:id/contents (add content)
- [ ] PUT /api/contents/:id (update content)
- [ ] DELETE /api/contents/:id (delete content)
- [ ] POST /api/contents/:id/files (add file)
- [ ] PUT /api/files/:id/toggle (toggle completion)
- [ ] DELETE /api/files/:id (delete file)

### Calendar:
- [ ] GET /api/events?month=YYYY-MM (list events)
- [ ] POST /api/events (create event)
- [ ] GET /api/events/:id (get event)
- [ ] PUT /api/events/:id (update event)
- [ ] DELETE /api/events/:id (delete event)

### Timer:
- [ ] POST /api/timer/sessions (save completed session)
- [ ] GET /api/timer/sessions?date=YYYY-MM-DD (list sessions)
- [ ] GET /api/timer/stats (aggregated statistics)

### Dashboard:
- [ ] GET /api/dashboard/stats (active subjects, study hours, tasks, streak)
- [ ] GET /api/dashboard/activities (recent activities)
- [ ] GET /api/dashboard/tasks (upcoming tasks)

### Storage (se implementar upload):
- [ ] POST /api/storage/upload (upload file)
- [ ] GET /api/storage/:filename (get file)
- [ ] DELETE /api/storage/:filename (delete file)

---

**FIM DO GUIA COMPLETO DO FRONTEND**