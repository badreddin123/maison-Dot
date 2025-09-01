<template>
  <div v-if="isDev" class="debug-panel">
    <button @click="togglePanel" class="debug-toggle">
      🐛 Debug
    </button>
    
    <div v-if="showPanel" class="debug-content">
      <h3>Debug Panel</h3>
      
      <div class="debug-section">
        <h4>État d'authentification</h4>
        <p>Connecté: {{ authStore.isAuthenticated ? '✅' : '❌' }}</p>
        <p>Token: {{ authStore.token ? '✅ Présent' : '❌ Absent' }}</p>
        <p>Utilisateur: {{ authStore.user?.name || 'Aucun' }}</p>
        <p>Erreur: {{ authStore.error || 'Aucune' }}</p>
        <p>Chargement: {{ authStore.isLoading ? '⏳' : '✅' }}</p>
      </div>
      
      <div class="debug-section">
        <h4>Tests API</h4>
        <button @click="testConnection" class="debug-btn">Test Connexion</button>
        <button @click="testAuth" class="debug-btn">Test Auth</button>
        <button @click="clearAuth" class="debug-btn">Clear Auth</button>
      </div>
      
      <div class="debug-section">
        <h4>Logs</h4>
        <div class="debug-logs">
          <div v-for="(log, index) in logs" :key="index" class="log-entry">
            {{ log }}
          </div>
        </div>
        <button @click="clearLogs" class="debug-btn">Clear Logs</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { testApiConnection } from '../utils/testApi'

const authStore = useAuthStore()
const isDev = process.env.NODE_ENV === 'development'
const showPanel = ref(false)
const logs = ref<string[]>([])

const addLog = (message: string) => {
  logs.value.unshift(`${new Date().toLocaleTimeString()}: ${message}`)
  if (logs.value.length > 10) {
    logs.value = logs.value.slice(0, 10)
  }
}

const togglePanel = () => {
  showPanel.value = !showPanel.value
}

const testConnection = async () => {
  addLog('Test de connexion API...')
  const result = await testApiConnection()
  addLog(`Résultat: ${result ? 'Succès' : 'Échec'}`)
}

const testAuth = async () => {
  addLog('Test d\'authentification...')
  try {
    await authStore.checkAuth()
    addLog('Check auth terminé')
  } catch (error) {
    addLog(`Erreur: ${error}`)
  }
}

const clearAuth = () => {
  localStorage.removeItem('auth_token')
  // Appeler la méthode clearAuthData si elle existe
  if (typeof authStore.clearAuthData === 'function') {
    authStore.clearAuthData()
  }
  addLog('Authentification supprimée')
}

const clearLogs = () => {
  logs.value = []
}
</script>

<script lang="ts">
export default {
  name: 'DebugPanel'
}
</script>

<style scoped>
.debug-panel {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 9999;
}

.debug-toggle {
  background: #1f2937;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.debug-content {
  position: absolute;
  top: 3rem;
  right: 0;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1rem;
  min-width: 300px;
  max-height: 400px;
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.debug-content h3 {
  margin: 0 0 1rem 0;
  font-size: 1rem;
  font-weight: 700;
  color: #1f2937;
}

.debug-section {
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.debug-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.debug-section h4 {
  margin: 0 0 0.5rem 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

.debug-section p {
  margin: 0.25rem 0;
  font-size: 0.75rem;
  color: #6b7280;
}

.debug-btn {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.25rem 0.75rem;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.75rem;
  margin-right: 0.5rem;
  margin-bottom: 0.25rem;
}

.debug-btn:hover {
  background: #2563eb;
}

.debug-logs {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  padding: 0.5rem;
  max-height: 120px;
  overflow-y: auto;
  margin-bottom: 0.5rem;
}

.log-entry {
  font-size: 0.75rem;
  color: #374151;
  margin-bottom: 0.25rem;
  font-family: monospace;
}
</style>
