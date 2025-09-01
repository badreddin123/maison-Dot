<template>
  <div class="pending-managers">
    <!-- En-tête -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-info">
          <h1 class="page-title">Demandes de comptes Manager</h1>
          <p class="page-subtitle">
            Gérez les demandes d'approbation des comptes managers
          </p>
        </div>
        
        <div class="header-stats">
          <div class="stat-item">
            <div class="stat-number">{{ pendingManagers.length }}</div>
            <div class="stat-label">En attente</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ processedToday }}</div>
            <div class="stat-label">Traitées aujourd'hui</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Actions en lot -->
    <div class="bulk-actions-section" v-if="selectedManagers.length > 0">
      <div class="bulk-content">
        <div class="bulk-info">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <span>{{ selectedManagers.length }} demande{{ selectedManagers.length > 1 ? 's' : '' }} sélectionnée{{ selectedManagers.length > 1 ? 's' : '' }}</span>
        </div>
        
        <div class="bulk-buttons">
          <button @click="bulkApprove" class="bulk-btn approve">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Approuver tout
          </button>
          <button @click="bulkReject" class="bulk-btn reject">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            Rejeter tout
          </button>
          <button @click="clearSelection" class="bulk-btn cancel">
            Annuler
          </button>
        </div>
      </div>
    </div>

    <!-- Liste des demandes -->
    <div class="managers-section">
      <div v-if="adminStore.isLoading" class="loading-state">
        <div class="cyber-spinner"></div>
        <p>Chargement des demandes...</p>
      </div>
      
      <div v-else-if="pendingManagers.length === 0" class="empty-state">
        <div class="empty-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <h3>Aucune demande en attente</h3>
        <p>Toutes les demandes de comptes managers ont été traitées.</p>
      </div>
      
      <div v-else class="managers-grid">
        <div
          v-for="(manager, index) in pendingManagers"
          :key="manager.id"
          class="manager-card"
          :class="{ selected: selectedManagers.includes(manager.id) }"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <!-- Checkbox de sélection -->
          <div class="card-checkbox">
            <input
              type="checkbox"
              :value="manager.id"
              v-model="selectedManagers"
              class="manager-checkbox"
            />
          </div>
          
          <!-- Informations du manager -->
          <div class="manager-info">
            <div class="manager-avatar">
              <img 
                v-if="manager.profile_picture" 
                :src="manager.profile_picture" 
                :alt="manager.name"
                @error="handleImageError"
              />
              <div v-else class="avatar-placeholder">
                {{ manager.name.charAt(0).toUpperCase() }}
              </div>
            </div>
            
            <div class="manager-details">
              <h3 class="manager-name">{{ manager.name }}</h3>
              <p class="manager-email">{{ manager.email }}</p>
              <div class="manager-meta">
                <div class="meta-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12,6 12,12 16,14"/>
                  </svg>
                  <span>Inscrit {{ formatRelativeTime(manager.created_at) }}</span>
                </div>
                <div v-if="manager.phone" class="meta-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
                  </svg>
                  <span>{{ manager.phone }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Informations supplémentaires -->
          <div class="manager-additional">
            <div v-if="manager.address" class="address-info">
              <h4>Adresse</h4>
              <p>{{ manager.address }}</p>
            </div>
            
            <!-- Motivation (simulée) -->
            <div class="motivation-info">
              <h4>Motivation</h4>
              <p>{{ getRandomMotivation() }}</p>
            </div>
            
            <!-- Expérience (simulée) -->
            <div class="experience-info">
              <h4>Expérience</h4>
              <div class="experience-tags">
                <span v-for="tag in getRandomExperience()" :key="tag" class="experience-tag">
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
          
          <!-- Statut d'urgence -->
          <div class="urgency-indicator" :class="getUrgencyLevel(manager.created_at)">
            <div class="urgency-dot"></div>
            <span class="urgency-text">{{ getUrgencyText(manager.created_at) }}</span>
          </div>
          
          <!-- Actions -->
          <div class="manager-actions">
            <button 
              @click="approveManager(manager)" 
              class="action-btn approve"
              :disabled="processingManagers.includes(manager.id)"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span v-if="!processingManagers.includes(manager.id)">Approuver</span>
              <span v-else>Traitement...</span>
            </button>
            
            <button 
              @click="viewManagerDetails(manager)" 
              class="action-btn details"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
              </svg>
              Détails
            </button>
            
            <button 
              @click="rejectManager(manager)" 
              class="action-btn reject"
              :disabled="processingManagers.includes(manager.id)"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
              Rejeter
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de confirmation d'approbation -->
    <div v-if="showApprovalModal" class="modal-overlay" @click="closeApprovalModal">
      <div class="modal-content approval-modal" @click.stop>
        <div class="modal-header">
          <h3>Confirmer l'approbation</h3>
          <button @click="closeApprovalModal" class="close-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="approval-content">
            <div class="approval-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h4>Approuver le compte manager ?</h4>
            <p v-if="managerToProcess">
              Vous êtes sur le point d'approuver le compte de <strong>{{ managerToProcess.name }}</strong>.
              Cette action donnera à l'utilisateur les droits de manager sur la plateforme.
            </p>
            
            <div class="approval-options">
              <label class="option-item">
                <input 
                  type="checkbox" 
                  v-model="sendWelcomeEmail"
                  class="option-checkbox"
                />
                <span class="option-label">Envoyer un email de bienvenue</span>
              </label>
              
              <label class="option-item">
                <input 
                  type="checkbox" 
                  v-model="notifyOtherAdmins"
                  class="option-checkbox"
                />
                <span class="option-label">Notifier les autres administrateurs</span>
              </label>
            </div>
          </div>
        </div>
        
        <div class="modal-actions">
          <button @click="closeApprovalModal" class="btn secondary">Annuler</button>
          <button @click="confirmApproval" class="btn primary" :disabled="isProcessing">
            <span v-if="!isProcessing">Confirmer l'approbation</span>
            <div v-else class="btn-loading">
              <div class="spinner"></div>
              <span>Traitement...</span>
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de rejet -->
    <div v-if="showRejectionModal" class="modal-overlay" @click="closeRejectionModal">
      <div class="modal-content rejection-modal" @click.stop>
        <div class="modal-header">
          <h3>Rejeter la demande</h3>
          <button @click="closeRejectionModal" class="close-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="rejection-content">
            <div class="rejection-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
            </div>
            <h4>Rejeter la demande de compte ?</h4>
            <p v-if="managerToProcess">
              Vous êtes sur le point de rejeter la demande de <strong>{{ managerToProcess.name }}</strong>.
              Cette action supprimera définitivement le compte.
            </p>
            
            <div class="rejection-reason">
              <label for="rejectionReason" class="reason-label">
                Motif du rejet (optionnel)
              </label>
              <select 
                id="rejectionReason"
                v-model="rejectionReason"
                class="reason-select"
              >
                <option value="">Sélectionnez un motif</option>
                <option value="incomplete_info">Informations incomplètes</option>
                <option value="suspicious_activity">Activité suspecte</option>
                <option value="policy_violation">Violation des conditions</option>
                <option value="duplicate_account">Compte en double</option>
                <option value="other">Autre</option>
              </select>
              
              <textarea
                v-if="rejectionReason === 'other' || rejectionReason"
                v-model="rejectionMessage"
                placeholder="Détaillez le motif du rejet..."
                class="reason-textarea"
                rows="3"
              ></textarea>
            </div>
            
            <div class="rejection-options">
              <label class="option-item">
                <input 
                  type="checkbox" 
                  v-model="sendRejectionEmail"
                  class="option-checkbox"
                />
                <span class="option-label">Informer l'utilisateur par email</span>
              </label>
            </div>
          </div>
        </div>
        
        <div class="modal-actions">
          <button @click="closeRejectionModal" class="btn secondary">Annuler</button>
          <button @click="confirmRejection" class="btn danger" :disabled="isProcessing">
            <span v-if="!isProcessing">Confirmer le rejet</span>
            <div v-else class="btn-loading">
              <div class="spinner"></div>
              <span>Traitement...</span>
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de détails -->
    <div v-if="showDetailsModal" class="modal-overlay" @click="closeDetailsModal">
      <div class="modal-content details-modal" @click.stop>
        <div class="modal-header">
          <h3>Détails du candidat manager</h3>
          <button @click="closeDetailsModal" class="close-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        
        <div class="modal-body" v-if="selectedManagerDetails">
          <div class="details-content">
            <div class="manager-profile">
              <div class="profile-avatar">
                <img 
                  v-if="selectedManagerDetails.profile_picture" 
                  :src="selectedManagerDetails.profile_picture" 
                  :alt="selectedManagerDetails.name"
                />
                <div v-else class="avatar-placeholder large">
                  {{ selectedManagerDetails.name.charAt(0).toUpperCase() }}
                </div>
              </div>
              <div class="profile-info">
                <h4>{{ selectedManagerDetails.name }}</h4>
                <p>{{ selectedManagerDetails.email }}</p>
                <div class="profile-meta">
                  <div class="meta-item">
                    <span class="meta-label">Inscrit le:</span>
                    <span class="meta-value">{{ formatDate(selectedManagerDetails.created_at) }}</span>
                  </div>
                  <div v-if="selectedManagerDetails.phone" class="meta-item">
                    <span class="meta-label">Téléphone:</span>
                    <span class="meta-value">{{ selectedManagerDetails.phone }}</span>
                  </div>
                  <div v-if="selectedManagerDetails.address" class="meta-item">
                    <span class="meta-label">Adresse:</span>
                    <span class="meta-value">{{ selectedManagerDetails.address }}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="additional-details">
              <div class="detail-section">
                <h5>Motivation</h5>
                <p>{{ getRandomMotivation() }}</p>
              </div>
              
              <div class="detail-section">
                <h5>Expérience professionnelle</h5>
                <p>5 années d'expérience dans la gestion immobilière, spécialisé dans la location courte durée et la gestion de propriétés haut de gamme.</p>
              </div>
              
              <div class="detail-section">
                <h5>Références</h5>
                <p>Ancien responsable chez ImmoLux Paris, certifié en gestion locative, membre de la chambre des propriétaires.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="modal-actions">
          <button @click="closeDetailsModal" class="btn secondary">Fermer</button>
          <button @click="approveFromDetails" class="btn primary">
            Approuver ce candidat
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAdminStore } from '../../stores/admin'
import type { User } from '../../stores/auth'

