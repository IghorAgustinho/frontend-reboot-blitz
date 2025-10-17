# 📘 GUIA DE IMPLEMENTAÇÃO BACKEND - SKILLIUM

## 📋 CONTEXTO DO PROJETO

Sistema de gerenciamento de estudos **Skillium**. Frontend em React + TypeScript, backend PHP + PostgreSQL.

---

## ✅ O QUE JÁ ESTÁ PRONTO

### Frontend
- ✅ Login/Cadastro com design moderno
- ✅ Dashboard com estatísticas
- ✅ Timer Pomodoro + Focus Mode
- ✅ Páginas: Calendar, Subjects, Notes, Settings
- ✅ Design system com gradientes (roxo + azul)

### Backend (CRUDs básicos prontos)
- ✅ Autenticação
- ✅ Usuários, Disciplinas, Eventos, Anotações

---

## 🎯 PRÓXIMAS IMPLEMENTAÇÕES

### 1. SISTEMA DE SESSÕES DE ESTUDO (CRÍTICO)

**Tabela necessária:**
```sql
CREATE TABLE sessoes_estudo (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL,
    disciplina_id INTEGER,
    inicio TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fim TIMESTAMP,
    duracao_minutos INTEGER,
    tipo VARCHAR(20) DEFAULT 'pomodoro',
    concluida BOOLEAN DEFAULT false,
    notas TEXT,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (disciplina_id) REFERENCES disciplinas(id) ON DELETE SET NULL
);
```

**Endpoints:**
- POST `/api/sessoes/iniciar.php` - Inicia sessão
- POST `/api/sessoes/finalizar.php` - Finaliza e calcula duração
- GET `/api/sessoes/ativas.php` - Lista sessões ativas
- GET `/api/sessoes/historico.php` - Histórico completo

### 2. ESTATÍSTICAS DO DASHBOARD

**GET `/api/dashboard/estatisticas.php`**
```php
{
    "materias": { "total": 5, "concluidas": 2 },
    "horas_estudadas": { "total_minutos": 480, "semana_minutos": 120 },
    "tarefas": { "total": 10, "concluidas": 7, "percentual": 70 },
    "sequencia_dias": 5
}
```

**GET `/api/dashboard/atividades-recentes.php`**
União de sessões, anotações e eventos recentes.

### 3. SISTEMA DE TAREFAS

**Tabela:**
```sql
CREATE TABLE tarefas (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL,
    disciplina_id INTEGER,
    titulo VARCHAR(200) NOT NULL,
    descricao TEXT,
    data_vencimento DATE,
    prioridade VARCHAR(10) DEFAULT 'medium',
    progresso INTEGER DEFAULT 0,
    concluida BOOLEAN DEFAULT false,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);
```

**Endpoints CRUD completo:**
- POST `/api/tarefas/criar.php`
- GET `/api/tarefas/listar.php`
- PUT `/api/tarefas/atualizar.php`
- PUT `/api/tarefas/concluir.php`
- DELETE `/api/tarefas/deletar.php`

### 4. RELATÓRIOS

- GET `/api/relatorios/progresso-semanal.php` - Últimos 7 dias
- GET `/api/relatorios/desempenho-disciplinas.php` - Tempo por matéria

---

## 📊 PRIORIDADES

### 🔥 ALTA (Fazer AGORA)
1. Sessões de estudo
2. Estatísticas dashboard
3. Sistema de tarefas

### 🟡 MÉDIA
4. Relatórios
5. Melhorias em eventos

### 🟢 BAIXA
6. Notificações
7. Gamificação

---

## 🔧 PADRÕES

**Resposta JSON:**
```php
// Sucesso
{ "success": true, "data": {...}, "message": "..." }

// Erro
{ "success": false, "error": "...", "code": "..." }
```

**CORS (já deve ter):**
```php
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
```

---

## 📝 CHECKLIST

- [ ] Tabela sessoes_estudo
- [ ] 4 endpoints de sessões
- [ ] 2 endpoints de dashboard
- [ ] Tabela tarefas
- [ ] 5 endpoints de tarefas
- [ ] 2 endpoints de relatórios

**Começar por sessões de estudo - é o mais crítico!**