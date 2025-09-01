<template>
  <div class="home-professional">
    <!-- Hero Section Ultra-Moderne -->
    <section class="hero-ultra">
      <!-- Arrière-plan animé -->
      <div class="hero-bg">
        <div class="geometric-shape shape-1"></div>
        <div class="geometric-shape shape-2"></div>
        <div class="geometric-shape shape-3"></div>
        <div class="floating-particles">
          <div v-for="i in 20" :key="i" class="particle" :style="getParticleStyle(i)"></div>
        </div>
      </div>

      <div class="hero-container">
        <div class="hero-content">
          <!-- Texte principal -->
          <div class="hero-text" data-aos="fade-up">
            <div class="hero-badge">
              <span class="badge-text">🏠 Plateforme N°1 en Design</span>
            </div>
            
            <h1 class="hero-title">
              <span class="title-line">Loyer de maison</span>
              <span class="title-highlight">dans plateforme</span>
              <span class="title-line">karya</span>
            </h1>
            
            <p class="hero-subtitle">
              Plateforme de location immobilière moderne pour trouver votre maison, 
              appartement ou bureau idéal avec des services personnalisés et une recherche simplifiée.
            </p>

            <!-- Statistiques impressionnantes -->
            <div class="hero-stats">
              <div class="stat-item" v-for="stat in heroStats" :key="stat.label">
                <div class="stat-number">{{ stat.number }}</div>
                <div class="stat-label">{{ stat.label }}</div>
              </div>
            </div>

            <!-- Boutons CTA premium -->
            <div class="hero-actions">
              <router-link to="/register" class="btn-premium">
                <span class="btn-text">Commencer Gratuitement</span>
                <div class="btn-glow"></div>
                <svg class="btn-icon" viewBox="0 0 24 24">
                  <path d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                </svg>
              </router-link>
              
              <button @click="showDemo" class="btn-glass">
                <svg class="play-icon" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                <span>Voir la Démo</span>
              </button>
            </div>
          </div>

          <!-- Visualisateur d'images inspirantes (Maison / Appartement / Bureau) -->
          <div class="hero-visual" data-aos="fade-left" data-aos-delay="200">
            <div class="hero-image-wrapper">
              <transition name="hero-slide" mode="out-in">
                <img
                  class="hero-image"
                  :src="currentHeroImage"
                  :alt="heroLabels[currentHeroIndex]"
                  loading="lazy"
                  referrerpolicy="no-referrer"
                  @error="onHeroImgError"
                  :key="currentHeroImage"
                />
              </transition>
              <div class="hero-badge-overlay">{{ heroLabels[currentHeroIndex] }}</div>
              <div class="hero-dots">
                <button 
                  v-for="(img, idx) in heroImages" 
                  :key="idx" 
                  class="hero-dot" 
                  :class="{ active: idx === currentHeroIndex }" 
                  @click="goToHero(idx)"
                  aria-label="Changer d'image"
                ></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Section Catégories (Maison, Appartement, Bureau) -->
    <section class="categories-showcase">
      <div class="container">
        <div class="section-header" data-aos="fade-up">
          <span class="section-tag">Catégories</span>
          <h2 class="section-title">Espaces que nous maîtrisons</h2>
          <p class="section-subtitle">
            Découvrez des exemples inspirants pour maisons, appartements et bureaux
          </p>
        </div>

        <div class="categories-grid">
          <div
            v-for="(cat, index) in categories"
            :key="cat.title"
            class="category-card"
            :data-aos="'zoom-in'"
            :data-aos-delay="index * 100"
          >
            <div class="category-image">
              <img
                class="category-img"
                :src="cat.image"
                alt=""
                loading="lazy"
                referrerpolicy="no-referrer"
                @error="onCategoryImgError"
              />
            </div>
            <div class="category-overlay"></div>
            <div class="category-content">
              <div class="category-badge">{{ cat.tag }}</div>
              <h3 class="category-title">{{ cat.title }}</h3>
              <p class="category-desc">{{ cat.description }}</p>
              <div class="category-stats">
                <div class="stat"><span class="stat-number">{{ cat.examples }}</span><span class="stat-label">exemples</span></div>
                <div class="stat"><span class="stat-number">{{ cat.designers }}</span><span class="stat-label">designers</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Section Fonctionnalités Premium -->
    <section class="features-premium">
      <div class="container">
        <div class="section-header" data-aos="fade-up">
          <span class="section-tag">Fonctionnalités</span>
          <h2 class="section-title">Outils Professionnels de Pointe</h2>
          <p class="section-subtitle">
            Créez des designs architecturaux exceptionnels avec nos outils alimentés par l'IA
          </p>
        </div>

        <div class="features-grid">
          <div 
            v-for="(feature, index) in premiumFeatures" 
            :key="feature.title"
            class="feature-card-premium"
            :data-aos="'fade-up'"
            :data-aos-delay="index * 100"
          >
            <div class="feature-icon-container">
              <div class="feature-icon" v-html="feature.icon"></div>
              <div class="icon-glow"></div>
            </div>
            
            <div class="feature-content">
              <h3 class="feature-title">{{ feature.title }}</h3>
              <p class="feature-description">{{ feature.description }}</p>
              
              <div class="feature-tech">
                <span v-for="tech in feature.technologies" :key="tech" class="tech-tag">
                  {{ tech }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Section Témoignages Clients -->
    <section class="testimonials-section">
      <div class="container">
        <div class="section-header" data-aos="fade-up">
          <span class="section-tag">Témoignages</span>
          <h2 class="section-title">Ce que disent nos clients</h2>
          <p class="section-subtitle">
            Des retours authentiques sur l'expérience et la qualité des projets livrés
          </p>
        </div>

        <div class="testimonials-grid">
          <div
            v-for="(t, index) in testimonials"
            :key="t.name"
            class="testimonial-card"
            :data-aos="'fade-up'"
            :data-aos-delay="index * 150"
          >
            <div class="testimonial-header">
              <img :src="t.avatar" :alt="t.name" class="avatar" />
              <div class="person">
                <div class="name">{{ t.name }}</div>
                <div class="role">{{ t.role }}</div>
              </div>
              <div class="rating">
                <span v-for="n in 5" :key="n" class="star" :class="{ filled: n <= t.rating }">★</span>
              </div>
            </div>
            <p class="testimonial-text">“{{ t.comment }}”</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Section Portfolio/Showcase -->
    <section class="portfolio-showcase">
      <div class="container">
        <div class="section-header" data-aos="fade-up">
          <span class="section-tag">Portfolio</span>
          <h2 class="section-title">Projets Réalisés</h2>
        </div>

        <div class="portfolio-grid">
          <div 
            v-for="(project, index) in portfolioProjects" 
            :key="project.id"
            class="portfolio-item"
            :data-aos="'zoom-in'"
            :data-aos-delay="index * 150"
            @click="viewProject(project)"
          >
            <div class="project-image">
              <img
                class="project-img"
                :src="project.image"
                alt=""
                loading="lazy"
                referrerpolicy="no-referrer"
                @error="onProjectImgError"
              />
              <div class="project-overlay">
                <div class="project-info">
                  <h4>{{ project.title }}</h4>
                  <p>{{ project.category }}</p>
                </div>
                <div class="project-action">
                  <svg viewBox="0 0 24 24">
                    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Section CTA Final -->
    <section class="cta-final">
      <div class="cta-bg">
        <div class="cta-gradient"></div>
      </div>
      
      <div class="container">
        <div class="cta-content" data-aos="fade-up">
          <h2 class="cta-title">Prêt à Révolutionner votre Design ?</h2>
          <p class="cta-subtitle">
            Rejoignez plus de 50,000 architectes et designers qui utilisent notre plateforme
          </p>
          
          <div class="cta-actions">
            <router-link to="/register" class="btn-cta-primary">
              <span>Commencer Maintenant</span>
              <div class="btn-shine"></div>
            </router-link>
            
            <router-link to="/login" class="btn-cta-secondary">
              Se Connecter
            </router-link>
          </div>
          
          <!-- Trust badges -->
          <div class="trust-badges">
            <div class="trust-item">
              <span class="trust-icon">⭐</span>
              <span>4.9/5 étoiles</span>
            </div>
            <div class="trust-item">
              <span class="trust-icon">🔒</span>
              <span>100% Sécurisé</span>
            </div>
            <div class="trust-item">
              <span class="trust-icon">🚀</span>
              <span>Démarrage instantané</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Données des statistiques
const heroStats = ref([
  { number: '50K+', label: 'Utilisateurs' },
  { number: '500+', label: 'Modèles 3D' },
  { number: '99.9%', label: 'Uptime' },
  { number: '24/7', label: 'Support' }
])

// Fonctionnalités premium
const premiumFeatures = ref([
  {
    title: 'IA Générative',
    description: 'Créez des designs uniques avec notre intelligence artificielle avancée',
    icon: '🤖',
    technologies: ['Machine Learning', 'Computer Vision', 'Neural Networks']
  },
  {
    title: 'Rendu Temps Réel',
    description: 'Visualisation photoréaliste instantanée avec ray-tracing',
    icon: '⚡',
    technologies: ['WebGL', 'Ray Tracing', 'GPU Computing']
  },
  {
    title: 'Collaboration Cloud',
    description: 'Travaillez en équipe sur vos projets en temps réel',
    icon: '☁️',
    technologies: ['WebRTC', 'Cloud Sync', 'Real-time']
  },
  {
    title: 'Réalité Virtuelle',
    description: 'Explorez vos créations en immersion totale VR/AR',
    icon: '🥽',
    technologies: ['WebXR', 'VR/AR', '3D Immersion']
  },
  {
    title: 'Export Professionnel',
    description: 'Exportez vers tous les formats professionnels (CAD, BIM)',
    icon: '📊',
    technologies: ['CAD Export', 'BIM', 'PDF/DWG']
  },
  {
    title: 'Analytics Avancés',
    description: 'Analysez les performances énergétiques et structurelles',
    icon: '📈',
    technologies: ['IoT', 'Analytics', 'Simulation']
  }
])

// Catégories présentées (images d'exemple)
const categories = ref([
  {
    title: 'Maison Moderne',
    tag: 'Maison',
    description: 'Volumes élégants, lumière naturelle et matériaux nobles pour un confort absolu.',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1600&auto=format&fit=crop',
    examples: '120+',
    designers: '30+'
  },
  {
    title: 'Appartement Chic',
    tag: 'Appartement',
    description: 'Optimisation des espaces, finitions raffinées et esprit contemporain.',
    image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=1600&auto=format&fit=crop',
    examples: '90+',
    designers: '22+'
  },
  {
    title: 'Bureau Inspirant',
    tag: 'Bureau',
    description: 'Espaces de travail flexibles, ergonomiques et à forte identité visuelle.',
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1600&auto=format&fit=crop',
    examples: '75+',
    designers: '18+'
  }
])

// Témoignages clients
const testimonials = ref([
  {
    name: 'Sophie Martin',
    role: 'Propriétaire Maison',
    rating: 5,
    comment: 'Résultat incroyable, le design 3D nous a permis de tout visualiser avant travaux.',
    avatar: 'https://i.pravatar.cc/100?img=5'
  },
  {
    name: 'Karim El Amrani',
    role: 'Gestionnaire d\'Appartement',
    rating: 5,
    comment: 'Optimisation parfaite des surfaces, finition premium. Clients ravis !',
    avatar: 'https://i.pravatar.cc/100?img=12'
  },
  {
    name: 'Laura Bianchi',
    role: 'Office Manager',
    rating: 4,
    comment: 'Nos équipes adorent le nouvel espace, lumineux et motivant au quotidien.',
    avatar: 'https://i.pravatar.cc/100?img=32'
  }
])

// Projets portfolio (avec images)
const portfolioProjects = ref([
  { 
    id: 1, 
    title: 'Villa Moderne', 
    category: 'Architecture Résidentielle',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1600&auto=format&fit=crop'
  },
  { 
    id: 2, 
    title: 'Loft Industriel', 
    category: 'Rénovation',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1600&auto=format&fit=crop'
  },
  { 
    id: 3, 
    title: 'Maison Écologique', 
    category: 'Développement Durable',
    image: 'https://images.unsplash.com/photo-1459535653751-d571815e906b?q=80&w=1600&auto=format&fit=crop'
  },
  { 
    id: 4, 
    title: 'Penthouse Luxe', 
    category: 'Design d\'Intérieur',
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1600&auto=format&fit=crop'
  },
  { 
    id: 5, 
    title: 'Studio Minimaliste', 
    category: 'Architecture Moderne',
    image: 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?q=80&w=1600&auto=format&fit=crop'
  },
  { 
    id: 6, 
    title: 'Château Restauré', 
    category: 'Patrimoine',
    image: 'https://images.unsplash.com/photo-1505842465776-3ac71e7abca7?q=80&w=1600&auto=format&fit=crop'
  }
])

// Méthodes
const getParticleStyle = (i?: number) => {
  const offset = (i ?? 0) * 0.05
  return {
    left: `${(Math.random() * 100 + offset) % 100}%`,
    top: `${(Math.random() * 100 + offset * 2) % 100}%`,
    animationDelay: `${((Math.random() * 5) + offset) % 5}s`,
    animationDuration: `${3 + (((Math.random() * 4) + offset) % 4)}s`
  }
}

// Images héro (professionnelles) Maison / Appartement / Bureau
const heroImages = ref([
  // Maison
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1600&auto=format&fit=crop',
  // Appartement
  'https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=1600&auto=format&fit=crop',
  // Bureau
  'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1600&auto=format&fit=crop'
])

const heroLabels = ref(['Maison', 'Appartement', 'Bureau'])
const currentHeroIndex = ref(0)
const currentHeroImage = ref(heroImages.value[currentHeroIndex.value])
let heroTimer: number | undefined

const startHeroAutoPlay = () => {
  stopHeroAutoPlay()
  heroTimer = window.setInterval(() => {
    nextHero()
  }, 4000)
}

const stopHeroAutoPlay = () => {
  if (heroTimer) {
    clearInterval(heroTimer)
    heroTimer = undefined
  }
}

const nextHero = () => {
  currentHeroIndex.value = (currentHeroIndex.value + 1) % heroImages.value.length
  currentHeroImage.value = heroImages.value[currentHeroIndex.value]
}

const goToHero = (idx: number) => {
  currentHeroIndex.value = idx
  currentHeroImage.value = heroImages.value[currentHeroIndex.value]
  startHeroAutoPlay()
}

const onHeroImgError = (e: Event) => {
  const target = e.target as HTMLImageElement
  target.onerror = null
  target.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1600&auto=format&fit=crop'
}

const showDemo = () => {
  console.log('Afficher la démo')
}

// Test de l'API (développement uniquement)
// const testAPI = async () => {
//   const { testApiConnection, testRegister, testLogin } = await import('../utils/testApi')
//   
//   console.log('=== Tests API ===')
//   
//   // Test de connexion
//   await testApiConnection()
//   
//   // Test d'inscription
//   const registerResult = await testRegister()
//   
//   if (registerResult?.access_token) {
//     // Test de connexion avec le nouvel utilisateur
//     const email = registerResult.user.email
//     const password = 'TestPassword123!'
//     await testLogin(email, password)
//   }
// }

interface Project {
  id: number
  title: string
  category: string
}

const viewProject = (project: Project) => {
  console.log('Voir le projet:', project.title)
}

const onProjectImgError = (e: Event) => {
  const target = e.target as HTMLImageElement
  // Empêcher une boucle infinie si l'image de secours échoue aussi
  target.onerror = null
  target.src = 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1600&auto=format&fit=crop'
}

const onCategoryImgError = (e: Event) => {
  const target = e.target as HTMLImageElement
  target.onerror = null
  // Fallback visuel pour catégorie
  target.src = 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1600&auto=format&fit=crop'
}

// Initialisation des animations
onMounted(() => {
  // Animation d'entrée progressive
  const elements = document.querySelectorAll('[data-aos]')
  elements.forEach((el, index) => {
    setTimeout(() => {
      el.classList.add('aos-animate')
    }, index * 100)
  })

  // Démarrer le carrousel héros
  startHeroAutoPlay()
})

// Arrêt du timer au démontage
import { onBeforeUnmount } from 'vue'
onBeforeUnmount(() => {
  stopHeroAutoPlay()
})
</script>

<style scoped>
/* Import de la nouvelle palette de couleurs moderne */
@import url('../assets/modern-purple-theme.css');

.home-professional {
  overflow-x: hidden;
  background: #ffffff;
  color: var(--text-primary);
  position: relative;
}

/* Catégories */
.categories-showcase {
  padding: 6rem 0;
  background: var(--bg-white);
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.category-card {
  position: relative;
  border-radius: 1rem;
  overflow: hidden;
  height: 360px;
  box-shadow: var(--shadow-card);
  border: 1px solid var(--card-border);
}

.category-image {
  position: absolute;
  inset: 0;
  transform: scale(1.05);
  transition: transform .6s ease;
}

.category-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.category-card:hover .category-image { transform: scale(1.12); }

.category-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.7) 100%);
}

