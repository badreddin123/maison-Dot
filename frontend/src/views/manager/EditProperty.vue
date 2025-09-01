<template>
  <div class="edit-property-view ultra-modern-layout">
    <div class="container">
      <!-- Header -->
      <div class="page-header ultra-modern-card">
        <div class="header-content">
          <button class="back-btn" @click="goBack">
            <span class="icon">←</span>
            Retour
          </button>
          <div class="header-info">
            <h1>Modifier la Propriété</h1>
            <p v-if="property">{{ property.title }}</p>
          </div>
        </div>
        <div class="header-actions">
          <button 
            class="btn btn-secondary" 
            @click="resetForm"
            :disabled="loading"
          >
            <span class="icon">🔄</span>
            Réinitialiser
          </button>
          <button 
            class="btn btn-primary ultra-modern-btn ultra-modern-btn-primary" 
            @click="saveProperty"
            :disabled="loading || !isFormValid"
          >
            <span class="icon">💾</span>
            {{ loading ? 'Sauvegarde...' : 'Sauvegarder' }}
          </button>
        </div>
      </div>

      <!-- Contenu principal -->
      <div class="edit-content">
        <!-- Formulaire principal -->
        <div class="main-form">
          <div class="card ultra-modern-card">
            <div class="card-header">
              <h3>Informations Générales</h3>
            </div>
            <div class="card-body">
              <div class="form-grid">
                <div class="form-group full-width">
                  <label for="title">Titre de la propriété *</label>
                  <input 
                    id="title"
                    v-model="form.title"
                    type="text"
                    class="form-control"
                    placeholder="Ex: Appartement luxueux centre-ville"
                    :class="{ error: errors.title }"
                  >
                  <span v-if="errors.title" class="error-message">{{ errors.title }}</span>
                </div>

                <div class="form-group full-width">
                  <label for="description">Description</label>
                  <textarea 
                    id="description"
                    v-model="form.description"
                    class="form-control"
                    rows="4"
                    placeholder="Décrivez votre propriété en détail..."
                  ></textarea>
                </div>

                <div class="form-group">
                  <label for="type">Type de propriété *</label>
                  <select 
                    id="type"
                    v-model="form.type"
                    class="form-control"
                    :class="{ error: errors.type }"
                  >
                    <option value="">Sélectionner un type</option>
                    <option value="apartment">Appartement</option>
                    <option value="house">Maison</option>
                    <option value="office">Bureau</option>
                  </select>
                  <span v-if="errors.type" class="error-message">{{ errors.type }}</span>
                </div>

                <div class="form-group">
                  <label for="price">Prix par nuit (€) *</label>
                  <input 
                    id="price"
                    v-model.number="form.price_per_night"
                    type="number"
                    min="1"
                    step="0.01"
                    class="form-control"
                    placeholder="150.00"
                    :class="{ error: errors.price_per_night }"
                  >
                  <span v-if="errors.price_per_night" class="error-message">{{ errors.price_per_night }}</span>
                </div>

                <div class="form-group">
                  <label for="bedrooms">Chambres</label>
                  <input 
                    id="bedrooms"
                    v-model.number="form.bedrooms"
                    type="number"
                    min="0"
                    max="20"
                    class="form-control"
                    placeholder="2"
                  >
                </div>

                <div class="form-group">
                  <label for="bathrooms">Salles de bain</label>
                  <input 
                    id="bathrooms"
                    v-model.number="form.bathrooms"
                    type="number"
                    min="1"
                    max="10"
                    class="form-control"
                    placeholder="1"
                  >
                </div>

                <div class="form-group">
                  <label for="area">Surface (m²)</label>
                  <input 
                    id="area"
                    v-model.number="form.area"
                    type="number"
                    min="1"
                    step="0.1"
                    class="form-control"
                    placeholder="75.5"
                  >
                </div>

                <div class="form-group">
                  <label for="guests">Nombre d'invités max</label>
                  <input 
                    id="guests"
                    v-model.number="form.guests"
                    type="number"
                    min="1"
                    max="50"
                    class="form-control"
                    placeholder="4"
                  >
                </div>

                <div class="form-group">
                  <label for="status">Statut</label>
                  <select 
                    id="status"
                    v-model="form.status"
                    class="form-control"
                  >
                    <option value="available">Disponible</option>
                    <option value="occupied">Occupé</option>
                    <option value="maintenance">En maintenance</option>
                  </select>
                </div>

                <div class="form-group">
                  <label>
                    <input 
                      v-model="form.featured"
                      type="checkbox"
                      class="checkbox"
                    >
                    Propriété mise en avant
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Adresse et localisation -->
          <div class="card ultra-modern-card">
            <div class="card-header">
              <h3>Localisation</h3>
            </div>
            <div class="card-body">
              <div class="form-grid">
                <div class="form-group full-width">
                  <label for="address">Adresse complète *</label>
                  <textarea 
                    id="address"
                    v-model="form.address"
                    class="form-control"
                    rows="3"
                    placeholder="123 Rue de la Paix, 75001 Paris, France"
                    :class="{ error: errors.address }"
                  ></textarea>
                  <span v-if="errors.address" class="error-message">{{ errors.address }}</span>
                </div>

                <div class="form-group">
                  <label for="latitude">Latitude</label>
                  <input 
                    id="latitude"
                    v-model.number="form.latitude"
                    type="number"
                    step="0.000001"
                    class="form-control"
                    placeholder="48.856614"
                  >
                </div>

                <div class="form-group">
                  <label for="longitude">Longitude</label>
                  <input 
                    id="longitude"
                    v-model.number="form.longitude"
                    type="number"
                    step="0.000001"
                    class="form-control"
                    placeholder="2.3522219"
                  >
                </div>
              </div>

              <div class="location-tools">
                <button 
                  type="button" 
                  class="btn btn-secondary"
                  @click="getCurrentLocation"
                  :disabled="gettingLocation"
                >
                  <span class="icon">📍</span>
                  {{ gettingLocation ? 'Localisation...' : 'Utiliser ma position' }}
                </button>
                <button 
                  type="button" 
                  class="btn btn-secondary"
                  @click="geocodeAddress"
                  :disabled="!form.address"
                >
                  <span class="icon">🗺️</span>
                  Géocoder l'adresse
                </button>
              </div>
            </div>
          </div>

          <!-- Équipements -->
          <div class="card ultra-modern-card">
            <div class="card-header">
              <h3>Équipements</h3>
            </div>
            <div class="card-body">
              <div class="amenities-grid">
                <label 
                  v-for="amenity in availableAmenities" 
                  :key="amenity.id"
                  class="amenity-item"
                >
                  <input 
                    v-model="form.amenities"
                    :value="amenity.id"
                    type="checkbox"
                    class="checkbox"
                  >
                  <div class="amenity-content">
                    <span class="amenity-icon">{{ amenity.icon }}</span>
                    <span class="amenity-label">{{ amenity.label }}</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="sidebar">
          <!-- Images -->
          <div class="card ultra-modern-card">
            <div class="card-header">
              <h3>Images</h3>
              <div class="header-actions">
                <span v-if="newImageFiles.length > 0" class="new-images-count">
                  {{ newImageFiles.length }} nouvelle(s)
                </span>
                <button 
                  class="btn btn-secondary btn-sm"
                  @click="showImageUpload = true"
                >
                  <span class="icon">📷</span>
                  Ajouter
                </button>
              </div>
            </div>
            <div class="card-body">
              <div v-if="form.images && form.images.length > 0" class="images-grid">
                <div 
                  v-for="(image, index) in form.images" 
                  :key="index"
                  class="image-item"
                  :class="{ 'new-image': index >= (property?.images?.length || 0) }"
                >
                  <img :src="getImageUrl(image)" :alt="`Image ${index + 1}`" class="image">
                  <div v-if="index >= (property?.images?.length || 0)" class="new-badge">Nouvelle</div>
                  <div class="image-overlay">
                    <button 
                      class="image-action"
                      @click="moveImageUp(index)"
                      :disabled="index === 0"
                    >
                      <span class="icon">↑</span>
                    </button>
                    <button 
                      class="image-action"
                      @click="moveImageDown(index)"
                      :disabled="index === form.images.length - 1"
                    >
                      <span class="icon">↓</span>
                    </button>
                    <button 
                      class="image-action delete"
                      @click="removeImage(index)"
                    >
                      <span class="icon">🗑️</span>
                    </button>
                  </div>
                </div>
              </div>
              <div v-else class="no-images">
                <span class="icon">🖼️</span>
                <p>Aucune image ajoutée</p>
                <button 
                  class="btn btn-primary"
                  @click="showImageUpload = true"
                >
                  Ajouter la première image
                </button>
              </div>
            </div>
          </div>

          <!-- Statistiques -->
          <div class="card ultra-modern-card" v-if="property">
            <div class="card-header">
              <h3>Statistiques</h3>
            </div>
            <div class="card-body">
              <div class="stats-grid">
                <div class="stat-item">
                  <div class="stat-value">{{ property.rating || '0.0' }}</div>
                  <div class="stat-label">Note moyenne</div>
                </div>
                <div class="stat-item">
                  <div class="stat-value">{{ property.reviewsCount || 0 }}</div>
                  <div class="stat-label">Avis</div>
                </div>
                <div class="stat-item">
                  <div class="stat-value">{{ getBookingsCount() }}</div>
                  <div class="stat-label">Réservations</div>
                </div>
                <div class="stat-item">
                  <div class="stat-value">{{ getRevenue() }}€</div>
                  <div class="stat-label">Revenus</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions rapides -->
          <div class="card ultra-modern-card">
            <div class="card-header">
              <h3>Actions</h3>
            </div>
            <div class="card-body">
              <div class="quick-actions">
                <button 
                  class="action-btn"
                  @click="duplicateProperty"
                  :disabled="loading"
                >
                  <span class="icon">📋</span>
                  Dupliquer
                </button>
                <button 
                  class="action-btn"
                  @click="previewProperty"
                >
                  <span class="icon">👁️</span>
                  Aperçu
                </button>
                <button 
                  class="action-btn danger"
                  @click="showDeleteConfirm = true"
                >
                  <span class="icon">🗑️</span>
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Upload Images -->
    <div v-if="showImageUpload" class="modal-overlay" @click="showImageUpload = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Ajouter des images</h3>
          <button class="modal-close" @click="showImageUpload = false">
            <span class="icon">❌</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="upload-methods">
            <div class="upload-method">
              <h4>Upload fichier</h4>
              <input 
                ref="fileInput"
                type="file" 
                accept="image/*" 
                multiple
                @change="handleFileUpload"
                style="display: none"
              >
              <div class="upload-area" @click="fileInput?.click()">
                <span class="icon">📤</span>
                <p>Cliquez pour sélectionner des images</p>
                <small>JPG, PNG, GIF - Max 5MB par image</small>
              </div>
            </div>
            
            <div class="upload-method">
              <h4>URL d'image</h4>
              <div class="url-input-group">
                <input 
                  v-model="imageUrl"
                  type="url"
                  class="form-control"
                  placeholder="https://example.com/image.jpg"
                >
                <button 
                  class="btn btn-primary"
                  @click="addImageFromUrl"
                  :disabled="!imageUrl"
                >
                  Ajouter
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Confirmation Suppression -->
    <div v-if="showDeleteConfirm" class="modal-overlay" @click="showDeleteConfirm = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Confirmer la suppression</h3>
          <button class="modal-close" @click="showDeleteConfirm = false">
            <span class="icon">❌</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="delete-warning">
            <span class="icon warning">⚠️</span>
            <p><strong>Attention !</strong> Cette action est irréversible.</p>
            <p>Êtes-vous sûr de vouloir supprimer cette propriété ?</p>
            <p>Toutes les réservations associées seront également supprimées.</p>
          </div>
          <div class="modal-actions">
            <button class="btn btn-secondary" @click="showDeleteConfirm = false">
              Annuler
            </button>
            <button class="btn btn-danger" @click="deleteProperty">
              <span class="icon">🗑️</span>
              Supprimer définitivement
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
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePropertiesStore, type Property } from '../../stores/properties'

