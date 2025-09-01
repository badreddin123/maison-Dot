<template>
  <footer class="app-footer">
    <div class="footer-container">
      <!-- Section principale -->
      <div class="footer-main">
        <!-- Marque et description -->
        <div class="footer-brand">
          <div class="brand-container">
            <div class="logo-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
              </svg>
            </div>
            <span class="brand-text">Karya</span>
          </div>
          <p class="brand-description">
            La plateforme de référence pour créer des designs architecturaux exceptionnels avec des outils professionnels et une interface intuitive.
          </p>
        </div>

        <!-- Liens de navigation -->
        <div class="footer-links">
          <div class="link-group">
            <h4 class="group-title">Produit</h4>
            <ul class="link-list">
              <li><a href="#" class="footer-link">Fonctionnalités</a></li>
              <li><a href="#" class="footer-link">Tarifs</a></li>
              <li><a href="#" class="footer-link">Galerie</a></li>
              <li><a href="#" class="footer-link">Modèles</a></li>
            </ul>
          </div>

          <div class="link-group">
            <h4 class="group-title">Ressources</h4>
            <ul class="link-list">
              <li><a href="#" class="footer-link">Documentation</a></li>
              <li><a href="#" class="footer-link">Tutoriels</a></li>
              <li><a href="#" class="footer-link">Blog</a></li>
              <li><a href="#" class="footer-link">Support</a></li>
            </ul>
          </div>

          <div class="link-group">
            <h4 class="group-title">Entreprise</h4>
            <ul class="link-list">
              <li><a href="#" class="footer-link">À propos</a></li>
              <li><a href="#" class="footer-link">Carrières</a></li>
              <li><a href="#" class="footer-link">Partenaires</a></li>
              <li><a href="#" class="footer-link">Contact</a></li>
            </ul>
          </div>

          <div class="link-group">
            <h4 class="group-title">Légal</h4>
            <ul class="link-list">
              <li><a href="#" class="footer-link">Confidentialité</a></li>
              <li><a href="#" class="footer-link">Conditions</a></li>
              <li><a href="#" class="footer-link">Cookies</a></li>
              <li><a href="#" class="footer-link">RGPD</a></li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Section inférieure -->
      <div class="footer-bottom">
        <div class="footer-bottom-content">
          <p class="copyright">
            © {{ currentYear }} HomeDesign Pro. Tous droits réservés.
          </p>
          
          <div class="social-links">
            <a href="#" class="social-link" aria-label="Twitter">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </a>
            
            <a href="#" class="social-link" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            
            <a href="#" class="social-link" aria-label="GitHub">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear())
</script>

<script lang="ts">
export default {
  name: 'AppFooter'
}
</script>

<style scoped>
/* Import du thème moderne */
@import url('../../assets/cyber-theme.css');

.app-footer {
  background: linear-gradient(135deg, #4300FF 0%, #0065F8 50%, #00CAFF 100%);
  color: white;
  padding: 4rem 0 2rem;
  box-shadow: 0 -4px 20px rgba(67, 0, 255, 0.15);
}

.footer-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

.footer-main {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 4rem;
  margin-bottom: 3rem;
}

.footer-brand {
  max-width: 400px;
}

.brand-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.logo-icon {
  width: 2.5rem;
  height: 2.5rem;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 15px rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.logo-icon svg {
  width: 1.5rem;
  height: 1.5rem;
  stroke: currentColor;
}

.brand-text {
  font-size: 1.5rem;
  font-weight: 800;
  color: white;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.brand-description {
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
  font-size: 0.95rem;
}

.footer-links {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
}

.link-group {
  display: flex;
  flex-direction: column;
}

.group-title {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: white;
}

.link-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.footer-link {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-size: 0.875rem;
  transition: all 0.3s ease;
}

.footer-link:hover {
  color: white;
  opacity: 1;
  text-shadow: 0 2px 8px rgba(255, 255, 255, 0.3);
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 2rem;
}

.footer-bottom-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.copyright {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.875rem;
  margin: 0;
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-link {
  width: 2.5rem;
  height: 2.5rem;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
  text-decoration: none;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.social-link:hover {
  background: rgba(255, 255, 255, 0.25);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.4);
}

.social-link svg {
  width: 1.25rem;
  height: 1.25rem;
}

/* Responsive */
@media (max-width: 1024px) {
  .footer-main {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
  
  .footer-links {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .app-footer {
    padding: 3rem 0 1.5rem;
  }
  
  .footer-container {
    padding: 0 1rem;
  }
  
  .footer-links {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .footer-bottom-content {
    flex-direction: column;
    gap: 1.5rem;
    text-align: center;
  }
  
  .social-links {
    justify-content: center;
  }
}
</style>