.category-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.25rem;
  color: white;
}

.category-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: rgba(0, 255, 222, 0.15);
  border: 1px solid rgba(0, 255, 222, 0.3);
  border-radius: 999px;
  font-size: .75rem;
  margin-bottom: .5rem;
}

.category-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 .25rem 0;
}

.category-desc {
  font-size: .9rem;
  opacity: .9;
  margin: 0 0 .75rem 0;
}

.category-stats {
  display: flex;
  gap: 1rem;
}

.category-stats .stat {
  display: flex;
  gap: .5rem;
  align-items: baseline;
}

.category-stats .stat-number { font-weight: 800; }
.category-stats .stat-label { opacity: .8; font-size: .8rem; }

/* Témoignages */
.testimonials-section {
  padding: 6rem 0;
  background: var(--bg-gray-50);
}

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.testimonial-card {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 1rem;
  padding: 1.25rem;
  box-shadow: var(--shadow-card);
}

.testimonial-header {
  display: flex;
  align-items: center;
  gap: .75rem;
  margin-bottom: .75rem;
}

.avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
}

.person .name { font-weight: 700; }
.person .role { font-size: .8rem; opacity: .7; }

.rating { margin-left: auto; color: #4300FF; }
.star { opacity: .4; }
.star.filled { opacity: 1; }

.testimonial-text {
  color: var(--text-secondary);
  line-height: 1.6;
}

@keyframes aurora-shift {
  0% { filter: hue-rotate(0deg); }
  100% { filter: hue-rotate(360deg); }
}

/* Hero Section Ultra-Moderne */
.hero-ultra {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  background: var(--bg-light);
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

/* Formes géométriques supprimées pour design minimalistique */
.geometric-shape {
  display: none;
}

.shape-1,
.shape-2,
.shape-3 {
  display: none;
}

.floating-particles {
  display: none;
}

.particle {
  display: none;
}

@keyframes particle-float {
  0% {
    transform: translateY(100vh) scale(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) scale(1);
    opacity: 0;
  }
}

@keyframes float-slow {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-30px) rotate(5deg); }
}

