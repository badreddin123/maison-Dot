<template>
  <div class="manager-profile-view">
    <div class="container">
      <!-- Header -->
      <div class="profile-header">
        <div class="profile-avatar">
          <div class="avatar-container">
            <img 
              v-if="user?.profile_picture" 
              :src="user.profile_picture" 
              :alt="user.name"
              class="avatar-image"
            >
            <div v-else class="avatar-placeholder">
              <span class="icon">👤</span>
            </div>
          </div>
          <button class="avatar-edit-btn" @click="showAvatarUpload = true">
            <span class="icon">📷</span>
          </button>
        </div>
        <div class="profile-info">
          <h1 class="profile-name">{{ user?.name }}</h1>
          <p class="profile-email">{{ user?.email }}</p>
          <div class="profile-badges">
            <span class="badge manager-badge">
              <span class="icon">🏢</span>
              Manager
            </span>
            <span v-if="user?.status === 'active'" class="badge status-active">
              <span class="icon">✅</span>
              Actif
            </span>
            <span v-else-if="user?.status === 'pending'" class="badge status-pending">
              <span class="icon">⏳</span>
              En attente
            </span>
          </div>
        </div>
        <div class="profile-stats">
          <div class="stat-card">
            <div class="stat-value">{{ managerStats.properties }}</div>
            <div class="stat-label">Propriétés</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ managerStats.bookings }}</div>
            <div class="stat-label">Réservations</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ managerStats.revenue }}€</div>
            <div class="stat-label">Revenus</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ managerStats.rating }}/5</div>
            <div class="stat-label">Note moyenne</div>
          </div>
        </div>
      </div>

      <div class="profile-content">
        <!-- Navigation onglets -->
        <div class="profile-tabs">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            :class="['tab-button', { active: activeTab === tab.id }]"
            @click="activeTab = tab.id"
          >
            <span class="icon">{{ getIcon(tab.icon) }}</span>
            {{ tab.label }}
          </button>
        </div>

        <!-- Contenu des onglets -->
        <div class="tab-content">
          <!-- Onglet Informations Personnelles -->
          <div v-if="activeTab === 'personal'" class="tab-panel">
            <div class="card">
              <div class="card-header">
                <h3>Informations Personnelles</h3>
                <button 
                  v-if="!editingPersonal"
                  class="btn btn-secondary"
                  @click="editingPersonal = true"
                >
                  <span class="icon">✏️</span>
                  Modifier
                </button>
                <div v-else class="edit-actions">
                  <button class="btn btn-primary" @click="savePersonalInfo">
                    <span class="icon">✅</span>
                    Sauvegarder
                  </button>
                  <button class="btn btn-secondary" @click="cancelEditPersonal">
                    <span class="icon">❌</span>
                    Annuler
                  </button>
                </div>
              </div>
              <div class="card-body">
                <div class="form-grid">
                  <div class="form-group">
                    <label>Nom complet</label>
                    <input 
                      v-if="editingPersonal"
                      v-model="personalForm.name"
                      type="text"
                      class="form-control"
                      placeholder="Votre nom complet"
                    >
                    <span v-else class="form-value">{{ user?.name || 'Non renseigné' }}</span>
                  </div>
                  <div class="form-group">
                    <label>Email</label>
                    <input 
                      v-if="editingPersonal"
                      v-model="personalForm.email"
                      type="email"
                      class="form-control"
                      placeholder="votre@email.com"
                    >
                    <span v-else class="form-value">{{ user?.email }}</span>
                  </div>
                  <div class="form-group">
                    <label>Téléphone</label>
                    <input 
                      v-if="editingPersonal"
                      v-model="personalForm.phone"
                      type="tel"
                      class="form-control"
                      placeholder="+33 1 23 45 67 89"
                    >
                    <span v-else class="form-value">{{ user?.phone || 'Non renseigné' }}</span>
                  </div>
                  <div class="form-group full-width">
                    <label>Adresse</label>
                    <textarea 
                      v-if="editingPersonal"
                      v-model="personalForm.address"
                      class="form-control"
                      rows="3"
                      placeholder="Votre adresse complète"
                    ></textarea>
                    <span v-else class="form-value">{{ user?.address || 'Non renseignée' }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Onglet Business -->
          <div v-if="activeTab === 'business'" class="tab-panel">
            <div class="card">
              <div class="card-header">
                <h3>Informations Business</h3>
                <button 
                  v-if="!editingBusiness"
                  class="btn btn-secondary"
                  @click="editingBusiness = true"
                >
                  <span class="icon">✏️</span>
                  Modifier
                </button>
                <div v-else class="edit-actions">
                  <button class="btn btn-primary" @click="saveBusinessInfo">
                    <span class="icon">✅</span>
                    Sauvegarder
                  </button>
                  <button class="btn btn-secondary" @click="cancelEditBusiness">
                    <span class="icon">❌</span>
                    Annuler
                  </button>
                </div>
              </div>
              <div class="card-body">
                <div class="form-grid">
                  <div class="form-group">
                    <label>Nom de l'entreprise</label>
                    <input 
                      v-if="editingBusiness"
                      v-model="businessForm.company_name"
                      type="text"
                      class="form-control"
                      placeholder="Mon Entreprise SARL"
                    >
                    <span v-else class="form-value">{{ businessInfo.company_name || 'Non renseigné' }}</span>
                  </div>
                  <div class="form-group">
                    <label>SIRET</label>
                    <input 
                      v-if="editingBusiness"
                      v-model="businessForm.siret"
                      type="text"
                      class="form-control"
                      placeholder="12345678901234"
                    >
                    <span v-else class="form-value">{{ businessInfo.siret || 'Non renseigné' }}</span>
                  </div>
                  <div class="form-group">
                    <label>TVA Intracommunautaire</label>
                    <input 
                      v-if="editingBusiness"
                      v-model="businessForm.vat_number"
                      type="text"
                      class="form-control"
                      placeholder="FR12345678901"
                    >
                    <span v-else class="form-value">{{ businessInfo.vat_number || 'Non renseigné' }}</span>
                  </div>
                  <div class="form-group">
                    <label>Site web</label>
                    <input 
                      v-if="editingBusiness"
                      v-model="businessForm.website"
                      type="url"
                      class="form-control"
                      placeholder="https://monentreprise.com"
                    >
                    <span v-else class="form-value">
                      <a v-if="businessInfo.website" :href="businessInfo.website" target="_blank">
                        {{ businessInfo.website }}
                      </a>
                      <span v-else>Non renseigné</span>
                    </span>
                  </div>
                  <div class="form-group full-width">
                    <label>Description de l'activité</label>
                    <textarea 
                      v-if="editingBusiness"
                      v-model="businessForm.description"
                      class="form-control"
                      rows="4"
                      placeholder="Décrivez votre activité dans l'immobilier..."
                    ></textarea>
                    <span v-else class="form-value">{{ businessInfo.description || 'Non renseignée' }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Informations bancaires -->
            <div class="card">
              <div class="card-header">
                <h3>Informations de Paiement</h3>
              </div>
              <div class="card-body">
                <div class="form-grid">
                  <div class="form-group">
                    <label>IBAN</label>
                    <span class="form-value">FR76 •••• •••• •••• ••45</span>
                  </div>
                  <div class="form-group">
                    <label>Statut</label>
                    <span class="badge status-verified">
                      <span class="icon">✅</span>
                      Vérifié
                    </span>
                  </div>
                </div>
                <button class="btn btn-secondary">
                  <span class="icon">🔒</span>
                  Modifier les informations bancaires
                </button>
              </div>
            </div>
          </div>

          <!-- Onglet Performances -->
          <div v-if="activeTab === 'performance'" class="tab-panel">
            <div class="performance-grid">
              <!-- Revenus -->
              <div class="card">
                <div class="card-header">
                  <h3>Revenus</h3>
                  <div class="period-selector">
                    <button 
                      v-for="period in periods" 
                      :key="period.id"
                      :class="['period-btn', { active: selectedPeriod === period.id }]"
                      @click="selectedPeriod = period.id"
                    >
                      {{ period.label }}
                    </button>
                  </div>
                </div>
                <div class="card-body">
                  <div class="revenue-chart">
                    <div class="revenue-total">
                      <span class="amount">{{ getRevenueForPeriod() }}€</span>
                      <span class="trend positive">
                        <span class="icon">📈</span>
                        +12% vs période précédente
                      </span>
                    </div>
                    <div class="revenue-breakdown">
                      <div class="breakdown-item">
                        <span class="label">Réservations confirmées</span>
                        <span class="value">{{ Math.round(getRevenueForPeriod() * 0.8) }}€</span>
                      </div>
                      <div class="breakdown-item">
                        <span class="label">Réservations terminées</span>
                        <span class="value">{{ Math.round(getRevenueForPeriod() * 0.2) }}€</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Réservations -->
              <div class="card">
                <div class="card-header">
                  <h3>Réservations</h3>
                </div>
                <div class="card-body">
                  <div class="bookings-stats">
                    <div class="booking-stat">
                      <div class="stat-number">{{ bookingStats.total }}</div>
                      <div class="stat-label">Total</div>
                    </div>
                    <div class="booking-stat">
                      <div class="stat-number">{{ bookingStats.pending }}</div>
                      <div class="stat-label">En attente</div>
                    </div>
                    <div class="booking-stat">
                      <div class="stat-number">{{ bookingStats.confirmed }}</div>
                      <div class="stat-label">Confirmées</div>
                    </div>
                    <div class="booking-stat">
                      <div class="stat-number">{{ bookingStats.completed }}</div>
                      <div class="stat-label">Terminées</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Propriétés -->
              <div class="card">
                <div class="card-header">
                  <h3>Propriétés</h3>
                </div>
                <div class="card-body">
                  <div class="properties-performance">
                    <div class="property-item">
                      <div class="property-info">
                        <h4>Appartement Luxueux Centre-Ville</h4>
                        <p>75001 Paris</p>
                      </div>
                      <div class="property-metrics">
                        <span class="metric">
                          <span class="icon">⭐</span>
                          4.8/5
                        </span>
                        <span class="metric">
                          <span class="icon">📅</span>
                          85% occupation
                        </span>
                        <span class="metric">
                          <span class="icon">💰</span>
                          2.4K€/mois
                        </span>
                      </div>
                    </div>
                    <div class="property-item">
                      <div class="property-info">
                        <h4>Maison de Charme Montmartre</h4>
                        <p>75018 Paris</p>
                      </div>
                      <div class="property-metrics">
                        <span class="metric">
                          <span class="icon">⭐</span>
                          4.6/5
                        </span>
                        <span class="metric">
                          <span class="icon">📅</span>
                          72% occupation
                        </span>
                        <span class="metric">
                          <span class="icon">💰</span>
                          1.8K€/mois
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Avis clients -->
              <div class="card">
                <div class="card-header">
                  <h3>Avis Clients</h3>
                </div>
                <div class="card-body">
                  <div class="reviews-summary">
                    <div class="overall-rating">
                      <div class="rating-value">4.7</div>
                      <div class="rating-stars">
                        <span class="icon">⭐⭐⭐⭐⭐</span>
                      </div>
                      <div class="rating-count">Basé sur 24 avis</div>
                    </div>
                    <div class="rating-breakdown">
                      <div class="rating-bar">
                        <span>5★</span>
                        <div class="bar"><div class="fill" style="width: 70%"></div></div>
                        <span>70%</span>
                      </div>
                      <div class="rating-bar">
                        <span>4★</span>
                        <div class="bar"><div class="fill" style="width: 20%"></div></div>
                        <span>20%</span>
                      </div>
                      <div class="rating-bar">
                        <span>3★</span>
                        <div class="bar"><div class="fill" style="width: 8%"></div></div>
                        <span>8%</span>
                      </div>
                      <div class="rating-bar">
                        <span>2★</span>
                        <div class="bar"><div class="fill" style="width: 2%"></div></div>
                        <span>2%</span>
                      </div>
                      <div class="rating-bar">
                        <span>1★</span>
                        <div class="bar"><div class="fill" style="width: 0%"></div></div>
                        <span>0%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Onglet Sécurité -->
          <div v-if="activeTab === 'security'" class="tab-panel">
            <div class="card">
              <div class="card-header">
                <h3>Sécurité du Compte</h3>
              </div>
              <div class="card-body">
                <!-- Changement de mot de passe -->
                <div class="security-section">
                  <h4>Changer le mot de passe</h4>
                  <form @submit.prevent="changePassword" class="password-form">
                    <div class="form-group">
                      <label>Mot de passe actuel</label>
                      <input 
                        v-model="passwordForm.current"
                        type="password"
                        class="form-control"
                        placeholder="Entrez votre mot de passe actuel"
                      >
                    </div>
                    <div class="form-group">
                      <label>Nouveau mot de passe</label>
                      <input 
                        v-model="passwordForm.new"
                        type="password"
                        class="form-control"
                        placeholder="Nouveau mot de passe"
                      >
                    </div>
                    <div class="form-group">
                      <label>Confirmer le nouveau mot de passe</label>
                      <input 
                        v-model="passwordForm.confirm"
                        type="password"
                        class="form-control"
                        placeholder="Confirmez le nouveau mot de passe"
                      >
                    </div>
                    <button 
                      type="submit" 
                      class="btn btn-primary"
                      :disabled="!isPasswordFormValid"
                    >
                      <span class="icon">🛡️</span>
                      Changer le mot de passe
                    </button>
                  </form>
                </div>

                <!-- Authentification à deux facteurs -->
                <div class="security-section">
                  <h4>Authentification à deux facteurs</h4>
                  <div class="two-factor-status">
                    <div class="status-info">
                      <span class="status-icon disabled">🔒</span>
                      <div>
                        <strong>Non activée</strong>
                        <p>Sécurisez votre compte avec l'authentification à deux facteurs</p>
                      </div>
                    </div>
                    <button class="btn btn-primary">
                      <span class="icon">🔐</span>
                      Activer 2FA
                    </button>
                  </div>
                </div>

                <!-- Sessions actives -->
                <div class="security-section">
                  <h4>Sessions Actives</h4>
                  <div class="sessions-list">
                    <div class="session-item current">
                      <div class="session-info">
                        <span class="icon">🖥️</span>
                        <div>
                          <strong>Session actuelle</strong>
                          <p>Chrome sur Windows - France</p>
                          <small>Connecté maintenant</small>
                        </div>
                      </div>
                      <span class="session-badge current">Actuelle</span>
                    </div>
                  </div>
                  <button class="btn btn-danger" @click="logoutAllDevices">
                    <span class="icon">🚪</span>
                    Déconnecter tous les appareils
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Onglet Notifications -->
          <div v-if="activeTab === 'notifications'" class="tab-panel">
            <div class="card">
              <div class="card-header">
                <h3>Préférences de Notification</h3>
              </div>
              <div class="card-body">
                <div class="notification-categories">
                  <div class="category">
                    <h4>Réservations</h4>
                    <div class="notification-item">
                      <label class="switch">
                        <input 
                          v-model="notifications.newBooking"
                          type="checkbox"
                        >
                        <span class="slider"></span>
                      </label>
                      <div class="notification-info">
                        <strong>Nouvelles réservations</strong>
                        <p>Recevoir une notification pour chaque nouvelle réservation</p>
                      </div>
                    </div>
                    <div class="notification-item">
                      <label class="switch">
                        <input 
                          v-model="notifications.bookingModified"
                          type="checkbox"
                        >
                        <span class="slider"></span>
                      </label>
                      <div class="notification-info">
                        <strong>Modifications de réservation</strong>
                        <p>Être alerté des annulations et modifications</p>
                      </div>
                    </div>
                  </div>

                  <div class="category">
                    <h4>Avis et Notes</h4>
                    <div class="notification-item">
                      <label class="switch">
                        <input 
                          v-model="notifications.newReview"
                          type="checkbox"
                        >
                        <span class="slider"></span>
                      </label>
                      <div class="notification-info">
                        <strong>Nouveaux avis</strong>
                        <p>Notification pour chaque nouvel avis client</p>
                      </div>
                    </div>
                  </div>

                  <div class="category">
                    <h4>Messages</h4>
                    <div class="notification-item">
                      <label class="switch">
                        <input 
                          v-model="notifications.messages"
                          type="checkbox"
                        >
                        <span class="slider"></span>
                      </label>
                      <div class="notification-info">
                        <strong>Messages clients</strong>
                        <p>Recevoir les messages des clients</p>
                      </div>
                    </div>
                  </div>

                  <div class="category">
                    <h4>Marketing</h4>
                    <div class="notification-item">
                      <label class="switch">
                        <input 
                          v-model="notifications.marketing"
                          type="checkbox"
                        >
                        <span class="slider"></span>
                      </label>
                      <div class="notification-info">
                        <strong>Conseils et promotions</strong>
                        <p>Recevoir des conseils pour optimiser vos annonces</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="notification-methods">
                  <h4>Moyens de communication</h4>
                  <div class="method-grid">
                    <label class="method-item">
                      <input 
                        v-model="notificationMethods"
                        value="email"
                        type="checkbox"
                      >
                      <div class="method-content">
                        <span class="method-icon">📧</span>
                        <span>Email</span>
                      </div>
                    </label>
                    <label class="method-item">
                      <input 
                        v-model="notificationMethods"
                        value="sms"
                        type="checkbox"
                      >
                      <div class="method-content">
                        <span class="method-icon">📱</span>
                        <span>SMS</span>
                      </div>
                    </label>
                    <label class="method-item">
                      <input 
                        v-model="notificationMethods"
                        value="push"
                        type="checkbox"
                      >
                      <div class="method-content">
                        <span class="method-icon">🔔</span>
                        <span>Push</span>
                      </div>
                    </label>
                  </div>
                </div>

                <div class="notification-actions">
                  <button class="btn btn-primary" @click="saveNotifications">
                    <span class="icon">💾</span>
                    Sauvegarder les préférences
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Upload Avatar -->
    <div v-if="showAvatarUpload" class="modal-overlay" @click="showAvatarUpload = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Changer votre photo de profil</h3>
          <button class="modal-close" @click="showAvatarUpload = false">
            <span class="icon">❌</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="avatar-upload">
            <input 
              ref="fileInput"
              type="file" 
              accept="image/*" 
              @change="handleAvatarUpload"
              style="display: none"
            >
            <div class="upload-area" @click="handleFileInputClick">
              <span class="icon">📤</span>
              <p>Cliquez pour sélectionner une image</p>
              <small>JPG, PNG, GIF - Max 5MB</small>
            </div>
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
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()

// Fonction pour obtenir les icônes
const getIcon = (name: string): string => {
  const icons: Record<string, string> = {
    'user': '👤', 'business': '🏢', 'performance': '📊', 'shield': '🛡️', 'bell': '🔔',
    'edit': '✏️', 'check': '✅', 'x': '❌', 'save': '💾', 'camera': '📷'
  }
  return icons[name] || '📄'
}

// État réactif
const loading = ref(false)
const activeTab = ref('personal')
const editingPersonal = ref(false)
const editingBusiness = ref(false)
const showAvatarUpload = ref(false)
const selectedPeriod = ref('month')
const fileInput = ref<HTMLInputElement>()

// Onglets
const tabs = [
  { id: 'personal', label: 'Profil', icon: 'user' },
  { id: 'business', label: 'Business', icon: 'business' },
  { id: 'performance', label: 'Performances', icon: 'performance' },
  { id: 'security', label: 'Sécurité', icon: 'shield' },
  { id: 'notifications', label: 'Notifications', icon: 'bell' }
]

// Périodes
const periods = [
  { id: 'week', label: 'Semaine' },
  { id: 'month', label: 'Mois' },
  { id: 'quarter', label: 'Trimestre' },
  { id: 'year', label: 'Année' }
]

// Données utilisateur
const user = computed(() => authStore.user)

// Statistiques manager
const managerStats = reactive({
  properties: 5,
  bookings: 28,
  revenue: 4200,
  rating: 4.7
})

// Statistiques réservations
const bookingStats = reactive({
  total: 28,
  pending: 3,
  confirmed: 12,
  completed: 13
})

// Formulaire informations personnelles
const personalForm = reactive({
  name: '',
  email: '',
  phone: '',
  address: ''
})

// Informations business
const businessInfo = reactive({
  company_name: 'PropManager SARL',
  siret: '12345678901234',
  vat_number: 'FR12345678901',
  website: 'https://propmanager.fr',
  description: 'Spécialisé dans la gestion de propriétés haut de gamme à Paris'
})

// Formulaire business
const businessForm = reactive({
  company_name: '',
  siret: '',
  vat_number: '',
  website: '',
  description: ''
})

// Formulaire mot de passe
const passwordForm = reactive({
  current: '',
  new: '',
  confirm: ''
})

// Notifications
const notifications = reactive({
  newBooking: true,
  bookingModified: true,
  newReview: true,
  messages: true,
  marketing: false
})

const notificationMethods = ref(['email', 'push'])

// Computed
const isPasswordFormValid = computed(() => {
  return passwordForm.current && 
         passwordForm.new && 
         passwordForm.confirm && 
         passwordForm.new === passwordForm.confirm &&
         passwordForm.new.length >= 8
})

// Méthodes
const initPersonalForm = () => {
  if (user.value) {
    personalForm.name = user.value.name || ''
    personalForm.email = user.value.email || ''
    personalForm.phone = user.value.phone || ''
    personalForm.address = user.value.address || ''
  }
}

const initBusinessForm = () => {
  businessForm.company_name = businessInfo.company_name
  businessForm.siret = businessInfo.siret
  businessForm.vat_number = businessInfo.vat_number
  businessForm.website = businessInfo.website
  businessForm.description = businessInfo.description
}

const savePersonalInfo = async () => {
  try {
    loading.value = true
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    await authStore.updateProfile({
      name: personalForm.name,
      email: personalForm.email,
      phone: personalForm.phone,
      address: personalForm.address
    })
    
    editingPersonal.value = false
    console.log('Profil mis à jour avec succès')
    
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error)
  } finally {
    loading.value = false
  }
}

const cancelEditPersonal = () => {
  editingPersonal.value = false
  initPersonalForm()
}

const saveBusinessInfo = async () => {
  try {
    loading.value = true
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    Object.assign(businessInfo, businessForm)
    editingBusiness.value = false
    console.log('Informations business mises à jour')
    
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error)
  } finally {
    loading.value = false
  }
}

