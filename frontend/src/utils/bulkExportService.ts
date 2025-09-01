import * as XLSX from 'xlsx'
import JSZip from 'jszip'

export interface ExportOptions {
  format: 'separate' | 'combined' | 'excel'
  dateFilter?: {
    start?: string
    end?: string
  }
  companyInfo: {
    name: string
    address: string
    phone: string
    email: string
    siret: string
    tva: string
  }
}

export interface BookingExportData {
  id: number
  start_date: string
  end_date: string
  total_price: number
  status: string
  guests: number
  client?: {
    name: string
    email: string
    phone?: string
  }
  property?: {
    title: string
    price_per_night: number
    type: string
    address?: string
  }
}

export class BulkExportService {
  static async exportBookings(
    bookings: BookingExportData[],
    options: ExportOptions,
    onProgress?: (progress: number, status: string) => void
  ): Promise<void> {
    switch (options.format) {
      case 'separate':
        await this.exportSeparateFiles(bookings, options, onProgress)
        break
      case 'combined':
        await this.exportCombinedPDF(bookings, options, onProgress)
        break
      case 'excel':
        await this.exportExcelFile(bookings, options, onProgress)
        break
    }
  }

  private static async exportSeparateFiles(
    bookings: BookingExportData[],
    options: ExportOptions,
    onProgress?: (progress: number, status: string) => void
  ): Promise<void> {
    onProgress?.(0, 'Préparation de l\'archive...')
    
    const zip = new JSZip()
    const totalBookings = bookings.length
    
    for (let i = 0; i < totalBookings; i++) {
      const booking = bookings[i]
      const progress = Math.round(((i + 1) / totalBookings) * 90) // 90% pour la génération
      
      onProgress?.(progress, `Génération facture ${i + 1}/${totalBookings}: ${booking.property?.title}`)
      
      try {
        // Simuler la génération de PDF (dans un vrai projet, vous utiliseriez jsPDF)
        const pdfContent = await this.generatePDFContent(booking, options.companyInfo)
        
        const filename = `facture-${booking.id}-${this.sanitizeFilename(booking.client?.name || 'client')}.pdf`
        zip.file(filename, pdfContent)
        
        // Petite pause pour l'effet visuel
        await new Promise(resolve => setTimeout(resolve, 200))
      } catch (error) {
        console.error(`Erreur pour la facture ${booking.id}:`, error)
      }
    }

    onProgress?.(95, 'Compression de l\'archive...')
    
    // Générer et télécharger l'archive ZIP
    const zipContent = await zip.generateAsync({ type: 'blob' })
    this.downloadFile(zipContent, 'factures-export.zip')
    
    onProgress?.(100, 'Export terminé !')
  }

  private static async exportCombinedPDF(
    bookings: BookingExportData[],
    options: ExportOptions,
    onProgress?: (progress: number, status: string) => void
  ): Promise<void> {
    onProgress?.(25, 'Génération du document combiné...')
    
    // Ici vous pourriez utiliser jsPDF pour créer un document avec toutes les factures
    const combinedContent = await this.generateCombinedPDFContent(bookings, options.companyInfo)
    
    onProgress?.(75, 'Finalisation du document...')
    
    this.downloadFile(combinedContent, 'factures-combinees.pdf')
    
    onProgress?.(100, 'Document combiné généré !')
  }

