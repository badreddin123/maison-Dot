import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface RentalData {
  id: number
  start_date: string
  end_date: string
  total_price: number
  monthly_rent: number
  payment_status: 'paid' | 'pending' | 'overdue' | 'cancelled'
  property?: {
    id: number
    title: string
    type: 'house' | 'apartment' | 'office'
    address: string
    images?: string[]
  }
  client?: {
    id: number
    name: string
    email: string
  }
}

export const useRentalHistoryStore = defineStore('rentalHistory', () => {
  const clientRentals = ref<RentalData[]>([])
  const managerRentals = ref<RentalData[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Données factices pour la démonstration
  const mockClientRentals: RentalData[] = [
    {
      id: 1,
      start_date: '2024-01-01',
      end_date: '2024-12-31',
      total_price: 14400,
      monthly_rent: 1200,
      payment_status: 'paid',
      property: {
        id: 1,
        title: 'Villa Moderne Centre-Ville',
        type: 'house',
        address: '123 Rue de la Paix, Paris',
        images: ['/images/villa-moderne.jpg']
      }
    },
    {
      id: 2,
      start_date: '2023-06-01',
      end_date: '2024-05-31',
      total_price: 9600,
      monthly_rent: 800,
      payment_status: 'paid',
      property: {
        id: 2,
        title: 'Appartement Lumineux',
        type: 'apartment',
        address: '456 Avenue des Champs, Lyon',
        images: ['/images/appartement-lumineux.jpg']
      }
    },
    {
      id: 3,
      start_date: '2024-03-01',
      end_date: '2025-02-28',
      total_price: 18000,
      monthly_rent: 1500,
      payment_status: 'pending',
      property: {
        id: 3,
        title: 'Bureau Moderne',
        type: 'office',
        address: '789 Boulevard du Commerce, Marseille',
        images: ['/images/bureau-moderne.jpg']
      }
    },
    {
      id: 4,
      start_date: '2023-01-01',
      end_date: '2023-12-31',
      total_price: 10800,
      monthly_rent: 900,
      payment_status: 'paid',
      property: {
        id: 4,
        title: 'Maison de Campagne',
        type: 'house',
        address: '321 Chemin Rural, Bordeaux',
        images: ['/images/maison-campagne.jpg']
      }
    },
    {
      id: 5,
      start_date: '2024-07-01',
      end_date: '2025-06-30',
      total_price: 7200,
      monthly_rent: 600,
      payment_status: 'paid',
      property: {
        id: 5,
        title: 'Studio Centre Historique',
        type: 'apartment',
        address: '654 Place Bellecour, Lyon',
        images: ['/images/studio-historique.jpg']
      }
    }
  ]

  const mockManagerRentals: RentalData[] = [
    ...mockClientRentals,
    {
      id: 6,
      start_date: '2024-02-01',
      end_date: '2025-01-31',
      total_price: 21600,
      monthly_rent: 1800,
      payment_status: 'paid',
      property: {
        id: 6,
        title: 'Loft Industriel',
        type: 'office',
        address: '987 Rue de l\'Industrie, Lille',
        images: ['/images/loft-industriel.jpg']
      },
      client: {
        id: 2,
        name: 'Marie Dubois',
        email: 'marie.dubois@email.com'
      }
    },
    {
      id: 7,
      start_date: '2023-09-01',
      end_date: '2024-08-31',
      total_price: 13200,
      monthly_rent: 1100,
      payment_status: 'overdue',
      property: {
        id: 7,
        title: 'Penthouse Vue Mer',
        type: 'apartment',
        address: '147 Corniche Kennedy, Nice',
        images: ['/images/penthouse-mer.jpg']
      },
      client: {
        id: 3,
        name: 'Pierre Martin',
        email: 'pierre.martin@email.com'
      }
    }
  ]

  const fetchClientRentals = async () => {
    isLoading.value = true
    error.value = null

    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 1000))
      clientRentals.value = mockClientRentals
    } catch (err) {
      error.value = 'Erreur lors du chargement de l\'historique des loyers'
      console.error('Erreur fetch client rentals:', err)
    } finally {
      isLoading.value = false
    }
  }

  const fetchManagerRentals = async () => {
    isLoading.value = true
    error.value = null

    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 1000))
      managerRentals.value = mockManagerRentals
    } catch (err) {
      error.value = 'Erreur lors du chargement de l\'historique des loyers'
      console.error('Erreur fetch manager rentals:', err)
    } finally {
      isLoading.value = false
    }
  }

  const addRental = (rental: Omit<RentalData, 'id'>) => {
    const newRental: RentalData = {
      ...rental,
      id: Date.now() // ID temporaire
    }
    
    clientRentals.value.push(newRental)
    managerRentals.value.push(newRental)
  }

  const updateRentalPaymentStatus = (rentalId: number, status: RentalData['payment_status']) => {
    const updateRental = (rentals: RentalData[]) => {
      const index = rentals.findIndex(r => r.id === rentalId)
      if (index !== -1) {
        rentals[index].payment_status = status
      }
    }

    updateRental(clientRentals.value)
    updateRental(managerRentals.value)
  }

  const getRentalById = (id: number): RentalData | undefined => {
    return clientRentals.value.find(rental => rental.id === id) ||
           managerRentals.value.find(rental => rental.id === id)
  }

  const getRentalsByProperty = (propertyId: number): RentalData[] => {
    return managerRentals.value.filter(rental => rental.property?.id === propertyId)
  }

  const getRentalsByClient = (clientId: number): RentalData[] => {
    return managerRentals.value.filter(rental => rental.client?.id === clientId)
  }

  const getTotalRentByPeriod = (startDate: string, endDate: string): number => {
    return clientRentals.value
      .filter(rental => {
        const rentalStart = new Date(rental.start_date)
        const rentalEnd = new Date(rental.end_date)
        const periodStart = new Date(startDate)
        const periodEnd = new Date(endDate)

        return (rentalStart <= periodEnd && rentalEnd >= periodStart)
      })
      .reduce((total, rental) => total + rental.total_price, 0)
  }

  const getPaymentStatistics = () => {
    const stats = {
      paid: 0,
      pending: 0,
      overdue: 0,
      cancelled: 0
    }

    clientRentals.value.forEach(rental => {
      stats[rental.payment_status]++
    })

    return stats
  }

  return {
    // State
    clientRentals,
    managerRentals,
    isLoading,
    error,

    // Actions
    fetchClientRentals,
    fetchManagerRentals,
    addRental,
    updateRentalPaymentStatus,

    // Getters
    getRentalById,
    getRentalsByProperty,
    getRentalsByClient,
    getTotalRentByPeriod,
    getPaymentStatistics
  }
})