const cancelEditBusiness = () => {
  editingBusiness.value = false
  initBusinessForm()
}

const changePassword = async () => {
  try {
    loading.value = true
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    passwordForm.current = ''
    passwordForm.new = ''
    passwordForm.confirm = ''
    
    console.log('Mot de passe changé avec succès')
    
  } catch (error) {
    console.error('Erreur lors du changement de mot de passe:', error)
  } finally {
    loading.value = false
  }
}

const saveNotifications = async () => {
  try {
    loading.value = true
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    console.log('Préférences de notifications sauvegardées')
    
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error)
  } finally {
    loading.value = false
  }
}

const logoutAllDevices = async () => {
  try {
    loading.value = true
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    console.log('Déconnexion de tous les appareils effectuée')
    
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error)
  } finally {
    loading.value = false
  }
}

const handleFileInputClick = () => {
  fileInput.value?.click()
}

const handleAvatarUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      alert('L\'image ne doit pas dépasser 5MB')
      return
    }
    
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      console.log('Avatar uploadé:', result)
      showAvatarUpload.value = false
    }
    reader.readAsDataURL(file)
  }
}

const getRevenueForPeriod = () => {
  switch (selectedPeriod.value) {
    case 'week': return 1200
    case 'month': return 4200
    case 'quarter': return 12600
    case 'year': return 50400
    default: return 4200
  }
}