  private static async exportExcelFile(
    bookings: BookingExportData[],
    options: ExportOptions,
    onProgress?: (progress: number, status: string) => void
  ): Promise<void> {
    onProgress?.(25, 'Préparation des données Excel...')
    
    // Données pour le tableau Excel
    const excelData = bookings.map(booking => ({
      'N° Réservation': booking.id,
      'Client': booking.client?.name || '',
      'Email': booking.client?.email || '',
      'Téléphone': booking.client?.phone || '',
      'Propriété': booking.property?.title || '',
      'Type': this.getPropertyTypeLabel(booking.property?.type || ''),
      'Date début': this.formatDate(booking.start_date),
      'Date fin': this.formatDate(booking.end_date),
      'Nuits': this.getDurationInNights(booking.start_date, booking.end_date),
      'Prix par nuit': booking.property?.price_per_night || 0,
      'Nombre invités': booking.guests,
      'Total': booking.total_price,
      'Statut': this.getStatusLabel(booking.status),
      'Statut original': booking.status
    }))

    onProgress?.(50, 'Création du fichier Excel...')

    // Créer le workbook
    const wb = XLSX.utils.book_new()
    
    // Feuille principale avec les données
    const ws = XLSX.utils.json_to_sheet(excelData)
    
    // Styliser les en-têtes (largeur des colonnes)
    const columnWidths = [
      { wch: 12 }, // N° Réservation
      { wch: 20 }, // Client
      { wch: 25 }, // Email
      { wch: 15 }, // Téléphone
      { wch: 30 }, // Propriété
      { wch: 12 }, // Type
      { wch: 12 }, // Date début
      { wch: 12 }, // Date fin
      { wch: 8 },  // Nuits
      { wch: 12 }, // Prix par nuit
      { wch: 10 }, // Invités
      { wch: 12 }, // Total
      { wch: 12 }, // Statut
      { wch: 0 }   // Statut original (caché)
    ]
    
    ws['!cols'] = columnWidths
    
    XLSX.utils.book_append_sheet(wb, ws, 'Réservations')
    
    // Ajouter une feuille de résumé
    const summaryData = this.generateSummaryData(bookings)
    const summaryWs = XLSX.utils.json_to_sheet(summaryData)
    XLSX.utils.book_append_sheet(wb, summaryWs, 'Résumé')

    onProgress?.(75, 'Génération du fichier...')
    
    // Générer et télécharger le fichier
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    
    this.downloadFile(blob, `reservations-export-${this.formatDate(new Date().toISOString())}.xlsx`)
    
    onProgress?.(100, 'Fichier Excel généré !')
  }

  private static generateSummaryData(bookings: BookingExportData[]) {
    const totalRevenue = bookings.reduce((sum, booking) => sum + booking.total_price, 0)
    const totalNights = bookings.reduce((sum, booking) => 
      sum + this.getDurationInNights(booking.start_date, booking.end_date), 0)
    
    const statusCounts = bookings.reduce((acc, booking) => {
      acc[booking.status] = (acc[booking.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const propertyTypes = bookings.reduce((acc, booking) => {
      const type = booking.property?.type || 'unknown'
      acc[type] = (acc[type] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return [
      { 'Statistique': 'Nombre total de réservations', 'Valeur': bookings.length },
      { 'Statistique': 'Revenus totaux', 'Valeur': totalRevenue },
      { 'Statistique': 'Total nuitées', 'Valeur': totalNights },
      { 'Statistique': 'Revenu moyen par réservation', 'Valeur': Math.round(totalRevenue / bookings.length) },
      { 'Statistique': '', 'Valeur': '' },
      { 'Statistique': 'Répartition par statut:', 'Valeur': '' },
      ...Object.entries(statusCounts).map(([status, count]) => ({
        'Statistique': `- ${this.getStatusLabel(status)}`,
        'Valeur': count
      })),
      { 'Statistique': '', 'Valeur': '' },
      { 'Statistique': 'Répartition par type de propriété:', 'Valeur': '' },
      ...Object.entries(propertyTypes).map(([type, count]) => ({
        'Statistique': `- ${this.getPropertyTypeLabel(type)}`,
        'Valeur': count
      }))
    ]
  }

  private static async generatePDFContent(booking: BookingExportData, _companyInfo: ExportOptions['companyInfo']): Promise<Blob> {
    // Simuler la génération de PDF
    // Dans un vrai projet, vous utiliseriez InvoiceService.generatePDF
    const content = `Facture pour ${booking.client?.name} - ${booking.property?.title}`
    return new Blob([content], { type: 'application/pdf' })
  }

  private static async generateCombinedPDFContent(bookings: BookingExportData[], _companyInfo: ExportOptions['companyInfo']): Promise<Blob> {
    // Simuler la génération de PDF combiné
    const content = `Document combiné avec ${bookings.length} factures`
    return new Blob([content], { type: 'application/pdf' })
  }

  private static downloadFile(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  private static sanitizeFilename(filename: string): string {
    return filename
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
      .replace(/[^a-zA-Z0-9\-_\.]/g, '-') // Remplacer les caractères spéciaux
      .replace(/-+/g, '-') // Éviter les tirets multiples
      .toLowerCase()
  }

  private static formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  private static getDurationInNights(startDate: string, endDate: string): number {
    const start = new Date(startDate)
    const end = new Date(endDate)
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  }

  private static getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      'pending': 'En attente',
      'confirmed': 'Confirmée',
      'completed': 'Terminée',
      'cancelled': 'Annulée'
    }
    return labels[status] || status
  }

  private static getPropertyTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      'house': 'Maison',
      'apartment': 'Appartement',
      'office': 'Bureau'
    }
    return labels[type] || type
  }
}