const adminStore = useAdminStore()

// État local
const selectedManagers = ref<number[]>([])
const processingManagers = ref<number[]>([])
const processedToday = ref(7)

// Modals
const showApprovalModal = ref(false)
const showRejectionModal = ref(false)
const showDetailsModal = ref(false)
const managerToProcess = ref<User | null>(null)
const selectedManagerDetails = ref<User | null>(null)
const isProcessing = ref(false)

// Options des modals
const sendWelcomeEmail = ref(true)
const notifyOtherAdmins = ref(false)
const sendRejectionEmail = ref(true)
const rejectionReason = ref('')
const rejectionMessage = ref('')

// Computed
const pendingManagers = computed(() => adminStore.pendingManagers || [])

// Données simulées pour la démonstration
const motivations = [
  "Passionné par l'immobilier depuis toujours, je souhaite développer mon activité de location saisonnière",
  "Fort de 5 ans d'expérience en gestion immobilière, je cherche à diversifier mon portefeuille",
  "Propriétaire de plusieurs biens, je désire optimiser leur rentabilité via votre plateforme",
  "Ancien hôtelier reconverti, j'apporte mon expertise du service client",
  "Investisseur immobilier expérimenté cherchant de nouveaux canaux de distribution"
]

const experiences = [
  ['Gestion immobilière', 'Location saisonnière', 'Service client'],
  ['Investissement', 'Rénovation', 'Marketing digital'],
  ['Hôtellerie', 'Conciergerie', 'Tourisme'],
  ['Commerce', 'Négociation', 'Relation client'],
  ['Finance', 'Analyse de marché', 'Gestion de patrimoine']
]

