<template>
  <div class="reports-view">
    <div class="container">
      <!-- Header -->
      <div class="page-header">
        <div class="header-content">
          <h1>Rapports et Analytics</h1>
          <p>Analyses complètes et rapports détaillés de la plateforme</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-secondary" @click="refreshData">
            <span class="icon">🔄</span>
            Actualiser
          </button>
          <button class="btn btn-primary" @click="generateReport">
            <span class="icon">📊</span>
            Générer Rapport
          </button>
        </div>
      </div>

      <!-- Période de rapport -->
      <div class="report-period-section">
        <div class="period-selector">
          <h3>Période d'analyse</h3>
          <div class="period-options">
            <button 
              v-for="period in periodOptions" 
              :key="period.value"
              :class="['period-btn', { active: selectedPeriod === period.value }]"
              @click="selectedPeriod = period.value"
            >
              {{ period.label }}
            </button>
          </div>
          <div class="custom-period" v-if="selectedPeriod === 'custom'">
            <input 
              v-model="customPeriod.start"
              type="date"
              class="period-input"
              placeholder="Date début"
            >
            <span class="period-separator">à</span>
            <input 
              v-model="customPeriod.end"
              type="date"
              class="period-input"
              placeholder="Date fin"
            >
          </div>
        </div>
      </div>

      <!-- KPI Dashboard -->
      <div class="kpi-dashboard">
        <h3>Indicateurs Clés de Performance</h3>
        <div class="kpi-grid">
          <div class="kpi-card revenue">
            <div class="kpi-header">
              <div class="kpi-icon">💰</div>
              <div class="kpi-trend positive">
                <span class="trend-icon">↗️</span>
                <span class="trend-value">+12.5%</span>
              </div>
            </div>
            <div class="kpi-content">
              <div class="kpi-value">{{ formatCurrency(kpiData.totalRevenue) }}</div>
              <div class="kpi-label">Revenus Totaux</div>
              <div class="kpi-period">{{ getPeriodLabel() }}</div>
            </div>
          </div>

          <div class="kpi-card bookings">
            <div class="kpi-header">
              <div class="kpi-icon">📋</div>
              <div class="kpi-trend positive">
                <span class="trend-icon">↗️</span>
                <span class="trend-value">+8.3%</span>
              </div>
            </div>
            <div class="kpi-content">
              <div class="kpi-value">{{ kpiData.totalBookings }}</div>
              <div class="kpi-label">Réservations</div>
              <div class="kpi-period">{{ getPeriodLabel() }}</div>
            </div>
          </div>

          <div class="kpi-card users">
            <div class="kpi-header">
              <div class="kpi-icon">👥</div>
              <div class="kpi-trend positive">
                <span class="trend-icon">↗️</span>
                <span class="trend-value">+15.7%</span>
              </div>
            </div>
            <div class="kpi-content">
              <div class="kpi-value">{{ kpiData.newUsers }}</div>
              <div class="kpi-label">Nouveaux Utilisateurs</div>
              <div class="kpi-period">{{ getPeriodLabel() }}</div>
            </div>
          </div>

          <div class="kpi-card properties">
            <div class="kpi-header">
              <div class="kpi-icon">🏠</div>
              <div class="kpi-trend positive">
                <span class="trend-icon">↗️</span>
                <span class="trend-value">+5.2%</span>
              </div>
            </div>
            <div class="kpi-content">
              <div class="kpi-value">{{ kpiData.newProperties }}</div>
              <div class="kpi-label">Nouvelles Propriétés</div>
              <div class="kpi-period">{{ getPeriodLabel() }}</div>
            </div>
          </div>

          <div class="kpi-card satisfaction">
            <div class="kpi-header">
              <div class="kpi-icon">⭐</div>
              <div class="kpi-trend positive">
                <span class="trend-icon">↗️</span>
                <span class="trend-value">+0.3</span>
              </div>
            </div>
            <div class="kpi-content">
              <div class="kpi-value">{{ kpiData.avgRating }}/5</div>
              <div class="kpi-label">Note Moyenne</div>
              <div class="kpi-period">{{ getPeriodLabel() }}</div>
            </div>
          </div>

          <div class="kpi-card occupancy">
            <div class="kpi-header">
              <div class="kpi-icon">📈</div>
              <div class="kpi-trend positive">
                <span class="trend-icon">↗️</span>
                <span class="trend-value">+7.1%</span>
              </div>
            </div>
            <div class="kpi-content">
              <div class="kpi-value">{{ kpiData.occupancyRate }}%</div>
              <div class="kpi-label">Taux d'Occupation</div>
              <div class="kpi-period">{{ getPeriodLabel() }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Graphiques analytiques -->
      <div class="analytics-charts">
        <div class="chart-section">
          <div class="chart-card large">
            <div class="chart-header">
              <h3>Évolution des Revenus</h3>
              <div class="chart-controls">
                <select v-model="revenueChartPeriod" class="chart-select">
                  <option value="daily">Quotidien</option>
                  <option value="weekly">Hebdomadaire</option>
                  <option value="monthly">Mensuel</option>
                </select>
              </div>
            </div>
            <div class="chart-content">
              <div class="revenue-chart">
                <div class="chart-grid">
                  <div class="y-axis">
                    <div v-for="label in revenueYLabels" :key="label" class="y-label">
                      {{ formatCurrency(label) }}
                    </div>
                  </div>
                  <div class="chart-area">
                    <svg class="chart-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <!-- Grille -->
                      <defs>
                        <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/>
                        </pattern>
                      </defs>
                      <rect width="100" height="100" fill="url(#grid)" />
                      
                      <!-- Zone sous la courbe -->
                      <path 
                        :d="revenueAreaPath"
                        fill="url(#revenueGradient)"
                        opacity="0.3"
                      />
                      
                      <!-- Ligne principale -->
                      <polyline 
                        :points="revenueLinePath"
                        fill="none"
                        stroke="var(--electric-blue)"
                        stroke-width="2"
                      />
                      
                      <!-- Points de données -->
                      <circle 
                        v-for="point in revenueDataPoints" 
                        :key="point.x"
                        :cx="point.x"
                        :cy="point.y"
                        r="3"
                        fill="var(--electric-blue)"
                        stroke="white"
                        stroke-width="2"
                      />
                      
                      <!-- Gradients -->
                      <defs>
                        <linearGradient id="revenueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" style="stop-color:var(--electric-blue);stop-opacity:1" />
                          <stop offset="100%" style="stop-color:var(--electric-blue);stop-opacity:0" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>
                <div class="x-axis">
                  <div v-for="label in revenueXLabels" :key="label" class="x-label">
                    {{ label }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="chart-card">
            <div class="chart-header">
              <h3>Répartition des Revenus</h3>
            </div>
            <div class="chart-content">
              <div class="pie-chart">
                <div class="pie-legend">
                  <div v-for="segment in revenueBreakdown" :key="segment.category" class="legend-item">
                    <div :class="['legend-color', segment.category]"></div>
                    <span class="legend-label">{{ segment.label }}</span>
                    <span class="legend-value">{{ formatCurrency(segment.value) }}</span>
                    <span class="legend-percentage">({{ segment.percentage }}%)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="chart-section">
          <div class="chart-card">
            <div class="chart-header">
              <h3>Top Managers</h3>
            </div>
            <div class="chart-content">
              <div class="top-performers">
                <div v-for="(manager, index) in topManagers" :key="manager.id" class="performer-item">
                  <div class="performer-rank">{{ index + 1 }}</div>
                  <div class="performer-info">
                    <div class="performer-avatar">
                      <img v-if="manager.avatar" :src="manager.avatar" :alt="manager.name">
                      <div v-else class="avatar-placeholder">
                        {{ getInitials(manager.name) }}
                      </div>
                    </div>
                    <div class="performer-details">
                      <div class="performer-name">{{ manager.name }}</div>
                      <div class="performer-stats">{{ manager.properties }} propriétés</div>
                    </div>
                  </div>
                  <div class="performer-metrics">
                    <div class="metric-value">{{ formatCurrency(manager.revenue) }}</div>
                    <div class="metric-rating">⭐ {{ manager.rating }}/5</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="chart-card">
            <div class="chart-header">
              <h3>Tendances Utilisateurs</h3>
            </div>
            <div class="chart-content">
              <div class="user-trends">
                <div class="trend-item">
                  <div class="trend-icon">👥</div>
                  <div class="trend-content">
                    <div class="trend-title">Inscriptions</div>
                    <div class="trend-value">+{{ userTrends.registrations }}</div>
                    <div class="trend-period">cette semaine</div>
                  </div>
                  <div class="trend-chart">
                    <div class="mini-bars">
                      <div v-for="bar in userTrends.registrationsBars" :key="bar" 
                           :style="{ height: `${bar}%` }" class="mini-bar"></div>
                    </div>
                  </div>
                </div>

                <div class="trend-item">
                  <div class="trend-icon">🔄</div>
                  <div class="trend-content">
                    <div class="trend-title">Rétention</div>
                    <div class="trend-value">{{ userTrends.retention }}%</div>
                    <div class="trend-period">30 jours</div>
                  </div>
                  <div class="trend-indicator positive">
                    <span class="indicator-arrow">↗️</span>
                    <span class="indicator-value">+5.2%</span>
                  </div>
                </div>

                <div class="trend-item">
                  <div class="trend-icon">📱</div>
                  <div class="trend-content">
                    <div class="trend-title">Sessions</div>
                    <div class="trend-value">{{ userTrends.avgSessions }}</div>
                    <div class="trend-period">par utilisateur</div>
                  </div>
                  <div class="trend-indicator positive">
                    <span class="indicator-arrow">↗️</span>
                    <span class="indicator-value">+12.7%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Rapports détaillés -->
      <div class="detailed-reports">
        <h3>Rapports Détaillés</h3>
        <div class="reports-grid">
          <div class="report-card">
            <div class="report-header">
              <div class="report-icon">📊</div>
              <div class="report-info">
                <h4>Rapport Financier</h4>
                <p>Analyse complète des revenus et dépenses</p>
              </div>
            </div>
            <div class="report-stats">
              <div class="stat">
                <span class="stat-label">Revenus totaux</span>
                <span class="stat-value">{{ formatCurrency(reports.financial.totalRevenue) }}</span>
              </div>
              <div class="stat">
                <span class="stat-label">Commissions</span>
                <span class="stat-value">{{ formatCurrency(reports.financial.commissions) }}</span>
              </div>
              <div class="stat">
                <span class="stat-label">Bénéfice net</span>
                <span class="stat-value success">{{ formatCurrency(reports.financial.netProfit) }}</span>
              </div>
            </div>
            <div class="report-actions">
              <button class="btn btn-secondary" @click="exportReport('financial')">
                <span class="icon">📄</span>
                Exporter PDF
              </button>
              <button class="btn btn-outline" @click="viewReport('financial')">
                <span class="icon">👁️</span>
                Voir Détails
              </button>
            </div>
          </div>

          <div class="report-card">
            <div class="report-header">
              <div class="report-icon">🏠</div>
              <div class="report-info">
                <h4>Rapport Propriétés</h4>
                <p>Performance et occupation des propriétés</p>
              </div>
            </div>
            <div class="report-stats">
              <div class="stat">
                <span class="stat-label">Propriétés actives</span>
                <span class="stat-value">{{ reports.properties.active }}</span>
              </div>
              <div class="stat">
                <span class="stat-label">Taux d'occupation</span>
                <span class="stat-value">{{ reports.properties.occupancy }}%</span>
              </div>
              <div class="stat">
                <span class="stat-label">Note moyenne</span>
                <span class="stat-value">⭐ {{ reports.properties.avgRating }}/5</span>
              </div>
            </div>
            <div class="report-actions">
              <button class="btn btn-secondary" @click="exportReport('properties')">
                <span class="icon">📄</span>
                Exporter PDF
              </button>
              <button class="btn btn-outline" @click="viewReport('properties')">
                <span class="icon">👁️</span>
                Voir Détails
              </button>
            </div>
          </div>

          <div class="report-card">
            <div class="report-header">
              <div class="report-icon">👥</div>
              <div class="report-info">
                <h4>Rapport Utilisateurs</h4>
                <p>Analyse de l'activité et engagement</p>
              </div>
            </div>
            <div class="report-stats">
              <div class="stat">
                <span class="stat-label">Utilisateurs actifs</span>
                <span class="stat-value">{{ reports.users.active }}</span>
              </div>
              <div class="stat">
                <span class="stat-label">Nouveaux inscrits</span>
                <span class="stat-value">{{ reports.users.newUsers }}</span>
              </div>
              <div class="stat">
                <span class="stat-label">Taux de rétention</span>
                <span class="stat-value success">{{ reports.users.retention }}%</span>
              </div>
            </div>
            <div class="report-actions">
              <button class="btn btn-secondary" @click="exportReport('users')">
                <span class="icon">📄</span>
                Exporter PDF
              </button>
              <button class="btn btn-outline" @click="viewReport('users')">
                <span class="icon">👁️</span>
                Voir Détails
              </button>
            </div>
          </div>

          <div class="report-card">
            <div class="report-header">
              <div class="report-icon">📈</div>
              <div class="report-info">
                <h4>Rapport Marketing</h4>
                <p>ROI et performance des campagnes</p>
              </div>
            </div>
            <div class="report-stats">
              <div class="stat">
                <span class="stat-label">Acquisitions</span>
                <span class="stat-value">{{ reports.marketing.acquisitions }}</span>
              </div>
              <div class="stat">
                <span class="stat-label">Coût par acquisition</span>
                <span class="stat-value">{{ formatCurrency(reports.marketing.cpa) }}</span>
              </div>
              <div class="stat">
                <span class="stat-label">ROI</span>
                <span class="stat-value success">{{ reports.marketing.roi }}%</span>
              </div>
            </div>
            <div class="report-actions">
              <button class="btn btn-secondary" @click="exportReport('marketing')">
                <span class="icon">📄</span>
                Exporter PDF
              </button>
              <button class="btn btn-outline" @click="viewReport('marketing')">
                <span class="icon">👁️</span>
                Voir Détails
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de rapport détaillé -->
    <div v-if="showReportModal" class="modal-overlay" @click="showReportModal = false">
      <div class="modal-content extra-large" @click.stop>
        <div class="modal-header">
          <h3>{{ currentReport?.title }}</h3>
          <button class="modal-close" @click="showReportModal = false">
            <span class="icon">❌</span>
          </button>
        </div>
        <div class="modal-body" v-if="currentReport">
          <div class="report-content">
            <div class="report-summary">
              <h4>Résumé Exécutif</h4>
              <p>{{ currentReport.summary }}</p>
            </div>
            
            <div class="report-data">
              <h4>Données Détaillées</h4>
              <div class="data-table">
                <table>
                  <thead>
                    <tr>
                      <th v-for="column in currentReport.columns" :key="column">{{ column }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="row in currentReport.data" :key="row.id">
                      <td v-for="column in currentReport.columns" :key="column">
                        {{ formatReportCell(row[column.toLowerCase()], column) }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div class="report-insights">
              <h4>Insights et Recommandations</h4>
              <ul>
                <li v-for="insight in currentReport.insights" :key="insight">{{ insight }}</li>
              </ul>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-primary" @click="exportDetailedReport">
            <span class="icon">📄</span>
            Exporter PDF Complet
          </button>
          <button class="btn btn-secondary" @click="exportExcel">
            <span class="icon">📊</span>
            Exporter Excel
          </button>
        </div>
      </div>
    </div>

    <!-- Loading overlay -->
    <div v-if="loading" class="loading-overlay">
      <div class="spinner"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useAdminStore } from '../../stores/admin'

// Interfaces
interface ReportData {
  title: string
  summary: string
  columns: string[]
  data: Array<Record<string, string | number>>
  insights: string[]
}

// Store Admin
const adminStore = useAdminStore()

// État réactif
const loading = ref(false)
const selectedPeriod = ref('month')
const customPeriod = reactive({
  start: '',
  end: ''
})
const revenueChartPeriod = ref('monthly')
const showReportModal = ref(false)
const currentReport = ref<ReportData | null>(null)

// Options de période
const periodOptions = [
  { value: 'week', label: 'Cette semaine' },
  { value: 'month', label: 'Ce mois' },
  { value: 'quarter', label: 'Ce trimestre' },
  { value: 'year', label: 'Cette année' },
  { value: 'custom', label: 'Période personnalisée' }
]

// Données KPI calculées depuis les vraies données
const kpiData = computed(() => {
  if (!adminStore.stats || !adminStore.report) {
    return {
      totalRevenue: 0,
      totalBookings: 0,
      newUsers: 0,
      newProperties: 0,
      avgRating: 0,
      occupancyRate: 0
    }
  }

  return {
    totalRevenue: adminStore.stats.total_revenue || 0,
    totalBookings: adminStore.stats.total_bookings || 0,
    newUsers: adminStore.report.users?.new_registrations || 0,
    newProperties: adminStore.report.properties?.new_properties || 0,
    avgRating: 4.6, // À calculer depuis les reviews si disponible
    occupancyRate: adminStore.stats.occupied_properties && adminStore.stats.total_properties 
      ? Math.round((adminStore.stats.occupied_properties / adminStore.stats.total_properties) * 100)
      : 0
  }
})

// Données de revenus pour le graphique - depuis les données réelles
const revenueData = computed(() => {
  if (!adminStore.monthlyStats?.revenue) {
    // Données par défaut si pas de données disponibles
    return [
      { date: 'Jan', value: 0 },
      { date: 'Fév', value: 0 },
      { date: 'Mar', value: 0 },
      { date: 'Avr', value: 0 },
      { date: 'Mai', value: 0 },
      { date: 'Jun', value: 0 }
    ]
  }

  // Convertir les données mensuelles en format utilisable pour le graphique
  const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']
  return adminStore.monthlyStats.revenue.map(monthData => ({
    date: monthNames[monthData.month - 1] || `M${monthData.month}`,
    value: monthData.total
  })).slice(0, 6) // Garder seulement les 6 derniers mois
})

// Données calculées pour le graphique
const revenueDataPoints = computed(() => {
  const maxValue = Math.max(...revenueData.value.map(d => d.value))
  return revenueData.value.map((d, index) => ({
    x: (index / (revenueData.value.length - 1)) * 100,
    y: 100 - (d.value / maxValue) * 100
  }))
})

const revenueLinePath = computed(() => {
  return revenueDataPoints.value.map(p => `${p.x},${p.y}`).join(' ')
})

const revenueAreaPath = computed(() => {
  const points = revenueDataPoints.value
  let path = `M 0,100 `
  points.forEach(p => {
    path += `L ${p.x},${p.y} `
  })
  path += `L 100,100 Z`
  return path
})

const revenueXLabels = computed(() => {
  return revenueData.value.map(d => d.date)
})

const revenueYLabels = computed(() => {
  const maxValue = Math.max(...revenueData.value.map(d => d.value))
  return [maxValue, maxValue * 0.75, maxValue * 0.5, maxValue * 0.25, 0]
})

// Répartition des revenus
const revenueBreakdown = ref([
  { category: 'apartments', label: 'Appartements', value: 68500, percentage: 54 },
  { category: 'houses', label: 'Maisons', value: 38200, percentage: 30 },
  { category: 'offices', label: 'Bureaux', value: 19100, percentage: 16 }
])

// Top managers
const topManagers = ref([
  { id: 1, name: 'Pierre Martin', avatar: null, properties: 12, revenue: 45600, rating: 4.8 },
  { id: 2, name: 'Sophie Dubois', avatar: null, properties: 8, revenue: 32400, rating: 4.7 },
  { id: 3, name: 'Lucas Bernard', avatar: null, properties: 6, revenue: 28200, rating: 4.6 },
  { id: 4, name: 'Marie Laurent', avatar: null, properties: 5, revenue: 19800, rating: 4.5 }
])

// Tendances utilisateurs
const userTrends = reactive({
  registrations: 142,
  registrationsBars: [60, 75, 45, 80, 95, 70, 85],
  retention: 73,
  avgSessions: 4.2
})

// Rapports détaillés
const reports = reactive({
  financial: {
    totalRevenue: 125800,
    commissions: 18870,
    netProfit: 106930
  },
  properties: {
    active: 89,
    occupancy: 78,
    avgRating: 4.6
  },
  users: {
    active: 1247,
    newUsers: 142,
    retention: 73
  },
  marketing: {
    acquisitions: 89,
    cpa: 45,
    roi: 340
  }
})

// Computed properties
const getPeriodLabel = () => {
  switch (selectedPeriod.value) {
    case 'week': return 'cette semaine'
    case 'month': return 'ce mois'
    case 'quarter': return 'ce trimestre'
    case 'year': return 'cette année'
    case 'custom': return 'période personnalisée'
    default: return 'ce mois'
  }
}

// Méthodes
const getInitials = (name: string) => {
  return name.split(' ').map(word => word[0]).join('').toUpperCase()
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

const exportReport = (type: string) => {
  console.log(`Export du rapport ${type} en cours...`)
  // Ici on pourrait générer le PDF
}

const viewReport = (type: string) => {
  // Données simulées pour chaque type de rapport
  const reportData = {
    financial: {
      title: 'Rapport Financier Détaillé',
      summary: 'Analyse approfondie des performances financières avec un focus sur la croissance des revenus et l\'optimisation des coûts.',
      columns: ['Période', 'Revenus', 'Commissions', 'Coûts', 'Bénéfice'],
      data: [
        { id: 1, période: 'Janvier 2024', revenus: 15000, commissions: 2250, coûts: 3500, bénéfice: 9250 },
        { id: 2, période: 'Février 2024', revenus: 18500, commissions: 2775, coûts: 3800, bénéfice: 11925 },
        { id: 3, période: 'Mars 2024', revenus: 22000, commissions: 3300, coûts: 4200, bénéfice: 14500 }
      ],
      insights: [
        'Croissance constante des revenus (+12.5% par rapport au trimestre précédent)',
        'Optimisation des coûts opérationnels réussie (-8% sur les frais généraux)',
        'Recommandation: Investir dans le marketing digital pour accélérer la croissance'
      ]
    },
    properties: {
      title: 'Rapport Performance Propriétés',
      summary: 'Évaluation complète de la performance des propriétés en termes d\'occupation, revenus et satisfaction client.',
      columns: ['Propriété', 'Type', 'Occupation', 'Revenus', 'Note'],
      data: [
        { id: 1, propriété: 'Appt. Champs-Élysées', type: 'Appartement', occupation: '85%', revenus: 12500, note: 4.8 },
        { id: 2, propriété: 'Maison Montmartre', type: 'Maison', occupation: '72%', revenus: 8900, note: 4.6 },
        { id: 3, propriété: 'Bureau Lyon Part-Dieu', type: 'Bureau', occupation: '90%', revenus: 6700, note: 4.5 }
      ],
      insights: [
        'Les appartements parisiens affichent les meilleures performances',
        'Potentiel d\'amélioration sur les maisons avec des rénovations ciblées',
        'Les bureaux montrent une demande stable et croissante'
      ]
    },
    users: {
      title: 'Rapport Activité Utilisateurs',
      summary: 'Analyse comportementale des utilisateurs et métriques d\'engagement sur la plateforme.',
      columns: ['Segment', 'Utilisateurs', 'Sessions', 'Rétention', 'Conversion'],
      data: [
        { id: 1, segment: 'Clients premium', utilisateurs: 245, sessions: 6.8, rétention: '89%', conversion: '12.5%' },
        { id: 2, segment: 'Clients standard', utilisateurs: 832, sessions: 3.2, rétention: '67%', conversion: '8.2%' },
        { id: 3, segment: 'Nouveaux visiteurs', utilisateurs: 1456, sessions: 1.8, rétention: '34%', conversion: '3.1%' }
      ],
      insights: [
        'Excellent taux de rétention des clients premium',
        'Opportunité d\'améliorer l\'onboarding des nouveaux utilisateurs',
        'Programme de fidélisation à développer pour les clients standard'
      ]
    },
    marketing: {
      title: 'Rapport Performance Marketing',
      summary: 'ROI et efficacité des campagnes marketing avec analyse détaillée des canaux d\'acquisition.',
      columns: ['Canal', 'Acquisitions', 'Coût', 'CPA', 'ROI'],
      data: [
        { id: 1, canal: 'Google Ads', acquisitions: 45, coût: 2250, cpa: 50, roi: '420%' },
        { id: 2, canal: 'Facebook Ads', acquisitions: 28, coût: 1400, cpa: 50, roi: '350%' },
        { id: 3, canal: 'SEO Organique', acquisitions: 16, coût: 0, cpa: 0, roi: '∞' }
      ],
      insights: [
        'Google Ads génère le meilleur volume d\'acquisitions qualifiées',
        'SEO organique offre le meilleur ROI à long terme',
        'Potentiel d\'expansion sur les réseaux sociaux (Instagram, LinkedIn)'
      ]
    }
  }

  currentReport.value = reportData[type as keyof typeof reportData]
  showReportModal.value = true
}

const formatReportCell = (value: string | number, column: string) => {
  if (typeof value === 'number' && (column.toLowerCase().includes('revenus') || column.toLowerCase().includes('coût') || column.toLowerCase().includes('bénéfice'))) {
    return formatCurrency(value)
  }
  return value
}

// Fonctions de chargement des données
const refreshData = async () => {
  loading.value = true
  try {
    // Charger les statistiques générales
    await adminStore.fetchDashboard()
    
    // Générer un rapport pour la période sélectionnée
    await generateReportForPeriod()
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error)
  } finally {
    loading.value = false
  }
}

const generateReportForPeriod = async () => {
  const { startDate, endDate } = getPeriodDates()
  await adminStore.generateReport(startDate, endDate)
}

const getPeriodDates = () => {
  const now = new Date()
  let startDate: string
  let endDate: string = now.toISOString().split('T')[0]

  switch (selectedPeriod.value) {
    case 'week':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      break
    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
      break
    case 'quarter':
      const quarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1)
      startDate = quarterStart.toISOString().split('T')[0]
      break
    case 'year':
      startDate = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0]
      break
    case 'custom':
      startDate = customPeriod.start
      endDate = customPeriod.end
      break
    default:
      startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
  }

  return { startDate, endDate }
}

const generateReport = async () => {
  await generateReportForPeriod()
}

const exportDetailedReport = () => {
  console.log('Export du rapport détaillé en PDF...')
}

const exportExcel = () => {
  console.log('Export du rapport en Excel...')
}

// Lifecycle
onMounted(async () => {
  // Charger les données initiales
  await refreshData()
})

// Watcher pour recharger les données quand la période change
watch([selectedPeriod, customPeriod], async () => {
  await generateReportForPeriod()
}, { deep: true })
</script>

<style scoped>
.reports-view {
  min-height: 100vh;
  background: var(--bg-gradient-main);
  padding: 2rem 0;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1.5rem 2rem;
  background: var(--card-bg);
  border-radius: var(--border-radius-large);
  border: 1px solid var(--card-border);
  box-shadow: var(--shadow-card);
}

.header-content h1 {
  margin: 0;
  color: #4300FF;
  font-size: 1.8rem;
  font-weight: 700;
}

.header-content p {
  margin: 0.5rem 0 0 0;
  color: var(--text-secondary);
}

.header-actions {
  display: flex;
  gap: 1rem;
}

/* Période de rapport */
.report-period-section {
  margin-bottom: 2rem;
}

.period-selector {
  background: var(--card-bg);
  border-radius: var(--border-radius-large);
  border: 1px solid var(--card-border);
  box-shadow: var(--shadow-card);
  padding: 1.5rem 2rem;
}

.period-selector h3 {
  margin: 0 0 1rem 0;
  color: var(--text-primary);
  font-size: 1.25rem;
  font-weight: 600;
}

.period-options {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.period-btn {
  padding: 0.75rem 1.5rem;
  border: 2px solid var(--card-border);
  background: var(--input-bg);
  color: var(--text-primary);
  border-radius: var(--border-radius-medium);
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.period-btn:hover {
  border-color: var(--electric-blue);
}

.period-btn.active {
  background: var(--electric-blue);
  color: white;
  border-color: var(--electric-blue);
}

.custom-period {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
}

.period-input {
  padding: 0.75rem 1rem;
  border: 2px solid var(--input-border);
  border-radius: var(--border-radius-medium);
  background: var(--input-bg);
  color: var(--text-primary);
  font-size: 1rem;
}

.period-separator {
  color: var(--text-secondary);
  font-weight: 500;
}

/* KPI Dashboard */
.kpi-dashboard {
  margin-bottom: 2rem;
}

.kpi-dashboard h3 {
  margin: 0 0 1.5rem 0;
  color: var(--text-primary);
  font-size: 1.5rem;
  font-weight: 600;
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.kpi-card {
  background: var(--card-bg);
  border-radius: var(--border-radius-large);
  border: 1px solid var(--card-border);
  box-shadow: var(--shadow-card);
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
}

.kpi-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--gradient-primary);
}

.kpi-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.kpi-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  background: rgba(59, 130, 246, 0.1);
  color: var(--electric-blue);
}

.kpi-trend {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.75rem;
  border-radius: var(--border-radius-small);
  font-size: 0.8rem;
  font-weight: 600;
}

.kpi-trend.positive {
  background: rgba(34, 197, 94, 0.1);
  color: var(--success-color);
}

.kpi-trend.negative {
  background: rgba(239, 68, 68, 0.1);
  color: var(--danger-color);
}

.kpi-content {
  text-align: left;
}

.kpi-value {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  line-height: 1;
}

.kpi-label {
  color: var(--text-secondary);
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.kpi-period {
  color: var(--text-secondary);
  font-size: 0.8rem;
  opacity: 0.8;
}

/* Analytics Charts */
.analytics-charts {
  margin-bottom: 2rem;
}

.chart-section {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.chart-section:last-child {
  grid-template-columns: 1fr 1fr;
}

.chart-card {
  background: var(--card-bg);
  border-radius: var(--border-radius-large);
  border: 1px solid var(--card-border);
  box-shadow: var(--shadow-card);
  overflow: hidden;
}

.chart-card.large {
  grid-column: span 1;
}

.chart-header {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--card-border);
  background: var(--bg-gray-50);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-header h3 {
  margin: 0;
  color: var(--text-primary);
  font-size: 1.25rem;
  font-weight: 600;
}

.chart-controls {
  display: flex;
  gap: 1rem;
}

.chart-select {
  padding: 0.5rem 1rem;
  border: 1px solid var(--card-border);
  border-radius: var(--border-radius-small);
  background: var(--input-bg);
  color: var(--text-primary);
}

.chart-content {
  padding: 2rem;
}

/* Revenue Chart */
.revenue-chart {
  height: 300px;
  display: flex;
  flex-direction: column;
}

.chart-grid {
  flex: 1;
  display: flex;
  position: relative;
}

.y-axis {
  width: 60px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-right: 1rem;
}

.y-label {
  font-size: 0.8rem;
  color: var(--text-secondary);
  text-align: right;
}

.chart-area {
  flex: 1;
  position: relative;
}

.chart-svg {
  width: 100%;
  height: 100%;
}

.x-axis {
  display: flex;
  justify-content: space-between;
  padding-top: 1rem;
  padding-left: 60px;
}

.x-label {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

/* Pie Chart */
.pie-legend {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.legend-color {
  width: 20px;
  height: 20px;
  border-radius: 4px;
}

.legend-color.apartments {
  background: var(--electric-blue);
}

.legend-color.houses {
  background: var(--success-color);
}

.legend-color.offices {
  background: var(--warning-color);
}

.legend-label {
  flex: 1;
  color: var(--text-primary);
  font-weight: 500;
}

.legend-value {
  color: var(--text-primary);
  font-weight: 600;
}

.legend-percentage {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-left: 0.5rem;
}

/* Top Performers */
.top-performers {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.performer-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--bg-gray-50);
  border-radius: var(--border-radius-medium);
}

.performer-rank {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: var(--electric-blue);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.9rem;
}

.performer-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.performer-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid var(--card-border);
}

.performer-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background: var(--electric-blue);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 600;
}

.performer-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.performer-name {
  font-weight: 600;
  color: var(--text-primary);
}

.performer-stats {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.performer-metrics {
  text-align: right;
}

.metric-value {
  font-weight: 600;
  color: var(--electric-blue);
  font-size: 1.1rem;
}

.metric-rating {
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-top: 0.25rem;
}

/* User Trends */
.user-trends {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.trend-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--bg-gray-50);
  border-radius: var(--border-radius-medium);
}

.trend-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(59, 130, 246, 0.1);
  color: var(--electric-blue);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.trend-content {
  flex: 1;
}

.trend-title {
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.trend-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--electric-blue);
  margin-bottom: 0.25rem;
}

.trend-period {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.trend-chart {
  width: 60px;
  height: 30px;
}

.mini-bars {
  display: flex;
  align-items: end;
  gap: 2px;
  height: 100%;
}

.mini-bar {
  flex: 1;
  background: var(--electric-blue);
  border-radius: 1px;
  min-height: 4px;
}

.trend-indicator {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: var(--border-radius-small);
  font-size: 0.8rem;
  font-weight: 600;
}

.trend-indicator.positive {
  background: rgba(34, 197, 94, 0.1);
  color: var(--success-color);
}

/* Detailed Reports */
.detailed-reports {
  margin-bottom: 2rem;
}

.detailed-reports h3 {
  margin: 0 0 1.5rem 0;
  color: var(--text-primary);
  font-size: 1.5rem;
  font-weight: 600;
}

.reports-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
}

.report-card {
  background: var(--card-bg);
  border-radius: var(--border-radius-large);
  border: 1px solid var(--card-border);
  box-shadow: var(--shadow-card);
  overflow: hidden;
  transition: all 0.3s ease;
}

.report-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-card-hover);
}

