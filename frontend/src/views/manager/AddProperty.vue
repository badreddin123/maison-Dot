<template>
  <div class="add-property ultra-modern-layout">
    <!-- En-tête -->
    <div class="page-header ultra-modern-card">
      <div class="header-content">
        <div class="header-info">
          <h1 class="page-title ultra-modern-text-gradient">Ajouter une propriété</h1>
          <p class="page-subtitle">
            Créez une nouvelle annonce pour votre propriété
          </p>
        </div>
        
        <div class="header-actions">
          <router-link to="/manager/properties" class="back-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
            Retour aux propriétés
          </router-link>
        </div>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="property-form">
      <div class="form-grid">
        <!-- Informations de base -->
        <div class="form-section ultra-modern-card">
          <h2 class="section-title">Informations générales</h2>
          
          <div class="form-group">
            <label for="title" class="form-label ultra-modern-label">
              Titre de l'annonce *
            </label>
                          <input
                id="title"
                v-model="form.title"
                type="text"
                required
                placeholder="ex: Appartement moderne avec vue sur mer"
                class="form-input ultra-modern-input"
                :class="{ 'error': errors.title }"
              />
            <div v-if="errors.title" class="error-message">{{ errors.title }}</div>
          </div>
          
          <div class="form-group">
            <label for="type" class="form-label ultra-modern-label">
              Type de propriété *
            </label>
            <select
              id="type"
              v-model="form.type"
              required
              class="form-select ultra-modern-select"
              :class="{ 'error': errors.type }"
            >
              <option value="">Sélectionnez un type</option>
              <option value="house">Maison</option>
              <option value="apartment">Appartement</option>
              <option value="office">Bureau</option>
            </select>
            <div v-if="errors.type" class="error-message">{{ errors.type }}</div>
          </div>
          
          <div class="form-group">
            <label for="description" class="form-label ultra-modern-label">
              Description *
            </label>
            <textarea
              id="description"
              v-model="form.description"
              rows="5"
              required
              placeholder="Décrivez votre propriété en détail..."
              class="form-textarea ultra-modern-textarea"
              :class="{ 'error': errors.description }"
            ></textarea>
            <div v-if="errors.description" class="error-message">{{ errors.description }}</div>
          </div>
        </div>

        <!-- Localisation -->
        <div class="form-section ultra-modern-card">
          <h2 class="section-title">Localisation</h2>
          
          <div class="form-group">
            <label for="address" class="form-label ultra-modern-label">
              Adresse complète *
            </label>
                          <input
                id="address"
                v-model="form.address"
                type="text"
                required
                placeholder="123 Rue de la Paix, 75001 Paris"
                class="form-input ultra-modern-input"
                :class="{ 'error': errors.address }"
              />
            <div v-if="errors.address" class="error-message">{{ errors.address }}</div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="latitude" class="form-label ultra-modern-label">
                Latitude
              </label>
              <input
                id="latitude"
                v-model.number="form.latitude"
                type="number"
                step="any"
                placeholder="48.8566"
                class="form-input ultra-modern-input-secondary"
                :class="{ 'error': errors.latitude }"
              />
              <div v-if="errors.latitude" class="error-message">{{ errors.latitude }}</div>
            </div>
            
            <div class="form-group">
              <label for="longitude" class="form-label ultra-modern-label">
                Longitude
              </label>
              <input
                id="longitude"
                v-model.number="form.longitude"
                type="number"
                step="any"
                placeholder="2.3522"
                class="form-input ultra-modern-input-secondary"
                :class="{ 'error': errors.longitude }"
              />
              <div v-if="errors.longitude" class="error-message">{{ errors.longitude }}</div>
            </div>
          </div>
          
          <div class="location-helper">
            <button type="button" @click="getLocationFromAddress" class="helper-btn ultra-modern-btn ultra-modern-btn-outline">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              Obtenir les coordonnées depuis l'adresse
            </button>
          </div>
        </div>

        <!-- Caractéristiques -->
        <div class="form-section ultra-modern-card">
          <h2 class="section-title">Caractéristiques</h2>
          
          <div class="form-row">
            <div class="form-group">
              <label for="bedrooms" class="form-label ultra-modern-label-gradient">
                Nombre de chambres *
              </label>
              <input
                id="bedrooms"
                v-model.number="form.bedrooms"
                type="number"
                min="0"
                required
                class="form-input ultra-modern-input-tertiary"
                :class="{ 'error': errors.bedrooms }"
              />
              <div v-if="errors.bedrooms" class="error-message">{{ errors.bedrooms }}</div>
            </div>
            
            <div class="form-group">
              <label for="bathrooms" class="form-label ultra-modern-label-gradient">
                Nombre de salles de bain *
              </label>
              <input
                id="bathrooms"
                v-model.number="form.bathrooms"
                type="number"
                min="0"
                required
                class="form-input ultra-modern-input-tertiary"
                :class="{ 'error': errors.bathrooms }"
              />
              <div v-if="errors.bathrooms" class="error-message">{{ errors.bathrooms }}</div>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="area" class="form-label ultra-modern-label">
                Surface (m²)
              </label>
              <input
                id="area"
                v-model.number="form.area"
                type="number"
                min="0"
                placeholder="75"
                class="form-input ultra-modern-input"
                :class="{ 'error': errors.area }"
              />
              <div v-if="errors.area" class="error-message">{{ errors.area }}</div>
            </div>
            
            <div class="form-group">
              <label for="price_per_night" class="form-label ultra-modern-label-gradient">
                Prix par nuit (€) *
              </label>
              <input
                id="price_per_night"
                v-model.number="form.price_per_night"
                type="number"
                min="0"
                step="0.01"
                required
                placeholder="120.00"
                class="form-input ultra-modern-input-gradient"
                :class="{ 'error': errors.price_per_night }"
              />
              <div v-if="errors.price_per_night" class="error-message">{{ errors.price_per_night }}</div>
            </div>
          </div>
        </div>

        <!-- Équipements -->
        <div class="form-section ultra-modern-card">
          <h2 class="section-title">Équipements et services</h2>
          
          <div class="amenities-grid">
            <label
              v-for="amenity in availableAmenities"
              :key="amenity.value"
              class="amenity-item"
            >
              <input
                v-model="form.amenities"
                :value="amenity.value"
                type="checkbox"
                class="amenity-checkbox"
              />
              <div class="amenity-content">
                <div class="amenity-icon" v-html="amenity.icon"></div>
                <span class="amenity-label">{{ amenity.label }}</span>
              </div>
            </label>
          </div>
        </div>

        <!-- Images -->
        <div class="form-section ultra-modern-card">
          <h2 class="section-title">Photos de la propriété</h2>
          
          <div class="image-upload-section">
            <div class="upload-area" @drop="handleDrop" @dragover.prevent @dragenter.prevent>
              <input
                ref="fileInput"
                type="file"
                multiple
                accept="image/*"
                @change="handleFileSelect"
                class="file-input"
              />
              
              <div class="upload-content">
                <div class="upload-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                  </svg>
                </div>
                <h3>Glissez vos images ici</h3>
                <p>ou cliquez pour sélectionner des fichiers</p>
                <button type="button" @click="triggerFileInput" class="upload-btn ultra-modern-btn ultra-modern-btn-primary">
                  Choisir des images
                </button>
              </div>
            </div>
            
            <div v-if="form.images.length > 0" class="images-preview">
              <div
                v-for="(image, index) in form.images"
                :key="index"
                class="image-preview"
              >
                <img :src="image.preview" :alt="`Image ${index + 1}`" />
                <button type="button" @click="removeImage(index)" class="remove-image">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
                <div v-if="index === 0" class="main-image-badge">Image principale</div>
              </div>
            </div>
            
            <div class="upload-info">
              <p>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 16v-4"/>
                  <path d="M12 8h.01"/>
                </svg>
                La première image sera utilisée comme image principale. Vous pouvez réorganiser l'ordre en glissant-déposant.
              </p>
            </div>
          </div>
        </div>

        <!-- Statut -->
        <div class="form-section ultra-modern-card">
          <h2 class="section-title">Disponibilité</h2>
          
          <div class="form-group">
            <label for="status" class="form-label">
              Statut de la propriété
            </label>
            <select
              id="status"
              v-model="form.status"
              class="form-select ultra-modern-select"
            >
              <option value="available">Disponible</option>
              <option value="occupied">Occupée</option>
              <option value="maintenance">En maintenance</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Actions du formulaire -->
      <div class="form-actions">
        <div class="actions-left">
                      <button type="button" @click="saveDraft" class="action-btn secondary ultra-modern-btn ultra-modern-btn-outline" :disabled="isSubmitting">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12"/>
              </svg>
              Sauvegarder comme brouillon
            </button>
        </div>
        
        <div class="actions-right">
          <router-link to="/manager/properties" class="action-btn cancel ultra-modern-btn ultra-modern-btn-danger">
            Annuler
          </router-link>
          
          <button type="submit" class="action-btn primary ultra-modern-btn ultra-modern-btn-success" :disabled="isSubmitting">
            <span v-if="!isSubmitting">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
              Créer la propriété
            </span>
            <div v-else class="loading-content">
              <div class="spinner"></div>
              <span>Création en cours...</span>
            </div>
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { usePropertiesStore } from '../../stores/properties'

