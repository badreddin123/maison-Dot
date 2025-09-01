<template>
  <div class="properties-view">
    <!-- En-tête Hero -->
    <div class="hero-section">
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title client-hero-title">Découvrez des propriétés exceptionnelles</h1>
          <p class="hero-subtitle">
            Trouvez votre lieu parfait parmi notre sélection premium de maisons, appartements et bureaux
          </p>
        </div>
        
        <!-- Barre de recherche principale -->
        <div class="search-hero">
          <div class="search-container">
            <div class="search-input-group">
              <div class="search-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="M21 21l-4.35-4.35"/>
                </svg>
              </div>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Rechercher par ville, quartier ou nom..."
                class="search-input"
                @input="debouncedSearch"
              />
              <button v-if="searchQuery" @click="clearSearch" class="clear-search">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            
            <button @click="toggleFilters" class="filters-toggle ultra-modern-btn ultra-modern-btn-outline" :class="{ active: showFilters }">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"/>
              </svg>
              Filtres
              <span v-if="activeFiltersCount > 0" class="filters-count">{{ activeFiltersCount }}</span>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Particules d'arrière-plan -->
      <div class="hero-particles">
        <div v-for="i in 20" :key="i" class="particle" :style="getParticleStyle()"></div>
      </div>
    </div>

    <!-- Panneau de filtres -->
    <transition name="filters-slide">
      <div v-if="showFilters" class="filters-panel">
        <div class="filters-content">
          <div class="filters-header">
            <h3>Affiner votre recherche</h3>
            <button @click="resetFilters" class="reset-btn ultra-modern-btn ultra-modern-btn-secondary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              Réinitialiser
            </button>
          </div>
          
          <div class="filters-grid">
            <!-- Type de propriété -->
            <div class="filter-group">
              <label class="filter-label">Type de propriété</label>
              <div class="filter-buttons">
                <button
                  v-for="type in propertyTypes"
                  :key="type.value"
                  @click="toggleFilter('type', type.value)"
                  :class="{ active: filters.type.includes(type.value) }"
                  class="filter-btn ultra-modern-btn ultra-modern-btn-outline"
                >
                  <div class="filter-icon" v-html="type.icon"></div>
                  {{ type.label }}
                </button>
              </div>
            </div>
            
            <!-- Prix par nuit -->
            <div class="filter-group">
              <label class="filter-label">Prix par nuit</label>
              <div class="price-range">
                <div class="price-inputs">
                  <input
                    v-model="filters.minPrice"
                    type="number"
                    placeholder="Min"
                    class="price-input ultra-modern-input"
                    @input="applyFilters"
                  />
                  <span class="price-separator">-</span>
                  <input
                    v-model="filters.maxPrice"
                    type="number"
                    placeholder="Max"
                    class="price-input ultra-modern-input"
                    @input="applyFilters"
                  />
                </div>
                <div class="price-slider">
                  <input
                    v-model="filters.priceRange"
                    type="range"
                    min="0"
                    max="1000"
                    step="50"
                    class="range-slider"
                    @input="updatePriceFromSlider"
                  />
                </div>
              </div>
            </div>
            
            <!-- Nombre de chambres -->
            <div class="filter-group">
              <label class="filter-label">Chambres</label>
              <div class="filter-buttons">
                <button
                  v-for="room in roomOptions"
                  :key="room"
                  @click="toggleFilter('bedrooms', room)"
                  :class="{ active: filters.bedrooms.includes(room) }"
                  class="filter-btn room-btn ultra-modern-btn ultra-modern-btn-outline"
                >
                  {{ room }}{{ room === '4+' ? '' : room === '1' ? ' ch' : ' ch' }}
                </button>
              </div>
            </div>
            
            <!-- Équipements -->
            <div class="filter-group">
              <label class="filter-label">Équipements</label>
              <div class="amenities-grid">
                <label
                  v-for="amenity in amenities"
                  :key="amenity.value"
                  class="amenity-checkbox"
                >
                  <input
                    v-model="filters.amenities"
                    :value="amenity.value"
                    type="checkbox"
                    @change="applyFilters"
                  />
                  <span class="checkmark"></span>
                  <div class="amenity-icon" v-html="amenity.icon"></div>
                  <span class="amenity-label">{{ amenity.label }}</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Résultats et tri -->
    <div class="results-section">
      <div class="results-header">
        <div class="results-info">
          <h2 class="results-title ultra-modern-text-gradient">
            {{ filteredProperties.length }} {{ filteredProperties.length === 1 ? 'propriété trouvée' : 'propriétés trouvées' }}
          </h2>
          <p v-if="searchQuery" class="search-info">
            Résultats pour "<strong>{{ searchQuery }}</strong>"
          </p>
        </div>
        
        <div class="results-controls">
          <div class="view-toggle">
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
            </button>
          </div>
          
          <select v-model="sortBy" @change="applySorting" class="sort-select ultra-modern-select">
            <option value="featured">Mises en avant</option>
            <option value="price_asc">Prix croissant</option>
            <option value="price_desc">Prix décroissant</option>
            <option value="newest">Plus récentes</option>
            <option value="rating">Mieux notées</option>
          </select>
        </div>
      </div>
      
      <!-- États de chargement et vide -->
      <div v-if="propertiesStore.isLoading" class="loading-state">
        <div class="cyber-spinner"></div>
        <p>Chargement des propriétés...</p>
      </div>
      
      <div v-else-if="propertiesStore.error" class="error-state">
        <div class="error-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <h3>Erreur de chargement</h3>
        <p>{{ propertiesStore.error }}</p>
        <button @click="retryLoadProperties" class="retry-btn ultra-modern-btn ultra-modern-btn-danger">
          Réessayer
        </button>
      </div>
      
      <div v-else-if="filteredProperties.length === 0 && propertiesStore.properties.length === 0" class="empty-state">
        <div class="empty-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10"/>
            <path d="M16 16l-4-4-4 4"/>
            <path d="M12 8v8"/>
          </svg>
        </div>
        <h3>Aucune propriété disponible</h3>
        <p>Il n'y a actuellement aucune propriété disponible dans notre catalogue.</p>
        <button @click="retryLoadProperties" class="retry-btn ultra-modern-btn ultra-modern-btn-primary">
          Actualiser
        </button>
        <button @click="testApiDirect" class="test-btn" style="margin-left: 10px; background: orange;">
          Test API Direct
        </button>
        <button @click="testStoreFunction" class="test-btn" style="margin-left: 10px; background: blue;">
          Test Store
        </button>
      </div>
      
      <div v-else-if="filteredProperties.length === 0" class="empty-state">
        <div class="empty-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10"/>
            <path d="M16 16l-4-4-4 4"/>
            <path d="M12 8v8"/>
          </svg>
        </div>
        <h3>Aucune propriété trouvée</h3>
        <p>Essayez de modifier vos critères de recherche ou explorez d'autres options.</p>
        <button @click="resetFilters" class="reset-search-btn ultra-modern-btn ultra-modern-btn-primary">
          Réinitialiser les filtres
        </button>
      </div>
      
      <!-- Vue grille -->
      <div v-else-if="viewMode === 'grid'" class="properties-grid">
                  <div
            v-for="(property, index) in paginatedProperties"
            :key="property.id"
            class="property-card ultra-modern-card ultra-modern-animate-fade-scale"
            :style="{ animationDelay: `${index * 0.1}s` }"
            @click="viewProperty(property.id)"
          >
          <div class="property-image">
            <img
              :src="getPropertyImageUrl(property.images?.[0]) || '/placeholder-property.svg'"
              :alt="property.title"
              @error="handleImageError"
            />
            <div class="property-overlay">
              <div class="property-actions">
                <button @click.stop="toggleFavorite(property.id)" class="action-btn favorite">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                  </svg>
                </button>
                <button @click.stop="shareProperty(property)" class="action-btn share">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"/>
                  </svg>
                </button>
              </div>
              <div class="property-badges">
                <span class="type-badge" :class="property.type">
                  {{ getTypeLabel(property.type) }}
                </span>
                <span v-if="property.featured" class="featured-badge">
                  ⭐ Coup de cœur
                </span>
              </div>
            </div>
          </div>
          
          <div class="property-content">
            <div class="property-header">
              <h3 class="property-title">{{ property.title }}</h3>
              <div class="property-rating">
                <div class="stars">
                  <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= (property.rating || 0) }">★</span>
                </div>
                <span class="rating-text">({{ property.reviewsCount || 0 }})</span>
              </div>
            </div>
            
            <p class="property-location">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              {{ property.address }}
            </p>
            
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
            
            <div class="property-price">
              <span class="price-amount">{{ formatPrice(property.price_per_night) }}</span>
              <span class="price-period">/ nuit</span>
            </div>
            
            <button @click.stop="bookProperty(property)" class="book-btn ultra-modern-btn ultra-modern-btn-primary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              Réserver maintenant
            </button>
          </div>
        </div>
      </div>
      
      <!-- Vue liste -->
      <div v-else class="properties-list">
        <div
          v-for="(property, index) in paginatedProperties"
          :key="property.id"
          class="property-list-item"
          :style="{ animationDelay: `${index * 0.05}s` }"
          @click="viewProperty(property.id)"
        >
          <div class="list-image">
            <img
              :src="getPropertyImageUrl(property.images?.[0]) || '/placeholder-property.svg'"
              :alt="property.title"
              @error="handleImageError"
            />
            <div class="list-badges">
              <span class="type-badge" :class="property.type">
                {{ getTypeLabel(property.type) }}
              </span>
            </div>
          </div>
          
          <div class="list-content">
            <div class="list-header">
              <h3 class="list-title">{{ property.title }}</h3>
              <div class="list-actions">
                <button @click.stop="toggleFavorite(property.id)" class="list-action-btn favorite">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                  </svg>
                </button>
                <div class="list-price">
                  <span class="price-amount">{{ formatPrice(property.price_per_night) }}</span>
                  <span class="price-period">/ nuit</span>
                </div>
              </div>
            </div>
            
            <p class="list-location">{{ property.address }}</p>
            
            <div class="list-features">
              <span class="feature">{{ property.bedrooms }} ch.</span>
              <span class="feature">{{ property.bathrooms }} sdb</span>
              <span v-if="property.area" class="feature">{{ property.area }} m²</span>
            </div>
            
            <div class="list-rating">
              <div class="stars">
                <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= (property.rating || 0) }">★</span>
              </div>
              <span class="rating-text">({{ property.reviewsCount || 0 }} avis)</span>
            </div>
            
            <button @click.stop="bookProperty(property)" class="list-book-btn ultra-modern-btn ultra-modern-btn-primary">
              Réserver
            </button>
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
        
        <div class="pagination-numbers">
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="currentPage = page"
            :class="{ active: currentPage === page }"
            class="pagination-number"
          >
            {{ page }}
          </button>
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
const showFilters = ref(false)
const viewMode = ref<'grid' | 'list'>('grid')
const currentPage = ref(1)
const itemsPerPage = ref(12)
const sortBy = ref('featured')

