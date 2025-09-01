<template>
  <div class="dashboard-professional ultra-modern-layout">
    <!-- En-tête -->
    <div class="dashboard-header-professional ultra-modern-card">
      <div class="header-content">
        <div class="header-info">
          <h1 class="page-title ultra-modern-text-gradient">Tableau de bord administrateur</h1>
          <p class="page-subtitle ultra-modern-text-secondary">
            Vue d'ensemble de la plateforme et gestion globale
          </p>
        </div>
        
        <div class="header-actions">
          <button @click="refreshData" class="ultra-modern-btn ultra-modern-btn-secondary" :disabled="isRefreshing">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" :class="{ spinning: isRefreshing }" style="width: 1.25rem; height: 1.25rem;">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            {{ isRefreshing ? 'Actualisation...' : 'Actualiser' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Métriques principales -->
    <div class="metrics-section">
      <div class="metrics-grid">
        <div class="metric-card ultra-modern-card ultra-modern-animate-fade-scale users" :style="{ animationDelay: '0s' }">
          <div class="metric-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.196-2.121L17 20zM9 6a3 3 0 106 0v1H9V6zM7 21h10a2 2 0 002-2V9a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
          </div>
          <div class="metric-content">
            <div class="metric-number ultra-modern-text-primary">{{ stats?.totalUsers || 0 }}</div>
            <div class="metric-label ultra-modern-text-secondary">Utilisateurs totaux</div>
            <div class="metric-change positive">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                <polyline points="17 6 23 6 23 12"/>
              </svg>
              <span class="ultra-modern-text-muted">+{{ stats?.newUsersThisMonth || 0 }} ce mois</span>
            </div>
          </div>
        </div>
        
        <div class="metric-card ultra-modern-card ultra-modern-animate-fade-scale managers" :style="{ animationDelay: '0.1s' }">
          <div class="metric-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
            </svg>
          </div>
          <div class="metric-content">
            <div class="metric-number ultra-modern-text-primary">{{ stats?.totalManagers || 0 }}</div>
            <div class="metric-label ultra-modern-text-secondary">Managers actifs</div>
            <div class="metric-detail">
              <span class="ultra-modern-badge ultra-modern-badge-warning">{{ stats?.pendingManagers || 0 }} en attente</span>
            </div>
          </div>
        </div>
        
        <div class="metric-card ultra-modern-card ultra-modern-animate-fade-scale properties" :style="{ animationDelay: '0.2s' }">
          <div class="metric-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
          </div>
          <div class="metric-content">
            <div class="metric-number ultra-modern-text-primary">{{ stats?.totalProperties || 0 }}</div>
            <div class="metric-label ultra-modern-text-secondary">Propriétés</div>
            <div class="metric-change positive">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                <polyline points="17 6 23 6 23 12"/>
              </svg>
              <span class="ultra-modern-text-muted">+{{ stats?.newPropertiesThisMonth || 0 }} ce mois</span>
            </div>
          </div>
        </div>
        
        <div class="metric-card ultra-modern-card ultra-modern-animate-fade-scale revenue" :style="{ animationDelay: '0.3s' }">
          <div class="metric-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="12" y1="1" x2="12" y2="23"/>
              <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
            </svg>
          </div>
          <div class="metric-content">
            <div class="metric-number ultra-modern-text-gradient">{{ formatCurrency(stats?.totalRevenue || 0) }}</div>
            <div class="metric-label ultra-modern-text-secondary">Revenus totaux</div>
            <div class="metric-change positive">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                <polyline points="17 6 23 6 23 12"/>
              </svg>
              <span class="ultra-modern-text-muted">+{{ formatCurrency(stats?.revenueThisMonth || 0) }} ce mois</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Actions rapides -->
    <div class="quick-actions-section">
      <h2 class="section-title">Actions rapides</h2>
      <div class="actions-grid">
        <router-link to="/admin/pending-managers" class="action-card " v-if="stats?.pendingManagers > 0" :style="{ animationDelay: '0s' }">
          <div class="action-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 6v6l4 2"/>
            </svg>
          </div>
          <div class="action-content">
            <h3>Managers en attente</h3>
            <p>{{ stats.pendingManagers }} demandes à traiter</p>
            <div class="action-badge urgent">Urgent</div>
          </div>
        </router-link>
        
        <router-link to="/admin/users" class="action-card" :style="{ animationDelay: '0.1s' }">
          <div class="action-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
            </svg>
          </div>
          <div class="action-content">
            <h3>Gestion des utilisateurs</h3>
            <p>Gérer tous les comptes utilisateurs</p>
          </div>
        </router-link>
        
        <router-link to="/admin/properties" class="action-card" :style="{ animationDelay: '0.2s' }">
          <div class="action-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
            </svg>
          </div>
          <div class="action-content">
            <h3>Vue d'ensemble des propriétés</h3>
            <p>Surveiller toutes les propriétés</p>
          </div>
        </router-link>
        
        <router-link to="/admin/reports" class="action-card" :style="{ animationDelay: '0.3s' }">
          <div class="action-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
          </div>
          <div class="action-content">
            <h3>Rapports et analyses</h3>
            <p>Statistiques détaillées</p>
          </div>
        </router-link>
      </div>
    </div>

    <!-- Graphiques et analyses -->
    <div class="analytics-section">
      <div class="analytics-grid">
        <!-- Graphique des inscriptions -->
        <div class="chart-card">
          <div class="chart-header">
            <h3>Inscriptions par mois</h3>
            <div class="chart-period">
              <select v-model="chartPeriod" @change="updateCharts">
                <option value="6months">6 derniers mois</option>
                <option value="year">Cette année</option>
                <option value="all">Toutes les données</option>
              </select>
            </div>
          </div>
          <div class="chart-content">
            <canvas ref="registrationsChart" class="chart-canvas"></canvas>
          </div>
        </div>
        
        <!-- Répartition des types de propriétés -->
        <div class="chart-card">
          <div class="chart-header">
            <h3>Types de propriétés</h3>
          </div>
          <div class="chart-content">
            <div class="property-types-chart">
              <div class="property-type-item" v-for="type in propertyTypesData" :key="type.type">
                <div class="type-info">
                  <div class="type-color" :style="{ backgroundColor: type.color }"></div>
                  <span class="type-label">{{ type.label }}</span>
                </div>
                <div class="type-stats">
                  <span class="type-count">{{ type.count }}</span>
                  <span class="type-percentage">{{ type.percentage }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Activité récente -->
        <div class="activity-card">
          <div class="activity-header">
            <h3>Activité récente</h3>
            <router-link to="/admin/users" class="view-all-link">Voir tout</router-link>
          </div>
          <div class="activity-content">
            <div class="activity-list">
              <div 
                v-for="activity in recentActivities" 
                :key="activity.id" 
                class="activity-item"
                :class="activity.type"
              >
                <div class="activity-icon">
                  <svg v-if="activity.type === 'user_registered'" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
                  </svg>
                  <svg v-else-if="activity.type === 'property_added'" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                  </svg>
                  <svg v-else-if="activity.type === 'booking_created'" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                </div>
                <div class="activity-content">
                  <div class="activity-title">{{ activity.title }}</div>
                  <div class="activity-description">{{ activity.description }}</div>
                  <div class="activity-time">{{ formatRelativeTime(activity.timestamp) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Alertes et notifications -->
    <div class="alerts-section" v-if="alerts.length > 0">
      <h2 class="section-title">Alertes système</h2>
      <div class="alerts-list">
        <div 
          v-for="alert in alerts" 
          :key="alert.id" 
          class="alert-item"
          :class="alert.severity"
        >
          <div class="alert-icon">
            <svg v-if="alert.severity === 'high'" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
            </svg>
            <svg v-else-if="alert.severity === 'medium'" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 16v-4"/>
              <path d="M12 8h.01"/>
            </svg>
          </div>
          <div class="alert-content">
            <div class="alert-title">{{ alert.title }}</div>
            <div class="alert-description">{{ alert.description }}</div>
            <div class="alert-actions" v-if="alert.actions">
              <button 
                v-for="action in alert.actions" 
                :key="action.label"
                @click="handleAlertAction(action)"
                class="alert-action-btn"
                :class="action.type"
              >
                {{ action.label }}
              </button>
            </div>
          </div>
          <button @click="dismissAlert(alert.id)" class="alert-dismiss">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAdminStore } from '../../stores/admin'
import { useRouter } from 'vue-router'

// Router
const router = useRouter()

// État local
const isRefreshing = ref(false)
const chartPeriod = ref('6months')
const registrationsChart = ref<HTMLCanvasElement>()
const dismissedAlerts = ref<number[]>([])

// Store Admin
const adminStore = useAdminStore()

// Statistiques consommées depuis l'API (via le store)
const stats = computed(() => ({
  totalUsers: adminStore.stats?.total_users ?? 0,
  newUsersThisMonth: 0,
  totalManagers: adminStore.stats?.total_managers ?? 0,
  pendingManagers: adminStore.stats?.pending_managers ?? 0,
  totalProperties: adminStore.stats?.total_properties ?? 0,
  newPropertiesThisMonth: 0,
  totalRevenue: adminStore.stats?.total_revenue ?? 0,
  revenueThisMonth: adminStore.monthlyStats?.revenue?.length
    ? adminStore.monthlyStats.revenue[adminStore.monthlyStats.revenue.length - 1].total
    : 0
}))

// Répartition des types de propriétés depuis l'API (via le store)
const propertyTypesData = computed(() => {
  const distribution = adminStore.propertiesData?.type_distribution || []
  const labelMap: Record<string, string> = {
    apartment: 'Appartements',
    house: 'Maisons',
    office: 'Bureaux'
  }
  const colorMap: Record<string, string> = {
    apartment: '#00e5ff',
    house: '#10f54c',
    office: '#ff6b35'
  }
  return distribution.map(d => ({
    type: d.type,
    label: labelMap[d.type] ?? d.type,
    count: d.count,
    percentage: d.percentage,
    color: colorMap[d.type] ?? '#00e5ff'
  }))
})

const recentActivities = ref([
  {
    id: 1,
    type: 'user_registered',
    title: 'Nouvel utilisateur',
    description: 'Marie Dubois s\'est inscrite en tant que client',
    timestamp: new Date(Date.now() - 5 * 60000) // 5 minutes ago
  },
  {
    id: 2,
    type: 'property_added',
    title: 'Nouvelle propriété',
    description: 'Appartement moderne ajouté par Pierre Martin',
    timestamp: new Date(Date.now() - 15 * 60000) // 15 minutes ago
  },
  {
    id: 3,
    type: 'booking_created',
    title: 'Nouvelle réservation',
    description: 'Réservation de 3 nuits pour 450€',
    timestamp: new Date(Date.now() - 30 * 60000) // 30 minutes ago
  },
  {
    id: 4,
    type: 'user_registered',
    title: 'Demande manager',
    description: 'Jean Dupont demande un compte manager',
    timestamp: new Date(Date.now() - 60 * 60000) // 1 hour ago
  }
])

const alerts = computed(() => {
  const alertsList = []
  
  // Alerte pour les managers en attente
  if (stats.value.pendingManagers > 0 && !dismissedAlerts.value.includes(1)) {
    alertsList.push({
      id: 1,
      severity: 'high',
      title: 'Managers en attente',
      description: `${stats.value.pendingManagers} demande${stats.value.pendingManagers > 1 ? 's' : ''} de comptes manager nécessitent votre approbation`,
      actions: [
        { label: 'Voir les demandes', type: 'primary', route: '/admin/pending-managers' }
      ]
    })
  }
  
  // Alerte pour la maintenance (exemple statique)
  if (!dismissedAlerts.value.includes(2)) {
    alertsList.push({
      id: 2,
      severity: 'medium',
      title: 'Maintenance serveur',
      description: 'Maintenance programmée le 15/01 de 2h à 4h du matin',
      actions: [
        { label: 'Programmer rappel', type: 'secondary' }
      ]
    })
  }
  
  return alertsList
})

// Computed supprimé car inutilisé

// Méthodes
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

const formatRelativeTime = (date: Date) => {
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
  
  if (diffInMinutes < 1) return 'À l\'instant'
  if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `Il y a ${diffInHours}h`
  
  const diffInDays = Math.floor(diffInHours / 24)
  return `Il y a ${diffInDays} jour${diffInDays > 1 ? 's' : ''}`
}

const refreshData = async () => {
  isRefreshing.value = true
  try {
    await Promise.all([
      adminStore.fetchDashboard(),
      adminStore.fetchPropertiesData()
    ])
  } catch (error) {
    console.error('Erreur lors de l\'actualisation:', error)
  } finally {
    isRefreshing.value = false
  }
}

const updateCharts = () => {
  // Mettre à jour les graphiques selon la période sélectionnée
  console.log('Mise à jour des graphiques pour la période:', chartPeriod.value)
}

interface AlertAction {
  label: string
  type: string
  route?: string
}

const handleAlertAction = (action: AlertAction) => {
  if (action.route) {
    // Navigation vers la route spécifiée
    router.push(action.route)
  } else if (action.label === 'Programmer rappel') {
    // Ouvrir une modal ou notification pour programmer un rappel
    alert('Fonctionnalité de rappel à implémenter : un rappel sera envoyé 30 minutes avant la maintenance.')
  } else {
    // Exécuter l'action spécifiée
    console.log('Action exécutée:', action.label)
  }
}

const dismissAlert = (alertId: number) => {
  dismissedAlerts.value.push(alertId)
}

const initCharts = () => {
  // Initialiser les graphiques (Chart.js ou autre librairie)
  if (registrationsChart.value) {
    console.log('Initialisation du graphique des inscriptions')
    // Ici on initialiserait Chart.js ou une autre librairie de graphiques
  }
}

// Lifecycle
onMounted(async () => {
  try {
    await Promise.all([
      adminStore.fetchDashboard(),
      adminStore.fetchPropertiesData()
    ])
    setTimeout(initCharts, 100)
  } catch (error) {
    console.error('Erreur lors du chargement du dashboard:', error)
  }
})
</script>

<style scoped>
@import url('../../assets/dashboard-professional.css');

.dashboard-professional {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%);
  padding: 2rem;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
}

.dashboard-header-professional {
  background: linear-gradient(145deg, #ffffff 0%, #f1f5f9 100%);
  border: 1px solid #e2e8f0;
  border-radius: var(--border-radius-large);
  padding: 2.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 900;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #a855f7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.02em;
}

.page-subtitle {
  font-size: 1.125rem;
  color: var(--text-secondary);
  margin: 0;
  font-weight: 400;
}

.refresh-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background: var(--pure-white);
  border: 2px solid var(--primary-color);
  border-radius: var(--border-radius-medium);
  color: var(--primary-color);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition-smooth);
  box-shadow: 0 2px 4px rgba(67, 0, 255, 0.1);
}

