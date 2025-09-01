<template>
  <div class="properties-overview-view">
    <div class="container">
      <!-- Header -->
      <div class="page-header">
        <div class="header-content">
          <h1>Aperçu des Propriétés</h1>
          <p>Vue d'ensemble de toutes les propriétés de la plateforme</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-secondary" @click="refreshData">
            <span class="icon">🔄</span>
            Actualiser
          </button>
          <button class="btn btn-secondary" @click="exportData">
            <span class="icon">📊</span>
            Exporter
          </button>
        </div>
      </div>

      <!-- Statistiques globales -->
      <div class="stats-grid">
        <div class="stat-card total">
          <div class="stat-icon">🏠</div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.total }}</div>
            <div class="stat-label">Total Propriétés</div>
          </div>
        </div>
        <div class="stat-card available">
          <div class="stat-icon">✅</div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.available }}</div>
            <div class="stat-label">Disponibles</div>
          </div>
        </div>
        <div class="stat-card occupied">
          <div class="stat-icon">🔒</div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.occupied }}</div>
            <div class="stat-label">Occupées</div>
          </div>
        </div>
        <div class="stat-card revenue">
          <div class="stat-icon">💰</div>
          <div class="stat-content">
            <div class="stat-value">{{ formatCurrency(stats.totalRevenue) }}</div>
            <div class="stat-label">Revenus Totaux</div>
          </div>
        </div>
      </div>

      <!-- Filtres et recherche -->
      <div class="filters-section">
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input 
            v-model="searchQuery"
            type="text"
            placeholder="Rechercher par titre, adresse, manager..."
            class="search-input"
          >
        </div>
        <div class="filters">
          <select v-model="selectedType" class="filter-select">
            <option value="">Tous les types</option>
            <option value="apartment">Appartements</option>
            <option value="house">Maisons</option>
            <option value="office">Bureaux</option>
          </select>
          <select v-model="selectedStatus" class="filter-select">
            <option value="">Tous les statuts</option>
            <option value="available">Disponible</option>
            <option value="occupied">Occupé</option>
            <option value="maintenance">Maintenance</option>
          </select>
          <select v-model="selectedCity" class="filter-select">
            <option value="">Toutes les villes</option>
            <option value="Paris">Paris</option>
            <option value="Lyon">Lyon</option>
            <option value="Marseille">Marseille</option>
            <option value="Bordeaux">Bordeaux</option>
          </select>
          <button class="btn btn-secondary" @click="resetFilters">
            <span class="icon">🗑️</span>
            Réinitialiser
          </button>
        </div>
      </div>

      <!-- Graphiques et analyses -->
      <div class="analytics-section">
        <div class="chart-card">
          <div class="chart-header">
            <h3>Répartition par Type</h3>
          </div>
          <div class="chart-content">
            <div class="pie-chart">
              <div class="chart-legend">
                <div v-for="type in typeDistribution" :key="type.type" class="legend-item">
                  <div :class="['legend-color', type.type]"></div>
                  <span class="legend-label">{{ getTypeLabel(type.type) }}</span>
                  <span class="legend-value">{{ type.count }} ({{ type.percentage }}%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="chart-card">
          <div class="chart-header">
            <h3>Revenus par Mois</h3>
          </div>
          <div class="chart-content">
            <div class="bar-chart">
              <div class="bars-container">
                <div 
                  v-for="month in revenueByMonth" 
                  :key="month.name"
                  class="bar-item"
                >
                  <div 
                    class="bar"
                    :style="{ height: `${(month.value / maxRevenue) * 100}%` }"
                  ></div>
                  <div class="bar-label">{{ month.name }}</div>
                  <div class="bar-value">{{ formatCurrency(month.value) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="chart-card">
          <div class="chart-header">
            <h3>Performance par Manager</h3>
          </div>
          <div class="chart-content">
            <div class="performance-list">
              <div 
                v-for="manager in topManagers" 
                :key="manager.id"
                class="manager-item"
              >
                <div class="manager-info">
                  <div class="manager-avatar">
                    <img 
                      v-if="manager.avatar" 
                      :src="manager.avatar" 
                      :alt="manager.name"
                    >
                    <div v-else class="avatar-placeholder">
                      {{ getInitials(manager.name) }}
                    </div>
                  </div>
                  <div class="manager-details">
                    <div class="manager-name">{{ manager.name }}</div>
                    <div class="manager-stats">{{ manager.properties }} propriétés</div>
                  </div>
                </div>
                <div class="manager-metrics">
                  <div class="metric">
                    <span class="metric-label">Revenus</span>
                    <span class="metric-value">{{ formatCurrency(manager.revenue) }}</span>
                  </div>
                  <div class="metric">
                    <span class="metric-label">Note</span>
                    <span class="metric-value">{{ manager.rating }}/5</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Table des propriétés -->
      <div class="properties-table-container">
        <div class="table-header">
          <h3>Liste des Propriétés</h3>
          <div class="table-actions">
            <select v-model="itemsPerPage" class="items-per-page">
              <option value="10">10 par page</option>
              <option value="25">25 par page</option>
              <option value="50">50 par page</option>
            </select>
          </div>
        </div>
        
        <table class="properties-table">
          <thead>
            <tr>
              <th @click="sortBy('title')" class="sortable">
                Propriété
                <span class="sort-icon">{{ getSortIcon('title') }}</span>
              </th>
              <th>Type</th>
              <th>Manager</th>
              <th @click="sortBy('price_per_night')" class="sortable">
                Prix/Nuit
                <span class="sort-icon">{{ getSortIcon('price_per_night') }}</span>
              </th>
              <th>Statut</th>
              <th @click="sortBy('rating')" class="sortable">
                Note
                <span class="sort-icon">{{ getSortIcon('rating') }}</span>
              </th>
              <th>Réservations</th>
              <th>Revenus</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="property in paginatedProperties" :key="property.id">
              <td>
                <div class="property-info">
                  <div class="property-image">
                    <img 
                      v-if="property.images && property.images[0]" 
                      :src="getPropertyImageUrl(property.images[0])" 
                      :alt="property.title"
                      class="property-img"
                      @error="handleImageError"
                    >
                    <div v-else class="image-placeholder">
                      <span class="icon">🏠</span>
                    </div>
                  </div>
                  <div class="property-details">
                    <div class="property-title">{{ property.title }}</div>
                    <div class="property-address">{{ property.address }}</div>
                  </div>
                </div>
              </td>
              <td>
                <span :class="['type-badge', property.type]">
                  <span class="icon">{{ getTypeIcon(property.type) }}</span>
                  {{ getTypeLabel(property.type) }}
                </span>
              </td>
              <td>
                <div class="manager-info">
                  <div class="manager-name">{{ property.manager_name }}</div>
                  <div class="manager-email">{{ property.manager_email }}</div>
                </div>
              </td>
              <td>
                <span class="price">{{ formatCurrency(property.price_per_night) }}</span>
              </td>
              <td>
                <span :class="['status-badge', property.status]">
                  <span class="icon">{{ getStatusIcon(property.status) }}</span>
                  {{ getStatusLabel(property.status) }}
                </span>
              </td>
              <td>
                <div class="rating-info">
                  <span class="rating-value">{{ property.rating || 'N/A' }}</span>
                  <div class="rating-stars">
                    <span v-for="i in 5" :key="i" :class="['star', { filled: i <= (property.rating || 0) }]">⭐</span>
                  </div>
                  <span class="reviews-count">({{ property.reviews_count || 0 }})</span>
                </div>
              </td>
              <td>
                <span class="bookings-count">{{ property.bookings_count || 0 }}</span>
              </td>
              <td>
                <span class="revenue">{{ formatCurrency(property.total_revenue || 0) }}</span>
              </td>
              <td>
                <div class="action-buttons">
                  <button 
                    class="action-btn view"
                    @click="viewProperty(property)"
                    title="Voir les détails"
                  >
                    <span class="icon">👁️</span>
                  </button>
                  <button 
                    class="action-btn edit"
                    @click="editProperty(property)"
                    title="Modifier"
                  >
                    <span class="icon">✏️</span>
                  </button>
                  <button 
                    v-if="property.status === 'available'"
                    class="action-btn disable"
                    @click="disableProperty(property)"
                    title="Désactiver"
                  >
                    <span class="icon">⏸️</span>
                  </button>
                  <button 
                    class="action-btn delete"
                    @click="deleteProperty(property)"
                    title="Supprimer"
                  >
                    <span class="icon">🗑️</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Message si aucune propriété -->
        <div v-if="filteredProperties.length === 0" class="no-properties">
          <span class="icon">🏠</span>
          <h3>Aucune propriété trouvée</h3>
          <p>Essayez de modifier vos critères de recherche</p>
        </div>
      </div>

      <!-- Pagination -->
      <div class="pagination" v-if="totalPages > 1">
        <button 
          class="pagination-btn"
          @click="currentPage = 1"
          :disabled="currentPage === 1"
        >
          <span class="icon">⏮️</span>
        </button>
        <button 
          class="pagination-btn"
          @click="currentPage--"
          :disabled="currentPage === 1"
        >
          <span class="icon">⏪</span>
        </button>
        
        <span class="pagination-info">
          Page {{ currentPage }} sur {{ totalPages }}
        </span>
        
        <button 
          class="pagination-btn"
          @click="currentPage++"
          :disabled="currentPage === totalPages"
        >
          <span class="icon">⏩</span>
        </button>
        <button 
          class="pagination-btn"
          @click="currentPage = totalPages"
          :disabled="currentPage === totalPages"
        >
          <span class="icon">⏭️</span>
        </button>
      </div>
    </div>

    <!-- Modal Détails Propriété -->
    <div v-if="showPropertyDetails" class="modal-overlay" @click="showPropertyDetails = false">
      <div class="modal-content large" @click.stop>
        <div class="modal-header">
          <h3>Détails de la propriété</h3>
          <button class="modal-close" @click="showPropertyDetails = false">
            <span class="icon">❌</span>
          </button>
        </div>
        <div class="modal-body" v-if="selectedProperty">
          <div class="property-details-grid">
            <div class="detail-section">
              <h4>Informations générales</h4>
              <div class="detail-item">
                <label>Titre:</label>
                <span>{{ selectedProperty.title }}</span>
              </div>
              <div class="detail-item">
                <label>Type:</label>
                <span :class="['type-badge', selectedProperty.type]">
                  {{ getTypeLabel(selectedProperty.type) }}
                </span>
              </div>
              <div class="detail-item">
                <label>Prix par nuit:</label>
                <span>{{ formatCurrency(selectedProperty.price_per_night) }}</span>
              </div>
              <div class="detail-item">
                <label>Statut:</label>
                <span :class="['status-badge', selectedProperty.status]">
                  {{ getStatusLabel(selectedProperty.status) }}
                </span>
              </div>
            </div>
            
            <div class="detail-section">
              <h4>Caractéristiques</h4>
              <div class="detail-item">
                <label>Chambres:</label>
                <span>{{ selectedProperty.bedrooms }}</span>
              </div>
              <div class="detail-item">
                <label>Salles de bain:</label>
                <span>{{ selectedProperty.bathrooms }}</span>
              </div>
              <div class="detail-item">
                <label>Surface:</label>
                <span>{{ selectedProperty.area }}m²</span>
              </div>
              <div class="detail-item">
                <label>Capacité:</label>
                <span>{{ selectedProperty.guests }} personnes</span>
              </div>
            </div>
          </div>
          
          <div class="detail-section full-width">
            <h4>Adresse</h4>
            <p>{{ selectedProperty.address }}</p>
          </div>

          <div class="detail-section full-width">
            <h4>Description</h4>
            <p>{{ selectedProperty.description || 'Aucune description disponible' }}</p>
          </div>

          <div class="property-actions">
            <button class="btn btn-primary" @click="editProperty(selectedProperty)">
              <span class="icon">✏️</span>
              Modifier
            </button>
            <button class="btn btn-danger" @click="deleteProperty(selectedProperty)">
              <span class="icon">🗑️</span>
              Supprimer
            </button>
          </div>
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminStore } from '../../stores/admin'
import type { PropertyWithStats } from '../../stores/admin'

const router = useRouter()
const adminStore = useAdminStore()

// État réactif
const loading = computed(() => adminStore.isLoading)
const searchQuery = ref('')
const selectedType = ref('')
const selectedStatus = ref('')
const selectedCity = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const sortField = ref('created_at')
const sortDirection = ref('desc')

// Modals
const showPropertyDetails = ref(false)
const selectedProperty = ref<PropertyWithStats | null>(null)

// Données des propriétés depuis le store
const properties = computed(() => adminStore.propertiesData?.properties || [])

// Computed properties
const stats = computed(() => {
  if (adminStore.propertiesData?.stats) {
    return {
      total: adminStore.propertiesData.stats.total,
      available: adminStore.propertiesData.stats.available,
      occupied: adminStore.propertiesData.stats.occupied,
      totalRevenue: adminStore.propertiesData.stats.total_revenue
    }
  }
  
  // Fallback si pas de données du store
  const total = properties.value.length
  const available = properties.value.filter(p => p.status === 'available').length
  const occupied = properties.value.filter(p => p.status === 'occupied').length
  const totalRevenue = properties.value.reduce((sum, p) => sum + (p.total_revenue || 0), 0)

  return { total, available, occupied, totalRevenue }
})

const typeDistribution = computed(() => {
  if (adminStore.propertiesData?.type_distribution) {
    return adminStore.propertiesData.type_distribution
  }
  
  // Fallback
  const distribution = properties.value.reduce((acc, property) => {
    acc[property.type] = (acc[property.type] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return Object.entries(distribution).map(([type, count]) => ({
    type,
    count,
    percentage: properties.value.length > 0 ? Math.round((count / properties.value.length) * 100) : 0
  }))
})

const revenueByMonth = computed(() => {
  if (adminStore.propertiesData?.revenue_by_month) {
    return adminStore.propertiesData.revenue_by_month.map(item => ({
      name: (item as { month?: string; name?: string; value: number }).month || 
            (item as { month?: string; name?: string; value: number }).name || 'Unknown',
      value: item.value
    }))
  }
  
  // Données par défaut
  return [
    { name: 'Jul', value: 0 },
    { name: 'Août', value: 0 },
    { name: 'Sep', value: 0 },
    { name: 'Oct', value: 0 },
    { name: 'Nov', value: 0 },
    { name: 'Déc', value: 0 }
  ]
})

const maxRevenue = computed(() => {
  const revenues = revenueByMonth.value.map(m => m.value)
  return revenues.length > 0 ? Math.max(...revenues) : 1
})

const topManagers = computed(() => {
  if (adminStore.propertiesData?.top_managers) {
    return adminStore.propertiesData.top_managers.map(manager => ({
      id: manager.id,
      name: manager.name,
      avatar: null,
      properties: manager.properties_count,
      revenue: manager.total_revenue,
      rating: manager.average_rating
    }))
  }
  
  // Fallback
  const managerStats = properties.value.reduce((acc, property) => {
    const managerId = property.manager_id || 0
    const managerName = property.manager_name || 'Manager Inconnu'
    
    if (!acc[managerId]) {
      acc[managerId] = {
        id: managerId,
        name: managerName,
        avatar: null,
        properties: 0,
        revenue: 0,
        rating: 0,
        totalRating: 0,
        ratingCount: 0
      }
    }
    
    acc[managerId].properties++
    acc[managerId].revenue += property.total_revenue || 0
    
    if (property.rating) {
      acc[managerId].totalRating += property.rating
      acc[managerId].ratingCount++
    }
    
    return acc
  }, {} as Record<number, {
    id: number;
    name: string;
    avatar: null;
    properties: number;
    revenue: number;
    rating: number;
    totalRating: number;
    ratingCount: number;
  }>)

  return Object.values(managerStats).map(manager => ({
    ...manager,
    rating: manager.ratingCount > 0 ? 
      Math.round((manager.totalRating / manager.ratingCount) * 10) / 10 : 0
  })).sort((a, b) => b.revenue - a.revenue)
})

const filteredProperties = computed(() => {
  let filtered = properties.value

  // Recherche par titre, adresse ou manager
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(property => 
      property.title.toLowerCase().includes(query) ||
      property.address.toLowerCase().includes(query) ||
(property.manager_name || '').toLowerCase().includes(query)
    )
  }

  // Filtre par type
  if (selectedType.value) {
    filtered = filtered.filter(property => property.type === selectedType.value)
  }

  // Filtre par statut
  if (selectedStatus.value) {
    filtered = filtered.filter(property => property.status === selectedStatus.value)
  }

  // Filtre par ville
  if (selectedCity.value) {
    filtered = filtered.filter(property => property.address.includes(selectedCity.value))
  }

  // Tri
  filtered.sort((a, b) => {
    const aValue = (a as Record<string, unknown>)[sortField.value]
    const bValue = (b as Record<string, unknown>)[sortField.value]
    
    // Conversion sécurisée pour la comparaison
    const aCompare = typeof aValue === 'string' || typeof aValue === 'number' ? aValue : 0
    const bCompare = typeof bValue === 'string' || typeof bValue === 'number' ? bValue : 0
    
    if (sortDirection.value === 'asc') {
      return aCompare > bCompare ? 1 : -1
    } else {
      return aCompare < bCompare ? 1 : -1
    }
  })

  return filtered
})

const paginatedProperties = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredProperties.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredProperties.value.length / itemsPerPage.value)
})

// Méthodes
const refreshData = async () => {
  await loadPropertiesData()
}

const exportData = () => {
  // Simuler l'export
  console.log('Export des données en cours...')
  // Ici on pourrait générer un CSV ou Excel
}

const loadPropertiesData = async () => {
  const filters = {
    search: searchQuery.value || undefined,
    type: selectedType.value || undefined,
    status: selectedStatus.value || undefined,
    city: selectedCity.value || undefined
  }
  
  await adminStore.fetchPropertiesData(filters)
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedType.value = ''
  selectedStatus.value = ''
  selectedCity.value = ''
  currentPage.value = 1
  loadPropertiesData()
}

const sortBy = (field: string) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = 'asc'
  }
}