const route = useRoute()
const router = useRouter()
const propertiesStore = usePropertiesStore()

// État réactif
const loading = ref(false)
const gettingLocation = ref(false)
const showImageUpload = ref(false)
const showDeleteConfirm = ref(false)
const imageUrl = ref('')
const property = ref<Property | null>(null)
const newImageFiles = ref<File[]>([]) // Nouvelles images à uploader
const fileInput = ref<HTMLInputElement | null>(null)

// Formulaire
const form = reactive({
  title: '',
  description: '',
  type: '',
  price_per_night: 0,
  address: '',
  latitude: null as number | null,
  longitude: null as number | null,
  bedrooms: 1,
  bathrooms: 1,
  area: null as number | null,
  guests: 2,
  amenities: [] as string[],
  images: [] as string[],
  status: 'available',
  featured: false
})

// Erreurs de validation
const errors = reactive({
  title: '',
  type: '',
  price_per_night: '',
  address: ''
})

// Équipements disponibles
const availableAmenities = [
  { id: 'wifi', label: 'WiFi', icon: '📶' },
  { id: 'parking', label: 'Parking', icon: '🚗' },
  { id: 'kitchen', label: 'Cuisine équipée', icon: '🍳' },
  { id: 'tv', label: 'Télévision', icon: '📺' },
  { id: 'washing_machine', label: 'Lave-linge', icon: '👕' },
  { id: 'air_conditioning', label: 'Climatisation', icon: '❄️' },
  { id: 'heating', label: 'Chauffage', icon: '🔥' },
  { id: 'balcony', label: 'Balcon', icon: '🏞️' },
  { id: 'garden', label: 'Jardin', icon: '🌳' },
  { id: 'pool', label: 'Piscine', icon: '🏊' },
  { id: 'gym', label: 'Salle de sport', icon: '💪' },
  { id: 'elevator', label: 'Ascenseur', icon: '🛗' },
  { id: 'pets_allowed', label: 'Animaux autorisés', icon: '🐕' },
  { id: 'smoking_allowed', label: 'Fumeur autorisé', icon: '🚬' }
]