.hero-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 10;
}

.hero-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: 4rem;
  align-items: center;
  min-height: 100vh;
  padding: 2rem 0;
}

@media (min-width: 1024px) {
  .hero-content {
    grid-template-columns: 1.2fr 1fr;
  }
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 2rem;
  backdrop-filter: blur(10px);
  margin-bottom: 2rem;
  font-size: 0.875rem;
  font-weight: 500;
  box-shadow: var(--shadow-card);
}

.hero-title {
  font-size: clamp(3rem, 8vw, 5rem);
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
}

.title-highlight {
  color: #4300FF;
  position: relative;
}

.title-highlight::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 0;
  right: 0;
  height: 4px;
  background: #00CAFF;
  border-radius: 2px;
  animation: underline-grow 2s ease-out;
}

@keyframes underline-grow {
  from { width: 0; }
  to { width: 100%; }
}

.hero-subtitle {
  font-size: 1.25rem;
  line-height: 1.6;
  color: var(--text-secondary);
  margin-bottom: 3rem;
  max-width: 600px;
}

.hero-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.stat-item {
  text-align: center;
  padding: 1.5rem;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 1rem;
  backdrop-filter: blur(10px);
  transition: var(--transition-smooth);
  box-shadow: var(--shadow-card);
}

.stat-item:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-hover);
  background: var(--card-bg-hover);
  border-color: var(--card-border-hover);
}

