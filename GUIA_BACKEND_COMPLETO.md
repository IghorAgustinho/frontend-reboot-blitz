# 📘 GUIA COMPLETO DE IMPLEMENTAÇÃO BACKEND - SKILLIUM

## 📋 CONTEXTO DO PROJETO

**Skillium** - Sistema completo de gerenciamento de estudos
- **Frontend**: React + TypeScript + Tailwind CSS (Design Aurora - Roxo/Azul)
- **Backend**: PHP 8+ com PostgreSQL
- **Objetivo**: TCC - Sistema de produtividade acadêmica

---

## ✅ O QUE JÁ ESTÁ IMPLEMENTADO

### Frontend (100% Completo)
- ✅ **Login/Cadastro**: Design moderno com gradientes aurora (roxo→azul)
- ✅ **Dashboard**: Cards com estatísticas visuais
- ✅ **Timer Pomodoro**: Com focus mode e alertas sonoros
- ✅ **Calendário**: Criação e visualização de eventos
- ✅ **Disciplinas**: Organização hierárquica (Unidades → Disciplinas → Conteúdos → Arquivos)
- ✅ **Anotações**: Sistema completo com tags e categorias
- ✅ **Settings**: Configurações de usuário
- ✅ **Sidebar**: Navegação com ícones e collapse
- ✅ **Design System**: Tokens semânticos, gradientes aurora, shadows, animações

### Backend (CRUDs Básicos Prontos)
- ✅ Autenticação (login/registro)
- ✅ CRUD Usuários
- ✅ CRUD Disciplinas
- ✅ CRUD Eventos (calendário)
- ✅ CRUD Anotações

---

## 🎯 IMPLEMENTAÇÕES CRÍTICAS NECESSÁRIAS

### 🔥 PRIORIDADE MÁXIMA

#### 1. SISTEMA DE SESSÕES DE ESTUDO (Timer Integration)

**Por que é crítico**: O timer Pomodoro já existe no frontend mas não salva dados. Precisamos:
- Rastrear tempo real de estudo
- Calcular estatísticas do dashboard
- Gerar sequências de dias estudados
- Criar histórico de produtividade

**Tabela SQL:**
```sql
CREATE TABLE sessoes_estudo (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL,
    disciplina_id INTEGER,
    inicio TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fim TIMESTAMP,
    duracao_minutos INTEGER,
    tipo VARCHAR(20) DEFAULT 'pomodoro', -- 'pomodoro', 'custom', 'focus_mode'
    concluida BOOLEAN DEFAULT false,
    interrompida BOOLEAN DEFAULT false,
    notas TEXT,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (disciplina_id) REFERENCES disciplinas(id) ON DELETE SET NULL
);

CREATE INDEX idx_sessoes_usuario ON sessoes_estudo(usuario_id);
CREATE INDEX idx_sessoes_data ON sessoes_estudo(inicio);
```

**Endpoints Necessários:**

**POST `/api/sessoes/iniciar.php`**
```json
Request:
{
    "disciplina_id": 5,
    "tipo": "pomodoro"
}

Response:
{
    "success": true,
    "data": {
        "sessao_id": 123,
        "inicio": "2025-10-17 14:30:00"
    }
}
```

**POST `/api/sessoes/finalizar.php`**
```json
Request:
{
    "sessao_id": 123,
    "concluida": true,
    "notas": "Revisei capítulo 5"
}

Response:
{
    "success": true,
    "data": {
        "duracao_minutos": 25,
        "fim": "2025-10-17 14:55:00"
    }
}
```

**GET `/api/sessoes/ativas.php`**
```json
Response:
{
    "success": true,
    "data": [
        {
            "id": 123,
            "disciplina": "Matemática",
            "inicio": "2025-10-17 14:30:00",
            "tipo": "pomodoro"
        }
    ]
}
```

**GET `/api/sessoes/historico.php?data_inicio=2025-10-01&data_fim=2025-10-17`**
```json
Response:
{
    "success": true,
    "data": [
        {
            "id": 123,
            "disciplina": "Matemática",
            "inicio": "2025-10-17 14:30:00",
            "fim": "2025-10-17 14:55:00",
            "duracao_minutos": 25,
            "tipo": "pomodoro",
            "concluida": true
        }
    ]
}
```

---

#### 2. ESTATÍSTICAS DO DASHBOARD

**Por que é crítico**: Dashboard mostra cards vazios. Precisa de dados reais.