const router = useRouter()
const propertiesStore = usePropertiesStore()

// État local
const isSubmitting = ref(false)
const fileInput = ref<HTMLInputElement>()

const form = reactive({
  title: '',
  type: '',
  description: '',
  address: '',
  latitude: null as number | null,
  longitude: null as number | null,
  bedrooms: 1,
  bathrooms: 1,
  area: null as number | null,
  price_per_night: 0,
  amenities: [] as string[],
  images: [] as Array<{ file: File; preview: string }>,
  status: 'available'
})

const errors = ref<Record<string, string>>({})

// Équipements disponibles
const availableAmenities = [
  {
    value: 'wifi',
    label: 'WiFi gratuit',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M1.42 9.007a16.997 16.997 0 0121.16 0m-18.34 2.993a12.996 12.996 0 0115.52 0M6.34 15.002a5.995 5.995 0 018.32 0l-2.44-2.44m-1.44 3.44v.01"/></svg>'
  },
  {
    value: 'parking',
    label: 'Parking',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="14" y="14" width="4" height="6" rx="2"/><rect x="6" y="4" width="4" height="6" rx="2"/><path d="M6 20h4"/><path d="M14 10h4"/></svg>'
  },
  {
    value: 'kitchen',
    label: 'Cuisine équipée',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>'
  },
  {
    value: 'tv',
    label: 'Télévision',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>'
  },
  {
    value: 'washing_machine',
    label: 'Lave-linge',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"/></svg>'
  },
  {
    value: 'air_conditioning',
    label: 'Climatisation',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>'
  },
  {
    value: 'heating',
    label: 'Chauffage',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>'
  },
  {
    value: 'balcony',
    label: 'Balcon/Terrasse',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>'
  },
  {
    value: 'pool',
    label: 'Piscine',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M2 20a2.5 2.5 0 005 0 2.5 2.5 0 005 0 2.5 2.5 0 005 0 2.5 2.5 0 005 0"/><path d="M2 16a2.5 2.5 0 005 0 2.5 2.5 0 005 0 2.5 2.5 0 005 0 2.5 2.5 0 005 0"/></svg>'
  },
  {
    value: 'gym',
    label: 'Salle de sport',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M7.4 7.4L4.6 4.6m0 0L1.8 1.8m2.8 2.8c4.2-4.2 11-4.2 15.2 0s4.2 11 0 15.2"/></svg>'
  },
  {
    value: 'elevator',
    label: 'Ascenseur',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M7 13l3-3 3 3M7 17l3-3 3 3M7 9l3-3 3 3"/></svg>'
  },
  {
    value: 'garden',
    label: 'Jardin',
    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>'
  }
]