// Méthodes
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
  
  if (diffInDays === 0) return 'aujourd\'hui'
  if (diffInDays === 1) return 'hier'
  if (diffInDays < 7) return `il y a ${diffInDays} jours`
  if (diffInDays < 30) return `il y a ${Math.floor(diffInDays / 7)} semaines`
  return `il y a ${Math.floor(diffInDays / 30)} mois`
}

const getUrgencyLevel = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
  
  if (diffInDays >= 7) return 'high'
  if (diffInDays >= 3) return 'medium'
  return 'low'
}

const getUrgencyText = (dateString: string) => {
  const level = getUrgencyLevel(dateString)
  const urgencyTexts = {
    high: 'Urgent',
    medium: 'À traiter',
    low: 'Récent'
  }
  return urgencyTexts[level]
}

const getRandomMotivation = () => {
  return motivations[Math.floor(Math.random() * motivations.length)]
}

const getRandomExperience = () => {
  return experiences[Math.floor(Math.random() * experiences.length)]
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  const placeholder = img.parentElement?.querySelector('.avatar-placeholder')
  if (placeholder) {
    img.style.display = 'none'
    ;(placeholder as HTMLElement).style.display = 'flex'
  }
}

const approveManager = (manager: User) => {
  managerToProcess.value = manager
  showApprovalModal.value = true
}

