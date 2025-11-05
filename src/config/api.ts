// Configuração da API
export const API_URL = 'https://seu-backend.com/api';

// Função para obter headers com autenticação
export const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};
