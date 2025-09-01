<template>
  <div class="properties-management">
    <!-- En-tête de gestion -->
    <div class="management-header">
      <div class="header-content">
        <div class="header-info">
          <h1 class="page-title">Gestion des propriétés</h1>
          <p class="page-subtitle">
            Gérez votre portefeuille immobilier et optimisez vos revenus
          </p>
        </div>
        
        <div class="header-actions">
          <router-link to="/manager/properties/add" class="add-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            Ajouter une propriété
          </router-link>
        </div>
      </div>
    </div>

    <!-- Filtres et recherche -->
    <div class="filters-section">
      <div class="filters-container">
        <div class="search-group">
          <div class="search-input-container">
            <div class="search-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35"/>
              </svg>
            </div>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Rechercher par nom, adresse..."
              class="search-input"
              @input="debouncedSearch"
            />
            <button v-if="searchQuery" @click="clearSearch" class="clear-search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>
        
        <div class="filter-groups">
          <div class="filter-group">
            <label class="filter-label">Type</label>
            <select v-model="filters.type" @change="applyFilters" class="filter-select">
              <option value="">Tous les types</option>
              <option value="house">Maisons</option>
              <option value="apartment">Appartements</option>
              <option value="office">Bureaux</option>
            </select>
          </div>
          
          <div class="filter-group">
            <label class="filter-label">Statut</label>
            <select v-model="filters.status" @change="applyFilters" class="filter-select">
              <option value="">Tous les statuts</option>
              <option value="available">Disponible</option>
              <option value="occupied">Occupé</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
          
          <div class="filter-group">
            <label class="filter-label">Prix</label>
            <div class="price-range">
              <input
                v-model="filters.minPrice"
                type="number"
                placeholder="Min"
                class="price-input"
                @input="applyFilters"
              />
              <span class="price-separator">-</span>
              <input
                v-model="filters.maxPrice"
                type="number"
                placeholder="Max"
                class="price-input"
                @input="applyFilters"
              />
            </div>
          </div>
          
          <button @click="resetFilters" class="reset-filters-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            Réinitialiser
          </button>
        </div>
      </div>
    </div>

    <!-- Statistiques rapides -->
    <div class="quick-stats">
      <div class="stat-item">
        <div class="stat-icon total">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ filteredProperties.length }}</div>
          <div class="stat-label">Propriétés</div>
        </div>
      </div>
      
      <div class="stat-item">
        <div class="stat-icon available">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ availableCount }}</div>
          <div class="stat-label">Disponibles</div>
        </div>
      </div>
      
      <div class="stat-item">
        <div class="stat-icon occupied">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 6v6l4 2"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ occupiedCount }}</div>
          <div class="stat-label">Occupées</div>
        </div>
      </div>
      
      <div class="stat-item">
        <div class="stat-icon revenue">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ formatPrice(totalRevenue) }}</div>
          <div class="stat-label">Revenus potentiels</div>
        </div>
      </div>
    </div>

    <!-- Vue des propriétés -->
    <div class="properties-section">
      <div class="section-header">
        <div class="view-controls">
          <button 
            @click="viewMode = 'grid'" 
            :class="{ active: viewMode === 'grid' }" 
            class="view-btn"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
            </svg>
            Grille
          </button>
          <button 
            @click="viewMode = 'list'" 
            :class="{ active: viewMode === 'list' }" 
            class="view-btn"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="8" y1="6" x2="21" y2="6"/>
              <line x1="8" y1="12" x2="21" y2="12"/>
              <line x1="8" y1="18" x2="21" y2="18"/>
              <line x1="3" y1="6" x2="3.01" y2="6"/>
              <line x1="3" y1="12" x2="3.01" y2="12"/>
              <line x1="3" y1="18" x2="3.01" y2="18"/>
            </svg>
            Liste
          </button>
        </div>
        
        <div class="sort-controls">
          <select v-model="sortBy" @change="applySorting" class="sort-select">
            <option value="created_at">Date d'ajout</option>
            <option value="title">Nom</option>
            <option value="price_per_night">Prix</option>
            <option value="status">Statut</option>
          </select>
          <button @click="toggleSortOrder" class="sort-order-btn">
            <svg v-if="sortOrder === 'asc'" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"/>
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"/>
            </svg>
          </button>
        </div>
      </div>
      
      <!-- État de chargement -->
      <div v-if="propertiesStore.isLoading" class="loading-state">
        <div class="cyber-spinner"></div>
        <p>Chargement de vos propriétés...</p>
      </div>
      
      <!-- État vide -->
      <div v-else-if="!loadingProperties && (filteredProperties.length === 0 || showEmptyState)" class="empty-state">
        <div class="empty-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
          </svg>
        </div>
        <h3>{{ searchQuery || hasActiveFilters ? 'Aucune propriété trouvée' : 'Commencez votre activité de location' }}</h3>
        <p>
          {{ searchQuery || hasActiveFilters 
            ? 'Essayez de modifier vos critères de recherche ou réinitialisez les filtres.' 
            : 'Ajoutez votre première propriété (maison, appartement ou bureau) pour commencer à recevoir des réservations et générer des revenus.' 
          }}
        </p>
        <router-link v-if="!searchQuery && !hasActiveFilters" to="/manager/properties/add" class="cta-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Ajouter une propriété
        </router-link>
      </div>
      
      <!-- Vue grille -->
      <div v-else-if="viewMode === 'grid'" class="properties-grid">
        <div 
          v-for="property in paginatedProperties" 
          :key="property.id" 
          class="property-card"
          :class="{ 'low-performance': getPerformanceScore(property) < 3 }"
        >
          <div class="property-image">
            <img 
              :src="getPropertyImageUrl(property.images?.[0]) || '/placeholder-property.svg'" 
              :alt="property.title"
              @error="handleImageError"
            />
            <div class="property-status" :class="property.status">
              {{ getStatusLabel(property.status) }}
            </div>
            <div class="property-type">{{ getTypeLabel(property.type) }}</div>
            <div class="property-actions-overlay">
              <button @click="toggleFavorite(property.id)" class="overlay-btn favorite">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                </svg>
              </button>
              <button @click="duplicateProperty(property.id)" class="overlay-btn duplicate">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                </svg>
              </button>
            </div>
          </div>
          
          <div class="property-content">
            <div class="property-header">
              <h3 class="property-title">{{ property.title }}</h3>
              <div class="performance-indicator" :class="getPerformanceClass(property)">
                <div v-for="i in 5" :key="i" class="performance-dot" :class="{ active: i <= getPerformanceScore(property) }"></div>
              </div>
            </div>
            
            <p class="property-address">{{ property.address }}</p>
            
            <div class="property-features">
              <div class="feature">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2V7"/>
                </svg>
                {{ property.bedrooms }} ch.
              </div>
              <div class="feature">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 14v3a2 2 0 002 2h4a2 2 0 002-2v-3"/>
                </svg>
                {{ property.bathrooms }} sdb
              </div>
              <div v-if="property.area" class="feature">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V6a2 2 0 012-2h2M4 16v2a2 2 0 002 2h2M16 4h2a2 2 0 012 2v2M16 20h2a2 2 0 002-2v-2"/>
                </svg>
                {{ property.area }} m²
              </div>
            </div>
            
            <div class="property-metrics">
              <div class="metric">
                <span class="metric-label">Prix/nuit</span>
                <span class="metric-value price">{{ formatPrice(property.price_per_night) }}</span>
              </div>
              <div class="metric">
                <span class="metric-label">Revenus/mois</span>
                <span class="metric-value">{{ formatPrice(property.price_per_night * 20) }}</span>
              </div>
            </div>
          </div>
          
          <div class="property-actions">
            <router-link :to="`/manager/properties/${property.id}/edit`" class="action-btn edit">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
              Modifier
            </router-link>
            <button @click="viewBookings(property.id)" class="action-btn bookings">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              Réservations
            </button>
            <button @click="showDeleteModal(property)" class="action-btn delete">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
              Supprimer
            </button>
          </div>
        </div>
      </div>
      
      <!-- Vue liste -->
      <div v-else class="properties-list">
        <div class="list-header">
          <div class="list-col property-col">Propriété</div>
          <div class="list-col type-col">Type</div>
          <div class="list-col status-col">Statut</div>
          <div class="list-col price-col">Prix/nuit</div>
          <div class="list-col performance-col">Performance</div>
          <div class="list-col actions-col">Actions</div>
        </div>
        
        <div 
          v-for="property in paginatedProperties" 
          :key="property.id" 
          class="list-item"
          :class="{ 'low-performance': getPerformanceScore(property) < 3 }"
        >
          <div class="list-col property-col">
            <div class="property-info">
              <div class="property-thumbnail">
                <img 
                  :src="getPropertyImageUrl(property.images?.[0]) || '/placeholder-property.svg'" 
                  :alt="property.title"
                  @error="handleImageError"
                />
              </div>
              <div class="property-details">
                <h3 class="property-name">{{ property.title }}</h3>
                <p class="property-location">{{ property.address }}</p>
                <div class="property-specs">
                  {{ property.bedrooms }}ch • {{ property.bathrooms }}sdb
                  <span v-if="property.area"> • {{ property.area }}m²</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="list-col type-col">
            <span class="type-badge" :class="property.type">
              {{ getTypeLabel(property.type) }}
            </span>
          </div>
          
          <div class="list-col status-col">
            <span class="status-badge" :class="property.status">
              {{ getStatusLabel(property.status) }}
            </span>
          </div>
          
          <div class="list-col price-col">
            <span class="price-value">{{ formatPrice(property.price_per_night) }}</span>
          </div>
          
          <div class="list-col performance-col">
            <div class="performance-indicator" :class="getPerformanceClass(property)">
              <div v-for="i in 5" :key="i" class="performance-dot" :class="{ active: i <= getPerformanceScore(property) }"></div>
            </div>
          </div>
          
          <div class="list-col actions-col">
            <div class="list-actions">
              <router-link :to="`/manager/properties/${property.id}/edit`" class="list-action-btn edit">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
              </router-link>
              <button @click="viewBookings(property.id)" class="list-action-btn bookings">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </button>
              <button @click="showDeleteModal(property)" class="list-action-btn delete">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Pagination -->
      <div v-if="totalPages > 1" class="pagination">
        <button 
          @click="currentPage = Math.max(1, currentPage - 1)" 
          :disabled="currentPage === 1"
          class="pagination-btn"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          Précédent
        </button>
        
        <div class="pagination-info">
          Page {{ currentPage }} sur {{ totalPages }} ({{ filteredProperties.length }} propriétés)
        </div>
        
        <button 
          @click="currentPage = Math.min(totalPages, currentPage + 1)" 
          :disabled="currentPage === totalPages"
          class="pagination-btn"
        >
          Suivant
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Modal de suppression -->
    <div v-if="showDeleteConfirm" class="modal-overlay" @click="closeDeleteModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Supprimer la propriété</h3>
          <button @click="closeDeleteModal" class="close-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="warning-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
            </svg>
          </div>
          <h4>Êtes-vous sûr de vouloir supprimer cette propriété ?</h4>
          <p>
            <strong>{{ propertyToDelete?.title }}</strong><br>
            Cette action est irréversible et supprimera définitivement toutes les données associées.
          </p>
        </div>
        
        <div class="modal-actions">
          <button @click="closeDeleteModal" class="btn secondary">Annuler</button>
          <button @click="confirmDelete" class="btn danger">Supprimer définitivement</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { usePropertiesStore, type Property } from '../../stores/properties'