// Computed
const isFormValid = computed(() => {
  return form.title.trim() && 
         form.type && 
         form.price_per_night > 0 && 
         form.address.trim()
})

// Méthodes
const loadProperty = async () => {
  const propertyId = route.params.id as string
  
  if (!propertyId) {
    router.push('/manager/properties')
    return
  }

  try {
    loading.value = true
    
    // Charger la propriété depuis l'API
    const result = await propertiesStore.fetchProperty(Number(propertyId))
    
    if (result.success && propertiesStore.currentProperty) {
      property.value = propertiesStore.currentProperty
      
      // Pré-remplir le formulaire avec les données existantes
      Object.assign(form, {
        title: property.value.title,
        description: property.value.description,
        type: property.value.type,
        price_per_night: property.value.price_per_night,
        address: property.value.address,
        latitude: property.value.latitude,
        longitude: property.value.longitude,
        bedrooms: property.value.bedrooms,
        bathrooms: property.value.bathrooms,
        area: property.value.area,
        guests: property.value.guests || 2,
        amenities: property.value.amenities || [],
        images: property.value.images || [],
        status: property.value.status,
        featured: property.value.featured || false
      })
    } else {
      console.error('Propriété non trouvée')
      router.push('/manager/properties')
    }
    
  } catch (error) {
    console.error('Erreur lors du chargement:', error)
    router.push('/manager/properties')
  } finally {
    loading.value = false
  }
}

