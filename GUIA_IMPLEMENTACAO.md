# 📚 Guia de Implementação - Skillium

Este guia explica como integrar o frontend React com seu backend PHP/PostgreSQL.

## 🎯 Visão Geral

O Skillium é uma plataforma completa de estudos que agora possui:
- ✅ Sistema de Modo Foco com alertas sonoros
- ✅ Sidebar responsiva e profissional
- ✅ Tela de login impressionante
- ✅ Gerenciamento de estado global (FocusModeContext)
- ✅ Design system completo com gradientes e animações

## 📁 Estrutura de Arquivos

```
frontend/                 # Seu projeto React
├── src/
│   ├── components/
│   │   └── layout/
│   │       ├── AppLayout.tsx      # Layout principal com sidebar
│   │       └── AppSidebar.tsx     # Sidebar com modo foco
│   ├── contexts/
│   │   ├── AuthContext.tsx        # Gerenciamento de autenticação
│   │   └── FocusModeContext.tsx   # Gerenciamento do modo foco
│   ├── hooks/
│   │   └── useFocusMode.tsx       # Hook para alertas de foco
│   ├── pages/
│   │   ├── Login.tsx              # Página de login/cadastro
│   │   ├── Dashboard.tsx
│   │   ├── Calendar.tsx
│   │   ├── Subjects.tsx
│   │   ├── Timer.tsx
│   │   └── Notes.tsx
│   └── config/
│       └── api.ts                 # Configuração da API
└── public/
    └── focus-alert.mp3            # Alerta sonoro do modo foco

backend/                 # Seu backend PHP
├── api/
│   ├── auth/
│   │   ├── login.php
│   │   └── register.php
│   ├── calendar/
│   │   ├── events.php
│   │   └── create-event.php
│   ├── subjects/
│   │   ├── units.php
│   │   └── create-unit.php
│   └── config.php
└── database/
    └── conexao.php
```

## 🔧 Passo 1: Configurar CORS no Backend PHP

Adicione isto no início de **TODOS** os seus arquivos PHP de API:

```php
<?php
// Permitir requisições do frontend
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json; charset=utf-8');

// Responder a requisições OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
```

### Exemplo completo de endpoint PHP:

**backend/api/auth/login.php**
```php
<?php
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../database/conexao.php';

try {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['email']) || !isset($data['password'])) {
        echo json_encode([
            'sucesso' => false,
            'mensagem' => 'Email e senha são obrigatórios'
        ]);
        exit();
    }

    $email = $data['email'];
    $password = $data['password'];

    // Buscar usuário no banco
    $stmt = $pdo->prepare("SELECT * FROM usuarios WHERE email = :email");
    $stmt->execute(['email' => $email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user || !password_verify($password, $user['senha'])) {
        echo json_encode([
            'sucesso' => false,
            'mensagem' => 'Credenciais inválidas'
        ]);
        exit();
    }

    // Gerar token (você pode usar JWT aqui)
    $token = bin2hex(random_bytes(32));
    
    // Salvar token no banco
    $stmt = $pdo->prepare("UPDATE usuarios SET token = :token WHERE id = :id");
    $stmt->execute(['token' => $token, 'id' => $user['id']]);

    echo json_encode([
        'sucesso' => true,
        'mensagem' => 'Login realizado com sucesso',
        'dados' => [
            'token' => $token,
            'usuario' => [
                'id' => $user['id'],
                'nome' => $user['nome'],
                'email' => $user['email']
            ]
        ]
    ]);

} catch (Exception $e) {
    echo json_encode([
        'sucesso' => false,
        'mensagem' => 'Erro no servidor: ' . $e->getMessage()
    ]);
}
```

## 🔧 Passo 2: Configurar o Frontend

### 2.1 Arquivo de Configuração da API

O arquivo `src/config/api.ts` já está criado. Você só precisa ajustar a URL base:

