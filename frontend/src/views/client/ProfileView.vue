<template>
  <div class="profile-view">
    <div class="container">
      <!-- Header avec avatar -->
      <div class="profile-header ultra-modern-card">
        <div class="profile-avatar">
          <div class="avatar-container">
            <img 
              v-if="user?.profile_picture" 
              :src="user.profile_picture" 
              :alt="user.name"
              class="avatar-image"
            >
            <div v-else class="avatar-placeholder">
              <span class="icon">{{ getIcon('user') }}</span>
            </div>
          </div>
          <button class="avatar-edit-btn" @click="showAvatarUpload = true">
            <span class="icon">{{ getIcon('camera') }}</span>
          </button>
        </div>
        <div class="profile-info">
          <h1 class="profile-name">{{ user?.name }}</h1>
          <p class="profile-email">{{ user?.email }}</p>
          <div class="profile-badges">
            <span class="badge client-badge">
              <span class="icon">{{ getIcon('user') }}</span>
              Client
            </span>
            <span v-if="user?.status === 'active'" class="badge status-active">
              <span class="icon">{{ getIcon('check-circle') }}</span>
              Actif
            </span>
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
            <div class="card ultra-modern-card">
              <div class="card-header">
                <h3>Informations Personnelles</h3>
                <button 
                  v-if="!editingPersonal"
                  class="btn btn-secondary ultra-modern-btn ultra-modern-btn-secondary"
                  @click="editingPersonal = true"
                >
                  <span class="icon">{{ getIcon('edit') }}</span>
                  Modifier
                </button>
                <div v-else class="edit-actions">
                  <button class="btn btn-primary ultra-modern-btn ultra-modern-btn-primary" @click="savePersonalInfo">
                    <span class="icon">{{ getIcon('check') }}</span>
                    Sauvegarder
                  </button>
                  <button class="btn btn-secondary ultra-modern-btn ultra-modern-btn-secondary" @click="cancelEditPersonal">
                    <span class="icon">{{ getIcon('x') }}</span>
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
                      class="form-control ultra-modern-input"
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
                      class="form-control ultra-modern-input"
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
                      class="form-control ultra-modern-input"
                      placeholder="+33 1 23 45 67 89"
                    >
                    <span v-else class="form-value">{{ user?.phone || 'Non renseigné' }}</span>
                  </div>
                  <div class="form-group full-width">
                    <label>Adresse</label>
                    <textarea 
                      v-if="editingPersonal"
                      v-model="personalForm.address"
                      class="form-control ultra-modern-textarea"
                      rows="3"
                      placeholder="Votre adresse complète"
                    ></textarea>
                    <span v-else class="form-value">{{ user?.address || 'Non renseignée' }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Onglet Sécurité -->
          <div v-if="activeTab === 'security'" class="tab-panel">
            <div class="card ultra-modern-card">
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
                        class="form-control ultra-modern-input"
                        placeholder="Entrez votre mot de passe actuel"
                      >
                    </div>
                    <div class="form-group">
                      <label>Nouveau mot de passe</label>
                      <input 
                        v-model="passwordForm.new"
                        type="password"
                        class="form-control ultra-modern-input"
                        placeholder="Nouveau mot de passe"
                      >
                    </div>
                    <div class="form-group">
                      <label>Confirmer le nouveau mot de passe</label>
                      <input 
                        v-model="passwordForm.confirm"
                        type="password"
                        class="form-control ultra-modern-input"
                        placeholder="Confirmez le nouveau mot de passe"
                      >
                    </div>
                    <button 
                      type="submit" 
                      class="btn btn-primary ultra-modern-btn ultra-modern-btn-primary"
                      :disabled="!isPasswordFormValid"
                    >
                      <span class="icon">{{ getIcon('shield') }}</span>
                      Changer le mot de passe
                    </button>
                  </form>
                </div>

                <!-- Sessions actives -->
                <div class="security-section">
                  <h4>Sessions Actives</h4>
                  <div class="sessions-list">
                    <div class="session-item current">
                      <div class="session-info">
                        <span class="icon">{{ getIcon('monitor') }}</span>
                        <div>
                          <strong>Session actuelle</strong>
                          <p>{{ currentDevice }} - {{ currentLocation }}</p>
                          <small>Connecté maintenant</small>
                        </div>
                      </div>
                      <span class="session-badge current">Actuelle</span>
                    </div>
                  </div>
                  <button class="btn btn-danger ultra-modern-btn ultra-modern-btn-danger" @click="logoutAllDevices">
                    <span class="icon">{{ getIcon('log-out') }}</span>
                    Déconnecter tous les appareils
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Onglet Préférences -->
          <div v-if="activeTab === 'preferences'" class="tab-panel">
            <div class="card ultra-modern-card">
              <div class="card-header">
                <h3>Préférences</h3>
              </div>
              <div class="card-body">
                <div class="preferences-grid">
                  <!-- Notifications -->
                  <div class="preference-section">
                    <h4>Notifications</h4>
                    <div class="preference-item">
                      <label class="switch">
                        <input 
                          v-model="preferences.emailNotifications"
                          type="checkbox"
                        >
                        <span class="slider"></span>
                      </label>
                      <div class="preference-info">
                        <strong>Notifications par email</strong>
                        <p>Recevoir des emails pour les confirmations de réservation</p>
                      </div>
                    </div>
                    <div class="preference-item">
                      <label class="switch">
                        <input 
                          v-model="preferences.pushNotifications"
                          type="checkbox"
                        >
                        <span class="slider"></span>
                      </label>
                      <div class="preference-info">
                        <strong>Notifications push</strong>
                        <p>Recevoir des notifications dans le navigateur</p>
                      </div>
                    </div>
                    <div class="preference-item">
                      <label class="switch">
                        <input 
                          v-model="preferences.marketingEmails"
                          type="checkbox"
                        >
                        <span class="slider"></span>
                      </label>
                      <div class="preference-info">
                        <strong>Emails marketing</strong>
                        <p>Recevoir des offres spéciales et nouveautés</p>
                      </div>
                    </div>
                  </div>

                  <!-- Langues et région -->
                  <div class="preference-section">
                    <h4>Langue et Région</h4>
                    <div class="form-group">
                      <label>Langue</label>
                      <select v-model="preferences.language" class="form-control ultra-modern-select">
                        <option value="fr">Français</option>
                        <option value="en">English</option>
                        <option value="es">Español</option>
                      </select>
                    </div>
                    <div class="form-group">
                      <label>Fuseau horaire</label>
                      <select v-model="preferences.timezone" class="form-control ultra-modern-select">
                        <option value="Europe/Paris">Europe/Paris (GMT+1)</option>
                        <option value="Europe/London">Europe/London (GMT+0)</option>
                        <option value="America/New_York">America/New_York (GMT-5)</option>
                      </select>
                    </div>
                    <div class="form-group">
                      <label>Devise</label>
                      <select v-model="preferences.currency" class="form-control ultra-modern-select">
                        <option value="EUR">Euro (€)</option>
                        <option value="USD">Dollar US ($)</option>
                        <option value="GBP">Livre Sterling (£)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div class="preferences-actions">
                  <button class="btn btn-primary ultra-modern-btn ultra-modern-btn-primary" @click="savePreferences">
                    <span class="icon">{{ getIcon('save') }}</span>
                    Sauvegarder les préférences
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Onglet Historique -->
          <div v-if="activeTab === 'history'" class="tab-panel">
            <div class="card ultra-modern-card">
              <div class="card-header">
                <h3>Historique d'Activité</h3>
              </div>
              <div class="card-body">
                <div class="activity-timeline">
                  <div v-for="activity in activityHistory" :key="activity.id" class="activity-item">
                    <div class="activity-icon">
                      <span class="icon">{{ getIcon(getActivityIcon(activity.type)) }}</span>
                    </div>
                    <div class="activity-content">
                      <h5>{{ activity.title }}</h5>
                      <p>{{ activity.description }}</p>
                      <small>{{ formatDate(activity.created_at) }}</small>
                    </div>
                  </div>
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
            <span class="icon">{{ getIcon('x') }}</span>
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
              <span class="icon">{{ getIcon('upload') }}</span>
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

// Fonction pour obtenir les icônes
const getIcon = (name: string): string => {
  const icons: Record<string, string> = {
    'user': '👤', 'camera': '📷', 'edit': '✏️', 'check': '✅', 'x': '❌',
    'shield': '🛡️', 'settings': '⚙️', 'clock': '🕐', 'monitor': '🖥️',
    'log-out': '🚪', 'save': '💾', 'upload': '📤', 'check-circle': '✅',
    'home': '🏠', 'log-in': '🔐', 'activity': '📊'
  }
  return icons[name] || '📄'
}

const authStore = useAuthStore()

// État réactif
const loading = ref(false)
const activeTab = ref('personal')
const editingPersonal = ref(false)
const showAvatarUpload = ref(false)
const fileInput = ref<HTMLInputElement>()

// Onglets
const tabs = [
  { id: 'personal', label: 'Informations', icon: 'user' },
  { id: 'security', label: 'Sécurité', icon: 'shield' },
  { id: 'preferences', label: 'Préférences', icon: 'settings' },
  { id: 'history', label: 'Historique', icon: 'clock' }
]

// Données utilisateur
const user = computed(() => authStore.user)

// Formulaire informations personnelles
const personalForm = reactive({
  name: '',
  email: '',
  phone: '',
  address: ''
})

// Formulaire mot de passe
const passwordForm = reactive({
  current: '',
  new: '',
  confirm: ''
})

// Préférences
const preferences = reactive({
  emailNotifications: true,
  pushNotifications: true,
  marketingEmails: false,
  language: 'fr',
  timezone: 'Europe/Paris',
  currency: 'EUR'
})

// Historique d'activité (simulé)
const activityHistory = ref([
  {
    id: 1,
    type: 'booking',
    title: 'Nouvelle réservation',
    description: 'Réservation confirmée pour "Appartement Luxueux Centre-Ville Paris"',
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    type: 'profile',
    title: 'Profil mis à jour',
    description: 'Informations personnelles modifiées',
    created_at: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 3,
    type: 'login',
    title: 'Connexion',
    description: 'Connexion depuis Chrome sur Windows',
    created_at: new Date(Date.now() - 172800000).toISOString()
  }
])

// Computed
const isPasswordFormValid = computed(() => {
  return passwordForm.current && 
         passwordForm.new && 
         passwordForm.confirm && 
         passwordForm.new === passwordForm.confirm &&
         passwordForm.new.length >= 8
})

const currentDevice = computed(() => {
  const userAgent = navigator.userAgent
  if (userAgent.includes('Chrome')) return 'Chrome'
  if (userAgent.includes('Firefox')) return 'Firefox'
  if (userAgent.includes('Safari')) return 'Safari'
  return 'Navigateur inconnu'
})

const currentLocation = computed(() => 'France') // Simulé

// Méthodes
const initPersonalForm = () => {
  if (user.value) {
    personalForm.name = user.value.name || ''
    personalForm.email = user.value.email || ''
    personalForm.phone = user.value.phone || ''
    personalForm.address = user.value.address || ''
  }
}

const savePersonalInfo = async () => {
  try {
    loading.value = true
    
    // Simuler la sauvegarde
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mettre à jour le store auth
    await authStore.updateProfile({
      name: personalForm.name,
      email: personalForm.email,
      phone: personalForm.phone,
      address: personalForm.address
    })
    
    editingPersonal.value = false
    
    // Afficher un message de succès
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

const changePassword = async () => {
  try {
    loading.value = true
    
    // Simuler le changement de mot de passe
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Réinitialiser le formulaire
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

const savePreferences = async () => {
  try {
    loading.value = true
    
    // Simuler la sauvegarde des préférences
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    console.log('Préférences sauvegardées')
    
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error)
  } finally {
    loading.value = false
  }
}

const logoutAllDevices = async () => {
  try {
    loading.value = true
    
    // Simuler la déconnexion de tous les appareils
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
    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('L\'image ne doit pas dépasser 5MB')
      return
    }
    
    // Simuler l'upload
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      console.log('Avatar uploadé:', result)
      showAvatarUpload.value = false
    }
    reader.readAsDataURL(file)
  }
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'booking': return 'home'
    case 'profile': return 'user'
    case 'login': return 'log-in'
    default: return 'activity'
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Lifecycle
onMounted(() => {
  initPersonalForm()
})
</script>

<style scoped>
@import url('../../assets/ultra-modern-theme.css');

.profile-view {
  min-height: 100vh;
  background: var(--bg-gradient-main);
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
  background: linear-gradient(135deg, #4300FF 0%, #0065F8 50%, #00CAFF 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 4px 12px rgba(67, 0, 255, 0.3);
  position: relative;
}

.profile-name::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 100px;
  height: 3px;
  background: linear-gradient(90deg, #4300FF, #0065F8);
  border-radius: 2px;
}

.profile-email {
  font-size: 1.2rem;
  color: var(--text-secondary);
  margin: 0 0 1rem 0;
  margin-top: 1rem;
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

.client-badge {
  background: rgba(59, 130, 246, 0.1);
  color: var(--electric-blue);
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.status-active {
  background: rgba(34, 197, 94, 0.1);
  color: var(--success-color);
  border: 1px solid rgba(34, 197, 94, 0.3);
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
  justify-content: between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--card-border);
  background: var(--bg-gray-50);
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

/* Actions d'édition */
.edit-actions {
  display: flex;
  gap: 1rem;
}

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

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-neon-hover);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.btn-secondary {
  background: var(--bg-gray-200);
  color: var(--text-primary);
  border: 1px solid var(--card-border);
}

.btn-secondary:hover {
  background: var(--bg-gray-300);
}

.btn-danger {
  background: var(--gradient-danger);
  color: white;
}

.btn-danger:hover {
  transform: translateY(-2px);
}

/* Sections sécurité */
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

/* Préférences */
.preferences-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-bottom: 2rem;
}

.preference-section h4 {
  color: var(--text-primary);
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
}

.preference-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.preference-info strong {
  color: var(--text-primary);
  display: block;
  margin-bottom: 0.25rem;
}

.preference-info p {
  color: var(--text-secondary);
  margin: 0;
  font-size: 0.9rem;
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

.preferences-actions {
  padding-top: 2rem;
  border-top: 1px solid var(--card-border);
}

/* Historique d'activité */
.activity-timeline {
  position: relative;
}

.activity-item {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  position: relative;
}

.activity-item:not(:last-child)::after {
  content: '';
  position: absolute;
  left: 20px;
  top: 50px;
  width: 2px;
  height: calc(100% - 20px);
  background: var(--card-border);
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--gradient-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.activity-content {
  flex: 1;
  padding-top: 0.25rem;
}

.activity-content h5 {
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
}

.activity-content p {
  color: var(--text-secondary);
  margin: 0 0 0.5rem 0;
}

.activity-content small {
  color: var(--text-muted);
  font-size: 0.8rem;
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
@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    text-align: center;
  }

  .profile-tabs {
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .tab-button {
    flex: 1;
    min-width: 120px;
  }

  .form-grid,
  .preferences-grid {
    grid-template-columns: 1fr;
  }

  .container {
    padding: 0 0.5rem;
  }
}
</style>