import { useRouter } from 'vue-router'
import { debounce } from '../../utils/debounce'

const propertiesStore = usePropertiesStore()
const router = useRouter()

// État local
const searchQuery = ref('')
const viewMode = ref<'grid' | 'list'>('grid')
const currentPage = ref(1)
const itemsPerPage = ref(12)
const sortBy = ref('created_at')
const sortOrder = ref<'asc' | 'desc'>('desc')
const showDeleteConfirm = ref(false)
const propertyToDelete = ref<Property | null>(null)

const filters = ref({
  type: '',
  status: '',
  minPrice: '',
  maxPrice: ''
})

// Computed
const filteredProperties = computed(() => {
  let properties = [...propertiesStore.myProperties]
  
  // Filtrage par recherche
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    properties = properties.filter(property =>
      property.title.toLowerCase().includes(query) ||
      property.address.toLowerCase().includes(query)
    )
  }
  
  // Filtrage par type
  if (filters.value.type) {
    properties = properties.filter(property => property.type === filters.value.type)
  }
  
  // Filtrage par statut
  if (filters.value.status) {
    properties = properties.filter(property => property.status === filters.value.status)
  }
  
  // Filtrage par prix
  if (filters.value.minPrice) {
    properties = properties.filter(property => property.price_per_night >= Number(filters.value.minPrice))
  }
  
  if (filters.value.maxPrice) {
    properties = properties.filter(property => property.price_per_night <= Number(filters.value.maxPrice))
  }
  
  // Tri
  properties.sort((a, b) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let aValue = (a as any)[sortBy.value]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let bValue = (b as any)[sortBy.value]
    
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase()
      bValue = (bValue as string).toLowerCase()
    }
    
    if (sortOrder.value === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })
  
  return properties
})