.refresh-btn:hover:not(:disabled) {
  background: var(--primary-color);
  color: var(--pure-white);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(67, 0, 255, 0.2);
}

.refresh-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.refresh-btn svg {
  width: 1.25rem;
  height: 1.25rem;
  stroke: currentColor;
  transition: transform 0.5s ease;
}

.refresh-btn svg.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.metrics-section {
  margin-bottom: 2rem;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.metric-card {
  background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid #e2e8f0;
  border-radius: var(--border-radius-large);
  padding: 2rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  animation: fade-in-up 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(30px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.metric-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.15), 0 8px 12px rgba(0, 0, 0, 0.1);
  border-color: #4f46e5;
}

@keyframes fade-in-up {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.metric-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  border-radius: var(--border-radius-large) var(--border-radius-large) 0 0;
}

.metric-card.users::before {
  background: var(--primary-color);
}

.metric-card.managers::before {
  background: var(--secondary-color);
}

.metric-card.properties::before {
  background: var(--tertiary-color);
}

.metric-card.revenue::before {
  background: var(--accent-color);
}

.metric-icon {
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.metric-card.users .metric-icon {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
}

.metric-card.managers .metric-icon {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  box-shadow: 0 0 20px rgba(245, 158, 11, 0.5);
}

.metric-card.properties .metric-icon {
  background: linear-gradient(135deg, #10b981, #059669);
  box-shadow: 0 0 20px rgba(16, 185, 129, 0.5);
}

.metric-card.revenue .metric-icon {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
}

.metric-icon svg {
  width: 1.5rem;
  height: 1.5rem;
  stroke: white;
}

.metric-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  line-height: 1;
}

.metric-label {
  font-size: 1rem;
  color: var(--text-secondary);
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
}

.metric-change {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
}

.metric-change.positive {
  color: var(--emerald-green);
}

.metric-change svg {
  width: 1rem;
  height: 1rem;
  stroke: currentColor;
}

.metric-detail {
  margin-top: 0.5rem;
}

.pending-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  background: rgba(245, 158, 11, 0.1);
  color: var(--golden-yellow);
  border: 1px solid rgba(245, 158, 11, 0.3);
  border-radius: var(--border-radius-small);
  font-size: 0.75rem;
  font-weight: 600;
  animation: pending-pulse 2s ease-in-out infinite;
}

@keyframes pending-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.quick-actions-section,
.analytics-section,
.alerts-section {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.section-title::before {
  content: '';
  width: 4px;
  height: 1.5rem;
  background: var(--primary-color);
  border-radius: 2px;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.action-card {
  background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid #e2e8f0;
  border-radius: var(--border-radius-large);
  padding: 2rem;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 1.5rem;
  position: relative;
  animation: fade-in-up 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(30px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.action-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.15), 0 8px 12px rgba(0, 0, 0, 0.1);
  border-color: #4f46e5;
  text-decoration: none;
}

.action-card.urgent {
  border-color: #ef4444;
  background: linear-gradient(145deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.05));
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.15);
  animation: urgent-glow 2s ease-in-out infinite alternate;
}

@keyframes urgent-glow {
  0% { 
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.15);
    border-color: #ef4444;
  }
  100% { 
    box-shadow: 0 8px 32px rgba(239, 68, 68, 0.5), 0 0 20px rgba(239, 68, 68, 0.3);
    border-color: #dc2626;
  }
}

