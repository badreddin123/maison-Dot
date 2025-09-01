import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeViewPro.vue'
import RegisterView from '../views/auth/RegisterViewPro.vue'
import LoginView from '../views/auth/LoginViewPro.vue'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { requiresGuest: true }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresGuest: true }
    },
    {
      path: '/pending-approval',
      name: 'pending-approval',
      component: () => import('../views/auth/PendingApprovalView.vue'),
      meta: { requiresAuth: true, requiresPending: true }
    },
    // Routes Client
    {
      path: '/client',
      meta: { requiresAuth: true, requiresRole: 'client' },
      children: [
        {
          path: 'dashboard',
          name: 'client-dashboard',
          component: () => import('../views/client/ClientDashboard.vue')
        },
        {
          path: 'properties',
          name: 'client-properties',
          component: () => import('../views/client/PropertiesView.vue')
        },
        {
          path: 'properties/:id',
          name: 'property-detail',
          component: () => import('../views/client/PropertyDetail.vue')
        },
        {
          path: 'bookings',
          name: 'client-bookings',
          component: () => import('../views/client/BookingsView.vue')
        },
        {
          path: 'profile',
          name: 'client-profile',
          component: () => import('../views/client/ProfileView.vue')
        }
      ]
    },
    // Routes Manager
    {
      path: '/manager',
      meta: { requiresAuth: true, requiresRole: 'manager' },
      children: [
        {
          path: 'dashboard',
          name: 'manager-dashboard',
          component: () => import('../views/manager/ManagerDashboard.vue')
        },
        {
          path: 'properties',
          name: 'manager-properties',
          component: () => import('../views/manager/PropertiesManagement.vue')
        },
        {
          path: 'properties/add',
          name: 'add-property',
          component: () => import('../views/manager/AddProperty.vue')
        },
        {
          path: 'properties/:id/edit',
          name: 'edit-property',
          component: () => import('../views/manager/EditProperty.vue')
        },
        {
          path: 'bookings',
          name: 'manager-bookings',
          component: () => import('../views/manager/BookingsManagement.vue')
        },
        {
          path: 'profile',
          name: 'manager-profile',
          component: () => import('../views/manager/ProfileView.vue')
        }
      ]
    },
    // Routes Admin
    {
      path: '/admin',
      meta: { requiresAuth: true, requiresRole: 'admin' },
      children: [
        {
          path: 'dashboard',
          name: 'admin-dashboard',
          component: () => import('../views/admin/AdminDashboard.vue')
        },
        {
          path: 'users',
          name: 'admin-users',
          component: () => import('../views/admin/UsersManagement.vue')
        },
        {
          path: 'pending-managers',
          name: 'admin-pending-managers',
          component: () => import('../views/admin/PendingManagers.vue')
        },
        {
          path: 'properties',
          name: 'admin-properties',
          component: () => import('../views/admin/PropertiesOverview.vue')
        },
        {
          path: 'bookings',
          name: 'admin-bookings',
          component: () => import('../views/admin/BookingsOverview.vue')
        },
        {
          path: 'reports',
          name: 'admin-reports',
          component: () => import('../views/admin/ReportsView.vue')
        }
      ]
    },
    // Route de démonstration de la palette de couleurs (temporaire)
    {
      path: '/color-demo',
      name: 'color-demo',
      component: () => import('../components/ColorPaletteDemo.vue')
    },
    // Redirection par défaut
    {
      path: '/dashboard',
      redirect: () => {
        const authStore = useAuthStore()
        const role = authStore.userRole
        if (role === 'admin') return '/admin/dashboard'
        if (role === 'manager') return '/manager/dashboard'
        return '/client/dashboard'
      }
    }
  ],
})

// Navigation guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Check if route requires authentication
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
    return
  }
  
  // Check if route requires guest (not authenticated)
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/dashboard')
    return
  }
  
  // Check if user is authenticated for role-based routes
  if (authStore.isAuthenticated) {
    // Check if route requires pending status
    if (to.meta.requiresPending && !authStore.isPending) {
      next('/dashboard')
      return
    }
    
    // Check if route requires specific role
    if (to.meta.requiresRole && authStore.userRole !== to.meta.requiresRole) {
      next('/dashboard')
      return
    }
    
    // Prevent pending users from accessing non-pending routes
    if (authStore.isPending && !to.meta.requiresPending && to.path !== '/pending-approval') {
      next('/pending-approval')
      return
    }
    
    // Prevent suspended users from accessing anything except logout
    if (authStore.isSuspended) {
      authStore.logout()
      return
    }
  }
  
  next()
})

export default router