.report-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--card-border);
  background: var(--bg-gray-50);
}

.report-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(59, 130, 246, 0.1);
  color: var(--electric-blue);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.report-info h4 {
  margin: 0 0 0.25rem 0;
  color: var(--text-primary);
  font-size: 1.25rem;
  font-weight: 600;
}

.report-info p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.report-stats {
  padding: 1.5rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.stat {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: var(--bg-gray-50);
  border-radius: var(--border-radius-medium);
}

.stat-label {
  color: var(--text-secondary);
  font-weight: 500;
}

.stat-value {
  color: var(--text-primary);
  font-weight: 600;
}

.stat-value.success {
  color: var(--success-color);
}

.report-actions {
  padding: 1rem 2rem 1.5rem;
  display: flex;
  gap: 1rem;
}

/* Boutons */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: var(--border-radius-medium);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
}

.btn-primary {
  background: var(--gradient-primary);
  color: white;
  box-shadow: var(--shadow-neon);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-neon-hover);
}

.btn-secondary {
  background: var(--bg-gray-200);
  color: var(--text-primary);
  border: 1px solid var(--card-border);
}

.btn-secondary:hover:not(:disabled) {
  background: var(--bg-gray-300);
}

.btn-outline {
  background: transparent;
  color: var(--electric-blue);
  border: 1px solid var(--electric-blue);
}