// Méthodes
const validateForm = () => {
  errors.value = {}
  
  if (!form.title.trim()) {
    errors.value.title = 'Le titre est requis'
  }
  
  if (!form.type) {
    errors.value.type = 'Le type de propriété est requis'
  }
  
  if (!form.description.trim()) {
    errors.value.description = 'La description est requise'
  }
  
  if (!form.address.trim()) {
    errors.value.address = 'L\'adresse est requise'
  }
  
  if (form.bedrooms < 0) {
    errors.value.bedrooms = 'Le nombre de chambres doit être positif'
  }
  
  if (form.bathrooms < 0) {
    errors.value.bathrooms = 'Le nombre de salles de bain doit être positif'
  }
  
  if (form.price_per_night <= 0) {
    errors.value.price_per_night = 'Le prix par nuit doit être supérieur à 0'
  }
  
  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) return
  
  isSubmitting.value = true
  
  try {
    // Créer un FormData pour envoyer les fichiers
    const formData = new FormData()
    
    // Ajouter les données de base
    formData.append('title', form.title)
    formData.append('type', form.type)
    formData.append('description', form.description)
    formData.append('address', form.address)
    formData.append('bedrooms', form.bedrooms.toString())
    formData.append('bathrooms', form.bathrooms.toString())
    formData.append('price_per_night', form.price_per_night.toString())
    formData.append('status', form.status)
    
    // Ajouter les coordonnées si disponibles
    if (form.latitude !== null) {
      formData.append('latitude', form.latitude.toString())
    }
    if (form.longitude !== null) {
      formData.append('longitude', form.longitude.toString())
    }
    if (form.area !== null) {
      formData.append('area', form.area.toString())
    }
    
    // Ajouter les équipements
    formData.append('amenities', JSON.stringify(form.amenities))
    
    // Ajouter les images avec débogage
    console.log('Nombre d\'images à envoyer:', form.images.length)
    form.images.forEach((imageObj, index) => {
      console.log(`Image ${index}:`, imageObj.file.name, imageObj.file.size, 'bytes')
      formData.append('images[]', imageObj.file)
    })
    
    // Déboguer le FormData
    console.log('Contenu du FormData:')
    const formEntries: string[] = []
    formData.forEach((value, key) => {
      formEntries.push(key + ': ' + (value instanceof File ? `${value.name} (${value.size} bytes)` : value))
    })
    console.log(formEntries.join('\n'))
    
    const result = await propertiesStore.createPropertyWithFiles(formData)
    
    if (result.success) {
      // Afficher un message de succès
      alert(`✅ Propriété "${form.title}" ajoutée avec succès !`)
      
      // Supprimer le brouillon
      localStorage.removeItem('property_draft')
      
      // Rediriger vers la liste des propriétés
      router.push('/manager/properties')
    } else {
      // Afficher le message d'erreur depuis l'API
      alert(`❌ Erreur: ${result.error || 'Impossible d\'ajouter la propriété'}`)
    }
  } catch (error) {
    console.error('Erreur lors de la création:', error)
    alert('❌ Une erreur inattendue s\'est produite')
  } finally {
    isSubmitting.value = false
  }
}