.action-icon {
  width: 3rem;
  height: 3rem;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
}

.action-card.urgent .action-icon {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  box-shadow: 0 0 20px rgba(239, 68, 68, 0.5);
}

.action-icon svg {
  width: 1.5rem;
  height: 1.5rem;
  stroke: white;
}

.action-content h3 {
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  font-size: 1.125rem;
  font-weight: 600;
}

.action-content p {
  color: var(--text-secondary);
  margin: 0;
  font-size: 0.875rem;
}

.action-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.25rem 0.75rem;
  border-radius: var(--border-radius-small);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.action-badge.urgent {
  background: var(--coral-red);
  color: white;
  animation: badge-pulse 1.5s ease-in-out infinite;
}

@keyframes badge-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.analytics-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 1.5rem;
}

.chart-card,
.activity-card {
  background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid #e2e8f0;
  border-radius: var(--border-radius-large);
  padding: 2rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.chart-card:hover,
.activity-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.15), 0 8px 12px rgba(0, 0, 0, 0.1);
  border-color: #4f46e5;
}

.chart-header,
.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--medium-gray);
}

.chart-header h3,
.activity-header h3 {
  color: var(--text-primary);
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
}

.chart-period select {
  background: var(--glass-bg-light);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-small);
  color: var(--text-primary);
  padding: 0.5rem;
  font-size: 0.875rem;
}