const validateForm = () => {
  // Réinitialiser les erreurs
  Object.keys(errors).forEach(key => {
    const errorKey = key as keyof typeof errors
    errors[errorKey] = ''
  })

  let isValid = true

  if (!form.title.trim()) {
    errors.title = 'Le titre est requis'
    isValid = false
  }

  if (!form.type) {
    errors.type = 'Le type de propriété est requis'
    isValid = false
  }

  if (!form.price_per_night || form.price_per_night <= 0) {
    errors.price_per_night = 'Le prix doit être supérieur à 0'
    isValid = false
  }

  if (!form.address.trim()) {
    errors.address = 'L\'adresse est requise'
    isValid = false
  }

  return isValid
}

const saveProperty = async () => {
  if (!validateForm() || !property.value) {
    return
  }

  try {
    loading.value = true
    
    console.log('Sauvegarde démarrée...')
    console.log('Nouvelles images à uploader:', newImageFiles.value.length)
    
    // Toujours utiliser FormData pour supporter les images
    const formData = new FormData()
    
    // Ajouter tous les champs du formulaire
    formData.append('title', form.title || '')
    formData.append('description', form.description || '')
    formData.append('type', form.type)
    formData.append('price_per_night', form.price_per_night.toString())
    formData.append('address', form.address || '')
    
    if (form.latitude !== null && form.latitude !== undefined) {
      formData.append('latitude', form.latitude.toString())
    }
    if (form.longitude !== null && form.longitude !== undefined) {
      formData.append('longitude', form.longitude.toString())
    }
    if (form.area !== null && form.area !== undefined) {
      formData.append('area', form.area.toString())
    }
    
    formData.append('bedrooms', Math.max(0, form.bedrooms || 0).toString())
    formData.append('bathrooms', Math.max(1, form.bathrooms || 1).toString())
    formData.append('guests', Math.max(1, form.guests || 1).toString())
    formData.append('status', form.status || 'available')
    formData.append('featured', (form.featured || false).toString())
    
    // Ajouter les équipements
    formData.append('amenities', JSON.stringify(form.amenities))
    
    // Ajouter les nouvelles images si présentes
    if (newImageFiles.value.length > 0) {
      console.log('Ajout des nouvelles images:')
      newImageFiles.value.forEach((file, index) => {
        console.log(`Image ${index}:`, file.name, file.size, 'bytes')
        formData.append('images[]', file)
      })
    }
    
    // Déboguer le FormData
    console.log('Contenu du FormData:')
    const formEntries: string[] = []
    formData.forEach((value, key) => {
      formEntries.push(key + ': ' + (value instanceof File ? `${value.name} (${value.size} bytes)` : value))
    })
    console.log(formEntries.join('\n'))
    
    // Utiliser la méthode avec FormData
    const result = await propertiesStore.updatePropertyWithFiles(property.value.id, formData)
    
    if (result.success) {
      console.log('Propriété mise à jour avec succès')
      // Réinitialiser les nouvelles images
      newImageFiles.value = []
      // Recharger la propriété pour obtenir les nouvelles URLs d'images
      await loadProperty()
      alert('Propriété mise à jour avec succès!')
    } else {
      console.error('Erreur lors de la mise à jour:', result.error)
      
      // Afficher des erreurs de validation plus détaillées si disponibles
      if (result.error && typeof result.error === 'object') {
        const errorMessages = Object.values(result.error).flat().join('\n')
        alert('Erreur de validation:\n' + errorMessages)
      } else {
        alert('Erreur lors de la mise à jour: ' + result.error)
      }
    }
    
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error)
    alert('Erreur lors de la sauvegarde: ' + error)
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  if (property.value) {
    Object.assign(form, property.value)
  }
  Object.keys(errors).forEach(key => {
    const errorKey = key as keyof typeof errors
    errors[errorKey] = ''
  })
}

