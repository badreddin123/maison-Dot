<template>
  <div class="register-cyber">
    <!-- Arrière-plan animé cyber -->
    <div class="cyber-bg">
      <div class="holographic-grid">
        <div v-for="i in 20" :key="i" class="grid-line" :style="getGridStyle(i)"></div>
      </div>
      
      <!-- Formes néon flottantes -->
      <div class="neon-shapes">
        <div class="neon-shape shape-1"></div>
        <div class="neon-shape shape-2"></div>
        <div class="neon-shape shape-3"></div>
        <div class="neon-shape shape-4"></div>
      </div>
      
      <!-- Particules cyber -->
      <div class="cyber-particles">
        <div v-for="i in 25" :key="i" class="cyber-particle" :style="getParticleStyle()"></div>
      </div>
    </div>

    <div class="register-container">
      <!-- Panneau gauche - Branding futuriste -->
      <div class="cyber-branding-panel">
        <div class="branding-content">
          <router-link to="/" class="cyber-logo-link">
            <div class="cyber-logo-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
              </svg>
            </div>
            <span class="cyber-logo-text">Karya</span>
          </router-link>
          
          <div class="cyber-hero">
            <h1 class="cyber-title">
              Rejoignez l'élite du design architectural
            </h1>
            <p class="cyber-subtitle">
              Créez un compte et accédez aux outils les plus avancés pour concevoir l'avenir de l'architecture.
            </p>
          </div>
          
          <!-- Avantages premium -->
          <div class="premium-features">
            <div class="feature-item">
              <div class="feature-icon">🚀</div>
              <span>IA Générative Avancée</span>
            </div>
            <div class="feature-item">
              <div class="feature-icon">⚡</div>
              <span>Rendu Temps Réel</span>
            </div>
            <div class="feature-item">
              <div class="feature-icon">🔮</div>
              <span>Réalité Virtuelle</span>
            </div>
            <div class="feature-item">
              <div class="feature-icon">🌐</div>
              <span>Collaboration Cloud</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Panneau droit - Formulaire cyber -->
      <div class="cyber-form-panel">
        <div class="form-content">
          <div class="form-header">
            <h2 class="form-title">Créer un compte</h2>
            <p class="form-subtitle">Rejoignez des milliers de designers professionnels</p>
          </div>

          <form @submit.prevent="handleRegister" class="cyber-form">
            <!-- Nom et Prénom -->
            <div class="form-row">
              <div class="form-group">
                <label for="firstName" class="cyber-label">Prénom</label>
                <div class="cyber-input-container">
                  <div class="input-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                  </div>
                  <input
                    id="firstName"
                    v-model="form.firstName"
                    type="text"
                    required
                    class="cyber-input"
                    :class="{ 'error': firstNameError }"
                    placeholder="John"
                  />
                </div>
                <div v-if="firstNameError" class="error-message">{{ firstNameError }}</div>
              </div>

              <div class="form-group">
                <label for="lastName" class="cyber-label">Nom</label>
                <div class="cyber-input-container">
                  <div class="input-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                  </div>
                  <input
                    id="lastName"
                    v-model="form.lastName"
                    type="text"
                    required
                    class="cyber-input"
                    :class="{ 'error': lastNameError }"
                    placeholder="Doe"
                  />
                </div>
                <div v-if="lastNameError" class="error-message">{{ lastNameError }}</div>
              </div>
            </div>

            <!-- Type de compte -->
            <div class="form-group">
              <label for="role" class="cyber-label">Type de compte</label>
              <div class="cyber-input-container">
                <div class="input-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.196-2.121L17 20zM9 6a3 3 0 106 0v1H9V6zM7 21h10a2 2 0 002-2V9a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                </div>
                <select
                  id="role"
                  v-model="form.role"
                  required
                  class="cyber-input"
                  :class="{ 'error': roleError }"
                >
                  <option value="">Sélectionnez votre type de compte</option>
                  <option value="client">Client - Je cherche à réserver des propriétés</option>
                  <option value="manager">Manager - Je souhaite gérer des propriétés</option>
                </select>
              </div>
              <div v-if="roleError" class="error-message">{{ roleError }}</div>
              <div v-if="form.role === 'manager'" class="role-info">
                <p class="role-info-text">
                  ⚠️ Les comptes Manager nécessitent une approbation par un administrateur avant activation.
                </p>
              </div>
            </div>

            <!-- Téléphone -->
            <div class="form-group">
              <label for="phone" class="cyber-label">Téléphone (optionnel)</label>
              <div class="cyber-input-container">
                <div class="input-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                </div>
                <input
                  id="phone"
                  v-model="form.phone"
                  type="tel"
                  class="cyber-input"
                  placeholder="+33 6 12 34 56 78"
                />
              </div>
            </div>

            <!-- Adresse -->
            <div class="form-group">
              <label for="address" class="cyber-label">Adresse (optionnel)</label>
              <div class="cyber-input-container">
                <div class="input-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                </div>
                <textarea
                  id="address"
                  v-model="form.address"
                  class="cyber-input"
                  rows="2"
                  placeholder="Votre adresse complète"
                ></textarea>
              </div>
            </div>

            <!-- Email -->
            <div class="form-group">
              <label for="email" class="cyber-label">Adresse email</label>
              <div class="cyber-input-container">
                <div class="input-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"/>
                  </svg>
                </div>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  required
                  class="cyber-input"
                  :class="{ 'error': emailError }"
                  placeholder="john.doe@example.com"
                />
              </div>
              <div v-if="emailError" class="error-message">{{ emailError }}</div>
            </div>

            <!-- Mot de passe -->
            <div class="form-group">
              <label for="password" class="cyber-label">Mot de passe</label>
              <div class="cyber-input-container">
                <div class="input-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                </div>
                <input
                  id="password"
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  class="cyber-input"
                  :class="{ 'error': passwordError }"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="password-toggle"
                >
                  <svg v-if="showPassword" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"/>
                  </svg>
                  <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                </button>
              </div>
              <div v-if="passwordError" class="error-message">{{ passwordError }}</div>
              
              <!-- Indicateur de force du mot de passe -->
              <div class="password-strength">
                <div class="strength-bar">
                  <div class="strength-fill" :style="{ width: passwordStrength + '%' }" :class="passwordStrengthClass"></div>
                </div>
                <span class="strength-text" :class="passwordStrengthClass">{{ passwordStrengthText }}</span>
              </div>
            </div>

            <!-- Confirmation mot de passe -->
            <div class="form-group">
              <label for="confirmPassword" class="cyber-label">Confirmer le mot de passe</label>
              <div class="cyber-input-container">
                <div class="input-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <input
                  id="confirmPassword"
                  v-model="form.confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  required
                  class="cyber-input"
                  :class="{ 'error': confirmPasswordError }"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  @click="showConfirmPassword = !showConfirmPassword"
                  class="password-toggle"
                >
                  <svg v-if="showConfirmPassword" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"/>
                  </svg>
                  <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                </button>
              </div>
              <div v-if="confirmPasswordError" class="error-message">{{ confirmPasswordError }}</div>
            </div>

            <!-- Conditions d'utilisation -->
            <div class="form-group">
              <label class="cyber-checkbox-container">
                <input v-model="form.acceptTerms" type="checkbox" class="cyber-checkbox">
                <span class="cyber-checkmark"></span>
                <span class="checkbox-label">
                  J'accepte les <a href="#" class="terms-link">conditions d'utilisation</a> et la 
                  <a href="#" class="terms-link">politique de confidentialité</a>
                </span>
              </label>
              <div v-if="termsError" class="error-message">{{ termsError }}</div>
            </div>

            <!-- Newsletter -->
            <div class="form-group">
              <label class="cyber-checkbox-container">
                <input v-model="form.newsletter" type="checkbox" class="cyber-checkbox">
                <span class="cyber-checkmark"></span>
                <span class="checkbox-label">
                  Recevoir les dernières actualités et offres spéciales
                </span>
              </label>
            </div>

            <!-- Message d'erreur -->
            <div v-if="authStore.error" class="cyber-alert cyber-alert-error">
              <svg class="alert-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span>{{ authStore.error }}</span>
            </div>

            <!-- Bouton d'inscription cyber -->
            <button
              type="submit"
              :disabled="authStore.isLoading || !form.acceptTerms"
              class="cyber-submit-btn"
            >
              <span v-if="!authStore.isLoading" class="btn-text">Créer mon compte</span>
              <div v-if="authStore.isLoading" class="cyber-loading">
                <div class="cyber-spinner"></div>
                <span>Création du compte...</span>
              </div>
              <div class="cyber-btn-glow"></div>
            </button>
          </form>

          <!-- Séparateur cyber -->
          <div class="cyber-divider">
            <span class="divider-text">Ou créer un compte avec</span>
          </div>

          <!-- Connexion sociale cyber -->
          <div class="cyber-social-buttons">
            <button class="cyber-social-btn google-btn">
              <svg class="social-icon" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Google</span>
            </button>
            
            <button class="cyber-social-btn microsoft-btn">
              <svg class="social-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z"/>
              </svg>
              <span>Microsoft</span>
            </button>

            <button class="cyber-social-btn github-btn">
              <svg class="social-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span>GitHub</span>
            </button>
          </div>

          
          <div class="login-link">
            <span>Déjà un compte ?</span>
            <router-link to="/login" class="cyber-login-btn">Se connecter</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()