const paginatedProperties = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredProperties.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredProperties.value.length / itemsPerPage.value)
})

const hasActiveFilters = computed(() => {
  return filters.value.type || filters.value.status || filters.value.minPrice || filters.value.maxPrice
})

const availableCount = computed(() => {
  return filteredProperties.value.filter(p => p.status === 'available').length
})

const occupiedCount = computed(() => {
  return filteredProperties.value.filter(p => p.status === 'occupied').length
})

const totalRevenue = computed(() => {
  return filteredProperties.value.reduce((sum, property) => {
    return sum + (property.price_per_night * 20) // Estimation 20 nuits/mois
  }, 0)
})

// Méthodes
const debouncedSearch = debounce(() => {
  currentPage.value = 1
}, 300)

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(price)
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    available: 'Disponible',
    occupied: 'Occupé',
    maintenance: 'Maintenance'
  }
  return labels[status] || status
}

const getTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    house: 'Maison',
    apartment: 'Appartement',
    office: 'Bureau'
  }
  return labels[type] || type
}

const getPerformanceScore = (property: Property) => {
  // Simulation d'un score de performance basé sur différents critères
  let score = 0
  
  // Prix compétitif
  if (property.price_per_night < 150) score += 1
  if (property.price_per_night < 100) score += 1
  
  // Équipements
  if (property.bedrooms >= 2) score += 1
  if (property.bathrooms >= 2) score += 1
  
  // Statut
  if (property.status === 'available') score += 1
  
  return Math.min(score, 5)
}

const getPerformanceClass = (property: Property) => {
  const score = getPerformanceScore(property)
  if (score >= 4) return 'excellent'
  if (score >= 3) return 'good'
  if (score >= 2) return 'average'
  return 'poor'
}

const getPropertyImageUrl = (imagePath?: string) => {
  if (!imagePath) return null
  
  // Si l'image commence par http/https, c'est une URL complète
  if (imagePath.startsWith('http')) {
    return imagePath
  }
  
  // Sinon, construire l'URL avec le domaine du backend
  const backendUrl = 'http://localhost:8000'
  return `${backendUrl}/${imagePath}`
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/placeholder-property.svg'
}

const applyFilters = () => {
  currentPage.value = 1
}

const resetFilters = () => {
  filters.value = {
    type: '',
    status: '',
    minPrice: '',
    maxPrice: ''
  }
  searchQuery.value = ''
  currentPage.value = 1
}

const clearSearch = () => {
  searchQuery.value = ''
  currentPage.value = 1
}

const toggleSortOrder = () => {
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  applySorting()
}

const applySorting = () => {
  currentPage.value = 1
}

const toggleFavorite = (propertyId: number) => {
  // Implémentation du système de favoris
  console.log('Toggle favorite for property:', propertyId)
}

const duplicateProperty = (propertyId: number) => {
  // Implémentation de la duplication de propriété
  console.log('Duplicate property:', propertyId)
}

const viewBookings = (propertyId: number) => {
  router.push(`/manager/bookings?property=${propertyId}`)
}

const showDeleteModal = (property: Property) => {
  propertyToDelete.value = property
  showDeleteConfirm.value = true
}

const closeDeleteModal = () => {
  showDeleteConfirm.value = false
  propertyToDelete.value = null
}

const confirmDelete = async () => {
  if (!propertyToDelete.value) return
  
  try {
    const result = await propertiesStore.deleteProperty(propertyToDelete.value?.id ?? 0)
    if (result.success) {
      closeDeleteModal()
      // Notification de succès
      console.log('Propriété supprimée avec succès')
    }
  } catch (error) {
    console.error('Erreur lors de la suppression:', error)
  }
}

// Watchers
watch(() => filteredProperties.value.length, () => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = 1
  }
})

// Lifecycle
// État de chargement et messages
const loadingProperties = ref(true)
const showEmptyState = ref(false)

onMounted(async () => {
  try {
    loadingProperties.value = true
    const result = await propertiesStore.fetchMyProperties()
    
    if (result.success) {
      // Si aucune propriété trouvée, afficher l'état vide
      if (propertiesStore.myProperties.length === 0) {
        showEmptyState.value = true
      }
    } else {
      console.error('Erreur lors du chargement des propriétés:', result.error)
    }
  } catch (error) {
    console.error('Erreur lors du chargement des propriétés:', error)
  } finally {
    loadingProperties.value = false
  }
})
</script>