const goBack = () => {
  router.push('/manager/properties')
}

const getCurrentLocation = () => {
  if (!navigator.geolocation) {
    alert('La géolocalisation n\'est pas supportée par votre navigateur')
    return
  }

  gettingLocation.value = true

  navigator.geolocation.getCurrentPosition(
    (position) => {
      form.latitude = position.coords.latitude
      form.longitude = position.coords.longitude
      gettingLocation.value = false
    },
    (error) => {
      console.error('Erreur de géolocalisation:', error)
      alert('Impossible d\'obtenir votre position')
      gettingLocation.value = false
    }
  )
}

const geocodeAddress = async () => {
  // Simulation du géocodage
  if (form.address.toLowerCase().includes('paris')) {
    form.latitude = 48.856614
    form.longitude = 2.3522219
  } else if (form.address.toLowerCase().includes('lyon')) {
    form.latitude = 45.764043
    form.longitude = 4.835659
  } else {
    // Coordonnées par défaut
    form.latitude = 46.603354
    form.longitude = 1.888334
  }
}

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  
  console.log('Fichiers sélectionnés:', files?.length || 0)
  
  if (files) {
    Array.from(files).forEach((file, index) => {
      console.log(`Traitement fichier ${index}:`, file.name, file.size, 'bytes')
      
      if (file.size > 5 * 1024 * 1024) {
        alert(`L'image ${file.name} est trop volumineuse (max 5MB)`)
        return
      }
      
      // Ajouter le fichier à la liste des nouveaux fichiers
      newImageFiles.value.push(file)
      console.log('Fichier ajouté à newImageFiles, total:', newImageFiles.value.length)
      
      // Créer un aperçu pour l'affichage
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        form.images.push(result)
        console.log('Aperçu ajouté, total images dans form:', form.images.length)
      }
      reader.readAsDataURL(file)
    })
  }
  
  // Réinitialiser l'input pour permettre de sélectionner le même fichier
  target.value = ''
  showImageUpload.value = false
}

const addImageFromUrl = () => {
  if (imageUrl.value) {
    form.images.push(imageUrl.value)
    imageUrl.value = ''
    showImageUpload.value = false
  }
}