.btn-outline:hover:not(:disabled) {
  background: var(--electric-blue);
  color: white;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

/* Modals */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.modal-content {
  background: var(--card-bg);
  border-radius: var(--border-radius-large);
  border: 1px solid var(--card-border);
  box-shadow: var(--shadow-card);
  max-width: 800px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-content.extra-large {
  max-width: 1200px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--card-border);
}

.modal-header h3 {
  margin: 0;
  color: var(--text-primary);
}

.modal-close {
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: var(--border-radius-small);
}

.modal-close:hover {
  background: var(--bg-gray-100);
  color: var(--text-primary);
}

.modal-body {
  padding: 2rem;
}

.modal-footer {
  padding: 1rem 2rem 1.5rem;
  border-top: 1px solid var(--card-border);
  display: flex;
  gap: 1rem;
  justify-content: center;
}

/* Report Content */
.report-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.report-summary h4,
.report-data h4,
.report-insights h4 {
  color: var(--text-primary);
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--card-border);
}

.report-summary p {
  color: var(--text-secondary);
  line-height: 1.6;
}

.data-table {
  overflow-x: auto;
}

.data-table table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid var(--card-border);
}

.data-table th {
  background: var(--bg-gray-50);
  color: var(--text-primary);
  font-weight: 600;
}

