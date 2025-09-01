<template>
  <div class="users-management-view">
    <div class="container">
      <!-- Header -->
      <div class="page-header">
        <div class="header-content">
          <h1>Gestion des Utilisateurs</h1>
          <p>Gérez tous les utilisateurs de la plateforme</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-secondary" @click="refreshUsers" :disabled="isLoading">
            <span class="icon">🔄</span>
            {{ isLoading ? 'Chargement...' : 'Actualiser' }}
          </button>
          <button class="btn btn-primary" @click="showCreateUser = true">
            <span class="icon">👤</span>
            Créer un utilisateur
          </button>
        </div>
      </div>

      <!-- Statistiques -->
      <div class="stats-cards">
        <div class="stat-card">
          <div class="stat-icon client">👤</div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.clients }}</div>
            <div class="stat-label">Clients</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon manager">🏢</div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.managers }}</div>
            <div class="stat-label">Managers</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon admin">👑</div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.admins }}</div>
            <div class="stat-label">Administrateurs</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon pending">⏳</div>
          <div class="stat-content">
            <div class="stat-value">{{ stats.pending }}</div>
            <div class="stat-label">En attente</div>
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
            placeholder="Rechercher par nom, email..."
            class="search-input"
          >
        </div>
        <div class="filters">
          <select v-model="selectedRole" class="filter-select">
            <option value="">Tous les rôles</option>
            <option value="client">Clients</option>
            <option value="manager">Managers</option>
            <option value="admin">Administrateurs</option>
          </select>
          <select v-model="selectedStatus" class="filter-select">
            <option value="">Tous les statuts</option>
            <option value="active">Actif</option>
            <option value="pending">En attente</option>
            <option value="suspended">Suspendu</option>
          </select>
          <button class="btn btn-secondary" @click="resetFilters">
            <span class="icon">🗑️</span>
            Réinitialiser
          </button>
        </div>
      </div>

      <!-- Actions en lot -->
      <div v-if="selectedUsers.length > 0" class="bulk-actions">
        <div class="selection-info">
          <span>{{ selectedUsers.length }} utilisateur(s) sélectionné(s)</span>
        </div>
        <div class="bulk-buttons">
          <button 
            class="btn btn-warning"
            @click="bulkAction('suspend')"
            :disabled="isLoading"
          >
            <span class="icon">⏸️</span>
            Suspendre
          </button>
          <button 
            class="btn btn-success"
            @click="bulkAction('activate')"
            :disabled="isLoading"
          >
            <span class="icon">✅</span>
            Activer
          </button>
          <button 
            class="btn btn-danger"
            @click="bulkAction('delete')"
            :disabled="isLoading"
          >
            <span class="icon">🗑️</span>
            Supprimer
          </button>
        </div>
      </div>

      <!-- Table des utilisateurs -->
      <div class="users-table-container">
        <table class="users-table">
          <thead>
            <tr>
              <th>
                <input 
                  type="checkbox"
                  :checked="allSelected"
                  @change="toggleSelectAll"
                  class="checkbox"
                >
              </th>
              <th @click="sortBy('name')" class="sortable">
                Nom
                <span class="sort-icon">{{ getSortIcon('name') }}</span>
              </th>
              <th @click="sortBy('email')" class="sortable">
                Email
                <span class="sort-icon">{{ getSortIcon('email') }}</span>
              </th>
              <th>Rôle</th>
              <th>Statut</th>
              <th @click="sortBy('created_at')" class="sortable">
                Date d'inscription
                <span class="sort-icon">{{ getSortIcon('created_at') }}</span>
              </th>
              <th>Dernière connexion</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="user in paginatedUsers" 
              :key="user.id"
              :class="{ selected: selectedUsers.includes(user.id) }"
            >
              <td>
                <input 
                  type="checkbox"
                  :checked="selectedUsers.includes(user.id)"
                  @change="toggleSelectUser(user.id)"
                  class="checkbox"
                >
              </td>
              <td>
                <div class="user-info">
                  <div class="user-avatar">
                    <img 
                      v-if="user.profile_picture" 
                      :src="user.profile_picture" 
                      :alt="user.name"
                      class="avatar-img"
                    >
                    <div v-else class="avatar-placeholder">
                      {{ getInitials(user.name) }}
                    </div>
                  </div>
                  <div class="user-details">
                    <div class="user-name">{{ user.name }}</div>
                    <div class="user-phone">{{ user.phone || 'N/A' }}</div>
                  </div>
                </div>
              </td>
              <td>
                <a :href="`mailto:${user.email}`" class="email-link">
                  {{ user.email }}
                </a>
              </td>
              <td>
                <span :class="['role-badge', user.role]">
                  <span class="icon">{{ getRoleIcon(user.role) }}</span>
                  {{ getRoleLabel(user.role) }}
                </span>
              </td>
              <td>
                <span :class="['status-badge', user.status]">
                  <span class="icon">{{ getStatusIcon(user.status) }}</span>
                  {{ getStatusLabel(user.status) }}
                </span>
              </td>
              <td>{{ formatDate(user.created_at) }}</td>
              <td>{{ formatDate(getLastLogin(user)) }}</td>
              <td>
                <div class="action-buttons">
                  <button 
                    class="action-btn view"
                    @click="viewUser(user)"
                    title="Voir le profil"
                  >
                    <span class="icon">👁️</span>
                  </button>
                  <button 
                    class="action-btn edit"
                    @click="editUser(user)"
                    title="Modifier"
                  >
                    <span class="icon">✏️</span>
                  </button>
                  <button 
                    v-if="user.role === 'manager' && user.status === 'pending'"
                    class="action-btn approve"
                    @click="approveManager(user)"
                    title="Approuver le manager"
                  >
                    <span class="icon">✅</span>
                  </button>
                  <button 
                    v-if="user.status === 'active'"
                    class="action-btn suspend"
                    @click="suspendUser(user)"
                    title="Suspendre"
                  >
                    <span class="icon">⏸️</span>
                  </button>
                  <button 
                    v-if="user.status === 'suspended'"
                    class="action-btn activate"
                    @click="activateUser(user)"
                    title="Activer"
                  >
                    <span class="icon">✅</span>
                  </button>
                  <button 
                    class="action-btn delete"
                    @click="deleteUser(user)"
                    title="Supprimer"
                  >
                    <span class="icon">🗑️</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Message si aucun utilisateur -->
        <div v-if="users.length === 0 && !isLoading" class="no-users">
          <span class="icon">👥</span>
          <h3>Aucun utilisateur trouvé</h3>
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

    <!-- Modal Créer Utilisateur -->
    <div v-if="showCreateUser" class="modal-overlay" @click="showCreateUser = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Créer un nouvel utilisateur</h3>
          <button class="modal-close" @click="showCreateUser = false">
            <span class="icon">❌</span>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="createUser" class="create-user-form">
            <div class="form-grid">
              <div class="form-group">
                <label>Nom complet *</label>
                <input 
                  v-model="newUser.name"
                  type="text"
                  class="form-control"
                  placeholder="Jean Dupont"
                  required
                >
              </div>
              <div class="form-group">
                <label>Email *</label>
                <input 
                  v-model="newUser.email"
                  type="email"
                  class="form-control"
                  placeholder="jean@example.com"
                  required
                >
              </div>
              <div class="form-group">
                <label>Téléphone</label>
                <input 
                  v-model="newUser.phone"
                  type="tel"
                  class="form-control"
                  placeholder="+33 1 23 45 67 89"
                >
              </div>
              <div class="form-group">
                <label>Rôle *</label>
                <select v-model="newUser.role" class="form-control" required>
                  <option value="">Sélectionner un rôle</option>
                  <option value="client">Client</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Administrateur</option>
                </select>
              </div>
              <div class="form-group full-width">
                <label>Adresse</label>
                <textarea 
                  v-model="newUser.address"
                  class="form-control"
                  rows="3"
                  placeholder="Adresse complète..."
                ></textarea>
              </div>
              <div class="form-group">
                <label>Mot de passe *</label>
                <input 
                  v-model="newUser.password"
                  type="password"
                  class="form-control"
                  placeholder="Mot de passe sécurisé"
                  required
                >
              </div>
              <div class="form-group">
                <label>Confirmer le mot de passe *</label>
                <input 
                  v-model="newUser.password_confirmation"
                  type="password"
                  class="form-control"
                  placeholder="Confirmer le mot de passe"
                  required
                >
              </div>
            </div>
            <div class="modal-actions">
              <button type="button" class="btn btn-secondary" @click="showCreateUser = false">
                Annuler
              </button>
              <button type="submit" class="btn btn-primary" :disabled="isLoading">
                <span class="icon">👤</span>
                {{ isLoading ? 'Création...' : 'Créer l\'utilisateur' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal Détails Utilisateur -->
    <div v-if="showUserDetails" class="modal-overlay" @click="showUserDetails = false">
      <div class="modal-content large" @click.stop>
        <div class="modal-header">
          <h3>Détails de l'utilisateur</h3>
          <button class="modal-close" @click="showUserDetails = false">
            <span class="icon">❌</span>
          </button>
        </div>
        <div class="modal-body" v-if="selectedUserDetails">
          <div class="user-details-grid">
            <div class="detail-section">
              <h4>Informations personnelles</h4>
              <div class="detail-item">
                <label>Nom complet:</label>
                <span>{{ selectedUserDetails.name }}</span>
              </div>
              <div class="detail-item">
                <label>Email:</label>
                <span>{{ selectedUserDetails.email }}</span>
              </div>
              <div class="detail-item">
                <label>Téléphone:</label>
                <span>{{ selectedUserDetails.phone || 'Non renseigné' }}</span>
              </div>
              <div class="detail-item">
                <label>Adresse:</label>
                <span>{{ selectedUserDetails.address || 'Non renseignée' }}</span>
              </div>
            </div>
            
            <div class="detail-section">
              <h4>Compte</h4>
              <div class="detail-item">
                <label>Rôle:</label>
                <span :class="['role-badge', selectedUserDetails.role]">
                  <span class="icon">{{ getRoleIcon(selectedUserDetails.role) }}</span>
                  {{ getRoleLabel(selectedUserDetails.role) }}
                </span>
              </div>
              <div class="detail-item">
                <label>Statut:</label>
                <span :class="['status-badge', selectedUserDetails.status]">
                  <span class="icon">{{ getStatusIcon(selectedUserDetails.status) }}</span>
                  {{ getStatusLabel(selectedUserDetails.status) }}
                </span>
              </div>
              <div class="detail-item">
                <label>Date d'inscription:</label>
                <span>{{ formatDate(selectedUserDetails.created_at) }}</span>
              </div>
              <div class="detail-item">
                <label>Dernière connexion:</label>
                <span>{{ formatDate(selectedUserDetails.last_login_at || null) }}</span>
              </div>
            </div>
          </div>
          
          <div class="user-actions">
            <button 
              v-if="selectedUserDetails.role === 'manager' && selectedUserDetails.status === 'pending'"
              class="btn btn-success"
              @click="approveManager(selectedUserDetails)"
            >
              <span class="icon">✅</span>
              Approuver le manager
            </button>
            <button 
              v-if="selectedUserDetails.status === 'active'"
              class="btn btn-warning"
              @click="suspendUser(selectedUserDetails)"
            >
              <span class="icon">⏸️</span>
              Suspendre
            </button>
            <button 
              v-if="selectedUserDetails.status === 'suspended'"
              class="btn btn-success"
              @click="activateUser(selectedUserDetails)"
            >
              <span class="icon">✅</span>
              Activer
            </button>
            <button 
              class="btn btn-danger"
              @click="deleteUser(selectedUserDetails)"
            >
              <span class="icon">🗑️</span>
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Confirmation -->
    <div v-if="showConfirmation" class="modal-overlay" @click="showConfirmation = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ confirmationTitle }}</h3>
          <button class="modal-close" @click="showConfirmation = false">
            <span class="icon">❌</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="confirmation-content">
            <span class="confirmation-icon">{{ confirmationIcon }}</span>
            <p>{{ confirmationMessage }}</p>
          </div>
          <div class="modal-actions">
            <button class="btn btn-secondary" @click="showConfirmation = false">
              Annuler
            </button>
            <button 
              class="btn btn-danger"
              @click="executeConfirmedAction"
              :disabled="isLoading"
            >
              {{ isLoading ? 'En cours...' : 'Confirmer' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading overlay -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="spinner"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useAdminStore } from '../../stores/admin'
import type { User } from '../../stores/auth'

// Type étendu pour les utilisateurs avec informations admin
interface AdminUser extends User {
  last_login_at?: string | null
}

const adminStore = useAdminStore()

// État réactif
const searchQuery = ref('')
const selectedRole = ref('')
const selectedStatus = ref('')
const selectedUsers = ref<number[]>([])
const currentPage = ref(1)
const sortField = ref('created_at')
const sortDirection = ref('desc')

// Modals
const showCreateUser = ref(false)
const showUserDetails = ref(false)
const showConfirmation = ref(false)
const selectedUserDetails = ref<AdminUser | null>(null)

// Confirmation state
const confirmationTitle = ref('')
const confirmationMessage = ref('')
const confirmationIcon = ref('')
const pendingAction = ref<(() => Promise<void>) | null>(null)

// Interface pour le formulaire de création d'utilisateur
interface NewUserForm {
  name: string
  email: string
  phone: string
  role: 'client' | 'manager' | 'admin' | ''
  address: string
  password: string
  password_confirmation: string
}

// Formulaire nouvel utilisateur
const newUser = reactive<NewUserForm>({
  name: '',
  email: '',
  phone: '',
  role: '',
  address: '',
  password: '',
  password_confirmation: ''
})

// Utiliser les données du store au lieu des données statiques
const users = computed(() => adminStore.users)

// Computed properties
const stats = computed(() => {
  return {
    clients: users.value.filter(u => u.role === 'client').length,
    managers: users.value.filter(u => u.role === 'manager').length,
    admins: users.value.filter(u => u.role === 'admin').length,
    pending: users.value.filter(u => u.status === 'pending').length
  }
})

// Utiliser le loading du store
const isLoading = computed(() => adminStore.isLoading)

// Le filtrage et le tri sont maintenant gérés côté serveur

// Utiliser directement les utilisateurs du store (la pagination est gérée côté serveur)
const paginatedUsers = computed(() => users.value)

const totalPages = computed(() => adminStore.pagination.last_page)

const allSelected = computed(() => {
  return paginatedUsers.value.length > 0 && 
         paginatedUsers.value.every(user => selectedUsers.value.includes(user.id))
})

// Méthodes
const refreshUsers = async () => {
  try {
    await loadUsers()
    console.log('Utilisateurs actualisés')
  } catch (error) {
    console.error('Erreur lors de l\'actualisation:', error)
  }
}

const loadUsers = async () => {
  const filters = {
    role: selectedRole.value || undefined,
    status: selectedStatus.value || undefined,
    search: searchQuery.value || undefined
  }
  
  const result = await adminStore.fetchUsers(currentPage.value, filters)
  if (!result.success) {
    console.error('Erreur lors du chargement des utilisateurs:', result.error)
  }
}

const resetFilters = async () => {
  searchQuery.value = ''
  selectedRole.value = ''
  selectedStatus.value = ''
  currentPage.value = 1
  await loadUsers()
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

const toggleSelectAll = () => {
  if (allSelected.value) {
    selectedUsers.value = selectedUsers.value.filter(id => 
      !paginatedUsers.value.some(user => user.id === id)
    )
  } else {
    const pageUserIds = paginatedUsers.value.map(user => user.id)
    selectedUsers.value = [...new Set([...selectedUsers.value, ...pageUserIds])]
  }
}

const toggleSelectUser = (userId: number) => {
  const index = selectedUsers.value.indexOf(userId)
  if (index > -1) {
    selectedUsers.value.splice(index, 1)
  } else {
    selectedUsers.value.push(userId)
  }
}

const getInitials = (name: string) => {
  return name.split(' ').map(word => word[0]).join('').toUpperCase()
}

const getRoleIcon = (role: string) => {
  switch (role) {
    case 'admin': return '👑'
    case 'manager': return '🏢'
    case 'client': return '👤'
    default: return '❓'
  }
}

const getRoleLabel = (role: string) => {
  switch (role) {
    case 'admin': return 'Administrateur'
    case 'manager': return 'Manager'
    case 'client': return 'Client'
    default: return 'Inconnu'
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'active': return '✅'
    case 'pending': return '⏳'
    case 'suspended': return '⏸️'
    default: return '❓'
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'active': return 'Actif'
    case 'pending': return 'En attente'
    case 'suspended': return 'Suspendu'
    default: return 'Inconnu'
  }
}

const formatDate = (dateString: string | null) => {
  if (!dateString) return 'Jamais'
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getLastLogin = (user: User): string | null => {
  return (user as AdminUser).last_login_at || null
}

const viewUser = (user: AdminUser) => {
  selectedUserDetails.value = user
  showUserDetails.value = true
}

const editUser = (user: AdminUser) => {
  // TODO: Implémenter l'édition
  console.log('Éditer utilisateur:', user)
}

const createUser = async () => {
  try {
    // Validation
    if (newUser.password !== newUser.password_confirmation) {
      alert('Les mots de passe ne correspondent pas')
      return
    }

    if (newUser.role === '') {
      alert('Veuillez sélectionner un rôle')
      return
    }

    // Créer l'objet avec le bon typage
    const userData = {
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role as 'client' | 'manager' | 'admin',
      password: newUser.password,
      password_confirmation: newUser.password_confirmation
    }

    const result = await adminStore.createUser(userData)
    
    if (result.success) {
      // Réinitialiser le formulaire
      Object.assign(newUser, {
        name: '',
        email: '',
        phone: '',
        role: '',
        address: '',
        password: '',
        password_confirmation: ''
      })
      
      showCreateUser.value = false
      console.log('Utilisateur créé avec succès')
      await loadUsers() // Recharger la liste
    } else {
      alert(result.error || 'Erreur lors de la création de l\'utilisateur')
    }
    
  } catch (error) {
    console.error('Erreur lors de la création:', error)
    alert('Erreur lors de la création de l\'utilisateur')
  }
}

const approveManager = (user: AdminUser) => {
  confirmAction(
    'Approuver le manager',
    `Êtes-vous sûr de vouloir approuver ${user.name} comme manager ?`,
    '✅',
    async () => {
      const result = await adminStore.approveManager(user.id)
      if (result.success) {
        console.log('Manager approuvé:', user.name)
        await loadUsers()
      } else {
        alert(result.error || 'Erreur lors de l\'approbation')
      }
    }
  )
}

const suspendUser = (user: AdminUser) => {
  confirmAction(
    'Suspendre l\'utilisateur',
    `Êtes-vous sûr de vouloir suspendre ${user.name} ?`,
    '⏸️',
    async () => {
      const result = await adminStore.suspendUser(user.id)
      if (result.success) {
        console.log('Utilisateur suspendu:', user.name)
        await loadUsers()
      } else {
        alert(result.error || 'Erreur lors de la suspension')
      }
    }
  )
}

const activateUser = (user: AdminUser) => {
  confirmAction(
    'Activer l\'utilisateur',
    `Êtes-vous sûr de vouloir activer ${user.name} ?`,
    '✅',
    async () => {
      const result = await adminStore.activateUser(user.id)
      if (result.success) {
        console.log('Utilisateur activé:', user.name)
        await loadUsers()
      } else {
        alert(result.error || 'Erreur lors de l\'activation')
      }
    }
  )
}

const deleteUser = (user: AdminUser) => {
  confirmAction(
    'Supprimer l\'utilisateur',
    `Êtes-vous sûr de vouloir supprimer définitivement ${user.name} ? Cette action est irréversible.`,
    '🗑️',
    async () => {
      const result = await adminStore.deleteUser(user.id)
      if (result.success) {
        console.log('Utilisateur supprimé:', user.name)
        await loadUsers()
      } else {
        alert(result.error || 'Erreur lors de la suppression')
      }
    }
  )
}

const bulkAction = (action: string) => {
  const selectedUsersData = users.value.filter(user => selectedUsers.value.includes(user.id))
  const actionLabels = {
    suspend: 'suspendre',
    activate: 'activer',
    delete: 'supprimer'
  }
  
  confirmAction(
    `${actionLabels[action as keyof typeof actionLabels]} les utilisateurs sélectionnés`,
    `Êtes-vous sûr de vouloir ${actionLabels[action as keyof typeof actionLabels]} ${selectedUsersData.length} utilisateur(s) ?`,
    action === 'delete' ? '🗑️' : action === 'suspend' ? '⏸️' : '✅',
    async () => {
      const result = await adminStore.bulkAction(action, selectedUsers.value)
      if (result.success) {
        selectedUsers.value = []
        console.log(`Action ${action} exécutée sur ${selectedUsersData.length} utilisateur(s)`)
        await loadUsers()
      } else {
        alert(result.error || 'Erreur lors de l\'action en lot')
      }
    }
  )
}

const confirmAction = (title: string, message: string, icon: string, action: () => Promise<void>) => {
  confirmationTitle.value = title
  confirmationMessage.value = message
  confirmationIcon.value = icon
  pendingAction.value = action
  showConfirmation.value = true
}

const executeConfirmedAction = async () => {
  try {
    if (pendingAction.value) {
      await pendingAction.value()
    }
    
    showConfirmation.value = false
    showUserDetails.value = false
    
  } catch (error) {
    console.error('Erreur lors de l\'exécution de l\'action:', error)
  }
}

// Watchers pour recharger automatiquement lors des changements de filtres
watch([searchQuery, selectedRole, selectedStatus], async () => {
  currentPage.value = 1
  await loadUsers()
})

watch(currentPage, async () => {
  await loadUsers()
})

// Lifecycle
onMounted(async () => {
  // Charger les utilisateurs au démarrage
  await loadUsers()
})
</script>

<style scoped>
.users-management-view {
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

/* Stats cards */
.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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

.stat-icon.client {
  background: rgba(59, 130, 246, 0.1);
  color: var(--electric-blue);
}

.stat-icon.manager {
  background: rgba(139, 69, 19, 0.1);
  color: #8B4513;
}

.stat-icon.admin {
  background: rgba(168, 85, 247, 0.1);
  color: #A855F7;
}

.stat-icon.pending {
  background: rgba(251, 191, 36, 0.1);
  color: var(--warning-color);
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

.filter-select:focus {
  outline: none;
  border-color: var(--electric-blue);
}

/* Actions en lot */
.bulk-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding: 1rem 1.5rem;
  background: var(--electric-blue);
  color: white;
  border-radius: var(--border-radius-medium);
  animation: slideDown 0.3s ease;
}

.selection-info {
  font-weight: 600;
}

.bulk-buttons {
  display: flex;
  gap: 1rem;
}

/* Table */
.users-table-container {
  background: var(--card-bg);
  border-radius: var(--border-radius-large);
  border: 1px solid var(--card-border);
  box-shadow: var(--shadow-card);
  overflow: hidden;
  margin-bottom: 2rem;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table th,
.users-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid var(--card-border);
}

.users-table th {
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

.users-table tr:hover {
  background: var(--bg-gray-50);
}

.users-table tr.selected {
  background: rgba(59, 130, 246, 0.1);
}

/* User info */
.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid var(--card-border);
}

.avatar-img {
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

.user-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.user-name {
  font-weight: 600;
  color: var(--text-primary);
}

.user-phone {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.email-link {
  color: var(--electric-blue);
  text-decoration: none;
}

.email-link:hover {
  text-decoration: underline;
}

/* Badges */
.role-badge,
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.75rem;
  border-radius: var(--border-radius-small);
  font-size: 0.8rem;
  font-weight: 600;
}

.role-badge.client {
  background: rgba(59, 130, 246, 0.1);
  color: var(--electric-blue);
}

.role-badge.manager {
  background: rgba(139, 69, 19, 0.1);
  color: #8B4513;
}

.role-badge.admin {
  background: rgba(168, 85, 247, 0.1);
  color: #A855F7;
}

.status-badge.active {
  background: rgba(34, 197, 94, 0.1);
  color: var(--success-color);
}

.status-badge.pending {
  background: rgba(251, 191, 36, 0.1);
  color: var(--warning-color);
}

.status-badge.suspended {
  background: rgba(239, 68, 68, 0.1);
  color: var(--danger-color);
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

.action-btn.approve {
  background: rgba(34, 197, 94, 0.1);
  color: var(--success-color);
}

.action-btn.suspend {
  background: rgba(251, 191, 36, 0.1);
  color: var(--warning-color);
}

.action-btn.activate {
  background: rgba(34, 197, 94, 0.1);
  color: var(--success-color);
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

/* No users */
.no-users {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--text-secondary);
}

.no-users .icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  display: block;
  opacity: 0.5;
}

.no-users h3 {
  margin: 0 0 0.5rem 0;
  color: var(--text-primary);
}

.no-users p {
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

.btn-success {
  background: var(--gradient-success);
  color: white;
}

.btn-warning {
  background: var(--gradient-warning);
  color: white;
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

/* Checkbox */
.checkbox {
  width: 1.2rem;
  height: 1.2rem;
  accent-color: var(--electric-blue);
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

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

/* Formulaires */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
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

/* Détails utilisateur */
.user-details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
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

.user-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  padding-top: 1rem;
  border-top: 1px solid var(--card-border);
}

/* Confirmation */
.confirmation-content {
  text-align: center;
  margin-bottom: 2rem;
}

.confirmation-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  display: block;
}

.confirmation-content p {
  color: var(--text-primary);
  font-size: 1.1rem;
  line-height: 1.5;
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

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 1024px) {
  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
  }

  .user-details-grid {
    grid-template-columns: 1fr;
  }

  .users-table {
    font-size: 0.9rem;
  }

  .users-table th,
  .users-table td {
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

  .stats-cards {
    grid-template-columns: 1fr;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .bulk-actions {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .bulk-buttons {
    justify-content: center;
  }

  .user-actions {
    flex-direction: column;
  }

  .container {
    padding: 0 0.5rem;
  }

  /* Table responsive */
  .users-table-container {
    overflow-x: auto;
  }

  .users-table {
    min-width: 800px;
  }
}
</style>