const removeImage = (index: number) => {
  console.log('Suppression image index:', index)
  console.log('Images actuelles:', form.images.length)
  console.log('Images originales de la propriété:', property.value?.images?.length || 0)
  console.log('Nouveaux fichiers:', newImageFiles.value.length)
  
  // Supprimer de l'affichage
  form.images.splice(index, 1)
  
  // Si c'est une nouvelle image (pas encore sauvegardée), la supprimer aussi des fichiers
  const originalImagesCount = property.value?.images?.length || 0
  if (index >= originalImagesCount) {
    const newImageIndex = index - originalImagesCount
    console.log('Suppression d\'une nouvelle image, index dans newImageFiles:', newImageIndex)
    if (newImageIndex >= 0 && newImageIndex < newImageFiles.value.length) {
      newImageFiles.value.splice(newImageIndex, 1)
      console.log('Nouvelle image supprimée, restant:', newImageFiles.value.length)
    }
  } else {
    console.log('Suppression d\'une image originale (sera conservée jusqu\'à la sauvegarde)')
  }
}

const moveImageUp = (index: number) => {
  if (index > 0) {
    const temp = form.images[index]
    form.images[index] = form.images[index - 1]
    form.images[index - 1] = temp
  }
}

const moveImageDown = (index: number) => {
  if (index < form.images.length - 1) {
    const temp = form.images[index]
    form.images[index] = form.images[index + 1]
    form.images[index + 1] = temp
  }
}

const duplicateProperty = () => {
  router.push('/manager/properties/add')
}

const previewProperty = () => {
  // Ouvrir dans un nouvel onglet
  const url = `/properties/${property.value?.id}`
  window.open(url, '_blank')
}

const getImageUrl = (imagePath: string) => {
  // Si c'est déjà une URL complète (http/https) ou un data URL, la retourner telle quelle
  if (imagePath.startsWith('http') || imagePath.startsWith('data:')) {
    return imagePath
  }
  
  // Si c'est un chemin relatif, construire l'URL complète
  if (imagePath.startsWith('uploads/')) {
    return `http://localhost:8000/${imagePath}`
  }
  
  // Fallback
  return imagePath
}

const deleteProperty = async () => {
  try {
    loading.value = true
    
    // Simuler la suppression
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    console.log('Propriété supprimée')
    
    router.push('/manager/properties')
    
  } catch (error) {
    console.error('Erreur lors de la suppression:', error)
  } finally {
    loading.value = false
    showDeleteConfirm.value = false
  }
}

const getBookingsCount = () => {
  // Simulé
  return 8
}

const getRevenue = () => {
  // Simulé
  return 2400
}

// Lifecycle
onMounted(() => {
  loadProperty()
})
</script>

<style scoped>
@import url('../../assets/ultra-modern-theme.css');

.edit-property-view {
  min-height: 100vh;
  background: var(--bg-main);
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

.header-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--card-bg);
  border: 1px solid var(--border-primary);
  border-radius: var(--border-radius-medium);
  color: var(--text-primary);
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
}

.back-btn:hover {
  background: var(--bg-gray-300);
  transform: translateY(-2px);
}

.header-info h1 {
  margin: 0;
  color: var(--text-primary);
  font-size: 1.8rem;
  font-weight: 700;
}

.header-info p {
  margin: 0.5rem 0 0 0;
  color: var(--text-secondary);
}

.header-actions {
  display: flex;
  gap: 1rem;
}

/* Layout */
.edit-content {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;
}

.main-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Cards */
.card {
  background: var(--card-bg);
  border-radius: var(--border-radius-large);
  border: 1px solid var(--card-border);
  box-shadow: var(--shadow-card);
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--border-primary);
  background: var(--card-bg);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.new-images-count {
  background: var(--electric-blue);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: var(--border-radius-full);
  font-size: 0.875rem;
  font-weight: 600;
}

.card-header h3 {
  margin: 0;
  color: var(--text-primary);
  font-size: 1.25rem;
  font-weight: 600;
}

.card-body {
  padding: 2rem;
}

/* Formulaires */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.9rem;
}