const rejectManager = (manager: User) => {
  managerToProcess.value = manager
  showRejectionModal.value = true
}

const viewManagerDetails = (manager: User) => {
  selectedManagerDetails.value = manager
  showDetailsModal.value = true
}

const closeApprovalModal = () => {
  showApprovalModal.value = false
  managerToProcess.value = null
  sendWelcomeEmail.value = true
  notifyOtherAdmins.value = false
}

const closeRejectionModal = () => {
  showRejectionModal.value = false
  managerToProcess.value = null
  rejectionReason.value = ''
  rejectionMessage.value = ''
  sendRejectionEmail.value = true
}

const closeDetailsModal = () => {
  showDetailsModal.value = false
  selectedManagerDetails.value = null
}

const confirmApproval = async () => {
  if (!managerToProcess.value) return
  
  isProcessing.value = true
  processingManagers.value.push(managerToProcess.value?.id ?? 0)
  
  try {
    const result = await adminStore.approveManager(managerToProcess.value?.id ?? 0)
    if (result.success) {
      processedToday.value++
      closeApprovalModal()
      // Retirer de la liste des sélectionnés
      const index = selectedManagers.value.indexOf(managerToProcess.value?.id ?? 0)
      if (index > -1) {
        selectedManagers.value.splice(index, 1)
      }
    }
  } catch (error) {
    console.error('Erreur lors de l\'approbation:', error)
  } finally {
    isProcessing.value = false
    const index = processingManagers.value.indexOf(managerToProcess.value?.id ?? 0)
    if (index > -1) {
      processingManagers.value.splice(index, 1)
    }
  }
}

const confirmRejection = async () => {
  if (!managerToProcess.value) return
  
  isProcessing.value = true
  processingManagers.value.push(managerToProcess.value?.id ?? 0)
  
  try {
    // Ici on appellerait l'API pour rejeter le manager
    // const result = await adminStore.rejectManager(managerToProcess.value?.id ?? 0, {
    //   reason: rejectionReason.value,
    //   message: rejectionMessage.value,
    //   sendEmail: sendRejectionEmail.value
    // })
    
    // Simulation
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    processedToday.value++
    closeRejectionModal()
    
    // Retirer de la liste des sélectionnés
    const index = selectedManagers.value.indexOf(managerToProcess.value?.id ?? 0)
    if (index > -1) {
      selectedManagers.value.splice(index, 1)
    }
    
    // Simulation: retirer de la liste
    const managerIndex = adminStore.pendingManagers.findIndex(m => m.id === (managerToProcess.value?.id ?? 0))
    if (managerIndex > -1) {
      adminStore.pendingManagers.splice(managerIndex, 1)
    }
  } catch (error) {
    console.error('Erreur lors du rejet:', error)
  } finally {
    isProcessing.value = false
    const index = processingManagers.value.indexOf(managerToProcess.value?.id ?? 0)
    if (index > -1) {
      processingManagers.value.splice(index, 1)
    }
  }
}