const filters = ref({
  type: [] as string[],
  minPrice: '',
  maxPrice: '',
  priceRange: 500,
  bedrooms: [] as string[],
  amenities: [] as string[]
})

// Options de filtres
const propertyTypes = [
  { 
    value: 'house', 
    label: 'Maisons',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>'
  },
  { 
    value: 'apartment', 
    label: 'Appartements',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>'
  },
  { 
    value: 'office', 
    label: 'Bureaux',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6"/></svg>'
  }
]

const roomOptions = ['1', '2', '3', '4+']

const amenities = [
  { value: 'wifi', label: 'WiFi', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M1.42 9.007a16.997 16.997 0 0121.16 0m-18.34 2.993a12.996 12.996 0 0115.52 0M6.34 15.002a5.995 5.995 0 018.32 0l-2.44-2.44m-1.44 3.44v.01"/></svg>' },
  { value: 'parking', label: 'Parking', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="14" y="14" width="4" height="6" rx="2"/><rect x="6" y="4" width="4" height="6" rx="2"/><path d="M6 20h4"/><path d="M14 10h4"/><path d="M6 14h2l3.5-3.5L15 7h3l4.5 4.5"/><path d="M12 6l-3-3 9 9"/></svg>' },
  { value: 'pool', label: 'Piscine', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M2 20a2.5 2.5 0 005 0 2.5 2.5 0 005 0 2.5 2.5 0 005 0 2.5 2.5 0 005 0"/><path d="M2 16a2.5 2.5 0 005 0 2.5 2.5 0 005 0 2.5 2.5 0 005 0 2.5 2.5 0 005 0"/><path d="M12 4L8 8l8 4-8 4 4 4"/></svg>' },
  { value: 'gym', label: 'Salle de sport', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M7.4 7.4L4.6 4.6m0 0L1.8 1.8m2.8 2.8c4.2-4.2 11-4.2 15.2 0s4.2 11 0 15.2"/></svg>' }
]

// Computed
const filteredProperties = computed(() => {
  let properties = [...propertiesStore.properties]
  
  // Filtrage par recherche
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    properties = properties.filter(property =>
      property.title.toLowerCase().includes(query) ||
      property.address.toLowerCase().includes(query)
    )
  }
  
  // Filtrage par type
  if (filters.value.type.length > 0) {
    properties = properties.filter(property => filters.value.type.includes(property.type))
  }
  
  // Filtrage par prix
  if (filters.value.minPrice) {
    properties = properties.filter(property => property.price_per_night >= Number(filters.value.minPrice))
  }
  
  if (filters.value.maxPrice) {
    properties = properties.filter(property => property.price_per_night <= Number(filters.value.maxPrice))
  }
  
  // Filtrage par chambres
  if (filters.value.bedrooms.length > 0) {
    properties = properties.filter(property => {
      return filters.value.bedrooms.some(bedroom => {
        if (bedroom === '4+') return property.bedrooms >= 4
        return property.bedrooms === Number(bedroom)
      })
    })
  }
  
  // Tri
  properties.sort((a, b) => {
    switch (sortBy.value) {
      case 'price_asc':
        return a.price_per_night - b.price_per_night
      case 'price_desc':
        return b.price_per_night - a.price_per_night
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      case 'rating':
        return (b.rating || 0) - (a.rating || 0)
      default: // featured
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
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

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, currentPage.value + 2)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

const activeFiltersCount = computed(() => {
  let count = 0
  if (filters.value.type.length > 0) count++
  if (filters.value.minPrice || filters.value.maxPrice) count++
  if (filters.value.bedrooms.length > 0) count++
  if (filters.value.amenities.length > 0) count++
  return count
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

const getTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    house: 'Maison',
    apartment: 'Appartement',
    office: 'Bureau'
  }
  return labels[type] || type
}

const getParticleStyle = () => {
  return {
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 5}s`,
    animationDuration: `${3 + Math.random() * 4}s`
  }
}

const getPropertyImageUrl = (imagePath?: string) => {
  if (!imagePath) return null
  
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

const toggleFilters = () => {
  showFilters.value = !showFilters.value
}

const toggleFilter = (filterType: string, value: string) => {
  const filterArray = filters.value[filterType as keyof typeof filters.value] as string[]
  const index = filterArray.indexOf(value)
  
  if (index > -1) {
    filterArray.splice(index, 1)
  } else {
    filterArray.push(value)
  }
  
  applyFilters()
}

const applyFilters = () => {
  currentPage.value = 1
}

const resetFilters = () => {
  filters.value = {
    type: [],
    minPrice: '',
    maxPrice: '',
    priceRange: 500,
    bedrooms: [],
    amenities: []
  }
  searchQuery.value = ''
  currentPage.value = 1
}

const retryLoadProperties = async () => {
  try {
    console.log('Nouvelle tentative de chargement des propriétés...')
    propertiesStore.clearError()
    await propertiesStore.fetchProperties()
    console.log('Propriétés rechargées:', propertiesStore.properties.length)
  } catch (error) {
    console.error('Erreur lors du rechargement des propriétés:', error)
  }
}

const clearSearch = () => {
  searchQuery.value = ''
  currentPage.value = 1
}

const updatePriceFromSlider = () => {
  filters.value.maxPrice = filters.value.priceRange.toString()
  applyFilters()
}

const applySorting = () => {
  currentPage.value = 1
}

const toggleFavorite = (propertyId: number) => {
  // Implémentation du système de favoris
  console.log('Toggle favorite for property:', propertyId)
}

const shareProperty = (property: Property) => {
  // Implémentation du partage
  console.log('Share property:', property)
}

const viewProperty = (propertyId: number) => {
  router.push(`/client/properties/${propertyId}`)
}

const testApiDirect = async () => {
  try {
    console.log('Test API direct...')
    const response = await fetch('http://localhost:8000/api/properties')
    const data = await response.json()
    console.log('Réponse API directe:', data)
    console.log('Status:', response.status)
    console.log('Nombre de propriétés dans la réponse:', data.properties?.data?.length || 'N/A')
  } catch (error) {
    console.error('Erreur test API direct:', error)
  }
}

const testStoreFunction = async () => {
  try {
    console.log('Test store fetchProperties...')
    console.log('Store avant appel:', {
      properties: propertiesStore.properties.length,
      isLoading: propertiesStore.isLoading,
      error: propertiesStore.error
    })
    
    const result = await propertiesStore.fetchProperties()
    
    console.log('Résultat fetchProperties:', result)
    console.log('Store après appel:', {
      properties: propertiesStore.properties.length,
      isLoading: propertiesStore.isLoading,
      error: propertiesStore.error
    })
  } catch (error) {
    console.error('Erreur test store:', error)
  }
}

const bookProperty = (property: Property) => {
  router.push(`/client/properties/${property.id}?book=true`)
}

// Watchers
watch(() => filteredProperties.value.length, () => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = 1
  }
})

// Lifecycle
onMounted(async () => {
  try {
    console.log('=== DÉBUT CHARGEMENT PROPRIÉTÉS ===')
    console.log('Store avant chargement:', {
      properties: propertiesStore.properties,
      isLoading: propertiesStore.isLoading,
      error: propertiesStore.error
    })
    
    console.log('Chargement des propriétés...')
    const result = await propertiesStore.fetchProperties()
    
    console.log('Résultat du chargement:', result)
    console.log('Store après chargement:', {
      properties: propertiesStore.properties.length,
      isLoading: propertiesStore.isLoading,
      error: propertiesStore.error
    })
    
    if (propertiesStore.properties.length > 0) {
      console.log('Première propriété:', propertiesStore.properties[0])
    }
    
    console.log('Propriétés chargées:', propertiesStore.properties.length)
    console.log('=== FIN CHARGEMENT PROPRIÉTÉS ===')
    
    // Exposer des fonctions utiles au global pour debug
    if (typeof window !== 'undefined') {
      const globalWindow = window as typeof window & {
        debugStore?: typeof propertiesStore;
        testApiDirect?: typeof testApiDirect;
        testStoreFunction?: typeof testStoreFunction;
      };
      globalWindow.debugStore = propertiesStore;
      globalWindow.testApiDirect = testApiDirect;
      globalWindow.testStoreFunction = testStoreFunction;
      console.log('🔧 Fonctions de debug exposées: window.debugStore, window.testApiDirect, window.testStoreFunction')
    }
  } catch (error) {
    console.error('Erreur lors du chargement des propriétés:', error)
  }
})
</script>

<style scoped>
@import url('../../assets/cyber-theme.css');
@import url('../../assets/ultra-modern-theme.css');

.properties-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #F8FAFC 0%, #EDF2F7 50%, #E2E8F0 100%);
}

/* Hero Section */
.hero-section {
  position: relative;
  background: linear-gradient(135deg, #4300FF 0%, #0065F8 50%, #00CAFF 100%);
  padding: 6rem 2rem 4rem;
  overflow: hidden;
}

.hero-content {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  position: relative;
  z-index: 10;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 900;
  margin-bottom: 1rem;
  color: white !important;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  animation: hero-title-glow 3s ease-in-out infinite alternate;
}

.client-hero-title {
  color: white !important;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.5) !important;
  animation: client-hero-glow 3s ease-in-out infinite alternate !important;
}

@keyframes client-hero-glow {
  0% { 
    text-shadow: 0 0 40px rgba(67, 0, 255, 0.4), 0 0 80px rgba(0, 101, 248, 0.2);
  }
  100% { 
    text-shadow: 0 0 60px rgba(67, 0, 255, 0.6), 0 0 120px rgba(0, 101, 248, 0.3), 0 0 160px rgba(0, 202, 255, 0.1);
  }
}

@keyframes hero-title-glow {
  0% { text-shadow: 0 0 40px rgba(0, 229, 255, 0.3); }
  100% { text-shadow: 0 0 60px rgba(0, 229, 255, 0.5); }
}

.hero-subtitle {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.95) !important;
  margin-bottom: 3rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.search-hero {
  max-width: 800px;
  margin: 0 auto;
}

.search-container {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.search-input-group {
  flex: 1;
  position: relative;
}

.search-icon {
  position: absolute;
  left: 1.5rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.5rem;
  height: 1.5rem;
  color: var(--text-muted);
  z-index: 2;
}

.search-icon svg {
  width: 100%;
  height: 100%;
  stroke: currentColor;
}

.search-input {
  width: 100%;
  padding: 1.5rem 1.5rem 1.5rem 4rem;
  background: rgba(248, 250, 252, 0.95) !important;
  backdrop-filter: blur(20px);
  border: 2px solid rgba(67, 0, 255, 0.3) !important;
  border-radius: var(--border-radius-large);
  color: #1E293B !important;
  font-size: 1.125rem;
  transition: var(--transition-smooth);
  box-shadow: 0 4px 20px rgba(67, 0, 255, 0.2) !important;
}

.search-input:focus {
  outline: none;
  border-color: #0065F8 !important;
  background: rgba(248, 250, 252, 1) !important;
  box-shadow: 0 6px 25px rgba(0, 101, 248, 0.4) !important;
}

.search-input::placeholder {
  color: #64748B !important;
}

.clear-search {
  position: absolute;
  right: 1.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  width: 1.5rem;
  height: 1.5rem;
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

.filters-toggle {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem 2rem;
  background: var(--glass-bg-medium);
  backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-large);
  color: var(--text-primary);
  font-size: 1.125rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition-smooth);
  position: relative;
  white-space: nowrap;
}

.filters-toggle:hover {
  background: var(--glass-bg-strong);
  border-color: var(--electric-blue);
}

.filters-toggle.active {
  background: var(--primary-gradient);
  color: white;
  border-color: var(--electric-blue);
}

.filters-toggle svg {
  width: 1.25rem;
  height: 1.25rem;
  stroke: currentColor;
}

.filters-count {
  position: absolute;
  top: -0.5rem;
  right: -0.5rem;
  width: 1.5rem;
  height: 1.5rem;
  background: var(--laser-red);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  animation: filter-count-pulse 2s ease-in-out infinite;
}

@keyframes filter-count-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.hero-particles {
  position: absolute;
  inset: 0;
}

.particle {
  position: absolute;
  width: 3px;
  height: 3px;
  background: var(--electric-blue);
  border-radius: 50%;
  animation: particle-float linear infinite;
  box-shadow: 0 0 8px var(--electric-blue);
}

.particle:nth-child(odd) {
  background: var(--neon-pink);
  box-shadow: 0 0 8px var(--neon-pink);
}

.particle:nth-child(3n) {
  background: var(--acid-green);
  box-shadow: 0 0 8px var(--acid-green);
}

@keyframes particle-float {
  0% {
    transform: translateY(100vh) translateX(0px) scale(0);
    opacity: 0;
  }
  5% {
    opacity: 1;
  }
  50% {
    transform: translateY(50vh) translateX(30px) scale(1);
    opacity: 0.8;
  }
  95% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) translateX(-15px) scale(0.3);
    opacity: 0;
  }
}

/* Panneau de filtres */
.filters-slide-enter-active,
.filters-slide-leave-active {
  transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.filters-slide-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.filters-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.filters-panel {
  background: var(--glass-bg-medium);
  backdrop-filter: blur(30px);
  border-bottom: 1px solid var(--glass-border);
  padding: 2rem;
}

.filters-content {
  max-width: 1200px;
  margin: 0 auto;
}

.filters-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.filters-header h3 {
  color: var(--text-primary);
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
}

.reset-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: var(--glass-bg-light);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-medium);
  color: var(--text-secondary);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition-smooth);
}

.reset-btn:hover {
  background: var(--glass-bg-strong);
  color: var(--text-primary);
  border-color: var(--electric-blue);
}

.reset-btn svg {
  width: 1rem;
  height: 1rem;
  stroke: currentColor;
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.filter-label {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.filter-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.25rem;
  background: var(--glass-bg-light);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-medium);
  color: var(--text-secondary);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition-smooth);
  min-width: 120px;
  justify-content: center;
}

.filter-btn:hover {
  background: var(--glass-bg-medium);
  color: var(--text-primary);
}

.filter-btn.active {
  background: var(--primary-gradient);
  color: white;
  border-color: var(--electric-blue);
  box-shadow: var(--shadow-neon-blue);
}

.filter-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.filter-icon svg {
  width: 100%;
  height: 100%;
  stroke: currentColor;
}

.room-btn {
  min-width: 80px;
}

.price-range {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.price-inputs {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.price-input {
  flex: 1;
  padding: 0.875rem 1rem;
  background: var(--glass-bg-light);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-medium);
  color: var(--text-primary);
  font-size: 1rem;
  transition: var(--transition-smooth);
}

.price-input:focus {
  outline: none;
  border-color: var(--electric-blue);
  background: var(--glass-bg-medium);
}

.price-input::placeholder {
  color: var(--text-muted);
}

.price-separator {
  color: var(--text-muted);
  font-weight: 600;
}

.price-slider {
  margin-top: 0.5rem;
}

.range-slider {
  width: 100%;
  height: 6px;
  background: var(--glass-bg-strong);
  border-radius: 3px;
  outline: none;
  -webkit-appearance: none;
  appearance: none;
}

.range-slider::-webkit-slider-thumb {
  appearance: none;
  width: 20px;
  height: 20px;
  background: var(--primary-gradient);
  border-radius: 50%;
  cursor: pointer;
  box-shadow: var(--shadow-neon-blue);
}

.range-slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  background: var(--primary-gradient);
  border-radius: 50%;
  cursor: pointer;
  border: none;
  box-shadow: var(--shadow-neon-blue);
}

.amenities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.amenity-checkbox {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: var(--glass-bg-light);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-medium);
  cursor: pointer;
  transition: var(--transition-smooth);
}

.amenity-checkbox:hover {
  background: var(--glass-bg-medium);
}

.amenity-checkbox input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.checkmark {
  width: 1.5rem;
  height: 1.5rem;
  background: var(--glass-bg-medium);
  border: 2px solid var(--glass-border);
  border-radius: 0.375rem;
  position: relative;
  transition: var(--transition-smooth);
  flex-shrink: 0;
}

.amenity-checkbox input:checked ~ .checkmark {
  background: var(--primary-gradient);
  border-color: var(--electric-blue);
  box-shadow: var(--shadow-neon-blue);
}

.amenity-checkbox input:checked ~ .checkmark::after {
  content: '';
  position: absolute;
  left: 0.375rem;
  top: 0.125rem;
  width: 0.375rem;
  height: 0.625rem;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.amenity-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--text-muted);
}

.amenity-checkbox input:checked ~ .amenity-icon {
  color: var(--electric-blue);
}

.amenity-icon svg {
  width: 100%;
  height: 100%;
  stroke: currentColor;
}

.amenity-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.amenity-checkbox input:checked ~ .amenity-label {
  color: var(--text-primary);
}

/* Section des résultats */
.results-section {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 2rem;
}

.results-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.search-info {
  color: var(--text-secondary);
  margin: 0;
}

.results-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.view-toggle {
  display: flex;
  gap: 0.5rem;
}

.view-btn {
  padding: 0.75rem;
  background: var(--glass-bg-light);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-medium);
  color: var(--text-secondary);
  cursor: pointer;
  transition: var(--transition-smooth);
}

.view-btn.active {
  background: var(--primary-gradient);
  color: white;
  border-color: var(--electric-blue);
}

.view-btn:not(.active):hover {
  background: var(--glass-bg-medium);
  color: var(--text-primary);
}

.view-btn svg {
  width: 1.25rem;
  height: 1.25rem;
  stroke: currentColor;
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
  min-width: 160px;
}

.sort-select:focus {
  outline: none;
  border-color: var(--electric-blue);
  background-color: var(--glass-bg-medium);
}

/* États de chargement et vide */
.loading-state,
.empty-state,
.error-state {
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

.empty-icon,
.error-icon {
  width: 4rem;
  height: 4rem;
  margin: 0 auto 1.5rem;
  color: var(--text-muted);
}

.error-icon {
  color: var(--laser-red);
}

.empty-icon svg,
.error-icon svg {
  width: 100%;
  height: 100%;
  stroke: currentColor;
}

.empty-state h3,
.error-state h3 {
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
}

.error-state h3 {
  color: var(--laser-red);
}

.empty-state p,
.error-state p {
  margin-bottom: 2rem;
  font-size: 1.125rem;
}

.reset-search-btn,
.retry-btn {
  padding: 1rem 2rem;
  background: var(--primary-gradient);
  color: white;
  border: none;
  border-radius: var(--border-radius-medium);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition-smooth);
  box-shadow: var(--shadow-neon-blue);
}

.retry-btn {
  background: linear-gradient(135deg, var(--laser-red), #dc2626);
  box-shadow: 0 0 20px rgba(239, 68, 68, 0.3);
}

.reset-search-btn:hover,
.retry-btn:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-cyber);
}

/* Vue grille */
.properties-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 2rem;
}

.property-card {
  background: white !important;
  border: 2px solid rgba(67, 0, 255, 0.2) !important;
  border-radius: var(--border-radius-large);
  overflow: hidden;
  transition: var(--transition-smooth);
  cursor: pointer;
  animation: fade-in-up 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(30px);
  box-shadow: 0 8px 32px rgba(67, 0, 255, 0.15) !important;
}

@keyframes fade-in-up {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.property-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 45px rgba(67, 0, 255, 0.25) !important;
  border-color: rgba(0, 101, 248, 0.4) !important;
}

.property-image {
  position: relative;
  height: 280px;
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

.property-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.2) 0%,
    rgba(0, 0, 0, 0) 50%,
    rgba(0, 0, 0, 0.4) 100%
  );
  opacity: 0;
  transition: var(--transition-smooth);
}

.property-card:hover .property-overlay {
  opacity: 1;
}

.property-actions {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  gap: 0.5rem;
  opacity: 0;
  transition: var(--transition-smooth);
}

.property-card:hover .property-actions {
  opacity: 1;
}

.action-btn {
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

.action-btn:hover {
  background: var(--glass-bg-strong);
  color: var(--text-primary);
  transform: scale(1.1);
}

.action-btn.favorite:hover {
  color: var(--laser-red);
  border-color: var(--laser-red);
}

.action-btn.share:hover {
  color: var(--electric-blue);
  border-color: var(--electric-blue);
}

.action-btn svg {
  width: 1.25rem;
  height: 1.25rem;
  stroke: currentColor;
}

.property-badges {
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.type-badge {
  padding: 0.5rem 0.75rem;
  border-radius: var(--border-radius-small);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  backdrop-filter: blur(10px);
}

.type-badge.house {
  background: rgba(59, 130, 246, 0.2);
  color: var(--electric-blue);
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.type-badge.apartment {
  background: rgba(16, 185, 129, 0.2);
  color: var(--acid-green);
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.type-badge.office {
  background: rgba(245, 158, 11, 0.2);
  color: var(--solar-orange);
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.featured-badge {
  padding: 0.5rem 0.75rem;
  background: rgba(255, 215, 0, 0.2);
  color: #ffd700;
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: var(--border-radius-small);
  font-size: 0.75rem;
  font-weight: 600;
  backdrop-filter: blur(10px);
  animation: featured-glow 2s ease-in-out infinite alternate;
}

@keyframes featured-glow {
  0% { box-shadow: 0 0 10px rgba(255, 215, 0, 0.3); }
  100% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.6); }
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
  color: #1E293B !important;
  margin: 0;
  flex: 1;
}

.property-rating {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
}

.stars {
  display: flex;
  gap: 0.125rem;
}

.star {
  font-size: 1rem;
  color: #666;
}

.star.filled {
  color: #ffd700;
}

.rating-text {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.property-location {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #64748B !important;
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
}

.property-location svg {
  width: 1rem;
  height: 1rem;
  stroke: currentColor;
  flex-shrink: 0;
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

.property-price {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.price-amount {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--electric-blue);
}

.price-period {
  font-size: 0.875rem;
  color: var(--text-muted);
}

.book-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #FF6B35 0%, #F7931E 50%, #FFD23F 100%);
  color: white !important;
  border: none;
  border-radius: var(--border-radius-medium);
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(255, 107, 53, 0.4), 0 0 20px rgba(255, 107, 53, 0.2);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  position: relative;
  overflow: hidden;
}

.book-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.6s;
}

.book-btn:hover::before {
  left: 100%;
}

.book-btn:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 8px 25px rgba(255, 107, 53, 0.6), 0 0 30px rgba(255, 107, 53, 0.4);
  background: linear-gradient(135deg, #FF8A65 0%, #FFB74D 50%, #FFF176 100%);
}

.book-btn svg {
  width: 1.25rem;
  height: 1.25rem;
  stroke: currentColor;
}

/* Vue liste */
.properties-list {
  display: grid;
  gap: 1.5rem;
}

.property-list-item {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
  background: var(--glass-bg-light);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-large);
  overflow: hidden;
  transition: var(--transition-smooth);
  cursor: pointer;
  animation: fade-in-up 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(30px);
  box-shadow: var(--shadow-card);
}

.property-list-item:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-hover);
}

.list-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.list-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: var(--transition-smooth);
}

.property-list-item:hover .list-image img {
  transform: scale(1.05);
}

.list-badges {
  position: absolute;
  top: 1rem;
  left: 1rem;
}

.list-content {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  gap: 1rem;
}

.list-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  flex: 1;
}

.list-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.list-action-btn {
  width: 2.5rem;
  height: 2.5rem;
  background: var(--glass-bg-medium);
  border: 1px solid var(--glass-border);
  border-radius: 50%;
  color: var(--text-secondary);
  cursor: pointer;
  transition: var(--transition-smooth);
  display: flex;
  align-items: center;
  justify-content: center;
}

.list-action-btn:hover {
  background: var(--glass-bg-strong);
  color: var(--laser-red);
  border-color: var(--laser-red);
  transform: scale(1.1);
}

.list-action-btn svg {
  width: 1.25rem;
  height: 1.25rem;
  stroke: currentColor;
}

.list-price {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.list-location {
  color: var(--text-muted);
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.list-features {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.list-features .feature {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.list-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.list-book-btn {
  align-self: flex-start;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #FF6B35 0%, #F7931E 50%, #FFD23F 100%);
  color: white !important;
  border: none;
  border-radius: var(--border-radius-medium);
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(255, 107, 53, 0.4), 0 0 20px rgba(255, 107, 53, 0.2);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  position: relative;
  overflow: hidden;
}

.list-book-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.6s;
}

.list-book-btn:hover::before {
  left: 100%;
}

.list-book-btn:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 8px 25px rgba(255, 107, 53, 0.6), 0 0 30px rgba(255, 107, 53, 0.4);
  background: linear-gradient(135deg, #FF8A65 0%, #FFB74D 50%, #FFF176 100%);
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 3rem;
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

.pagination-numbers {
  display: flex;
  gap: 0.5rem;
}

.pagination-number {
  width: 2.5rem;
  height: 2.5rem;
  background: var(--glass-bg-medium);
  border: 1px solid var(--glass-border);
  border-radius: 50%;
  color: var(--text-secondary);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition-smooth);
  display: flex;
  align-items: center;
  justify-content: center;
}

.pagination-number:hover {
  background: var(--glass-bg-strong);
  color: var(--text-primary);
}

.pagination-number.active {
  background: var(--primary-gradient);
  color: white;
  border-color: var(--electric-blue);
}

/* Animations */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 1024px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .search-container {
    flex-direction: column;
  }
  
  .filters-grid {
    grid-template-columns: 1fr;
  }
  
  .results-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .properties-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
  
  .property-list-item {
    grid-template-columns: 1fr;
  }
  
  .list-image {
    height: 250px;
  }
  
  .pagination {
    flex-wrap: wrap;
  }
}

@media (max-width: 768px) {
  .hero-section {
    padding: 4rem 1rem 3rem;
  }
  
  .hero-title {
    font-size: 2rem;
  }
  
  .properties-view {
    padding: 0;
  }
  
  .results-section {
    padding: 1rem;
  }
  
  .properties-grid {
    grid-template-columns: 1fr;
  }
  
  .filter-buttons {
    grid-template-columns: 1fr;
  }
  
  .amenities-grid {
    grid-template-columns: 1fr;
  }
  
  .price-inputs {
    flex-direction: column;
  }
  
  .property-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .list-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .pagination-numbers {
    order: -1;
    width: 100%;
    justify-content: center;
  }
}
</style>