.form-control {
  padding: 0.75rem 1rem;
  border: 2px solid var(--input-border);
  border-radius: var(--border-radius-medium);
  background: var(--input-bg);
  color: var(--text-primary);
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-control:focus {
  outline: none;
  border-color: var(--electric-blue);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-control.error {
  border-color: var(--danger-color);
}

.error-message {
  color: var(--danger-color);
  font-size: 0.8rem;
  margin-top: 0.25rem;
}

.checkbox {
  width: 1.2rem;
  height: 1.2rem;
  margin-right: 0.5rem;
  accent-color: var(--electric-blue);
}

/* Outils de localisation */
.location-tools {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--card-border);
}

/* Équipements */
.amenities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.amenity-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border: 2px solid var(--card-border);
  border-radius: var(--border-radius-medium);
  cursor: pointer;
  transition: all 0.3s ease;
}

.amenity-item:hover {
  border-color: var(--electric-blue);
  background: rgba(59, 130, 246, 0.05);
}

.amenity-item:has(input:checked) {
  border-color: var(--electric-blue);
  background: rgba(59, 130, 246, 0.1);
}

.amenity-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.amenity-icon {
  font-size: 1.2rem;
}

.amenity-label {
  color: var(--text-primary);
  font-weight: 500;
}

/* Images */
.images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
}

.image-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: var(--border-radius-medium);
  overflow: hidden;
  border: 2px solid var(--card-border);
}

.image-item.new-image {
  border-color: var(--electric-blue);
  box-shadow: 0 0 10px rgba(0, 229, 255, 0.3);
}

.new-badge {
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  background: var(--electric-blue);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: var(--border-radius-small);
  font-size: 0.75rem;
  font-weight: 600;
  z-index: 2;
}

.image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.image-item:hover .image-overlay {
  opacity: 1;
}

.image-action {
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: var(--border-radius-small);
  color: white;
  cursor: pointer;
  transition: background 0.3s ease;
}

.image-action:hover {
  background: rgba(255, 255, 255, 0.3);
}

.image-action.delete:hover {
  background: var(--danger-color);
}

.image-action:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.no-images {
  text-align: center;
  padding: 2rem;
  color: var(--text-secondary);
}

.no-images .icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  display: block;
}

/* Statistiques */
.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.stat-item {
  text-align: center;
  padding: 1rem;
  background: var(--bg-gray-50);
  border-radius: var(--border-radius-medium);
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--electric-blue);
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.8rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Actions rapides */
.quick-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: var(--bg-gray-100);
  border: 1px solid var(--card-border);
  border-radius: var(--border-radius-medium);
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  width: 100%;
}

.action-btn:hover {
  background: var(--bg-gray-200);
  transform: translateY(-1px);
}

.action-btn.danger {
  color: var(--danger-color);
  border-color: var(--danger-color);
}

.action-btn.danger:hover {
  background: rgba(239, 68, 68, 0.1);
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

.btn-danger:hover:not(:disabled) {
  transform: translateY(-2px);
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
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

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

/* Upload */
.upload-methods {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.upload-method h4 {
  margin: 0 0 1rem 0;
  color: var(--text-primary);
}

.upload-area {
  border: 2px dashed var(--card-border);
  border-radius: var(--border-radius-medium);
  padding: 3rem 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.upload-area:hover {
  border-color: var(--electric-blue);
  background: rgba(59, 130, 246, 0.05);
}

.upload-area .icon {
  font-size: 2rem;
  margin-bottom: 1rem;
  display: block;
}

.upload-area p {
  color: var(--text-primary);
  font-weight: 600;
  margin: 0 0 0.5rem 0;
}

.upload-area small {
  color: var(--text-secondary);
}

.url-input-group {
  display: flex;
  gap: 1rem;
}

.url-input-group .form-control {
  flex: 1;
}

/* Messages d'avertissement */
.delete-warning {
  text-align: center;
  padding: 1rem;
}

.delete-warning .icon.warning {
  font-size: 3rem;
  margin-bottom: 1rem;
  display: block;
  color: var(--warning-color);
}

.delete-warning p {
  margin: 0.5rem 0;
  color: var(--text-primary);
}

.delete-warning strong {
  color: var(--danger-color);
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
  .edit-content {
    grid-template-columns: 1fr;
  }

  .sidebar {
    order: -1;
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

  .form-grid {
    grid-template-columns: 1fr;
  }

  .stats-grid,
  .amenities-grid {
    grid-template-columns: 1fr;
  }

  .location-tools {
    flex-direction: column;
  }

  .container {
    padding: 0 0.5rem;
  }
}
</style>