```typescript
// src/config/api.ts
const API_BASE_URL = 'http://localhost/seu-projeto/backend/api';
// Ajuste para o caminho correto do seu backend!
```

### 2.2 Exemplo de uso no Login

O arquivo `src/pages/Login.tsx` já está preparado. Para conectar ao backend, você precisa:

1. **Importar o apiClient:**
```typescript
import { apiClient } from "@/config/api";
```

2. **Atualizar a função handleSignIn:**
```typescript
const handleSignIn = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  
  try {
    const response = await apiClient.post('/auth/login.php', {
      email: signInData.email,
      password: signInData.password
    });

    if (response.sucesso) {
      // Salvar token e dados do usuário
      localStorage.setItem('token', response.dados.token);
      localStorage.setItem('user', JSON.stringify(response.dados.usuario));
      
      toast.success(response.mensagem);
      navigate("/dashboard");
    } else {
      toast.error(response.mensagem);
    }
  } catch (error) {
    toast.error('Erro ao fazer login. Tente novamente.');
    console.error('Erro:', error);
  } finally {
    setLoading(false);
  }
};
```

3. **Atualizar a função handleSignUp:**
```typescript
const handleSignUp = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  
  try {
    const response = await apiClient.post('/auth/register.php', {
      nome: signUpData.name,
      email: signUpData.email,
      password: signUpData.password
    });

    if (response.sucesso) {
      toast.success(response.mensagem);
      // Opcional: fazer login automático
    } else {
      toast.error(response.mensagem);
    }
  } catch (error) {
    toast.error('Erro ao criar conta. Tente novamente.');
    console.error('Erro:', error);
  } finally {
    setLoading(false);
  }
};
```

## 🔧 Passo 3: Usar o AuthContext

Para acessar dados do usuário em qualquer componente:

```typescript
import { useAuth } from "@/contexts/AuthContext";

function MeuComponente() {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <div>Você precisa fazer login</div>;
  }
  
  return (
    <div>
      <h1>Olá, {user?.nome}!</h1>
      <button onClick={logout}>Sair</button>
    </div>
  );
}
```

## 🔧 Passo 4: Proteger Rotas

Adicione um componente de rota protegida:

**src/components/ProtectedRoute.tsx**
```typescript
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}
```

**Uso no App.tsx:**
```typescript
import { ProtectedRoute } from "./components/ProtectedRoute";

// Nas rotas:
<Route path="/dashboard" element={
  <ProtectedRoute>
    <AppLayout><Dashboard /></AppLayout>
  </ProtectedRoute>
} />
```

## 🔧 Passo 5: Fazer Requisições Autenticadas

Todas as requisições após o login devem incluir o token:

```typescript
// O apiClient já está configurado para enviar o token automaticamente!

// Exemplo: Buscar eventos do calendário
const loadEvents = async () => {
  try {
    const response = await apiClient.get('/calendar/events.php');
    if (response.sucesso) {
      setEvents(response.dados);
    }
  } catch (error) {
    console.error('Erro ao carregar eventos:', error);
  }
};

// Exemplo: Criar novo evento
const createEvent = async (eventData) => {
  try {
    const response = await apiClient.post('/calendar/create-event.php', eventData);
    if (response.sucesso) {
      toast.success('Evento criado!');
      loadEvents(); // Recarregar lista
    }
  } catch (error) {
    toast.error('Erro ao criar evento');
  }
};
```

## 🔧 Passo 6: Middleware de Autenticação no Backend

Crie um arquivo para verificar o token em todas as rotas protegidas:

