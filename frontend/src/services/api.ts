import axios from 'axios';

// Configuration de base pour Axios
const apiClient = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  withCredentials: false,
  timeout: 10000,
});

// Intercepteur pour les requêtes
apiClient.interceptors.request.use(
  (config) => {
    console.log('🚀 API Request:', {
      method: config.method?.toUpperCase(),
      url: config.baseURL + config.url,
      headers: config.headers,
      data: config.data
    })
    
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    console.error('❌ API Request Error:', error)
    return Promise.reject(error)
  }
)

// Intercepteur pour les réponses
apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', {
      status: response.status,
      statusText: response.statusText,
      url: response.config.url,
      data: response.data
    })
    return response
  },
  (error) => {
    console.error('❌ API Error:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      data: error.response?.data
    })
    
    // Rediriger vers login si token expiré
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token')
      window.location.href = '/login'
    }
    
    return Promise.reject(error);
  }
);

// === API USERS ===
export const usersAPI = {
  // Récupérer tous les utilisateurs
  getAll: () => apiClient.get('/api/admin/users'),
  
  // Récupérer un utilisateur par ID
  getById: (id: number) => apiClient.get(`/api/admin/users/${id}`),
  
  // Créer un nouvel utilisateur
  create: (userData: any) => apiClient.post('/api/admin/users', userData),
  
  // Mettre à jour un utilisateur
  update: (id: number, userData: any) => apiClient.put(`/api/admin/users/${id}`, userData),
  
  // Supprimer un utilisateur
  delete: (id: number) => apiClient.delete(`/api/admin/users/${id}`),
  
  // Approuver un manager
  approveManager: (id: number) => apiClient.post(`/api/admin/users/${id}/approve`),
  
  // Suspendre un utilisateur
  suspend: (id: number) => apiClient.post(`/api/admin/users/${id}/suspend`),
  
  // Activer un utilisateur
  activate: (id: number) => apiClient.post(`/api/admin/users/${id}/activate`),
  
  // Actions en lot
  bulkAction: (action: string, userIds: number[]) => 
    apiClient.post('/api/admin/users/bulk', { action, user_ids: userIds }),
  
  // Statistiques des utilisateurs
  getStats: () => apiClient.get('/api/admin/users/stats')
};

export default apiClient;