const saveDraft = () => {
  // Sauvegarder en localStorage pour récupérer plus tard
  localStorage.setItem('property_draft', JSON.stringify({
    ...form,
    images: [] // Ne pas sauvegarder les images dans le localStorage
  }))
  
  // Notification de succès
  console.log('Brouillon sauvegardé')
}

const getLocationFromAddress = async () => {
  if (!form.address.trim()) return
  
  // Ici vous pourriez intégrer un service de géocodage
  // Pour l'exemple, on simule des coordonnées
  console.log('Géocodage de l\'adresse:', form.address)
  // form.latitude = 48.8566
  // form.longitude = 2.3522
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    processFiles(Array.from(target.files))
  }
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  if (event.dataTransfer?.files) {
    processFiles(Array.from(event.dataTransfer.files))
  }
}

const processFiles = (files: File[]) => {
  files.forEach(file => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        form.images.push({
          file,
          preview: e.target?.result as string
        })
      }
      reader.readAsDataURL(file)
    }
  })
}

const removeImage = (index: number) => {
  form.images.splice(index, 1)
}

// Charger un brouillon au montage si disponible
const loadDraft = () => {
  const draft = localStorage.getItem('property_draft')
  if (draft) {
    try {
      const draftData = JSON.parse(draft)
      Object.assign(form, draftData)
    } catch (error) {
      console.error('Erreur lors du chargement du brouillon:', error)
    }
  }
}