// État du formulaire
const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: '',
  phone: '',
  address: '',
  acceptTerms: false,
  newsletter: false
})

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const firstNameError = ref('')
const lastNameError = ref('')
const emailError = ref('')
const passwordError = ref('')
const confirmPasswordError = ref('')
const roleError = ref('')
const termsError = ref('')

// Méthodes pour les effets visuels
const getParticleStyle = () => {
  return {
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 5}s`,
    animationDuration: `${3 + Math.random() * 4}s`
  }
}

const getGridStyle = (index: number) => {
  const isVertical = index % 2 === 0
  return {
    [isVertical ? 'left' : 'top']: `${(index / 20) * 100}%`,
    animationDelay: `${index * 0.1}s`
  }
}

// Calcul de la force du mot de passe
const passwordStrength = computed(() => {
  const password = form.password
  if (!password) return 0
  
  let strength = 0
  if (password.length >= 8) strength += 25
  if (/[a-z]/.test(password)) strength += 25
  if (/[A-Z]/.test(password)) strength += 25
  if (/[0-9]/.test(password)) strength += 25
  if (/[^A-Za-z0-9]/.test(password)) strength += 25
  
  return Math.min(strength, 100)
})

const passwordStrengthClass = computed(() => {
  if (passwordStrength.value < 25) return 'weak'
  if (passwordStrength.value < 50) return 'fair'
  if (passwordStrength.value < 75) return 'good'
  return 'strong'
})

const passwordStrengthText = computed(() => {
  if (passwordStrength.value < 25) return 'Faible'
  if (passwordStrength.value < 50) return 'Moyen'
  if (passwordStrength.value < 75) return 'Bon'
  return 'Fort'
})

// Validation du formulaire
const validateForm = () => {
  firstNameError.value = ''
  lastNameError.value = ''
  emailError.value = ''
  passwordError.value = ''
  confirmPasswordError.value = ''
  roleError.value = ''
  termsError.value = ''

  let isValid = true

  if (!form.firstName.trim()) {
    firstNameError.value = 'Le prénom est requis'
    isValid = false
  }

  if (!form.lastName.trim()) {
    lastNameError.value = 'Le nom est requis'
    isValid = false
  }

  if (!form.role) {
    roleError.value = 'Le type de compte est requis'
    isValid = false
  }

  if (!form.email) {
    emailError.value = 'L\'adresse email est requise'
    isValid = false
  } else if (!/\S+@\S+\.\S+/.test(form.email)) {
    emailError.value = 'L\'adresse email n\'est pas valide'
    isValid = false
  }

  if (!form.password) {
    passwordError.value = 'Le mot de passe est requis'
    isValid = false
  } else if (form.password.length < 8) {
    passwordError.value = 'Le mot de passe doit contenir au moins 8 caractères'
    isValid = false
  }

  if (!form.confirmPassword) {
    confirmPasswordError.value = 'La confirmation du mot de passe est requise'
    isValid = false
  } else if (form.password !== form.confirmPassword) {
    confirmPasswordError.value = 'Les mots de passe ne correspondent pas'
    isValid = false
  }

  if (!form.acceptTerms) {
    termsError.value = 'Vous devez accepter les conditions d\'utilisation'
    isValid = false
  }

  return isValid
}

const handleRegister = async () => {
  if (!validateForm()) return

  try {
    const result = await authStore.register({
      name: `${form.firstName} ${form.lastName}`,
      email: form.email,
      password: form.password,
      password_confirmation: form.confirmPassword,
      role: form.role as 'client' | 'manager',
      phone: form.phone,
      address: form.address
    })
    
    if (result?.success) {
      console.log('Inscription réussie')
    }
  } catch (error) {
    console.error('Erreur d\'inscription:', error)
  }
}

// Watchers pour validation en temps réel
watch(() => form.confirmPassword, () => {
  if (form.confirmPassword && form.password !== form.confirmPassword) {
    confirmPasswordError.value = 'Les mots de passe ne correspondent pas'
  } else {
    confirmPasswordError.value = ''
  }
})
</script>

<style scoped>
/* Import des variables cyber */
@import url('../../assets/cyber-theme.css');

.register-cyber {
  min-height: 100vh;
  position: relative;
  background: var(--bg-gradient-main);
  overflow: hidden;
}

.register-cyber::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--hero-gradient);
  opacity: 0.8;
  pointer-events: none;
  animation: aurora-shift 30s linear infinite;
}

@keyframes aurora-shift {
  0% { filter: hue-rotate(0deg); }
  100% { filter: hue-rotate(360deg); }
}

/* Arrière-plan cyber */
.cyber-bg {
  position: absolute;
  inset: 0;
}

.holographic-grid {
  position: absolute;
  inset: 0;
  opacity: 0.1;
}

.grid-line {
  position: absolute;
  background: var(--electric-blue);
  animation: grid-pulse 4s ease-in-out infinite;
}

.grid-line:nth-child(even) {
  width: 1px;
  height: 100%;
}

.grid-line:nth-child(odd) {
  width: 100%;
  height: 1px;
}

@keyframes grid-pulse {
  0%, 100% { opacity: 0.1; }
  50% { opacity: 0.3; }
}

.neon-shapes {
  position: absolute;
  inset: 0;
}

.neon-shape {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
}

.shape-1 {
  width: 600px;
  height: 600px;
  background: var(--primary-gradient);
  top: -300px;
  right: -300px;
  animation: neon-float-1 20s ease-in-out infinite;
}

.shape-2 {
  width: 400px;
  height: 400px;
  background: var(--cyber-gradient);
  bottom: -200px;
  left: -200px;
  animation: neon-float-2 25s ease-in-out infinite reverse;
}

.shape-3 {
  width: 300px;
  height: 300px;
  background: var(--secondary-gradient);
  top: 20%;
  left: 10%;
  animation: neon-float-3 18s ease-in-out infinite;
}

.shape-4 {
  width: 250px;
  height: 250px;
  background: var(--matrix-gradient);
  bottom: 30%;
  right: 15%;
  animation: neon-float-4 22s ease-in-out infinite;
}

@keyframes neon-float-1 {
  0%, 100% { 
    transform: translate(0px, 0px) rotate(0deg) scale(1);
    opacity: 0.4;
  }
  25% { 
    transform: translate(-50px, -30px) rotate(90deg) scale(1.1);
    opacity: 0.6;
  }
  50% { 
    transform: translate(-30px, -60px) rotate(180deg) scale(0.9);
    opacity: 0.3;
  }
  75% { 
    transform: translate(-70px, -20px) rotate(270deg) scale(1.2);
    opacity: 0.5;
  }
}

@keyframes neon-float-2 {
  0%, 100% { 
    transform: translate(0px, 0px) rotate(0deg);
    opacity: 0.3;
  }
  33% { 
    transform: translate(40px, -25px) rotate(120deg);
    opacity: 0.5;
  }
  66% { 
    transform: translate(-25px, -50px) rotate(240deg);
    opacity: 0.4;
  }
}

@keyframes neon-float-3 {
  0%, 100% { 
    transform: translateY(0px) scale(1);
    opacity: 0.35;
  }
  50% { 
    transform: translateY(-80px) scale(1.3);
    opacity: 0.7;
  }
}

@keyframes neon-float-4 {
  0%, 100% { 
    transform: translate(0px, 0px) rotate(0deg) scale(1);
    opacity: 0.25;
  }
  50% { 
    transform: translate(30px, -40px) rotate(180deg) scale(1.15);
    opacity: 0.45;
  }
}

.cyber-particles {
  position: absolute;
  inset: 0;
}

.cyber-particle {
  position: absolute;
  width: 3px;
  height: 3px;
  background: var(--electric-blue);
  border-radius: 50%;
  animation: cyber-particle-dance linear infinite;
  box-shadow: 0 0 8px var(--electric-blue);
}

.cyber-particle:nth-child(odd) {
  background: var(--neon-pink);
  box-shadow: 0 0 8px var(--neon-pink);
}

.cyber-particle:nth-child(3n) {
  background: var(--acid-green);
  box-shadow: 0 0 8px var(--acid-green);
}

.cyber-particle:nth-child(5n) {
  background: var(--cyber-purple);
  box-shadow: 0 0 8px var(--cyber-purple);
}

@keyframes cyber-particle-dance {
  0% {
    transform: translateY(100vh) translateX(0px) scale(0);
    opacity: 0;
  }
  5% {
    opacity: 1;
  }
  25% {
    transform: translateY(75vh) translateX(30px) scale(1);
  }
  50% {
    transform: translateY(50vh) translateX(-20px) scale(1.2);
    opacity: 0.8;
  }
  75% {
    transform: translateY(25vh) translateX(40px) scale(0.8);
  }
  95% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) translateX(-15px) scale(0.3);
    opacity: 0;
  }
}

/* Container principal */
.register-container {
  position: relative;
  z-index: 10;
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr;
  background: linear-gradient(135deg, #4300FF 0%, #0065F8 33%, #00CAFF 66%, #00FFDE 100%);

}

@media (min-width: 1200px) {
  .register-container {
    grid-template-columns: 1fr 1.2fr;
  }
}

/* Panneau de branding cyber */
.cyber-branding-panel {
  display: none;
  background: var(--navbar-gradient);
  backdrop-filter: blur(40px);
  border-right: 1px solid var(--card-border);
  position: relative;
  overflow: hidden;
}

.cyber-branding-panel::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--hologram-gradient);
  opacity: 0.05;
  animation: hologram-wave 25s linear infinite;
}

@keyframes hologram-wave {
  0% { transform: translateX(-100%) rotate(0deg); }
  100% { transform: translateX(200%) rotate(360deg); }
}

@media (min-width: 1200px) {
  .cyber-branding-panel {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4rem;
  }
}

.branding-content {
  max-width: 500px;
  color: var(--text-white);
  position: relative;
  z-index: 2;
}

.cyber-logo-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  text-decoration: none;
  color: var(--text-primary);
  margin-bottom: 3rem;
}

.cyber-logo-icon {
  width: 3.5rem;
  height: 3.5rem;
  background: var(--primary-gradient);
  border-radius: var(--border-radius-large);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-neon-blue);
  animation: cyber-logo-pulse 4s ease-in-out infinite;
}

@keyframes cyber-logo-pulse {
  0%, 100% { 
    box-shadow: var(--shadow-neon-blue);
    transform: scale(1);
  }
  50% { 
    box-shadow: var(--shadow-cyber);
    transform: scale(1.05);
  }
}

.cyber-logo-icon svg {
  width: 2rem;
  height: 2rem;
  stroke: white;
}

.cyber-logo-text {
  font-size: 1.75rem;
  font-weight: 800;
  color: #ffffff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.cyber-hero {
  margin-bottom: 3rem;
}

.cyber-title {
  font-size: 3rem;
  font-weight: 900;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #ffffff 0%, #e2e8f0 50%, #cbd5e1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 2px 8px rgba(6, 101, 248, 0.1);
}

.cyber-subtitle {
  font-size: 1.25rem;
  color: #e5e7eb;
  line-height: 1.6;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.premium-features {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--border-radius-medium);
  backdrop-filter: blur(20px);
  transition: var(--transition-smooth);
  color: #ffffff;
}

.feature-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(6, 101, 248, 0.3);
  border-color: #0065F8;
  background: rgba(255, 255, 255, 0.15);
}

.feature-icon {
  font-size: 1.5rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

/* Panneau de formulaire cyber */
.cyber-form-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: var(--bg-white);
  backdrop-filter: blur(30px);
  position: relative;
}

.cyber-form-panel::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--matrix-gradient);
  opacity: 0.03;
  animation: matrix-flow 20s linear infinite;
}

@keyframes matrix-flow {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
}

.form-content {
  width: 100%;
  max-width: 500px;
  color: var(--text-primary);
  position: relative;
  z-index: 2;
}

.form-header {
  text-align: center;
  margin-bottom: 3rem;
}

.form-title {
  font-size: 2.5rem;
  font-weight: 900;
  margin-bottom: 0.5rem;
  color: #000000;
}

.form-subtitle {
  color: #0065F8;
  font-size: 1.1rem;
}

.cyber-form {
  margin-bottom: 2rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.cyber-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #000000;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.cyber-input-container {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.25rem;
  height: 1.25rem;
  color: var(--text-muted);
  z-index: 2;
  transition: var(--transition-smooth);
}

.input-icon svg {
  width: 100%;
  height: 100%;
  stroke: currentColor;
}

.cyber-input {
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: var(--border-radius-medium);
  color: var(--text-primary);
  font-size: 1rem;
  transition: var(--transition-smooth);
  backdrop-filter: blur(15px);
  box-shadow: var(--shadow-card);
}

.cyber-input:focus {
  outline: none;
  border-color: var(--electric-blue);
  background: var(--card-bg-hover);
  box-shadow: var(--shadow-hover);
  color: var(--text-primary);
}

.cyber-input:focus + .input-icon {
  color: var(--electric-blue);
}

.cyber-input.error {
  border-color: var(--laser-red);
  box-shadow: 0 0 15px rgba(255, 0, 64, 0.3);
}

.cyber-input::placeholder {
  color: #666666;
}

.password-toggle {
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

.password-toggle:hover {
  color: var(--electric-blue);
}

.password-toggle svg {
  width: 100%;
  height: 100%;
  stroke: currentColor;
}

.error-message {
  margin-top: 0.5rem;
  color: var(--laser-red);
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Indicateur de force du mot de passe */
.password-strength {
  margin-top: 0.75rem;
}

.strength-bar {
  width: 100%;
  height: 4px;
  background: var(--glass-bg-strong);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.strength-fill {
  height: 100%;
  transition: var(--transition-smooth);
  border-radius: 2px;
}

.strength-fill.weak { background: var(--laser-red); }
.strength-fill.fair { background: var(--solar-orange); }
.strength-fill.good { background: var(--acid-green); }
.strength-fill.strong { background: var(--electric-blue); }

.strength-text {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.strength-text.weak { color: var(--laser-red); }
.strength-text.fair { color: var(--solar-orange); }
.strength-text.good { color: var(--acid-green); }
.strength-text.strong { color: var(--electric-blue); }

/* Checkbox cyber */
.cyber-checkbox-container {
  display: flex;
  align-items: flex-start;
  cursor: pointer;
  user-select: none;
  gap: 0.75rem;
}

.cyber-checkbox {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.cyber-checkmark {
  width: 1.5rem;
  height: 1.5rem;
  background: var(--glass-bg-medium);
  border: 2px solid var(--glass-border);
  border-radius: 0.375rem;
  position: relative;
  transition: var(--transition-smooth);
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.cyber-checkbox:checked ~ .cyber-checkmark {
  background: var(--primary-gradient);
  border-color: var(--electric-blue);
  box-shadow: 0 0 15px rgba(0, 229, 255, 0.5);
}

.cyber-checkbox:checked ~ .cyber-checkmark::after {
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

.checkbox-label {
  font-size: 0.875rem;
  color: #000000;
  line-height: 1.4;
}

/* Styles pour le rôle */
.role-info {
  margin-top: 0.5rem;
  padding: 0.75rem;
  background: rgba(255, 165, 0, 0.1);
  border: 1px solid rgba(255, 165, 0, 0.3);
  border-radius: var(--border-radius-medium);
  backdrop-filter: blur(10px);
}

.role-info-text {
  margin: 0;
  font-size: 0.875rem;
  color: #0065F8;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Styles pour select et textarea */
.cyber-input select,
.cyber-input textarea {
  width: 100%;
  background: transparent;
  border: none;
  color: inherit;
  outline: none;
  resize: vertical;
}

.cyber-input select {
  padding-right: 2rem;
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
}

.cyber-input select option {
  background: var(--card-bg);
  color: var(--text-primary);
  padding: 0.5rem;
}

.cyber-input textarea {
  min-height: 60px;
  max-height: 120px;
  line-height: 1.4;
}

.terms-link {
  color: #0065F8;
  text-decoration: none;
  transition: var(--transition-smooth);
}

.terms-link:hover {
  color: #4300FF;
  text-shadow: 0 0 10px #4300FF;
}

/* Alert cyber */
.cyber-alert {
  padding: 1rem;
  border-radius: var(--border-radius-medium);
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  backdrop-filter: blur(20px);
}

.cyber-alert-error {
  background: rgba(255, 0, 64, 0.1);
  border: 1px solid rgba(255, 0, 64, 0.3);
  color: var(--laser-red);
}

.alert-icon {
  width: 1.25rem;
  height: 1.25rem;
  stroke: currentColor;
  flex-shrink: 0;
}

/* Bouton d'inscription cyber */
.cyber-submit-btn {
  position: relative;
  width: 100%;
  padding: 1.25rem;
  background: linear-gradient(135deg, #0065F8 0%, #4300FF 100%);
  border: none;
  border-radius: var(--border-radius-medium);
  color: white;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  transition: var(--transition-smooth);
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(6, 101, 248, 0.3);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.cyber-submit-btn:hover:not(:disabled) {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 8px 25px rgba(6, 101, 248, 0.4);
  background: linear-gradient(135deg, #4300FF 0%, #0065F8 100%);
}

.cyber-submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.btn-text {
  position: relative;
  z-index: 2;
}

.cyber-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  position: relative;
  z-index: 2;
}

.cyber-spinner {
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid var(--electric-blue);
  border-radius: 50%;
  animation: cyber-spin 1s linear infinite;
}

@keyframes cyber-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.cyber-btn-glow {
  position: absolute;
  inset: 0;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transform: translateX(-100%);
  transition: transform 0.8s;
}

.cyber-submit-btn:hover .cyber-btn-glow {
  transform: translateX(100%);
}

/* Séparateur cyber */
.cyber-divider {
  position: relative;
  text-align: center;
  margin: 3rem 0;
}

.cyber-divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--glass-border), transparent);
}

.divider-text {
  background: white;
  padding: 0 1.5rem;
  color: #000000;
  font-size: 0.875rem;
  position: relative;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Boutons sociaux cyber */
.cyber-social-buttons {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 3rem;
}

.cyber-social-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: var(--border-radius-medium);
  color: #000000;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition-smooth);
  backdrop-filter: blur(20px);
  font-size: 0.875rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.cyber-social-btn:hover {
  background: #f9fafb;
  border-color: #0065F8;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(6, 101, 248, 0.15);
}

.social-icon {
  width: 1.25rem;
  height: 1.25rem;
}

/* Lien de connexion */
.login-link {
  text-align: center;
  color: #000000;
  font-size: 0.875rem;
}

.cyber-login-btn {
  color: #0065F8;
  text-decoration: none;
  font-weight: 600;
  margin-left: 0.5rem;
  transition: var(--transition-smooth);
}

.cyber-login-btn:hover {
  color: #4300FF;
  text-shadow: 0 0 15px #4300FF;
}

/* Responsive */
@media (max-width: 1199px) {
  .cyber-form-panel {
    min-height: 100vh;
  }
  
  .form-content {
    max-width: 600px;
  }
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .cyber-social-buttons {
    grid-template-columns: 1fr;
  }
  
  .premium-features {
    grid-template-columns: 1fr;
  }
  
  .cyber-title {
    font-size: 2rem;
  }
}
</style>