.view-all-link {
  color: var(--electric-blue);
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 600;
  transition: var(--transition-smooth);
}

.view-all-link:hover {
  color: var(--neon-cyan);
  text-shadow: 0 0 10px var(--neon-cyan);
}

.chart-canvas {
  width: 100%;
  height: 300px;
  background: var(--glass-bg-light);
  border-radius: var(--border-radius-medium);
}

.property-types-chart {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.property-type-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: var(--glass-bg-light);
  border-radius: var(--border-radius-medium);
  transition: var(--transition-smooth);
}

.property-type-item:hover {
  background: var(--glass-bg-medium);
  transform: translateX(5px);
}

.type-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.type-color {
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
}

.type-label {
  font-weight: 600;
  color: var(--text-primary);
}

.type-stats {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
}

.type-count {
  font-weight: 700;
  color: var(--text-primary);
  font-size: 1.125rem;
}

.type-percentage {
  font-size: 0.875rem;
  color: var(--text-muted);
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--light-gray);
  border-radius: var(--border-radius-medium);
  transition: var(--transition-smooth);
  border: 1px solid transparent;
}

.activity-item:hover {
  background: var(--pure-white);
  border-color: var(--primary-color);
  transform: translateX(3px);
}

.activity-icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.activity-item.user_registered .activity-icon {
  background: rgba(0, 229, 255, 0.1);
  color: var(--electric-blue);
}

