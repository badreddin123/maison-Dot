import { ref } from 'vue'

export interface ToastOptions {
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  autoClose?: boolean
}

interface Toast extends ToastOptions {
  id: string
  show: boolean
  createdAt: number
}

const toasts = ref<Toast[]>([])
let toastIdCounter = 0

export const useToast = () => {
  const show = (options: ToastOptions): string => {
    const id = `toast-${++toastIdCounter}`
    const toast: Toast = {
      id,
      ...options,
      show: true,
      createdAt: Date.now(),
      duration: options.duration ?? (options.type === 'error' ? 6000 : 4000),
      autoClose: options.autoClose ?? true
    }

    toasts.value.push(toast)

    // Limiter le nombre de toasts affichés simultanément
    if (toasts.value.length > 5) {
      const oldestToast = toasts.value[0]
      remove(oldestToast.id)
    }

    return id
  }

  const success = (title: string, message?: string, options?: Partial<ToastOptions>): string => {
    return show({
      type: 'success',
      title,
      message,
      ...options
    })
  }

  const error = (title: string, message?: string, options?: Partial<ToastOptions>): string => {
    return show({
      type: 'error',
      title,
      message,
      ...options
    })
  }

  const warning = (title: string, message?: string, options?: Partial<ToastOptions>): string => {
    return show({
      type: 'warning',
      title,
      message,
      ...options
    })
  }

  const info = (title: string, message?: string, options?: Partial<ToastOptions>): string => {
    return show({
      type: 'info',
      title,
      message,
      ...options
    })
  }

  const remove = (id: string) => {
    const index = toasts.value.findIndex(toast => toast.id === id)
    if (index > -1) {
      toasts.value[index].show = false
      // Supprimer complètement après l'animation
      setTimeout(() => {
        const currentIndex = toasts.value.findIndex(toast => toast.id === id)
        if (currentIndex > -1) {
          toasts.value.splice(currentIndex, 1)
        }
      }, 300)
    }
  }

  const clear = () => {
    toasts.value.forEach(toast => {
      toast.show = false
    })
    // Nettoyer après les animations
    setTimeout(() => {
      toasts.value.splice(0)
    }, 300)
  }

  // Méthodes de convenance pour l'export
  const exportSuccess = (count: number, format: string) => {
    return success(
      'Export réussi',
      `${count} facture${count > 1 ? 's' : ''} exportée${count > 1 ? 's' : ''} au format ${format}`,
      { duration: 5000 }
    )
  }

  const exportError = (message?: string) => {
    return error(
      'Erreur d\'export',
      message || 'Une erreur est survenue lors de l\'export des factures',
      { duration: 7000 }
    )
  }

  const exportProgress = (message: string) => {
    return info(
      'Export en cours',
      message,
      { autoClose: false }
    )
  }

  return {
    toasts: toasts.value,
    show,
    success,
    error,
    warning,
    info,
    remove,
    clear,
    // Méthodes spécialisées pour l'export
    exportSuccess,
    exportError,
    exportProgress
  }
}