**Tabela Auxiliar:**
```sql
CREATE TABLE estatisticas_diarias (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL,
    data DATE NOT NULL,
    minutos_estudados INTEGER DEFAULT 0,
    sessoes_concluidas INTEGER DEFAULT 0,
    ultima_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    UNIQUE(usuario_id, data)
);

CREATE INDEX idx_stats_usuario_data ON estatisticas_diarias(usuario_id, data);
```

**GET `/api/dashboard/estatisticas.php`**
```json
Response:
{
    "success": true,
    "data": {
        "materias": {
            "total": 8,
            "ativas": 6,
            "concluidas": 2
        },
        "horas_estudadas": {
            "hoje_minutos": 75,
            "semana_minutos": 380,
            "mes_minutos": 1520,
            "total_minutos": 5430
        },
        "tarefas": {
            "total": 15,
            "concluidas": 10,
            "pendentes": 5,
            "percentual_conclusao": 66.7
        },
        "sequencia_dias": {
            "atual": 7,
            "melhor": 14,
            "ultima_quebra": "2025-10-10"
        },
        "sessoes": {
            "hoje": 3,
            "semana": 18,
            "media_duracao_minutos": 23.5
        }
    }
}
```

**Query SQL Exemplo:**
```sql
-- Cálculo de sequência de dias
WITH dias_estudados AS (
    SELECT DISTINCT DATE(inicio) as data
    FROM sessoes_estudo
    WHERE usuario_id = $1 AND concluida = true
    ORDER BY data DESC
)
SELECT COUNT(*) as sequencia
FROM dias_estudados
WHERE data >= CURRENT_DATE - INTERVAL '30 days';
```

**GET `/api/dashboard/atividades-recentes.php?limite=10`**
```json
Response:
{
    "success": true,
    "data": [
        {
            "tipo": "sessao",
            "titulo": "Sessão de Matemática",
            "data": "2025-10-17 14:55:00",
            "duracao": "25 min",
            "icone": "timer"
        },
        {
            "tipo": "anotacao",
            "titulo": "Resumo de Física",
            "data": "2025-10-17 10:30:00",
            "icone": "file-text"
        },
        {
            "tipo": "evento",
            "titulo": "Prova de Química",
            "data": "2025-10-20 08:00:00",
            "icone": "calendar"
        }
    ]
}
```

---

#### 3. SISTEMA DE TAREFAS (To-Do Lists)

**Por que é importante**: Frontend tem progresso de tarefas mas sem backend.

**Tabela SQL:**
```sql
CREATE TABLE tarefas (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL,
    disciplina_id INTEGER,
    titulo VARCHAR(200) NOT NULL,
    descricao TEXT,
    data_vencimento DATE,
    hora_vencimento TIME,
    prioridade VARCHAR(10) DEFAULT 'medium', -- 'low', 'medium', 'high'
    progresso INTEGER DEFAULT 0, -- 0-100
    concluida BOOLEAN DEFAULT false,
    data_conclusao TIMESTAMP,
    tags TEXT[], -- Array de tags
    anexos JSONB, -- Arquivos anexados
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (disciplina_id) REFERENCES disciplinas(id) ON DELETE SET NULL
);

CREATE INDEX idx_tarefas_usuario ON tarefas(usuario_id);
CREATE INDEX idx_tarefas_vencimento ON tarefas(data_vencimento);
CREATE INDEX idx_tarefas_concluida ON tarefas(concluida);
```

**Endpoints CRUD Completo:**

**POST `/api/tarefas/criar.php`**
```json
Request:
{
    "titulo": "Resolver lista de exercícios",
    "descricao": "Capítulos 3 e 4",
    "disciplina_id": 5,
    "data_vencimento": "2025-10-25",
    "hora_vencimento": "23:59",
    "prioridade": "high",
    "tags": ["exercicios", "matematica", "calculo"]
}

Response:
{
    "success": true,
    "data": {
        "tarefa_id": 456,
        "mensagem": "Tarefa criada com sucesso"
    }
}
```

**GET `/api/tarefas/listar.php?filtro=pendentes&disciplina_id=5`**
```json
Response:
{
    "success": true,
    "data": [
        {
            "id": 456,
            "titulo": "Resolver lista de exercícios",
            "disciplina": "Matemática",
            "data_vencimento": "2025-10-25",
            "prioridade": "high",
            "progresso": 30,
            "concluida": false,
            "dias_restantes": 8
        }
    ]
}
```