const approveFromDetails = () => {
  if (selectedManagerDetails.value) {
    closeDetailsModal()
    approveManager(selectedManagerDetails.value)
  }
}

const bulkApprove = async () => {
  if (confirm(`Approuver ${selectedManagers.value.length} demandes ?`)) {
    for (const managerId of selectedManagers.value) {
      try {
        await adminStore.approveManager(managerId)
        processedToday.value++
      } catch (error) {
        console.error('Erreur lors de l\'approbation groupée:', error)
      }
    }
    selectedManagers.value = []
  }
}

const bulkReject = async () => {
  if (confirm(`Rejeter ${selectedManagers.value.length} demandes ?`)) {
    for (const managerId of selectedManagers.value) {
      try {
        // await adminStore.rejectManager(managerId)
        console.log('Rejecting manager:', managerId)
        processedToday.value++
      } catch (error) {
        console.error('Erreur lors du rejet groupé:', error)
      }
    }
    selectedManagers.value = []
  }
}

const clearSelection = () => {
  selectedManagers.value = []
}

// Lifecycle
onMounted(async () => {
  try {
    await adminStore.fetchPendingManagers()
  } catch (error) {
    console.error('Erreur lors du chargement des managers en attente:', error)
  }
})
</script>

<style scoped>
@import url('../../assets/cyber-theme.css');

.pending-managers {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%);
  padding: 2rem;
}

.page-header {
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
}

.page-subtitle {
  font-size: 1.125rem;
  color: var(--text-secondary);
  margin: 0;
}

