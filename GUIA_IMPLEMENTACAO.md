# 📚 GUIA COMPLETO - SKILLIUM BACKEND
## 🔄 Instruções para o Gemini atualizar o PHP

---

## 🎯 O QUE FOI IMPLEMENTADO NO FRONTEND

✅ **Login/Cadastro** - Design moderno com sobreposição e gradientes
✅ **Dashboard** - Cards de estatísticas (precisa dados do backend)
✅ **Timer Pomodoro** - Funcional, precisa salvar sessões no backend
✅ **Modo Foco** - Alerta sonoro após 15s de inatividade (já funciona)
✅ **Sidebar** - Responsiva e colapsável
✅ **Páginas**: Calendar, Subjects, Notes, Settings

---

## 📊 SCHEMA DO BANCO - POSTGRESQL

```sql
-- 1. USUÁRIOS
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    token VARCHAR(255),
    foto_perfil VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. SESSÕES DE ESTUDO (CRÍTICO!)
CREATE TABLE sessoes_estudo (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    disciplina_id INTEGER REFERENCES disciplinas(id) ON DELETE SET NULL,
    titulo VARCHAR(255),
    duracao_segundos INTEGER NOT NULL,
    data_inicio TIMESTAMP NOT NULL,
    data_fim TIMESTAMP NOT NULL,
    tipo VARCHAR(50) DEFAULT 'pomodoro',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. DISCIPLINAS
CREATE TABLE disciplinas (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    cor VARCHAR(7) DEFAULT '#6366f1',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. EVENTOS
CREATE TABLE eventos (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    data_inicio TIMESTAMP NOT NULL,
    data_fim TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. ANOTAÇÕES
CREATE TABLE anotacoes (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    disciplina_id INTEGER REFERENCES disciplinas(id) ON DELETE SET NULL,
    titulo VARCHAR(255) NOT NULL,
    conteudo TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ÍNDICES
CREATE INDEX idx_sessoes_usuario ON sessoes_estudo(usuario_id);
CREATE INDEX idx_sessoes_data ON sessoes_estudo(data_inicio);
```

---

## 🔥 ENDPOINTS MAIS IMPORTANTES

### 1. Dashboard Stats - `GET /api/dashboard/estatisticas.php`

**Retornar:**
```json
{
  "sucesso": true,
  "dados": {
    "horas": {
      "hoje": 2.5,
      "semana": 12.3,
      "mes": 45.6,
      "total": 120.5
    },
    "streak": 7,
    "sessoes_recentes": [
      {
        "id": 1,
        "titulo": "Matemática",
        "duracao_segundos": 1500,
        "data_inicio": "2025-01-15 14:00:00"
      }
    ],
    "media_diaria": 3.2
  }
}
```

**Query SQL:**
```php
// Total de horas HOJE
SELECT COALESCE(SUM(duracao_segundos), 0) / 3600.0 as horas
FROM sessoes_estudo
WHERE usuario_id = ? AND DATE(data_inicio) = CURRENT_DATE

// Streak (dias consecutivos)
WITH dias AS (
  SELECT DISTINCT DATE(data_inicio) as dia
  FROM sessoes_estudo WHERE usuario_id = ?
  ORDER BY dia DESC
)
SELECT COUNT(*) FROM dias
WHERE dia >= CURRENT_DATE - ROW_NUMBER() OVER (ORDER BY dia DESC)
```

### 2. Criar Sessão - `POST /api/sessoes/criar.php`

**Receber:**
```json
{
  "disciplina_id": 1,
  "titulo": "Estudo de Cálculo",
  "duracao_segundos": 1500,
  "data_inicio": "2025-01-15 14:00:00",
  "data_fim": "2025-01-15 14:25:00",
  "tipo": "pomodoro"
}
```

### 3. Login - `POST /api/auth/login.php`
### 4. Registro - `POST /api/auth/register.php`
### 5. Listar Disciplinas - `GET /api/disciplinas/listar.php`

---

## ⚙️ CONFIGURAÇÃO CORS (EM TODOS OS ARQUIVOS PHP)

```php
<?php
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
```

---

## 🔐 MIDDLEWARE DE AUTENTICAÇÃO

**Arquivo: `backend/middleware/auth.php`**

```php
<?php
function verificarAutenticacao() {
    require_once __DIR__ . '/../config/database.php';
    
    $headers = getallheaders();
    if (!isset($headers['Authorization'])) {
        http_response_code(401);
        echo json_encode(['sucesso' => false, 'mensagem' => 'Token não fornecido']);
        exit();
    }
    
    $token = str_replace('Bearer ', '', $headers['Authorization']);
    
    $stmt = $pdo->prepare("SELECT * FROM usuarios WHERE token = ?");
    $stmt->execute([$token]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$user) {
        http_response_code(401);
        echo json_encode(['sucesso' => false, 'mensagem' => 'Token inválido']);
        exit();
    }
    
    return $user;
}
```

---

## 📋 CHECKLIST DE IMPLEMENTAÇÃO

- [ ] Criar todas as tabelas no PostgreSQL
- [ ] Implementar `auth/login.php` e `auth/register.php`
- [ ] Implementar `dashboard/estatisticas.php` (CRÍTICO)
- [ ] Implementar `sessoes/criar.php` (CRÍTICO)
- [ ] Implementar CRUD de disciplinas
- [ ] Implementar CRUD de eventos
- [ ] Implementar CRUD de anotações
- [ ] Adicionar CORS em todos os endpoints
- [ ] Testar todas as rotas

---

**URL do Frontend:** `http://localhost:5173`
**URL da API:** Ajustar em `src/config/api.ts`

---

✅ **Pronto para integração!**