.stat-number {
  font-size: 2rem;
  font-weight: 800;
  color: #4300FF;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-muted);
  margin-top: 0.5rem;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  align-items: center;
}

.btn-premium {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #4300FF 0%, #0065F8 100%);
  color: white;
  text-decoration: none;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 1.1rem;
  transition: var(--transition-smooth);
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(67, 0, 255, 0.3);
}

.btn-premium:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(67, 0, 255, 0.4);
  background: linear-gradient(135deg, #0065F8 0%, #4300FF 100%);
}

.btn-glow {
  position: absolute;
  inset: 0;
  background: linear-gradient(45deg, transparent, rgba(0, 202, 255, 0.3), transparent);
  transform: translateX(-100%);
  transition: transform 0.6s;
}

.btn-premium:hover .btn-glow {
  transform: translateX(100%);
}

.btn-icon {
  width: 1.25rem;
  height: 1.25rem;
  stroke: currentColor;
  stroke-width: 2;
  fill: none;
}

.btn-glass {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(67, 0, 255, 0.2);
  color: #4300FF;
  border-radius: 0.75rem;
  backdrop-filter: blur(10px);
  font-weight: 500;
  transition: var(--transition-smooth);
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(67, 0, 255, 0.1);
}

.btn-glass:hover {
  background: rgba(67, 0, 255, 0.1);
  border-color: #4300FF;
  color: #0065F8;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(67, 0, 255, 0.2);
}