// Charger le brouillon au montage
loadDraft()
</script>

<style scoped>
@import url('../../assets/cyber-theme.css');
@import url('../../assets/ultra-modern-theme.css');

.add-property {
  min-height: 100vh;
  background: var(--bg-main);
  padding: 2rem;
}

.page-header {
  background: var(--card-bg);
  border: 1px solid var(--border-primary);
  border-radius: var(--border-radius-large);
  padding: 2.5rem;
  margin-bottom: 2rem;
  box-shadow: var(--shadow-card);
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
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-subtitle {
  font-size: 1.125rem;
  color: var(--text-secondary);
  margin: 0;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #64748b 0%, #475569 100%);
  border: none;
  border-radius: var(--border-radius-medium);
  color: white;
  text-decoration: none;
  font-weight: 600;
  transition: var(--transition-smooth);
  box-shadow: 0 4px 15px rgba(100, 116, 139, 0.25);
}

.back-btn:hover {
  background: linear-gradient(135deg, #475569 0%, #334155 100%);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(100, 116, 139, 0.35);
}

.back-btn svg {
  width: 1.25rem;
  height: 1.25rem;
  stroke: currentColor;
}

.property-form {
  background: var(--card-bg);
  border: 1px solid var(--border-primary);
  border-radius: var(--border-radius-large);
  padding: 3rem;
  box-shadow: var(--shadow-card);
}

.form-grid {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.form-section {
  padding: 2rem;
  background: var(--card-bg);
  border: 1px solid var(--border-primary);
  border-radius: var(--border-radius-large);
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.section-title::before {
  content: '';
  width: 4px;
  height: 1.5rem;
  background: var(--primary-gradient);
  border-radius: 2px;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 1rem 1.25rem;
  background: var(--glass-bg-medium);
  border: 2px solid #e2e8f0;
  border-radius: var(--border-radius-medium);
  color: var(--text-primary);
  font-size: 1rem;
  transition: var(--transition-smooth);
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #0065F8;
  background: var(--glass-bg-strong);
  box-shadow: 0 0 0 3px rgba(6, 101, 248, 0.1);
}

.form-input.error,
.form-select.error,
.form-textarea.error {
  border-color: #ef4444;
  background: rgba(239, 68, 68, 0.05);
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: var(--text-muted);
}

.form-select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
}

.error-message {
  margin-top: 0.5rem;
  color: var(--laser-red);
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.error-message::before {
  content: '⚠️';
  font-size: 0.75rem;
}

.location-helper {
  margin-top: 1rem;
  text-align: center;
}

.helper-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: var(--glass-bg-medium);
  border: 1px solid var(--electric-blue);
  border-radius: var(--border-radius-medium);
  color: var(--electric-blue);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition-smooth);
}

.helper-btn:hover {
  background: rgba(0, 229, 255, 0.1);
  transform: translateY(-2px);
}

.helper-btn svg {
  width: 1rem;
  height: 1rem;
  stroke: currentColor;
}

.amenities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.amenity-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  background: var(--glass-bg-medium);
  border: 2px solid #e2e8f0;
  border-radius: var(--border-radius-medium);
  cursor: pointer;
  transition: var(--transition-smooth);
}

.amenity-item:hover {
  background: var(--glass-bg-strong);
  transform: translateY(-2px);
}

.amenity-checkbox {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.amenity-checkbox:checked + .amenity-content {
  background: rgba(6, 101, 248, 0.1);
  border-color: #0065F8;
  color: #0065F8;
}

.amenity-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.5rem;
  border-radius: var(--border-radius-small);
  transition: var(--transition-smooth);
}

.amenity-icon {
  width: 1.5rem;
  height: 1.5rem;
  flex-shrink: 0;
}

.amenity-icon svg {
  width: 100%;
  height: 100%;
  stroke: currentColor;
}

.amenity-label {
  font-weight: 500;
  color: var(--text-secondary);
}

.amenity-checkbox:checked + .amenity-content .amenity-label {
  color: #0065F8;
  font-weight: 600;
}

.image-upload-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.upload-area {
  position: relative;
  border: 2px dashed #cbd5e1;
  border-radius: var(--border-radius-large);
  padding: 3rem 2rem;
  text-align: center;
  transition: var(--transition-smooth);
  cursor: pointer;
}

.upload-area:hover {
  border-color: #0065F8;
  background: rgba(6, 101, 248, 0.02);
}

.file-input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.upload-icon {
  width: 4rem;
  height: 4rem;
  background: var(--glass-bg-medium);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
}

.upload-icon svg {
  width: 2rem;
  height: 2rem;
  stroke: currentColor;
}

.upload-content h3 {
  color: var(--text-primary);
  margin: 0;
  font-size: 1.25rem;
}

.upload-content p {
  color: var(--text-muted);
  margin: 0;
}

.upload-btn {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #0065F8 0%, #4300FF 100%);
  color: white;
  border: none;
  border-radius: var(--border-radius-medium);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition-smooth);
  box-shadow: 0 4px 15px rgba(6, 101, 248, 0.3);
}