<style scoped>
@import url('../../assets/cyber-theme.css');

.properties-management {
  min-height: 100vh;
  background: var(--bg-gradient-main);
  padding: 2rem;
}

.management-header {
  background: var(--glass-bg-medium);
  backdrop-filter: blur(30px);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-large);
  padding: 2.5rem;
  margin-bottom: 2rem;
  box-shadow: var(--shadow-cyber);
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
  background: linear-gradient(135deg, #4300FF 0%, #0065F8 50%, #00CAFF 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 4px 12px rgba(67, 0, 255, 0.3);
  position: relative;
}

.page-title::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 80px;
  height: 3px;
  background: linear-gradient(90deg, #4300FF, #0065F8);
  border-radius: 2px;
}

.page-subtitle {
  font-size: 1.125rem;
  color: var(--text-secondary);
  margin: 0;
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #10B981 0%, #059669 50%, #047857 100%);
  color: white;
  text-decoration: none;
  border-radius: 1rem;
  font-weight: 700;
  font-size: 1rem;
  letter-spacing: 0.025em;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 20px rgba(16, 185, 129, 0.3), 0 0 30px rgba(16, 185, 129, 0.2);
  position: relative;
  overflow: hidden;
  border: 2px solid transparent;
}

.add-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.6s ease;
}

.add-btn:hover::before {
  left: 100%;
}

.add-btn:hover {
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 8px 35px rgba(16, 185, 129, 0.5), 0 0 50px rgba(16, 185, 129, 0.3);
  background: linear-gradient(135deg, #059669 0%, #047857 50%, #065f46 100%);
  border-color: rgba(16, 185, 129, 0.4);
}

.add-btn:active {
  transform: translateY(-2px) scale(1.02);
  transition: all 0.1s ease;
}

.add-btn svg {
  width: 1.5rem;
  height: 1.5rem;
  stroke: currentColor;
  stroke-width: 2.5;
  transition: all 0.3s ease;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.add-btn:hover svg {
  transform: rotate(90deg) scale(1.1);
  stroke-width: 3;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
}

.filters-section {
  background: var(--glass-bg-medium);
  backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-large);
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: var(--shadow-card);
}

.filters-container {
  display: grid;
  gap: 1.5rem;
}

.search-group {
  display: flex;
  justify-content: center;
}

.search-input-container {
  position: relative;
  max-width: 500px;
  width: 100%;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.25rem;
  height: 1.25rem;
  color: #6B7280;
  z-index: 2;
  transition: all 0.3s ease;
}

.search-input-container:hover .search-icon {
  color: #4300FF;
  transform: translateY(-50%) scale(1.1);
}

.search-icon svg {
  width: 100%;
  height: 100%;
  stroke: currentColor;
}

.search-input {
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  background: #FFFFFF;
  border: 2px solid #E2E8F0;
  border-radius: var(--border-radius-medium);
  color: var(--text-primary);
  font-size: 1rem;
  transition: var(--transition-smooth);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.search-input:hover {
  border-color: #CBD5E1;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.search-input:focus {
  outline: none;
  border-color: #4300FF;
  background: #FFFFFF;
  box-shadow: 0 0 0 3px rgba(67, 0, 255, 0.1), 0 4px 16px rgba(67, 0, 255, 0.15);
}

.search-input::placeholder {
  color: var(--text-muted);
}

.clear-search {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  width: 1.25rem;
  height: 1.25rem;
  transition: var(--transition-smooth);
}

.clear-search:hover {
  color: var(--text-primary);
}

.clear-search svg {
  width: 100%;
  height: 100%;
  stroke: currentColor;
}

.filter-groups {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  align-items: end;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.filter-select {
  padding: 0.75rem 1rem;
  background: #FFFFFF;
  border: 2px solid #E2E8F0;
  border-radius: var(--border-radius-medium);
  color: var(--text-primary);
  font-size: 0.875rem;
  transition: var(--transition-smooth);
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.filter-select:hover {
  border-color: #CBD5E1;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.filter-select:focus {
  outline: none;
  border-color: #0065F8;
  background-color: #FFFFFF;
  box-shadow: 0 0 0 3px rgba(0, 101, 248, 0.1), 0 4px 16px rgba(0, 101, 248, 0.15);
}

.price-range {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.price-input {
  flex: 1;
  padding: 0.75rem;
  background: #FFFFFF;
  border: 2px solid #E2E8F0;
  border-radius: var(--border-radius-medium);
  color: var(--text-primary);
  font-size: 0.875rem;
  transition: var(--transition-smooth);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.price-input:hover {
  border-color: #CBD5E1;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.price-input:focus {
  outline: none;
  border-color: #00CAFF;
  background-color: #FFFFFF;
  box-shadow: 0 0 0 3px rgba(0, 202, 255, 0.1), 0 4px 16px rgba(0, 202, 255, 0.15);
}

.price-input::placeholder {
  color: var(--text-muted);
}

.price-separator {
  color: var(--text-muted);
  font-weight: 600;
}

.reset-filters-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #FFFFFF;
  border: 2px solid #EF4444;
  border-radius: var(--border-radius-medium);
  color: #EF4444;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition-smooth);
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.1);
}

.reset-filters-btn:hover {
  background: #EF4444;
  color: #FFFFFF;
  border-color: #EF4444;
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(239, 68, 68, 0.25);
}

.reset-filters-btn svg {
  width: 1rem;
  height: 1rem;
  stroke: currentColor;
}

.quick-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-item {
  background: var(--glass-bg-medium);
  backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-large);
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: var(--transition-smooth);
  box-shadow: var(--shadow-card);
}

.stat-item:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-hover);
}

.stat-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon.total {
  background: linear-gradient(135deg, #4300FF 0%, #0065F8 50%, #00CAFF 100%);
  box-shadow: 0 0 25px rgba(67, 0, 255, 0.6), 0 0 50px rgba(0, 101, 248, 0.4);
  position: relative;
  overflow: hidden;
}

.stat-icon.total::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: icon-shimmer-total 3s linear infinite;
}

.stat-icon.available {
  background: linear-gradient(135deg, #10B981 0%, #059669 50%, #047857 100%);
  box-shadow: 0 0 25px rgba(16, 185, 129, 0.6), 0 0 50px rgba(5, 150, 105, 0.4);
  position: relative;
  overflow: hidden;
}

.stat-icon.available::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: icon-shimmer-available 3s linear infinite 1s;
}

.stat-icon.occupied {
  background: linear-gradient(135deg, #F59E0B 0%, #D97706 50%, #B45309 100%);
  box-shadow: 0 0 25px rgba(245, 158, 11, 0.6), 0 0 50px rgba(217, 119, 6, 0.4);
  position: relative;
  overflow: hidden;
}

.stat-icon.occupied::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: icon-shimmer-occupied 3s linear infinite 2s;
}

.stat-icon.revenue {
  background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 50%, #6D28D9 100%);
  box-shadow: 0 0 25px rgba(139, 92, 246, 0.6), 0 0 50px rgba(124, 58, 237, 0.4);
  position: relative;
  overflow: hidden;
}

.stat-icon.revenue::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: icon-shimmer-revenue 3s linear infinite 0.5s;
}