// Lifecycle
onMounted(() => {
  initPersonalForm()
  initBusinessForm()
})
</script>

<style scoped>
.manager-profile-view {
  min-height: 100vh;
  background: var(--bg-main);
  padding: 2rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Header Profile */
.profile-header {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 3rem;
  padding: 2rem;
  background: var(--card-bg);
  border-radius: var(--border-radius-large);
  border: 1px solid var(--card-border);
  box-shadow: var(--shadow-card);
}

.profile-avatar {
  position: relative;
}

.avatar-container {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid var(--electric-blue);
  background: var(--bg-gray-100);
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  font-size: 3rem;
  color: var(--text-secondary);
}

.avatar-edit-btn {
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--electric-blue);
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.avatar-edit-btn:hover {
  background: var(--neon-cyan);
  transform: scale(1.1);
}

.profile-info {
  flex: 1;
}

.profile-name {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
  background: var(--gradient-text);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.profile-email {
  font-size: 1.2rem;
  color: var(--text-secondary);
  margin: 0 0 1rem 0;
}

.profile-badges {
  display: flex;
  gap: 1rem;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius-medium);
  font-size: 0.9rem;
  font-weight: 600;
}

.manager-badge {
  background: rgba(139, 69, 19, 0.1);
  color: #8B4513;
  border: 1px solid rgba(139, 69, 19, 0.3);
}

.status-active {
  background: rgba(34, 197, 94, 0.1);
  color: var(--success-color);
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.status-pending {
  background: rgba(251, 191, 36, 0.1);
  color: var(--warning-color);
  border: 1px solid rgba(251, 191, 36, 0.3);
}

.status-verified {
  background: rgba(34, 197, 94, 0.1);
  color: var(--success-color);
  border: 1px solid rgba(34, 197, 94, 0.3);
}

/* Stats cards */
.profile-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.stat-card {
  text-align: center;
  padding: 1.5rem 1rem;
  background: var(--card-bg);
  border-radius: var(--border-radius-medium);
  border: 1px solid var(--border-primary);
  box-shadow: var(--shadow-card);
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--electric-blue);
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.9rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Onglets */
.profile-tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid var(--card-border);
}

.tab-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 1rem;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: all 0.3s ease;
  position: relative;
}