const getSortIcon = (field: string) => {
  if (sortField.value !== field) return '↕️'
  return sortDirection.value === 'asc' ? '↑' : '↓'
}

const getInitials = (name: string) => {
  return name.split(' ').map(word => word[0]).join('').toUpperCase()
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'apartment': return '🏢'
    case 'house': return '🏠'
    case 'office': return '🏢'
    default: return '🏠'
  }
}

const getTypeLabel = (type: string) => {
  switch (type) {
    case 'apartment': return 'Appartement'
    case 'house': return 'Maison'
    case 'office': return 'Bureau'
    default: return 'Inconnu'
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'available': return '✅'
    case 'occupied': return '🔒'
    case 'maintenance': return '🔧'
    default: return '❓'
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'available': return 'Disponible'
    case 'occupied': return 'Occupé'
    case 'maintenance': return 'Maintenance'
    default: return 'Inconnu'
  }
}

const getPropertyImageUrl = (imagePath?: string) => {
  if (!imagePath) return undefined
  
  // Si l'image commence par http/https, c'est une URL complète
  if (imagePath.startsWith('http')) {
    return imagePath
  }
  
  // Sinon, construire l'URL avec le domaine du backend
  const backendUrl = 'http://localhost:8000' // TODO: Configurer via une variable d'environnement
  return `${backendUrl}/${imagePath}`
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/placeholder-property.svg'
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

const viewProperty = (property: PropertyWithStats) => {
  selectedProperty.value = property
  showPropertyDetails.value = true
}

const editProperty = (property: PropertyWithStats) => {
  // Rediriger vers la page d'édition du manager
  router.push(`/manager/properties/${property.id}/edit`)
}

const disableProperty = (property: PropertyWithStats) => {
  property.status = 'maintenance'
  console.log('Propriété désactivée:', property.title)
}

const deleteProperty = (property: PropertyWithStats) => {
  if (confirm(`Êtes-vous sûr de vouloir supprimer "${property.title}" ?`)) {
    const index = properties.value.findIndex(p => p.id === property.id)
    if (index > -1) {
      properties.value.splice(index, 1)
    }
    console.log('Propriété supprimée:', property.title)
  }
}

// Lifecycle
onMounted(() => {
  loadPropertiesData()
})
</script>

<style scoped>
.properties-overview-view {
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

/* Stats grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: var(--card-bg);
  border-radius: var(--border-radius-large);
  border: 1px solid var(--card-border);
  box-shadow: var(--shadow-card);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
}

.stat-card.total .stat-icon {
  background: rgba(59, 130, 246, 0.1);
  color: var(--electric-blue);
}

.stat-card.available .stat-icon {
  background: rgba(34, 197, 94, 0.1);
  color: var(--success-color);
}

.stat-card.occupied .stat-icon {
  background: rgba(251, 191, 36, 0.1);
  color: var(--warning-color);
}

.stat-card.revenue .stat-icon {
  background: rgba(168, 85, 247, 0.1);
  color: #A855F7;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.stat-label {
  color: var(--text-secondary);
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Filtres */
.filters-section {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: var(--card-bg);
  border-radius: var(--border-radius-large);
  border: 1px solid var(--card-border);
  box-shadow: var(--shadow-card);
}

.search-box {
  position: relative;
  flex: 1;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 3rem;
  border: 2px solid var(--input-border);
  border-radius: var(--border-radius-medium);
  background: var(--input-bg);
  color: var(--text-primary);
  font-size: 1rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--electric-blue);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.filters {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.filter-select {
  padding: 0.75rem 1rem;
  border: 2px solid var(--input-border);
  border-radius: var(--border-radius-medium);
  background: var(--input-bg);
  color: var(--text-primary);
  font-size: 1rem;
  min-width: 150px;
}

/* Analytics section */
.analytics-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.chart-card {
  background: var(--card-bg);
  border-radius: var(--border-radius-large);
  border: 1px solid var(--card-border);
  box-shadow: var(--shadow-card);
  overflow: hidden;
}

.chart-header {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--card-border);
  background: var(--bg-gray-50);
}

.chart-header h3 {
  margin: 0;
  color: var(--text-primary);
  font-size: 1.25rem;
  font-weight: 600;
}

.chart-content {
  padding: 2rem;
}

/* Pie chart */
.chart-legend {
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

.legend-color.apartment {
  background: var(--electric-blue);
}

.legend-color.house {
  background: var(--success-color);
}

.legend-color.office {
  background: var(--warning-color);
}

.legend-label {
  flex: 1;
  color: var(--text-primary);
  font-weight: 500;
}

.legend-value {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

/* Bar chart */
.bars-container {
  display: flex;
  align-items: end;
  gap: 1rem;
  height: 200px;
}

.bar-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
}

.bar {
  width: 100%;
  background: var(--gradient-primary);
  border-radius: 4px 4px 0 0;
  transition: all 0.3s ease;
  margin-bottom: 0.5rem;
}

.bar-label {
  color: var(--text-secondary);
  font-size: 0.8rem;
  margin-bottom: 0.25rem;
}

.bar-value {
  color: var(--text-primary);
  font-size: 0.8rem;
  font-weight: 600;
}

/* Performance list */
.performance-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.manager-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: var(--bg-gray-50);
  border-radius: var(--border-radius-medium);
}

.manager-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.manager-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid var(--card-border);
}

.manager-avatar img {
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

.manager-name {
  font-weight: 600;
  color: var(--text-primary);
}

.manager-stats {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.manager-metrics {
  display: flex;
  gap: 1rem;
}

.metric {
  text-align: center;
}

.metric-label {
  display: block;
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-bottom: 0.25rem;
}

.metric-value {
  font-weight: 600;
  color: var(--text-primary);
}

/* Table */
.properties-table-container {
  background: var(--card-bg);
  border-radius: var(--border-radius-large);
  border: 1px solid var(--card-border);
  box-shadow: var(--shadow-card);
  overflow: hidden;
  margin-bottom: 2rem;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--card-border);
  background: var(--bg-gray-50);
}

.table-header h3 {
  margin: 0;
  color: var(--text-primary);
  font-size: 1.25rem;
  font-weight: 600;
}

.items-per-page {
  padding: 0.5rem 1rem;
  border: 1px solid var(--card-border);
  border-radius: var(--border-radius-small);
  background: var(--input-bg);
  color: var(--text-primary);
}

.properties-table {
  width: 100%;
  border-collapse: collapse;
}

.properties-table th,
.properties-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid var(--card-border);
}

.properties-table th {
  background: var(--bg-gray-50);
  color: var(--text-primary);
  font-weight: 600;
  position: sticky;
  top: 0;
  z-index: 10;
}

.sortable {
  cursor: pointer;
  user-select: none;
  position: relative;
}

.sortable:hover {
  background: var(--bg-gray-100);
}

.sort-icon {
  margin-left: 0.5rem;
  opacity: 0.6;
}

.properties-table tr:hover {
  background: var(--bg-gray-50);
}

/* Property info */
.property-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.property-image {
  width: 60px;
  height: 60px;
  border-radius: var(--border-radius-medium);
  overflow: hidden;
  border: 2px solid var(--card-border);
}

.property-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  background: var(--bg-gray-200);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
}