.play-icon {
  width: 1rem;
  height: 1rem;
  fill: currentColor;
}

/* Visualisation 3D Ultra-Moderne */
.hero-visual {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.floating-icons {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.hero-image-wrapper {
  position: relative;
  width: min(560px, 90vw);
  aspect-ratio: 4/3;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: var(--shadow-card);
  border: 1px solid var(--card-border);
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  position: absolute;
  inset: 0;
}

.hero-badge-overlay {
  position: absolute;
  top: .75rem;
  left: .75rem;
  background: rgba(39,0,93,.8);
  color: var(--pure-white);
  padding: .25rem .6rem;
  border-radius: .5rem;
  font-weight: 600;
  border: 1px solid rgba(174,210,255,.4);
}

.hero-dots {
  position: absolute;
  bottom: .75rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: .4rem;
}

.hero-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(174,210,255,.4);
  border: 1px solid rgba(174,210,255,.6);
  cursor: pointer;
}

.hero-dot.active {
  background: var(--bright-purple);
}

/* Transition du carrousel héros - slide gauche -> droite */
.hero-slide-enter-active,
.hero-slide-leave-active {
  transition: transform .45s ease, opacity .45s ease;
  position: absolute;
  inset: 0;
}
.hero-slide-enter-from { 
  transform: translateX(-20px); 
  opacity: 0; 
}
.hero-slide-enter-to { 
  transform: translateX(0); 
  opacity: 1; 
}
.hero-slide-leave-from { 
  transform: translateX(0); 
  opacity: 1; 
}
.hero-slide-leave-to { 
  transform: translateX(20px); 
  opacity: 0; 
}

.icon-element {
  position: absolute;
  font-size: 2rem;
  background: rgba(67, 0, 255, 0.1);
  border: 2px solid var(--tertiary-color);
  border-radius: 50%;
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(15px);
  box-shadow: var(--shadow-card);
  animation: icon-orbital 8s ease-in-out infinite;
  transition: all 0.3s ease;
}

.icon-element:hover {
  transform: scale(1.2);
  box-shadow: var(--shadow-hover);
  background: rgba(0, 255, 222, 0.15);
}

.icon-1 {
  top: 15%;
  left: 5%;
  animation-delay: 0s;
  background: rgba(67, 0, 255, 0.1);
}

.icon-2 {
  top: 65%;
  right: 5%;
  animation-delay: 2s;
  background: rgba(0, 101, 248, 0.1);
}

.icon-3 {
  bottom: 15%;
  left: 15%;
  animation-delay: 4s;
  background: rgba(0, 202, 255, 0.1);
}

.icon-4 {
  top: 8%;
  right: 25%;
  animation-delay: 6s;
  background: rgba(0, 255, 222, 0.1);
}

@keyframes icon-orbital {
  0%, 100% { 
    transform: translateY(0px) translateX(0px) rotate(0deg);
    box-shadow: 
      var(--shadow-neon-blue),
      inset 0 2px 4px rgba(174, 210, 255, 0.2);
  }
  25% {
    transform: translateY(-20px) translateX(10px) rotate(90deg);
    box-shadow: 
      var(--shadow-neon-purple),
      inset 0 2px 4px rgba(174, 210, 255, 0.3);
  }
  50% { 
    transform: translateY(-10px) translateX(-5px) rotate(180deg);
    box-shadow: 
      var(--shadow-cyber),
      inset 0 2px 4px rgba(174, 210, 255, 0.4);
  }
  75% {
    transform: translateY(-25px) translateX(-10px) rotate(270deg);
    box-shadow: 
      var(--shadow-neon-blue),
      inset 0 2px 4px rgba(174, 210, 255, 0.3);
  }
}

/* Ajout d'effets de particules autour de la maison */
.house-3d-container::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 50%, 
    rgba(174, 210, 255, 0.1) 0%, 
    transparent 50%);
  border-radius: 50%;
  animation: energy-pulse 4s ease-in-out infinite;
  pointer-events: none;
}