.tab-button:hover {
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.05);
}

.tab-button.active {
  color: var(--electric-blue);
  border-bottom-color: var(--electric-blue);
}

/* Contenu des onglets */
.tab-content {
  animation: fadeIn 0.3s ease;
}

.tab-panel {
  display: block;
}

.card {
  background: var(--card-bg);
  border-radius: var(--border-radius-large);
  border: 1px solid var(--card-border);
  box-shadow: var(--shadow-card);
  margin-bottom: 2rem;
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

.card-header h3 {
  margin: 0;
  color: var(--text-primary);
  font-size: 1.5rem;
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

.form-value {
  padding: 0.75rem 0;
  color: var(--text-primary);
  font-size: 1rem;
  min-height: 1.5rem;
}

.form-value a {
  color: var(--electric-blue);
  text-decoration: none;
}

.form-value a:hover {
  text-decoration: underline;
}

/* Performance grid */
.performance-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

/* Sélecteur de période */
.period-selector {
  display: flex;
  gap: 0.5rem;
}

.period-btn {
  padding: 0.5rem 1rem;
  background: var(--bg-gray-100);
  border: 1px solid var(--card-border);
  border-radius: var(--border-radius-small);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.period-btn:hover {
  background: var(--bg-gray-200);
}

.period-btn.active {
  background: var(--electric-blue);
  color: white;
  border-color: var(--electric-blue);
}

/* Revenus */
.revenue-chart {
  text-align: center;
}

.revenue-total {
  margin-bottom: 2rem;
}

.amount {
  font-size: 3rem;
  font-weight: 700;
  color: var(--electric-blue);
  display: block;
  margin-bottom: 0.5rem;
}

.trend {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
}

.trend.positive {
  color: var(--success-color);
}

.revenue-breakdown {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.breakdown-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: var(--card-bg);
  border-radius: var(--border-radius-medium);
  border: 1px solid var(--border-primary);
}

.breakdown-item .label {
  color: var(--text-secondary);
}

.breakdown-item .value {
  font-weight: 700;
  color: var(--text-primary);
}

/* Statistiques réservations */
.bookings-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.booking-stat {
  text-align: center;
  padding: 1.5rem;
  background: var(--card-bg);
  border-radius: var(--border-radius-medium);
  border: 1px solid var(--border-primary);
}

.booking-stat .stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: var(--electric-blue);
  margin-bottom: 0.5rem;
}

.booking-stat .stat-label {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

/* Performance des propriétés */
.properties-performance {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.property-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: var(--card-bg);
  border-radius: var(--border-radius-medium);
  border: 1px solid var(--border-primary);
}

.property-info h4 {
  margin: 0 0 0.25rem 0;
  color: var(--text-primary);
  font-size: 1rem;
}

.property-info p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.property-metrics {
  display: flex;
  gap: 1rem;
}

.metric {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8rem;
  color: var(--text-secondary);
}

/* Avis clients */
.reviews-summary {
  display: flex;
  gap: 2rem;
}

.overall-rating {
  text-align: center;
  flex: 1;
}

.rating-value {
  font-size: 3rem;
  font-weight: 700;
  color: var(--electric-blue);
  margin-bottom: 0.5rem;
}

.rating-stars {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.rating-count {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.rating-breakdown {
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.rating-bar {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.9rem;
}

.rating-bar span:first-child {
  width: 30px;
  color: var(--text-secondary);
}

.bar {
  flex: 1;
  height: 8px;
  background: var(--bg-gray-200);
  border-radius: 4px;
  overflow: hidden;
}

.fill {
  height: 100%;
  background: var(--electric-blue);
  transition: width 0.3s ease;
}

.rating-bar span:last-child {
  width: 40px;
  text-align: right;
  color: var(--text-secondary);
}

/* Sécurité */
.security-section {
  margin-bottom: 3rem;
}

.security-section:last-child {
  margin-bottom: 0;
}

.security-section h4 {
  color: var(--text-primary);
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
}

.password-form {
  max-width: 500px;
}

.two-factor-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: var(--bg-gray-50);
  border-radius: var(--border-radius-medium);
  border: 1px solid var(--card-border);
}

.status-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.status-icon {
  font-size: 2rem;
}

.status-icon.disabled {
  opacity: 0.5;
}

.status-info div strong {
  color: var(--text-primary);
  display: block;
}

.status-info div p {
  color: var(--text-secondary);
  margin: 0.25rem 0 0 0;
}

.sessions-list {
  margin-bottom: 1.5rem;
}

.session-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: var(--bg-gray-50);
  border-radius: var(--border-radius-medium);
  border: 1px solid var(--card-border);
}

.session-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.session-info > div strong {
  color: var(--text-primary);
  display: block;
}

.session-info > div p {
  color: var(--text-secondary);
  margin: 0.25rem 0;
}

.session-info > div small {
  color: var(--text-muted);
}

.session-badge {
  padding: 0.25rem 0.75rem;
  border-radius: var(--border-radius-small);
  font-size: 0.8rem;
  font-weight: 600;
}

.session-badge.current {
  background: rgba(34, 197, 94, 0.1);
  color: var(--success-color);
}

/* Notifications */
.notification-categories {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-bottom: 2rem;
}

.category h4 {
  color: var(--text-primary);
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.notification-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background: var(--bg-gray-50);
  border-radius: var(--border-radius-medium);
}

.notification-info strong {
  color: var(--text-primary);
  display: block;
  margin-bottom: 0.25rem;
}

.notification-info p {
  color: var(--text-secondary);
  margin: 0;
  font-size: 0.9rem;
}

.notification-methods h4 {
  color: var(--text-primary);
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.method-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.method-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border: 2px solid var(--card-border);
  border-radius: var(--border-radius-medium);
  cursor: pointer;
  transition: all 0.3s ease;
}

.method-item:hover {
  border-color: var(--electric-blue);
  background: rgba(59, 130, 246, 0.05);
}

.method-item:has(input:checked) {
  border-color: var(--electric-blue);
  background: rgba(59, 130, 246, 0.1);
}

.method-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.method-icon {
  font-size: 1.2rem;
}

/* Switch toggle */
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
  flex-shrink: 0;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--bg-gray-300);
  transition: 0.4s;
  border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .slider {
  background: var(--gradient-primary);
}

input:checked + .slider:before {
  transform: translateX(26px);
}

/* Actions d'édition */
.edit-actions {
  display: flex;
  gap: 1rem;
}

.notification-actions {
  padding-top: 2rem;
  border-top: 1px solid var(--card-border);
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

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

/* Modal */
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
  max-width: 500px;
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

/* Upload area */
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

.upload-area > * {
  margin-bottom: 0.5rem;
}

.upload-area p {
  color: var(--text-primary);
  font-weight: 600;
  margin: 0;
}

.upload-area small {
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
  .profile-header {
    flex-direction: column;
    text-align: center;
  }

  .profile-stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .performance-grid {
    grid-template-columns: 1fr;
  }

  .reviews-summary {
    flex-direction: column;
  }

  .method-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .profile-tabs {
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .tab-button {
    flex: 1;
    min-width: 120px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .profile-stats {
    grid-template-columns: 1fr;
  }

  .bookings-stats {
    grid-template-columns: 1fr;
  }

  .container {
    padding: 0 0.5rem;
  }
}
</style>