.stat-icon svg {
  width: 1.75rem;
  height: 1.75rem;
  stroke: white;
  stroke-width: 2.5;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
}

.stat-item:hover .stat-icon svg {
  transform: scale(1.1) rotate(5deg);
  stroke-width: 3;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4));
}

/* Animations shimmer pour les icônes */
@keyframes icon-shimmer-total {
  0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
  100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
}

@keyframes icon-shimmer-available {
  0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
  100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
}

@keyframes icon-shimmer-occupied {
  0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
  100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
}

@keyframes icon-shimmer-revenue {
  0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
  100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
}

/* Animation de pulsation pour les icônes */
@keyframes icon-pulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 25px rgba(67, 0, 255, 0.6), 0 0 50px rgba(0, 101, 248, 0.4);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 35px rgba(67, 0, 255, 0.8), 0 0 70px rgba(0, 101, 248, 0.6);
  }
}

@keyframes icon-pulse-green {
  0%, 100% {
    box-shadow: 0 0 25px rgba(16, 185, 129, 0.6), 0 0 50px rgba(5, 150, 105, 0.4);
  }
  50% {
    box-shadow: 0 0 35px rgba(16, 185, 129, 0.8), 0 0 70px rgba(5, 150, 105, 0.6);
  }
}

@keyframes icon-pulse-orange {
  0%, 100% {
    box-shadow: 0 0 25px rgba(245, 158, 11, 0.6), 0 0 50px rgba(217, 119, 6, 0.4);
  }
  50% {
    box-shadow: 0 0 35px rgba(245, 158, 11, 0.8), 0 0 70px rgba(217, 119, 6, 0.6);
  }
}

@keyframes icon-pulse-purple {
  0%, 100% {
    box-shadow: 0 0 25px rgba(139, 92, 246, 0.6), 0 0 50px rgba(124, 58, 237, 0.4);
  }
  50% {
    box-shadow: 0 0 35px rgba(139, 92, 246, 0.8), 0 0 70px rgba(124, 58, 237, 0.6);
  }
}

/* Appliquer les animations de pulsation */
.stat-icon.total {
  animation: icon-pulse 4s ease-in-out infinite;
}

.stat-icon.available {
  animation: icon-pulse-green 4s ease-in-out infinite 1s;
}

.stat-icon.occupied {
  animation: icon-pulse-orange 4s ease-in-out infinite 2s;
}

.stat-icon.revenue {
  animation: icon-pulse-purple 4s ease-in-out infinite 3s;
}

/* Désactiver l'animation au survol pour un meilleur contrôle */
.stat-item:hover .stat-icon {
  animation: none;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 900;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.properties-section {
  background: var(--glass-bg-medium);
  backdrop-filter: blur(30px);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-large);
  padding: 2.5rem;
  box-shadow: var(--shadow-cyber);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
}

.view-controls {
  display: flex;
  gap: 0.5rem;
}

.view-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: #FFFFFF;
  border: 2px solid #E2E8F0;
  border-radius: var(--border-radius-medium);
  color: var(--text-secondary);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.view-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.view-btn:hover::before {
  left: 100%;
}

.view-btn.active {
  background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 50%, #6D28D9 100%);
  color: white;
  border-color: transparent;
  box-shadow: 0 4px 16px rgba(139, 92, 246, 0.3);
  transform: translateY(-2px);
}

.view-btn.active svg {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.view-btn:not(.active):hover {
  background: #F8FAFC;
  color: var(--text-primary);
  border-color: #8B5CF6;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.15);
}

.view-btn svg {
  width: 1rem;
  height: 1rem;
  stroke: currentColor;
  transition: all 0.3s ease;
  stroke-width: 2;
}

.view-btn:hover svg {
  transform: scale(1.1);
  stroke-width: 2.5;
}

.view-btn.active svg {
  stroke-width: 2.5;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.sort-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.sort-select {
  padding: 0.75rem 1rem;
  background: var(--glass-bg-light);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-medium);
  color: var(--text-primary);
  font-size: 0.875rem;
  transition: var(--transition-smooth);
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}

.sort-select:focus {
  outline: none;
  border-color: var(--electric-blue);
  background-color: var(--glass-bg-medium);
}

.sort-order-btn {
  padding: 0.75rem;
  background: var(--glass-bg-light);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-medium);
  color: var(--text-secondary);
  cursor: pointer;
  transition: var(--transition-smooth);
}

.sort-order-btn:hover {
  background: var(--glass-bg-medium);
  color: var(--text-primary);
}

