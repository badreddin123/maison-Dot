import apiClient from '../services/api'

export const testApiConnection = async () => {
  try {
    console.log('🔄 Test de connexion à l\'API...')
    
    // Test simple de l'API
    const response = await apiClient.get('/api/user')
    console.log('✅ API accessible:', response.status)
    return true
  } catch (error: any) {
    console.log('❌ Erreur API:', error.response?.status, error.response?.data || error.message)
    
    if (error.response?.status === 401) {
      console.log('ℹ️  Normal - pas d\'authentification')
      return true // 401 est normal sans token
    }
    
    return false
  }
}

export const testRegister = async () => {
  try {
    console.log('🔄 Test d\'inscription...')
    
    const testUser = {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'TestPassword123!',
      password_confirmation: 'TestPassword123!'
    }
    
    const response = await apiClient.post('/api/register', testUser)
    console.log('✅ Inscription réussie:', response.data)
    return response.data
  } catch (error: any) {
    console.log('❌ Erreur inscription:', error.response?.data || error.message)
    return null
  }
}

export const testLogin = async (email: string, password: string) => {
  try {
    console.log('🔄 Test de connexion...')
    
    const response = await apiClient.post('/api/login', {
      email,
      password
    })
    
    console.log('✅ Connexion réussie:', response.data)
    return response.data
  } catch (error: any) {
    console.log('❌ Erreur connexion:', error.response?.data || error.message)
    return null
  }
}