**PUT `/api/tarefas/atualizar.php`**
```json
Request:
{
    "tarefa_id": 456,
    "progresso": 75,
    "descricao": "Capítulos 3 e 4 - já fiz 15/20 exercícios"
}
```

**PUT `/api/tarefas/concluir.php`**
```json
Request:
{
    "tarefa_id": 456,
    "concluida": true
}
```

**DELETE `/api/tarefas/deletar.php`**
```json
Request:
{
    "tarefa_id": 456
}
```

---

### 🟡 PRIORIDADE MÉDIA

#### 4. RELATÓRIOS E ANÁLISES

**GET `/api/relatorios/progresso-semanal.php?semanas=4`**
```json
Response:
{
    "success": true,
    "data": {
        "semanas": [
            {
                "inicio": "2025-10-14",
                "fim": "2025-10-20",
                "minutos_estudados": 420,
                "sessoes_concluidas": 18,
                "dias_ativos": 6
            }
        ],
        "tendencia": "crescente" // ou "decrescente", "estavel"
    }
}
```

**GET `/api/relatorios/desempenho-disciplinas.php?periodo=mes`**
```json
Response:
{
    "success": true,
    "data": [
        {
            "disciplina": "Matemática",
            "tempo_total_minutos": 680,
            "sessoes": 28,
            "media_sessao_minutos": 24.3,
            "tarefas_concluidas": 12,
            "percentual_tempo": 35.2
        },
        {
            "disciplina": "Física",
            "tempo_total_minutos": 420,
            "sessoes": 17,
            "media_sessao_minutos": 24.7,
            "tarefas_concluidas": 8,
            "percentual_tempo": 21.7
        }
    ]
}
```

**GET `/api/relatorios/metas.php`**
```json
Response:
{
    "success": true,
    "data": {
        "meta_diaria_minutos": 120,
        "meta_semanal_minutos": 840,
        "progresso_hoje": {
            "minutos": 75,
            "percentual": 62.5,
            "faltam": 45
        },
        "progresso_semana": {
            "minutos": 380,
            "percentual": 45.2,
            "faltam": 460
        }
    }
}
```

---

#### 5. MELHORIAS NOS ENDPOINTS EXISTENTES

**Eventos (Calendário):**
- Adicionar suporte a eventos recorrentes
- Notificações antes do evento
- Sincronização Google Calendar (futuro)

**Disciplinas:**
- Estatísticas por disciplina
- Progresso automático baseado em tarefas
- Upload de arquivos (PDFs, imagens)

**Anotações:**
- Markdown support
- Anexar imagens
- Compartilhamento (futuro)

---

### 🟢 PRIORIDADE BAIXA (Futuras Implementações)

#### 6. GAMIFICAÇÃO
```sql
CREATE TABLE conquistas (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    titulo VARCHAR(100) NOT NULL,
    descricao TEXT,
    icone VARCHAR(50),
    data_conquista TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);
```

**Tipos de conquistas:**
- 7 dias seguidos estudando
- 100 horas totais
- Completar 50 tarefas
- Primeira sessão de focus mode

#### 7. NOTIFICAÇÕES
```sql
CREATE TABLE notificacoes (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL,
    tipo VARCHAR(30) NOT NULL,
    titulo VARCHAR(100) NOT NULL,
    mensagem TEXT,
    lida BOOLEAN DEFAULT false,
    link VARCHAR(200),
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);
```

---

## 🔧 PADRÕES DE IMPLEMENTAÇÃO

### Estrutura de Resposta JSON Padrão

**Sucesso:**
```json
{
    "success": true,
    "data": { ... },
    "message": "Operação realizada com sucesso"
}
```

**Erro:**
```json
{
    "success": false,
    "error": "Descrição do erro",
    "code": "ERRO_ESPECIFICO",
    "details": { ... } // opcional
}
```

### CORS Headers (Obrigatório em todos os arquivos)

```php
<?php
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
```

### Middleware de Autenticação

**Arquivo**: `backend/middleware/auth.php`

```php
<?php
function verificarAutenticacao($pdo) {
    $headers = getallheaders();
    
    if (!isset($headers['Authorization'])) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'error' => 'Token não fornecido',
            'code' => 'NO_TOKEN'
        ]);
        exit();
    }
    
    $token = str_replace('Bearer ', '', $headers['Authorization']);
    
    $stmt = $pdo->prepare("
        SELECT id, nome, email 
        FROM usuarios 
        WHERE token = ? AND token_expiracao > NOW()
    ");
    $stmt->execute([$token]);
    $usuario = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$usuario) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'error' => 'Token inválido ou expirado',
            'code' => 'INVALID_TOKEN'
        ]);
        exit();
    }
    
    return $usuario;
}
```