.sort-order-btn svg {
  width: 1rem;
  height: 1rem;
  stroke: currentColor;
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--text-secondary);
}

.cyber-spinner {
  width: 3rem;
  height: 3rem;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid var(--electric-blue);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

.empty-icon {
  width: 4rem;
  height: 4rem;
  margin: 0 auto 1.5rem;
  color: var(--text-muted);
}

.empty-icon svg {
  width: 100%;
  height: 100%;
  stroke: currentColor;
}

.empty-state h3 {
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
}

.empty-state p {
  margin-bottom: 2rem;
  font-size: 1.125rem;
}

.cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem 2.5rem;
  background: linear-gradient(135deg, #F59E0B 0%, #D97706 50%, #B45309 100%);
  color: white;
  text-decoration: none;
  border-radius: 1.25rem;
  font-weight: 700;
  font-size: 1.1rem;
  letter-spacing: 0.025em;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 20px rgba(245, 158, 11, 0.3), 0 0 30px rgba(245, 158, 11, 0.2);
  position: relative;
  overflow: hidden;
  border: 2px solid transparent;
  margin-top: 1.5rem;
}

.cta-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.6s ease;
}

.cta-btn:hover::before {
  left: 100%;
}

.cta-btn:hover {
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 8px 35px rgba(245, 158, 11, 0.5), 0 0 50px rgba(245, 158, 11, 0.3);
  background: linear-gradient(135deg, #D97706 0%, #B45309 50%, #92400e 100%);
  border-color: rgba(245, 158, 11, 0.4);
}

.cta-btn:active {
  transform: translateY(-2px) scale(1.02);
  transition: all 0.1s ease;
}

.cta-btn svg {
  width: 1.5rem;
  height: 1.5rem;
  stroke: currentColor;
  stroke-width: 2.5;
  transition: all 0.3s ease;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.cta-btn:hover svg {
  transform: rotate(90deg) scale(1.1);
  stroke-width: 3;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
}

/* Animations pour les boutons */
@keyframes add-btn-pulse {
  0%, 100% {
    box-shadow: 0 4px 20px rgba(16, 185, 129, 0.3), 0 0 30px rgba(16, 185, 129, 0.2);
  }
  50% {
    box-shadow: 0 4px 25px rgba(16, 185, 129, 0.4), 0 0 40px rgba(16, 185, 129, 0.3);
  }
}

@keyframes cta-btn-pulse {
  0%, 100% {
    box-shadow: 0 4px 20px rgba(245, 158, 11, 0.3), 0 0 30px rgba(245, 158, 11, 0.2);
  }
  50% {
    box-shadow: 0 4px 25px rgba(245, 158, 11, 0.4), 0 0 40px rgba(245, 158, 11, 0.3);
  }
}

@keyframes icon-bounce {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  25% {
    transform: translateY(-2px) rotate(5deg);
  }
  50% {
    transform: translateY(0) rotate(0deg);
  }
  75% {
    transform: translateY(-1px) rotate(-5deg);
  }
}

/* Application des animations aux boutons */
.add-btn:not(:hover) {
  animation: add-btn-pulse 3s ease-in-out infinite;
}

.cta-btn:not(:hover) {
  animation: cta-btn-pulse 3s ease-in-out infinite 0.5s;
}

.add-btn:hover svg,
.cta-btn:hover svg {
  animation: icon-bounce 0.6s ease-in-out;
}

/* Vue grille */
.properties-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
}

.property-card {
  background: var(--glass-bg-light);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-large);
  overflow: hidden;
  transition: var(--transition-smooth);
  box-shadow: var(--shadow-card);
}

.property-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-hover);
}

.property-card.low-performance {
  border-color: var(--solar-orange);
  background: rgba(255, 165, 0, 0.03);
}

.property-image {
  position: relative;
  height: 250px;
  overflow: hidden;
}

.property-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: var(--transition-smooth);
}

.property-card:hover .property-image img {
  transform: scale(1.05);
}

.property-status {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.5rem 0.75rem;
  border-radius: var(--border-radius-small);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  backdrop-filter: blur(10px);
}

.property-status.available {
  background: rgba(16, 185, 129, 0.2);
  color: var(--acid-green);
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.property-status.occupied {
  background: rgba(245, 158, 11, 0.2);
  color: var(--solar-orange);
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.property-status.maintenance {
  background: rgba(255, 0, 64, 0.2);
  color: var(--laser-red);
  border: 1px solid rgba(255, 0, 64, 0.3);
}

.property-type {
  position: absolute;
  top: 1rem;
  left: 1rem;
  padding: 0.5rem 0.75rem;
  background: var(--primary-gradient);
  color: white;
  border-radius: var(--border-radius-small);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.property-actions-overlay {
  position: absolute;
  top: 1rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.5rem;
  opacity: 0;
  transition: var(--transition-smooth);
}

.property-card:hover .property-actions-overlay {
  opacity: 1;
}

.overlay-btn {
  width: 2.5rem;
  height: 2.5rem;
  background: var(--glass-bg-medium);
  backdrop-filter: blur(10px);
  border: 1px solid var(--glass-border);
  border-radius: 50%;
  color: var(--text-secondary);
  cursor: pointer;
  transition: var(--transition-smooth);
  display: flex;
  align-items: center;
  justify-content: center;
}

.overlay-btn:hover {
  background: var(--glass-bg-strong);
  color: var(--text-primary);
  transform: scale(1.1);
}

.overlay-btn svg {
  width: 1.25rem;
  height: 1.25rem;
  stroke: currentColor;
}

.property-content {
  padding: 2rem;
}

.property-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  gap: 1rem;
}

.property-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  flex: 1;
}

.performance-indicator {
  display: flex;
  gap: 0.25rem;
  flex-shrink: 0;
}

.performance-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: var(--glass-bg-strong);
  transition: var(--transition-smooth);
}

.performance-dot.active {
  background: var(--electric-blue);
}