.property-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.property-title {
  font-weight: 600;
  color: var(--text-primary);
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.property-address {
  font-size: 0.8rem;
  color: var(--text-secondary);
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Badges */
.type-badge,
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.75rem;
  border-radius: var(--border-radius-small);
  font-size: 0.8rem;
  font-weight: 600;
}

.type-badge.apartment {
  background: rgba(59, 130, 246, 0.1);
  color: var(--electric-blue);
}

.type-badge.house {
  background: rgba(34, 197, 94, 0.1);
  color: var(--success-color);
}

.type-badge.office {
  background: rgba(251, 191, 36, 0.1);
  color: var(--warning-color);
}

.status-badge.available {
  background: rgba(34, 197, 94, 0.1);
  color: var(--success-color);
}

.status-badge.occupied {
  background: rgba(251, 191, 36, 0.1);
  color: var(--warning-color);
}

.status-badge.maintenance {
  background: rgba(239, 68, 68, 0.1);
  color: var(--danger-color);
}

/* Manager info */
.manager-info .manager-name {
  font-weight: 600;
  color: var(--text-primary);
}

.manager-email {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

/* Price */
.price {
  font-weight: 700;
  color: var(--electric-blue);
  font-size: 1.1rem;
}

/* Rating */
.rating-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.rating-value {
  font-weight: 600;
  color: var(--text-primary);
}

.rating-stars {
  display: flex;
  gap: 0.1rem;
}

.star {
  font-size: 0.8rem;
  opacity: 0.3;
}

.star.filled {
  opacity: 1;
}

.reviews-count {
  font-size: 0.7rem;
  color: var(--text-secondary);
}

/* Counts and revenue */
.bookings-count,
.revenue {
  font-weight: 600;
  color: var(--text-primary);
}

/* Actions */
.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: var(--border-radius-small);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.action-btn.view {
  background: rgba(59, 130, 246, 0.1);
  color: var(--electric-blue);
}

.action-btn.edit {
  background: rgba(251, 191, 36, 0.1);
  color: var(--warning-color);
}

.action-btn.disable {
  background: rgba(239, 68, 68, 0.1);
  color: var(--danger-color);
}

.action-btn.delete {
  background: rgba(239, 68, 68, 0.1);
  color: var(--danger-color);
}

.action-btn:hover {
  transform: scale(1.1);
  opacity: 0.8;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}

.pagination-btn {
  padding: 0.5rem 1rem;
  border: 1px solid var(--card-border);
  background: var(--card-bg);
  color: var(--text-primary);
  border-radius: var(--border-radius-small);
  cursor: pointer;
  transition: all 0.3s ease;
}

.pagination-btn:hover:not(:disabled) {
  background: var(--electric-blue);
  color: white;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  color: var(--text-secondary);
  font-weight: 600;
}

/* No properties */
.no-properties {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--text-secondary);
}

.no-properties .icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  display: block;
  opacity: 0.5;
}