@keyframes energy-pulse {
  0%, 100% { 
    transform: scale(0.8);
    opacity: 0.3;
  }
  50% { 
    transform: scale(1.2);
    opacity: 0.1;
  }
}

/* Section Fonctionnalités Premium */
.features-premium {
  padding: 8rem 0;
  background: var(--bg-gray-50);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.section-header {
  text-align: center;
  margin-bottom: 5rem;
}

.section-tag {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #4300FF 0%, #0065F8 100%);
  color: white;
  border-radius: 2rem;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.section-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
}

.section-subtitle {
  font-size: 1.25rem;
  color: var(--text-secondary);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.feature-card-premium {
  position: relative;
  padding: 2.5rem;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 1.5rem;
  backdrop-filter: blur(20px);
  transition: var(--transition-smooth);
  overflow: hidden;
  box-shadow: var(--shadow-card);
}

.feature-card-premium::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--primary-gradient);
  opacity: 0;
  transition: var(--transition-smooth);
  z-index: -1;
}

.feature-card-premium:hover::before {
  opacity: 0.05;
}

.feature-card-premium:hover {
  transform: translateY(-10px);
  box-shadow: var(--shadow-hover);
  border-color: var(--card-border-hover);
  background: var(--card-bg-hover);
}

.feature-icon-container {
  position: relative;
  width: 80px;
  height: 80px;
  margin-bottom: 2rem;
}