.activity-item.property_added .activity-icon {
  background: rgba(16, 242, 76, 0.1);
  color: var(--acid-green);
}

.activity-item.booking_created .activity-icon {
  background: rgba(255, 165, 0, 0.1);
  color: var(--solar-orange);
}

.activity-icon svg {
  width: 1.25rem;
  height: 1.25rem;
  stroke: currentColor;
}

.activity-title {
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
}

.activity-description {
  color: var(--text-secondary);
  font-size: 0.75rem;
  margin-bottom: 0.25rem;
}

.activity-time {
  color: var(--text-muted);
  font-size: 0.75rem;
}

.alerts-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.alert-item {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  background: var(--pure-white);
  border: 1px solid var(--medium-gray);
  border-radius: var(--border-radius-large);
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.alert-item.high {
  border-color: var(--coral-red);
  background: rgba(239, 68, 68, 0.03);
}

.alert-item.medium {
  border-color: var(--golden-yellow);
  background: rgba(245, 158, 11, 0.03);
}

.alert-item.low {
  border-color: var(--secondary-color);
  background: rgba(0, 101, 248, 0.03);
}

.alert-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.alert-item.high .alert-icon {
  background: rgba(239, 68, 68, 0.1);
  color: var(--coral-red);
}

.alert-item.medium .alert-icon {
  background: rgba(245, 158, 11, 0.1);
  color: var(--golden-yellow);
}

.alert-item.low .alert-icon {
  background: rgba(0, 101, 248, 0.1);
  color: var(--secondary-color);
}

.alert-icon svg {
  width: 1.5rem;
  height: 1.5rem;
  stroke: currentColor;
}

.alert-content {
  flex: 1;
}

.alert-title {
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  font-size: 1.125rem;
}

.alert-description {
  color: var(--text-secondary);
  margin-bottom: 1rem;
  line-height: 1.5;
}

.alert-actions {
  display: flex;
  gap: 0.75rem;
}

.alert-action-btn {
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius-small);
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: var(--transition-smooth);
  border: none;
}