**backend/middleware/auth.php**
```php
<?php
function verificarAutenticacao() {
    $headers = getallheaders();
    
    if (!isset($headers['Authorization'])) {
        http_response_code(401);
        echo json_encode([
            'sucesso' => false,
            'mensagem' => 'Token não fornecido'
        ]);
        exit();
    }

    $token = str_replace('Bearer ', '', $headers['Authorization']);
    
    require_once '../database/conexao.php';
    
    $stmt = $pdo->prepare("SELECT * FROM usuarios WHERE token = :token");
    $stmt->execute(['token' => $token]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$user) {
        http_response_code(401);
        echo json_encode([
            'sucesso' => false,
            'mensagem' => 'Token inválido'
        ]);
        exit();
    }
    
    return $user;
}
```

**Uso em endpoints protegidos:**
```php
<?php
require_once '../middleware/auth.php';

$user = verificarAutenticacao();
// Agora você tem acesso aos dados do usuário!

// Continuar com a lógica do endpoint...
```

## 🎨 Funcionalidades Especiais

### Modo Foco
O Modo Foco agora está integrado na sidebar e pode ser ativado/desativado pelo usuário. Quando ativado:
- Detecta quando o usuário sai da aba por mais de 15 segundos
- Toca um alerta sonoro (`focus-alert.mp3`)
- O estado é salvo em `localStorage` e persiste entre sessões

### Persistência do Timer
O timer continua contando mesmo quando você navega para outras páginas. O estado é salvo em `localStorage` com um timestamp.

## 📊 Schema do Banco de Dados

```sql
-- Tabela de usuários
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    token VARCHAR(255),
    foto_perfil VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de eventos (calendário)
CREATE TABLE eventos (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id),
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    data_inicio TIMESTAMP NOT NULL,
    data_fim TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de disciplinas
CREATE TABLE disciplinas (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id),
    nome VARCHAR(255) NOT NULL,
    cor VARCHAR(7),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de unidades de estudo
CREATE TABLE unidades_estudo (
    id SERIAL PRIMARY KEY,
    disciplina_id INTEGER REFERENCES disciplinas(id),
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    ordem INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de anotações
CREATE TABLE anotacoes (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id),
    disciplina_id INTEGER REFERENCES disciplinas(id),
    titulo VARCHAR(255) NOT NULL,
    conteudo TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🚀 Checklist de Implementação

- [ ] 1. Configurar CORS em todos os endpoints PHP
- [ ] 2. Criar estrutura de pastas do backend
- [ ] 3. Configurar conexão com PostgreSQL
- [ ] 4. Criar tabelas no banco de dados
- [ ] 5. Implementar endpoints de autenticação (login/register)
- [ ] 6. Implementar middleware de autenticação
- [ ] 7. Ajustar `API_BASE_URL` no frontend
- [ ] 8. Testar login e cadastro
- [ ] 9. Implementar endpoints de eventos do calendário
- [ ] 10. Implementar endpoints de disciplinas
- [ ] 11. Implementar endpoints de anotações
- [ ] 12. Adicionar ProtectedRoute em todas as rotas privadas
- [ ] 13. Testar fluxo completo da aplicação
- [ ] 14. Implementar logout
- [ ] 15. Adicionar tratamento de erros e validações

## 🐛 Troubleshooting

### Erro de CORS
Se você receber erros de CORS, verifique:
1. Headers CORS estão no **topo** de todos os arquivos PHP
2. URL do frontend está correta (`http://localhost:5173`)
3. Servidor Apache/Nginx está configurado corretamente

### Token não está sendo enviado
1. Verifique se o token está salvo no localStorage: `localStorage.getItem('token')`
2. Abra as DevTools > Network e veja se o header `Authorization` está presente
3. Verifique se o `apiClient` está importado corretamente

### Requisições retornam 401
1. Verifique se o token é válido no banco
2. Confirme que o middleware `verificarAutenticacao()` está funcionando
3. Teste o token manualmente com um cliente REST (Postman/Insomnia)

## 📞 Suporte

Para mais informações sobre o frontend:
- Lovable Docs: https://docs.lovable.dev
- React Router: https://reactrouter.com
- TailwindCSS: https://tailwindcss.com

---

**Desenvolvido com ❤️ usando Skillium**