.feature-icon {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #4300FF 0%, #0065F8 100%);
  border-radius: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  position: relative;
  z-index: 2;
}

.icon-glow {
  position: absolute;
  inset: -10px;
  background: #00CAFF;
  border-radius: 2rem;
  filter: blur(20px);
  opacity: 0.3;
  z-index: 1;
}

.feature-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.feature-description {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.feature-tech {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tech-tag {
  padding: 0.25rem 0.75rem;
  background: rgba(67, 0, 255, 0.1);
  border: 1px solid rgba(67, 0, 255, 0.3);
  border-radius: 1rem;
  font-size: 0.75rem;
  color: #4300FF;
  font-weight: 500;
}

/* Portfolio Showcase */
.portfolio-showcase {
  padding: 8rem 0;
  background: var(--bg-white);
}

/* Overrides: titres et sous-titres en noir pour sections demandées */
.features-premium .section-title,
.categories-showcase .section-title,
.testimonials-section .section-title,
.portfolio-showcase .section-title,
.cta-final .cta-title {
  background: none;
  -webkit-text-fill-color: initial;
  background-clip: initial;
  color: #111827; /* noir moderne */
}

.features-premium .section-subtitle,
.categories-showcase .section-subtitle,
.testimonials-section .section-subtitle,
.cta-final .cta-subtitle {
  color: var(--deep-purple);
}

/* CTA buttons en texte violet */
.cta-final .btn-cta-primary {
  color: var(--pure-white);
}

.cta-final .btn-cta-secondary {
  color: #111827;
  border-color: rgba(0, 0, 0, 0.25);
}

.cta-final .btn-cta-secondary:hover {
  background: rgba(0, 0, 0, 0.06);
  border-color: rgba(0, 0, 0, 0.35);
}

/* Trust badges en noir */
.trust-badges .trust-item {
  color: #111827;
}

.portfolio-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.portfolio-item {
  position: relative;
  aspect-ratio: 4/3;
  border-radius: 1rem;
  overflow: hidden;
  cursor: pointer;
  transition: var(--transition-smooth);
}

.portfolio-item:hover {
  transform: scale(1.05);
}

.project-image {
  width: 100%;
  height: 100%;
  background-color: #111827;
  position: relative;
}

.project-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.project-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.8) 100%);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 2rem;
  opacity: 0;
  transition: var(--transition-smooth);
}