.performance-indicator.excellent .performance-dot.active {
  background: var(--acid-green);
}

.performance-indicator.good .performance-dot.active {
  background: var(--electric-blue);
}

.performance-indicator.average .performance-dot.active {
  background: var(--solar-orange);
}

.performance-indicator.poor .performance-dot.active {
  background: var(--laser-red);
}

.property-address {
  color: var(--text-muted);
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
}

.property-features {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.feature {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.feature svg {
  width: 1rem;
  height: 1rem;
  stroke: currentColor;
}

.property-metrics {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 2rem;
}

.metric {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.metric-label {
  font-size: 0.75rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.metric-value {
  font-weight: 700;
  color: var(--text-primary);
}

.metric-value.price {
  color: var(--electric-blue);
  font-size: 1.125rem;
}

.property-actions {
  display: flex;
  gap: 0.75rem;
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border-radius: var(--border-radius-medium);
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
  transition: var(--transition-smooth);
  cursor: pointer;
  border: none;
}

.action-btn.edit {
  background: linear-gradient(135deg, #3B82F6 0%, #2563EB 50%, #1D4ED8 100%);
  border: none;
  color: white;
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3);
  position: relative;
  overflow: hidden;
}

.action-btn.edit::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.action-btn.edit:hover::before {
  left: 100%;
}

.action-btn.edit:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.5);
  background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 50%, #1E40AF 100%);
}

.action-btn.bookings {
  background: linear-gradient(135deg, #F59E0B 0%, #D97706 50%, #B45309 100%);
  border: none;
  color: white;
  box-shadow: 0 4px 16px rgba(245, 158, 11, 0.3);
  position: relative;
  overflow: hidden;
}

.action-btn.bookings::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.action-btn.bookings:hover::before {
  left: 100%;
}

.action-btn.bookings:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 8px 24px rgba(245, 158, 11, 0.5);
  background: linear-gradient(135deg, #D97706 0%, #B45309 50%, #92400E 100%);
}

.action-btn.delete {
  background: linear-gradient(135deg, #EF4444 0%, #DC2626 50%, #B91C1C 100%);
  border: none;
  color: white;
  box-shadow: 0 4px 16px rgba(239, 68, 68, 0.3);
  position: relative;
  overflow: hidden;
}

.action-btn.delete::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.action-btn.delete:hover::before {
  left: 100%;
}

.action-btn.delete:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 8px 24px rgba(239, 68, 68, 0.5);
  background: linear-gradient(135deg, #DC2626 0%, #B91C1C 50%, #991B1B 100%);
}

.action-btn svg {
  width: 1rem;
  height: 1rem;
  stroke: currentColor;
  transition: all 0.3s ease;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.action-btn:hover svg {
  transform: scale(1.1);
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
}

/* Animations spéciales pour les boutons d'action dans les cartes */
.action-btn.edit:hover svg {
  animation: edit-icon-rotate 0.6s ease-in-out;
}

.action-btn.bookings:hover svg {
  animation: bookings-icon-bounce 0.8s ease-in-out;
}

.action-btn.delete:hover svg {
  animation: delete-icon-shake 0.5s ease-in-out;
}

@keyframes edit-icon-rotate {
  0%, 100% { transform: scale(1.1) rotate(0deg); }
  50% { transform: scale(1.2) rotate(10deg); }
}

@keyframes bookings-icon-bounce {
  0%, 100% { transform: scale(1.1) translateY(0); }
  50% { transform: scale(1.2) translateY(-3px); }
}

@keyframes delete-icon-shake {
  0%, 100% { transform: scale(1.1) translateX(0); }
  25% { transform: scale(1.2) translateX(-2px); }
  75% { transform: scale(1.2) translateX(2px); }
}

/* Vue liste */
.properties-list {
  display: grid;
  gap: 0.5rem;
}

.list-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1.5fr;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: var(--glass-bg-strong);
  border-radius: var(--border-radius-medium);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.list-item {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1.5fr;
  gap: 1rem;
  padding: 1.5rem;
  background: var(--glass-bg-light);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-medium);
  transition: var(--transition-smooth);
  align-items: center;
}

.list-item:hover {
  background: var(--glass-bg-medium);
  transform: translateX(5px);
}

.list-item.low-performance {
  border-color: var(--solar-orange);
  background: rgba(255, 165, 0, 0.03);
}

.list-col {
  display: flex;
  align-items: center;
}

.property-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.property-thumbnail {
  width: 60px;
  height: 60px;
  border-radius: var(--border-radius-medium);
  overflow: hidden;
  flex-shrink: 0;
}

.property-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.property-details {
  flex: 1;
}

.property-name {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.property-location {
  font-size: 0.875rem;
  color: var(--text-muted);
  margin-bottom: 0.25rem;
}

.property-specs {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.type-badge,
.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: var(--border-radius-small);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.type-badge.house { background: rgba(59, 130, 246, 0.1); color: var(--electric-blue); }
.type-badge.apartment { background: rgba(16, 185, 129, 0.1); color: var(--acid-green); }
.type-badge.office { background: rgba(245, 158, 11, 0.1); color: var(--solar-orange); }

.status-badge.available { background: rgba(16, 185, 129, 0.1); color: var(--acid-green); }
.status-badge.occupied { background: rgba(245, 158, 11, 0.1); color: var(--solar-orange); }
.status-badge.maintenance { background: rgba(255, 0, 64, 0.1); color: var(--laser-red); }

.price-value {
  font-weight: 700;
  color: var(--electric-blue);
  font-size: 1.125rem;
}

.list-actions {
  display: flex;
  gap: 0.5rem;
}

.list-action-btn {
  width: 2.75rem;
  height: 2.75rem;
  background: #FFFFFF;
  border: 2px solid #E2E8F0;
  border-radius: 50%;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.list-action-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  transform: scale(0);
  transition: transform 0.3s ease;
}

.list-action-btn.edit::before {
  background: linear-gradient(135deg, #3B82F6, #2563EB);
}

.list-action-btn.bookings::before {
  background: linear-gradient(135deg, #F59E0B, #D97706);
}

.list-action-btn.delete::before {
  background: linear-gradient(135deg, #EF4444, #DC2626);
}

.list-action-btn:hover::before {
  transform: scale(1);
}

.list-action-btn:hover {
  color: white;
  transform: scale(1.15);
  border-color: transparent;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.list-action-btn.edit:hover {
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.4);
}

.list-action-btn.bookings:hover {
  box-shadow: 0 4px 16px rgba(245, 158, 11, 0.4);
}

.list-action-btn.delete:hover {
  box-shadow: 0 4px 16px rgba(239, 68, 68, 0.4);
}

.list-action-btn svg {
  width: 1rem;
  height: 1rem;
  stroke: currentColor;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
}

.list-action-btn:hover svg {
  transform: scale(1.1);
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

/* Animations spéciales pour chaque type de bouton */
@keyframes edit-bounce {
  0%, 100% { transform: scale(1.15) rotate(0deg); }
  50% { transform: scale(1.2) rotate(5deg); }
}

@keyframes bookings-pulse {
  0%, 100% { transform: scale(1.15); }
  50% { transform: scale(1.25); }
}

@keyframes delete-shake {
  0%, 100% { transform: scale(1.15) translateX(0); }
  25% { transform: scale(1.2) translateX(-2px); }
  75% { transform: scale(1.2) translateX(2px); }
}

.list-action-btn.edit:hover {
  animation: edit-bounce 0.6s ease-in-out;
}

.list-action-btn.bookings:hover {
  animation: bookings-pulse 0.8s ease-in-out;
}

.list-action-btn.delete:hover {
  animation: delete-shake 0.5s ease-in-out;
}

/* Animation pour les boutons de vue */
@keyframes view-button-activate {
  0% { transform: translateY(-2px) scale(1); }
  50% { transform: translateY(-4px) scale(1.05); }
  100% { transform: translateY(-2px) scale(1); }
}

.view-btn.active {
  animation: view-button-activate 0.5s ease-out;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--glass-border);
}

.pagination-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: var(--glass-bg-medium);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-medium);
  color: var(--text-secondary);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition-smooth);
}

.pagination-btn:not(:disabled):hover {
  background: var(--glass-bg-strong);
  color: var(--text-primary);
  border-color: var(--electric-blue);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-btn svg {
  width: 1rem;
  height: 1rem;
  stroke: currentColor;
}

.pagination-info {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fade-in 0.3s ease-out;
}

.modal-content {
  background: var(--glass-bg-medium);
  backdrop-filter: blur(30px);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-large);
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  animation: slide-up 0.3s ease-out;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 2rem 1rem;
  border-bottom: 1px solid var(--glass-border);
}

.modal-header h3 {
  color: var(--text-primary);
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
}

.close-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: var(--border-radius-small);
  transition: var(--transition-smooth);
}

.close-btn:hover {
  color: var(--text-primary);
  background: var(--glass-bg-light);
}

.close-btn svg {
  width: 1.25rem;
  height: 1.25rem;
  stroke: currentColor;
}

.modal-body {
  padding: 2rem;
  text-align: center;
}

.warning-icon {
  width: 4rem;
  height: 4rem;
  background: rgba(245, 158, 11, 0.1);
  border: 2px solid var(--solar-orange);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  color: var(--solar-orange);
}

.warning-icon svg {
  width: 2rem;
  height: 2rem;
  stroke: currentColor;
}

.modal-body h4 {
  color: var(--text-primary);
  margin-bottom: 1rem;
  font-size: 1.125rem;
}

.modal-body p {
  color: var(--text-secondary);
  line-height: 1.6;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  padding: 1rem 2rem 2rem;
  justify-content: flex-end;
}

.btn {
  padding: 0.875rem 1.5rem;
  border-radius: var(--border-radius-medium);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition-smooth);
  border: none;
}

.btn.secondary {
  background: var(--glass-bg-medium);
  border: 1px solid var(--glass-border);
  color: var(--text-secondary);
}

.btn.secondary:hover {
  background: var(--glass-bg-strong);
  color: var(--text-primary);
}

.btn.danger {
  background: var(--danger-gradient, linear-gradient(135deg, #ef4444, #dc2626));
  color: white;
}

.btn.danger:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 20px rgba(239, 68, 68, 0.5);
}

/* Animations */
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slide-up {
  from { 
    opacity: 0;
    transform: translateY(50px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 1024px) {
  .header-content {
    flex-direction: column;
    text-align: center;
  }
  
  .filter-groups {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .quick-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .section-header {
    flex-direction: column;
    gap: 1rem;
  }
  
  .properties-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
  
  .list-header,
  .list-item {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
  
  .list-header {
    display: none;
  }
  
  .list-item {
    padding: 1rem;
  }
  
  .list-col {
    justify-content: space-between;
    padding: 0.5rem 0;
    border-bottom: 1px solid var(--glass-border);
  }
  
  .list-col:last-child {
    border-bottom: none;
  }
  
  .list-col::before {
    content: attr(data-label);
    font-weight: 600;
    color: var(--text-secondary);
    text-transform: uppercase;
    font-size: 0.75rem;
  }
}

@media (max-width: 768px) {
  .properties-management {
    padding: 1rem;
  }
  
  .management-header,
  .filters-section,
  .properties-section {
    padding: 1.5rem;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .filter-groups {
    grid-template-columns: 1fr;
  }
  
  .quick-stats {
    grid-template-columns: 1fr;
  }
  
  .properties-grid {
    grid-template-columns: 1fr;
  }
  
  .property-actions {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .pagination {
    flex-direction: column;
    gap: 1rem;
  }
  
  .modal-content {
    width: 95%;
    margin: 1rem;
  }
  
  .modal-actions {
    flex-direction: column;
  }
}
</style>