### Tratamento de Erros Padronizado

```php
<?php
try {
    // ... código principal
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Erro no banco de dados',
        'code' => 'DB_ERROR',
        'details' => $e->getMessage() // apenas em dev
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Erro interno do servidor',
        'code' => 'SERVER_ERROR'
    ]);
}
```

---

## 📁 ESTRUTURA DE DIRETÓRIOS RECOMENDADA

```
backend/
├── config/
│   └── database.php          # Conexão PDO
├── middleware/
│   └── auth.php              # Verificação de token
├── api/
│   ├── auth/
│   │   ├── login.php
│   │   └── register.php
│   ├── sessoes/
│   │   ├── iniciar.php       # ⭐ NOVO
│   │   ├── finalizar.php     # ⭐ NOVO
│   │   ├── ativas.php        # ⭐ NOVO
│   │   └── historico.php     # ⭐ NOVO
│   ├── dashboard/
│   │   ├── estatisticas.php  # ⭐ NOVO
│   │   └── atividades.php    # ⭐ NOVO
│   ├── tarefas/
│   │   ├── criar.php         # ⭐ NOVO
│   │   ├── listar.php        # ⭐ NOVO
│   │   ├── atualizar.php     # ⭐ NOVO
│   │   ├── concluir.php      # ⭐ NOVO
│   │   └── deletar.php       # ⭐ NOVO
│   ├── relatorios/
│   │   ├── progresso-semanal.php  # ⭐ NOVO
│   │   └── desempenho-disciplinas.php  # ⭐ NOVO
│   ├── disciplinas/
│   │   └── ... (já existe)
│   ├── eventos/
│   │   └── ... (já existe)
│   └── anotacoes/
│       └── ... (já existe)
└── uploads/                  # Para arquivos futuros
```

---

## 📝 CHECKLIST DE IMPLEMENTAÇÃO

### 🔥 Fase 1: Crítico (Fazer AGORA)
- [ ] Criar tabela `sessoes_estudo`
- [ ] Criar tabela `estatisticas_diarias`
- [ ] Implementar `POST /api/sessoes/iniciar.php`
- [ ] Implementar `POST /api/sessoes/finalizar.php`
- [ ] Implementar `GET /api/sessoes/ativas.php`
- [ ] Implementar `GET /api/sessoes/historico.php`
- [ ] Implementar `GET /api/dashboard/estatisticas.php`
- [ ] Implementar `GET /api/dashboard/atividades-recentes.php`
- [ ] Criar tabela `tarefas`
- [ ] Implementar CRUD completo de tarefas (5 endpoints)

### 🟡 Fase 2: Importante
- [ ] Implementar relatórios semanais
- [ ] Implementar desempenho por disciplina
- [ ] Implementar sistema de metas
- [ ] Adicionar upload de arquivos
- [ ] Melhorar endpoints de disciplinas

### 🟢 Fase 3: Melhorias Futuras
- [ ] Sistema de conquistas
- [ ] Notificações
- [ ] Eventos recorrentes
- [ ] Compartilhamento de anotações

---

## 🎨 INTEGRAÇÃO FRONTEND ↔️ BACKEND

### Exemplo: Dashboard Statistics

**Frontend (React):**
```typescript
// src/pages/Dashboard.tsx
useEffect(() => {
    const fetchStats = async () => {
        const response = await fetch('http://localhost:8000/api/dashboard/estatisticas.php', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        setStats(data.data);
    };
    fetchStats();
}, []);
```

**Backend (PHP):**
```php
// backend/api/dashboard/estatisticas.php
<?php
require_once '../../config/database.php';
require_once '../../middleware/auth.php';

// CORS
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Content-Type: application/json');

$usuario = verificarAutenticacao($pdo);

// Calcular estatísticas
$stats = [
    'materias' => calcularMaterias($pdo, $usuario['id']),
    'horas_estudadas' => calcularHoras($pdo, $usuario['id']),
    'tarefas' => calcularTarefas($pdo, $usuario['id']),
    'sequencia_dias' => calcularSequencia($pdo, $usuario['id'])
];

echo json_encode([
    'success' => true,
    'data' => $stats
]);
```

---

## 💡 SUGESTÕES E MELHORIAS