.header-stats {
  display: flex;
  gap: 2rem;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 2rem;
  font-weight: 900;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.bulk-actions-section {
  background: linear-gradient(145deg, #f0f9ff 0%, #e0f2fe 100%);
  border: 2px solid #0ea5e9;
  border-radius: var(--border-radius-large);
  padding: 1.5rem 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 8px 20px rgba(14, 165, 233, 0.15);
  animation: slide-down 0.3s ease-out;
}

@keyframes slide-down {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.bulk-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}

.bulk-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: var(--text-primary);
  font-weight: 600;
}

.bulk-info svg {
  width: 1.5rem;
  height: 1.5rem;
  stroke: var(--electric-blue);
}

.bulk-buttons {
  display: flex;
  gap: 1rem;
}

.bulk-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.75rem;
  border: none;
  border-radius: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 0.875rem;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.bulk-btn.approve {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.bulk-btn.approve:hover {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(16, 185, 129, 0.4);
}

.bulk-btn.reject {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  border: none;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.bulk-btn.reject:hover {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(239, 68, 68, 0.4);
}

.bulk-btn.cancel {
  background: linear-gradient(145deg, #f8fafc 0%, #e2e8f0 100%);
  color: #64748b;
  border: 1px solid #cbd5e1;
  box-shadow: 0 2px 6px rgba(100, 116, 139, 0.2);
}

.bulk-btn.cancel:hover {
  background: linear-gradient(145deg, #e2e8f0 0%, #cbd5e1 100%);
  color: #475569;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(100, 116, 139, 0.3);
}

.bulk-btn svg {
  width: 1rem;
  height: 1rem;
  stroke: currentColor;
}

.managers-section {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: var(--border-radius-large);
  padding: 2rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05);
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
  color: var(--acid-green);
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
  font-size: 1.125rem;
}

.managers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 2rem;
}

.manager-card {
  background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid #e2e8f0;
  border-radius: var(--border-radius-large);
  padding: 2rem;
  transition: var(--transition-smooth);
  position: relative;
  animation: fade-in-up 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(30px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

@keyframes fade-in-up {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.manager-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.15), 0 8px 12px rgba(0, 0, 0, 0.1);
  border-color: #4f46e5;
}

.manager-card.selected {
  border-color: #4f46e5;
  background: linear-gradient(145deg, #f0f9ff 0%, #e0f2fe 100%);
  box-shadow: 0 8px 25px rgba(79, 70, 229, 0.3), 0 0 0 2px rgba(79, 70, 229, 0.2);
}

.card-checkbox {
  position: absolute;
  top: 1rem;
  right: 1rem;
}

.manager-checkbox {
  width: 1.25rem;
  height: 1.25rem;
  accent-color: var(--electric-blue);
}

.manager-info {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.manager-avatar {
  position: relative;
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.manager-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1.5rem;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
}

.avatar-placeholder.large {
  width: 5rem;
  height: 5rem;
  font-size: 2rem;
}

.manager-name {
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
}

.manager-email {
  color: var(--text-secondary);
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.manager-meta {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: var(--text-muted);
}

.meta-item svg {
  width: 1rem;
  height: 1rem;
  stroke: currentColor;
  flex-shrink: 0;
}

.manager-additional {
  margin-bottom: 2rem;
}

.address-info,
.motivation-info,
.experience-info {
  margin-bottom: 1.5rem;
}

.manager-additional h4 {
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.manager-additional p {
  color: var(--text-secondary);
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 0;
}

.experience-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.experience-tag {
  padding: 0.375rem 0.75rem;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border: 1px solid #0ea5e9;
  border-radius: 1rem;
  font-size: 0.75rem;
  color: #0369a1;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(14, 165, 233, 0.1);
}

.urgency-indicator {
  position: absolute;
  top: 1rem;
  left: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.75rem;
  border-radius: var(--border-radius-small);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.urgency-indicator.high {
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  color: #dc2626;
  border: 1px solid #f87171;
  box-shadow: 0 2px 8px rgba(220, 38, 38, 0.2);
}

.urgency-indicator.medium {
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
  color: #d97706;
  border: 1px solid #fbbf24;
  box-shadow: 0 2px 8px rgba(217, 119, 6, 0.2);
}

.urgency-indicator.low {
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  color: #059669;
  border: 1px solid #4ade80;
  box-shadow: 0 2px 8px rgba(5, 150, 105, 0.2);
}

.urgency-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  animation: urgency-pulse 2s ease-in-out infinite;
}

.urgency-indicator.high .urgency-dot {
  background: var(--laser-red);
}

.urgency-indicator.medium .urgency-dot {
  background: var(--solar-orange);
}

.urgency-indicator.low .urgency-dot {
  background: var(--acid-green);
}

@keyframes urgency-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.manager-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.25rem;
  border: none;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  flex: 1;
  justify-content: center;
  min-width: 100px;
  position: relative;
  overflow: hidden;
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.action-btn.approve {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.action-btn.approve:hover:not(:disabled) {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(16, 185, 129, 0.4);
}

.action-btn.details {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
  border: none;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
}

.action-btn.details:hover {
  background: linear-gradient(135deg, #4338ca 0%, #6d28d9 100%);
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(79, 70, 229, 0.4);
}

.action-btn.reject {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  border: none;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.action-btn.reject:hover:not(:disabled) {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(239, 68, 68, 0.4);
}

.action-btn svg {
  width: 1rem;
  height: 1rem;
  stroke: currentColor;
}

/* Modals */
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
  background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid #e2e8f0;
  border-radius: var(--border-radius-large);
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  animation: slide-up 0.3s ease-out;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
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
  font-size: 1.5rem;
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
}

.approval-content,
.rejection-content {
  text-align: center;
}

.approval-icon,
.rejection-icon {
  width: 4rem;
  height: 4rem;
  margin: 0 auto 1.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.approval-icon {
  background: rgba(16, 185, 129, 0.1);
  color: var(--acid-green);
}

.rejection-icon {
  background: rgba(255, 0, 64, 0.1);
  color: var(--laser-red);
}

.approval-icon svg,
.rejection-icon svg {
  width: 2rem;
  height: 2rem;
  stroke: currentColor;
}

.approval-content h4,
.rejection-content h4 {
  color: var(--text-primary);
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

.approval-content p,
.rejection-content p {
  color: var(--text-secondary);
  margin-bottom: 2rem;
  line-height: 1.6;
}

.approval-options,
.rejection-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: var(--glass-bg-light);
  border-radius: var(--border-radius-medium);
  cursor: pointer;
  transition: var(--transition-smooth);
}

.option-item:hover {
  background: var(--glass-bg-medium);
}

.option-checkbox {
  width: 1.25rem;
  height: 1.25rem;
  accent-color: var(--electric-blue);
}

.option-label {
  color: var(--text-primary);
  font-weight: 500;
}

.rejection-reason {
  text-align: left;
  margin-bottom: 2rem;
}

.reason-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.875rem;
}

.reason-select {
  width: 100%;
  padding: 0.75rem;
  background: var(--glass-bg-light);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-medium);
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.reason-textarea {
  width: 100%;
  padding: 0.75rem;
  background: var(--glass-bg-light);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-medium);
  color: var(--text-primary);
  resize: vertical;
  font-family: inherit;
}

.reason-textarea::placeholder {
  color: var(--text-muted);
}

.details-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.manager-profile {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  background: var(--glass-bg-light);
  border-radius: var(--border-radius-medium);
}

.profile-avatar {
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.profile-info h4 {
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  font-size: 1.25rem;
}

.profile-info p {
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.profile-meta {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.meta-label {
  font-weight: 600;
  color: var(--text-muted);
  font-size: 0.875rem;
}

.meta-value {
  color: var(--text-primary);
  font-size: 0.875rem;
}

.additional-details {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.detail-section {
  padding: 1.5rem;
  background: var(--glass-bg-light);
  border-radius: var(--border-radius-medium);
}

.detail-section h5 {
  color: var(--text-primary);
  margin-bottom: 1rem;
  font-size: 1rem;
  font-weight: 600;
}

.detail-section p {
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
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
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn.secondary {
  background: linear-gradient(145deg, #f8fafc 0%, #e2e8f0 100%);
  border: 1px solid #cbd5e1;
  color: #64748b;
  box-shadow: 0 2px 6px rgba(100, 116, 139, 0.2);
}

.btn.secondary:hover {
  background: linear-gradient(145deg, #e2e8f0 0%, #cbd5e1 100%);
  color: #475569;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(100, 116, 139, 0.3);
}

.btn.primary {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
}

.btn.primary:hover:not(:disabled) {
  transform: translateY(-2px);
  background: linear-gradient(135deg, #4338ca 0%, #6d28d9 100%);
  box-shadow: 0 8px 20px rgba(79, 70, 229, 0.4);
}

.btn.danger {
  background: var(--danger-gradient, linear-gradient(135deg, #ef4444, #dc2626));
  color: white;
}

.btn.danger:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 0 20px rgba(239, 68, 68, 0.5);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.btn-loading {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
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
    align-items: flex-start;
  }
  
  .header-stats {
    width: 100%;
    justify-content: center;
  }
  
  .bulk-content {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .managers-grid {
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  }
}

@media (max-width: 768px) {
  .pending-managers {
    padding: 1rem;
  }
  
  .page-header,
  .bulk-actions-section,
  .managers-section {
    padding: 1.5rem;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .managers-grid {
    grid-template-columns: 1fr;
  }
  
  .manager-info {
    flex-direction: column;
    text-align: center;
  }
  
  .manager-actions {
    flex-direction: column;
  }
  
  .bulk-buttons {
    flex-direction: column;
    width: 100%;
  }
  
  .modal-content {
    width: 95%;
    margin: 1rem;
  }
  
  .modal-actions {
    flex-direction: column;
  }
  
  .manager-profile {
    flex-direction: column;
    text-align: center;
  }
}
</style>
