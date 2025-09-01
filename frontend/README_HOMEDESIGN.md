# HomeDesign Pro - Plateforme de Design de Maison

## 🏠 Description

HomeDesign Pro est une plateforme professionnelle de design d'intérieur et d'architecture qui permet aux utilisateurs de créer, visualiser et partager leurs projets de design de maison. L'application offre une interface moderne avec des animations fluides et une expérience utilisateur exceptionnelle.

## ✨ Fonctionnalités

### 🎨 Design et Interface
- **Interface moderne** avec animations fluides et transitions
- **Design responsive** adapté à tous les écrans
- **Thème professionnel** avec dégradés et ombres élégantes
- **Navigation intuitive** avec menu hamburger mobile

### 🔐 Authentification
- **Inscription/Connexion sécurisée** avec validation des formulaires
- **Gestion des sessions** avec Pinia store
- **Protection des routes** avec navigation guards
- **Intégration API** Laravel Sanctum

### 📊 Dashboard
- **Statistiques en temps réel** des projets
- **Gestion des projets** avec statuts visuels
- **Actions rapides** pour créer et gérer
- **Activité récente** et conseils

### 🏗️ Fonctionnalités de Design
- **Projets 3D interactifs** (à venir)
- **Bibliothèque de meubles** (à venir)
- **Rendu photoréaliste** (à venir)
- **Collaboration en temps réel** (à venir)

## 🛠️ Technologies Utilisées

### Frontend
- **Vue.js 3** - Framework JavaScript progressif
- **TypeScript** - Typage statique
- **Pinia** - Gestion d'état moderne
- **Vue Router** - Routage SPA
- **Tailwind CSS** - Framework CSS utilitaire
- **Vite** - Build tool moderne

### Backend (Existant)
- **Laravel 11** - Framework PHP
- **Laravel Sanctum** - Authentification API
- **MySQL** - Base de données

## 🚀 Installation et Configuration

### Prérequis
- Node.js 18+ 
- NPM ou Yarn
- PHP 8.1+
- Composer
- MySQL

### Installation Frontend

```bash
# Cloner le projet
cd frontend

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev

# Build pour la production
npm run build
```

### Configuration API

Le frontend est configuré pour communiquer avec l'API Laravel sur `http://127.0.0.1:8000`.

Modifiez `src/services/api.ts` si nécessaire :

```typescript
const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000', // URL de votre API Laravel
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false,
});
```

## 📁 Structure du Projet

```
frontend/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppHeader.vue    # Navigation principale
│   │   │   └── AppFooter.vue    # Pied de page
│   │   └── ...
│   ├── views/
│   │   ├── HomeView.vue         # Page d'accueil
│   │   └── auth/
│   │       ├── LoginView.vue    # Connexion
│   │       ├── RegisterView.vue # Inscription
│   │       └── DashboardView.vue # Tableau de bord
│   ├── stores/
│   │   └── auth.ts             # Store d'authentification
│   ├── services/
│   │   └── api.ts              # Configuration Axios
│   ├── router/
│   │   └── index.ts            # Configuration des routes
│   └── assets/
│       └── main.css            # Styles principaux
├── tailwind.config.js          # Configuration Tailwind
└── package.json
```

## 🎯 Fonctionnalités Clés

### Page d'Accueil
- Hero section avec animations de blob
- Présentation des fonctionnalités
- Témoignages clients
- Call-to-action attractifs

### Authentification
- Formulaires de connexion/inscription stylés
- Validation côté client
- Indicateur de force du mot de passe
- Gestion des erreurs

### Dashboard
- Vue d'ensemble des projets
- Statistiques personnalisées
- Actions rapides
- Interface moderne et intuitive

## 🔧 API Endpoints Utilisés

```typescript
// Authentification
POST /api/register     // Inscription
POST /api/login        // Connexion
POST /api/logout       // Déconnexion
GET  /api/user         // Profil utilisateur

// Projets (à implémenter)
GET    /api/projects   // Liste des projets
POST   /api/projects   // Créer un projet
PUT    /api/projects/:id // Modifier un projet
DELETE /api/projects/:id // Supprimer un projet
```

## 🎨 Design System

### Couleurs Principales
- **Indigo** : `from-indigo-600 to-purple-600`
- **Gris** : `text-gray-900`, `bg-gray-50`
- **Blanc** : `bg-white`

### Animations
- **Blob** : Animation fluide des éléments de fond
- **Float** : Animation de flottement
- **Fade-in-up** : Apparition depuis le bas

### Composants
- Boutons avec gradients et hover effects
- Cards avec ombres et bordures arrondies
- Formulaires avec validation visuelle
- Navigation responsive

## 🚀 Prochaines Étapes

1. **Intégration 3D** avec Three.js
2. **Système de projets** complet
3. **Bibliothèque de meubles** 
4. **Collaboration temps réel** avec WebSockets
5. **Export PDF/Images** des designs
6. **Réalité augmentée** pour visualisation

## 📝 Utilisation

### Créer un Compte
1. Cliquez sur "S'inscrire" 
2. Remplissez le formulaire
3. Validez votre email (si configuré)

### Créer un Projet
1. Connectez-vous à votre compte
2. Cliquez sur "Nouveau Projet" 
3. Configurez votre projet
4. Commencez à designer !

### Navigation
- **Accueil** : Présentation de la plateforme
- **Dashboard** : Gestion de vos projets
- **Profil** : Paramètres du compte

## 🔒 Sécurité

- Authentification sécurisée avec Laravel Sanctum
- Validation des formulaires côté client et serveur
- Protection CSRF
- Hachage sécurisé des mots de passe
- Sessions sécurisées

## 📱 Responsive Design

L'application est entièrement responsive et s'adapte à :
- **Desktop** : Interface complète
- **Tablet** : Navigation adaptée
- **Mobile** : Menu hamburger et layout optimisé

## 🎉 Conclusion

HomeDesign Pro offre une base solide pour une plateforme de design professionnel avec une interface moderne, une authentification sécurisée et une architecture évolutive. La plateforme est prête pour l'ajout de fonctionnalités avancées de design 3D et de collaboration.

---

**Développé avec ❤️ pour créer la maison de vos rêves !**