.data-table tr:hover {
  background: var(--bg-gray-50);
}

.report-insights ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.report-insights li {
  padding: 0.75rem 1rem;
  margin-bottom: 0.5rem;
  background: var(--bg-gray-50);
  border-radius: var(--border-radius-medium);
  border-left: 4px solid var(--electric-blue);
  color: var(--text-secondary);
}

/* Loading */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.spinner {
  width: 3rem;
  height: 3rem;
  border: 4px solid var(--bg-gray-200);
  border-top: 4px solid var(--electric-blue);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* Icônes */
.icon {
  display: inline-block;
  line-height: 1;
  font-style: normal;
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 1024px) {
  .kpi-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .chart-section {
    grid-template-columns: 1fr;
  }

  .reports-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .header-actions {
    flex-direction: column;
    width: 100%;
  }

  .period-options {
    flex-direction: column;
  }

  .period-btn {
    width: 100%;
  }

  .custom-period {
    flex-direction: column;
    align-items: stretch;
  }

  .kpi-grid {
    grid-template-columns: 1fr;
  }

  .reports-grid {
    grid-template-columns: 1fr;
  }

  .report-actions {
    flex-direction: column;
  }

  .modal-footer {
    flex-direction: column;
  }

  .container {
    padding: 0 0.5rem;
  }
}
</style>