.alert-action-btn.primary {
  background: var(--primary-color);
  color: white;
}

.alert-action-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(67, 0, 255, 0.2);
  background: var(--secondary-color);
}

.alert-action-btn.secondary {
  background: var(--pure-white);
  border: 1px solid var(--medium-gray);
  color: var(--text-secondary);
}

.alert-action-btn.secondary:hover {
  background: var(--light-gray);
  color: var(--text-primary);
  border-color: var(--primary-color);
}

.alert-dismiss {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: var(--border-radius-small);
  transition: var(--transition-smooth);
}

.alert-dismiss:hover {
  color: var(--text-primary);
  background: var(--glass-bg-light);
}

.alert-dismiss svg {
  width: 1.25rem;
  height: 1.25rem;
  stroke: currentColor;
}

/* Responsive */
@media (max-width: 1024px) {
  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .metrics-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
  
  .analytics-grid {
    grid-template-columns: 1fr;
  }
  
  .actions-grid {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }
}

@media (max-width: 768px) {
  .admin-dashboard {
    padding: 1rem;
  }
  
  .dashboard-header {
    padding: 1.5rem;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .metric-card {
    flex-direction: column;
    text-align: center;
  }
  
  .metric-number {
    font-size: 2rem;
  }
  
  .chart-card,
  .activity-card {
    padding: 1.5rem;
  }
  
  .action-card {
    flex-direction: column;
    text-align: center;
  }
  
  .alert-item {
    flex-direction: column;
    text-align: center;
  }
  
  .alert-actions {
    justify-content: center;
  }
}
</style>