.upload-btn:hover {
  transform: translateY(-2px);
  background: linear-gradient(135deg, #4300FF 0%, #0065F8 100%);
  box-shadow: 0 8px 25px rgba(6, 101, 248, 0.4);
}

.images-preview {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
}

.image-preview {
  position: relative;
  aspect-ratio: 1;
  border-radius: var(--border-radius-medium);
  overflow: hidden;
  background: var(--glass-bg-medium);
  border: 1px solid var(--glass-border);
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-image {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 2rem;
  height: 2rem;
  background: rgba(0, 0, 0, 0.7);
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition-smooth);
}

.remove-image:hover {
  background: var(--laser-red);
  transform: scale(1.1);
}

.remove-image svg {
  width: 1rem;
  height: 1rem;
  stroke: currentColor;
}

.main-image-badge {
  position: absolute;
  bottom: 0.5rem;
  left: 0.5rem;
  right: 0.5rem;
  padding: 0.25rem 0.5rem;
  background: var(--primary-gradient);
  color: white;
  border-radius: var(--border-radius-small);
  font-size: 0.75rem;
  font-weight: 600;
  text-align: center;
}

.upload-info {
  padding: 1rem;
  background: rgba(0, 229, 255, 0.05);
  border: 1px solid rgba(0, 229, 255, 0.2);
  border-radius: var(--border-radius-medium);
}

.upload-info p {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.upload-info svg {
  width: 1rem;
  height: 1rem;
  stroke: var(--electric-blue);
  flex-shrink: 0;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid var(--glass-border);
}

.actions-left,
.actions-right {
  display: flex;
  gap: 1rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  border-radius: var(--border-radius-medium);
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: var(--transition-smooth);
  border: none;
  font-size: 1rem;
}

.action-btn.primary {
  background: var(--primary-gradient);
  color: white;
  box-shadow: var(--shadow-neon-blue);
}

.action-btn.primary:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: var(--shadow-cyber);
}

.action-btn.secondary {
  background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
  border: none;
  color: white;
  box-shadow: 0 4px 15px rgba(107, 114, 128, 0.25);
}

.action-btn.secondary:hover:not(:disabled) {
  background: linear-gradient(135deg, #4b5563 0%, #374151 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(107, 114, 128, 0.35);
}

.action-btn.cancel {
  background: var(--glass-bg-medium);
  border: 1px solid var(--laser-red);
  color: var(--laser-red);
}

.action-btn.cancel:hover {
  background: rgba(255, 0, 64, 0.1);
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.action-btn svg {
  width: 1.25rem;
  height: 1.25rem;
  stroke: currentColor;
}

.loading-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.spinner {
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Styles ultra modernes spécifiques pour ce composant */
.ultra-modern-input-secondary {
  background: rgba(241, 245, 249, 0.9) !important;
  border-color: var(--secondary-color) !important;
}

.ultra-modern-input-tertiary {
  background: rgba(240, 253, 255, 0.9) !important;
  border-color: var(--tertiary-color) !important;
}

.ultra-modern-input-gradient {
  background: linear-gradient(rgba(248, 250, 252, 0.9), rgba(248, 250, 252, 0.9)) padding-box,
              var(--gradient-primary) border-box !important;
  border: 2px solid transparent !important;
}

.ultra-modern-label-gradient {
  background: var(--gradient-primary) !important;
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
  background-clip: text !important;
  font-weight: 700 !important;
}

/* Forcer les couleurs des boutons spécifiques - Priorité maximale */
button.ultra-modern-btn-success,
.action-btn.ultra-modern-btn-success {
  background: linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%) !important;
  color: white !important;
  border: none !important;
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.25) !important;
}

button.ultra-modern-btn-success:hover,
.action-btn.ultra-modern-btn-success:hover {
  background: linear-gradient(135deg, #059669 0%, #047857 50%, #065f46 100%) !important;
  transform: translateY(-3px) !important;
  box-shadow: 0 8px 32px rgba(16, 185, 129, 0.35) !important;
}

a.ultra-modern-btn-danger,
.action-btn.ultra-modern-btn-danger {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%) !important;
  color: white !important;
  border: none !important;
  box-shadow: 0 4px 16px rgba(239, 68, 68, 0.25) !important;
  text-decoration: none !important;
}

a.ultra-modern-btn-danger:hover,
.action-btn.ultra-modern-btn-danger:hover {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 50%, #991b1b 100%) !important;
  transform: translateY(-3px) !important;
  box-shadow: 0 8px 32px rgba(239, 68, 68, 0.35) !important;
  color: white !important;
  text-decoration: none !important;
}

/* Titre avec gradient ultra moderne */
.page-title.ultra-modern-text-gradient {
  background: linear-gradient(135deg, #4300FF 0%, #0065F8 50%, #00CAFF 100%) !important;
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
  background-clip: text !important;
  font-weight: 900 !important;
  font-size: 2.5rem !important;
}

/* Responsive */
@media (max-width: 1024px) {
  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .amenities-grid {
    grid-template-columns: 1fr;
  }
  
  .form-actions {
    flex-direction: column;
    gap: 1rem;
  }
  
  .actions-left,
  .actions-right {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .add-property {
    padding: 1rem;
  }
  
  .page-header,
  .property-form {
    padding: 1.5rem;
  }
  
  .form-section {
    padding: 1.5rem;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .images-preview {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
  
  .actions-left,
  .actions-right {
    flex-direction: column;
  }
}
</style>