### 1. **Backup Automático**
Implementar rotina diária de backup do PostgreSQL:
```bash
pg_dump skillium_db > backup_$(date +%Y%m%d).sql
```

### 2. **Rate Limiting**
Adicionar controle de requisições por IP/usuário para evitar abuso:
```php
// Limite: 100 req/minuto por usuário
$redis->incr("rate_limit:$usuario_id");
$redis->expire("rate_limit:$usuario_id", 60);
```

### 3. **Cache de Estatísticas**
Cachear dados do dashboard por 5 minutos para melhorar performance:
```php
$cache_key = "stats:$usuario_id";
$cached = $redis->get($cache_key);
if ($cached) {
    echo $cached;
    exit;
}
// ... calcular stats
$redis->setex($cache_key, 300, json_encode($stats));
```

### 4. **Webhooks para Integrações Futuras**
Preparar estrutura para Google Calendar, Notion, etc:
```sql
CREATE TABLE webhooks (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NOT NULL,
    servico VARCHAR(50) NOT NULL,
    url TEXT NOT NULL,
    eventos TEXT[] NOT NULL,
    ativo BOOLEAN DEFAULT true
);
```

### 5. **Logs de Auditoria**
Rastrear ações importantes:
```sql
CREATE TABLE logs_auditoria (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER,
    acao VARCHAR(50) NOT NULL,
    detalhes JSONB,
    ip VARCHAR(45),
    data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 6. **Exportação de Dados**
Permitir usuário baixar seus dados (LGPD):
```php
// GET /api/usuario/exportar-dados.php
// Retorna JSON/CSV com todos os dados do usuário
```

### 7. **Modo Offline (PWA)**
Preparar frontend para funcionar offline e sincronizar depois:
- Service Workers
- IndexedDB local
- Sync quando voltar online

### 8. **Dark Mode no Backend**
Salvar preferência de tema:
```sql
ALTER TABLE usuarios ADD COLUMN tema VARCHAR(10) DEFAULT 'light';
```

---

## 🚀 CRONOGRAMA SUGERIDO (1 MÊS)

### Semana 1 (17/10 - 23/10)
- Sessões de estudo (4 endpoints)
- Estatísticas do dashboard (2 endpoints)
- ✅ **Meta**: Timer funcionando com persistência

### Semana 2 (24/10 - 30/10)
- Sistema de tarefas completo (5 endpoints)
- Integração frontend ↔️ backend
- ✅ **Meta**: Dashboard com dados reais

### Semana 3 (31/10 - 06/11)
- Relatórios e análises
- Melhorias nos endpoints existentes
- ✅ **Meta**: Sistema completo funcionando

### Semana 4 (07/11 - 13/11)
- Testes intensivos
- Correções de bugs
- Documentação final
- ✅ **Meta**: Projeto pronto para apresentação

---

## 📞 OBSERVAÇÕES IMPORTANTES

1. **Todas as queries devem usar prepared statements** para evitar SQL injection
2. **Sempre validar dados de entrada** antes de inserir no banco
3. **Timestamps em UTC**, converter no frontend se necessário
4. **Senhas sempre com `password_hash()`**, nunca plain text
5. **Tokens JWT** com expiração de 7 dias
6. **Logs de erro** em arquivo separado, não no response JSON
7. **Versionamento da API**: Considerar `/api/v1/` para futuras versões

---

## 🎯 PRIORIDADE DE DESENVOLVIMENTO

**COMECE POR AQUI (na ordem):**

1. ⭐ Tabela `sessoes_estudo`
2. ⭐ Tabela `estatisticas_diarias`  
3. ⭐ POST `/api/sessoes/iniciar.php`
4. ⭐ POST `/api/sessoes/finalizar.php`
5. ⭐ GET `/api/dashboard/estatisticas.php`
6. ⭐ Tabela `tarefas`
7. ⭐ CRUD completo de tarefas

**Isso dará ao frontend os dados essenciais para funcionar completamente!**

---

## 📖 REFERÊNCIAS ÚTEIS

- [PHP PDO Documentation](https://www.php.net/manual/en/book.pdo.php)
- [PostgreSQL Date/Time Functions](https://www.postgresql.org/docs/current/functions-datetime.html)
- [JWT Best Practices](https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/)
- [REST API Design](https://restfulapi.net/)

---

**Última atualização**: 17/10/2025 - Versão 2.0
**Status**: Pronto para implementação da Fase 1 🚀