.portfolio-item:hover .project-overlay {
  opacity: 1;
}

.project-info h4 {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.project-info p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
}

.project-action {
  align-self: flex-end;
}

.project-action svg {
  width: 2rem;
  height: 2rem;
  stroke: white;
  stroke-width: 2;
  fill: none;
}

/* CTA Final */
.cta-final {
  position: relative;
  padding: 8rem 0;
  background: var(--bg-light);
  overflow: hidden;
}

.cta-bg {
  position: absolute;
  inset: 0;
}

.cta-gradient {
  display: none; /* Supprimé pour design minimalistique */
}

.cta-content {
  text-align: center;
  position: relative;
  z-index: 10;
}

.cta-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
}

.cta-subtitle {
  font-size: 1.25rem;
  color: var(--text-secondary);
  margin-bottom: 3rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.cta-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: center;
  margin-bottom: 3rem;
}

.btn-cta-primary {
  position: relative;
  display: inline-flex;
  align-items: center;
  padding: 1.25rem 2.5rem;
  background: linear-gradient(135deg, #4300FF 0%, #0065F8 100%);
  color: white;
  text-decoration: none;
  border-radius: 0.75rem;
  font-weight: 700;
  font-size: 1.1rem;
  transition: var(--transition-smooth);
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(67, 0, 255, 0.3);
}

.btn-cta-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(67, 0, 255, 0.4);
  background: linear-gradient(135deg, #0065F8 0%, #4300FF 100%);
}

.btn-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0, 202, 255, 0.4), transparent);
  transition: left 0.5s;
}

.btn-cta-primary:hover .btn-shine {
  left: 100%;
}

.btn-cta-secondary {
  display: inline-flex;
  align-items: center;
  padding: 1.25rem 2.5rem;
  background: transparent;
  border: 2px solid #4300FF;
  color: #4300FF;
  text-decoration: none;
  border-radius: 0.75rem;
  font-weight: 600;
  transition: var(--transition-smooth);
}

.btn-cta-secondary:hover {
  background: #4300FF;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(67, 0, 255, 0.3);
}

.trust-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
}

.trust-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
}

.trust-icon {
  font-size: 1.25rem;
}

/* Animations AOS */
[data-aos] {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s ease;
}

[data-aos].aos-animate {
  opacity: 1;
  transform: translateY(0);
}

/* Responsive */
@media (max-width: 768px) {
  .hero-content {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .hero-actions {
    justify-content: center;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .portfolio-grid {
    grid-template-columns: 1fr;
  }
  
  .cta-actions {
    flex-direction: column;
    align-items: center;
  }
}
</style>