.no-properties h3 {
  margin: 0 0 0.5rem 0;
  color: var(--text-primary);
}

.no-properties p {
  margin: 0;
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

.btn-danger {
  background: var(--gradient-danger);
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
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-content.large {
  max-width: 800px;
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

/* Détails propriété */
.property-details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.detail-section {
  margin-bottom: 2rem;
}

.detail-section.full-width {
  grid-column: 1 / -1;
}

.detail-section h4 {
  color: var(--text-primary);
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--card-border);
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: var(--bg-gray-50);
  border-radius: var(--border-radius-medium);
}

.detail-item label {
  font-weight: 600;
  color: var(--text-secondary);
}

.detail-item span {
  color: var(--text-primary);
}

.property-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  padding-top: 1rem;
  border-top: 1px solid var(--card-border);
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
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .analytics-section {
    grid-template-columns: 1fr;
  }

  .property-details-grid {
    grid-template-columns: 1fr;
  }

  .properties-table {
    font-size: 0.9rem;
  }

  .properties-table th,
  .properties-table td {
    padding: 0.75rem 0.5rem;
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

  .filters-section {
    flex-direction: column;
  }

  .filters {
    flex-direction: column;
    width: 100%;
  }

  .filter-select {
    width: 100%;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .property-actions {
    flex-direction: column;
  }

  .container {
    padding: 0 0.5rem;
  }

  /* Table responsive */
  .properties-table-container {
    overflow-x: auto;
  }

  .properties-table {
    min-width: 1000px;
  }
}
</style>
