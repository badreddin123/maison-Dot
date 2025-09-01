import jsPDF from 'jspdf'
import type { Booking } from '../stores/bookings'

export interface InvoiceData {
  invoiceNumber: string
  issueDate: string
  dueDate: string
  companyInfo: {
    name: string
    address: string
    city: string
    postalCode: string
    country: string
    phone: string
    email: string
    website: string
  }
  clientInfo: {
    name: string
    email: string
    phone?: string
  }
  bookingDetails: {
    propertyTitle: string
    propertyAddress: string
    checkIn: string
    checkOut: string
    nights: number
    guests: number
    pricePerNight: number
    subtotal: number
    taxes: number
    total: number
  }
  paymentInfo?: {
    method: string
    status: string
    paidAt?: string
  }
}

class InvoiceService {
  private generateInvoiceNumber(): string {
    const date = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    return `INV-${year}${month}${day}-${random}`
  }

  private formatDate(date: Date): string {
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  private calculateNights(startDate: string, endDate: string): number {
    const start = new Date(startDate)
    const end = new Date(endDate)
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  }

  public createInvoiceData(booking: Booking): InvoiceData {
    const issueDate = new Date()
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + 30) // 30 jours pour payer

    const nights = this.calculateNights(booking.start_date, booking.end_date)
    const pricePerNight = booking.total_price / nights
    const subtotal = booking.total_price
    const taxes = subtotal * 0.20 // TVA 20%
    const total = subtotal + taxes

    return {
      invoiceNumber: this.generateInvoiceNumber(),
      issueDate: this.formatDate(issueDate),
      dueDate: this.formatDate(dueDate),
      companyInfo: {
        name: 'HomeDesign Rentals',
        address: '123 Rue de la Location',
        city: 'Paris',
        postalCode: '75001',
        country: 'France',
        phone: '+33 1 23 45 67 89',
        email: 'contact@homedesign-rentals.com',
        website: 'www.homedesign-rentals.com'
      },
      clientInfo: {
        name: booking.client?.name || 'Client',
        email: booking.client?.email || '',
        phone: booking.client?.phone
      },
      bookingDetails: {
        propertyTitle: booking.property?.title || 'Propriété',
        propertyAddress: booking.property?.address || '',
        checkIn: this.formatDate(new Date(booking.start_date)),
        checkOut: this.formatDate(new Date(booking.end_date)),
        nights,
        guests: booking.guests || 2,
        pricePerNight,
        subtotal,
        taxes,
        total
      }
    }
  }

  public generatePDF(invoiceData: InvoiceData): jsPDF {
    const pdf = new jsPDF()
    const pageWidth = pdf.internal.pageSize.width
    const pageHeight = pdf.internal.pageSize.height
    let yPosition = 20

    // Couleurs
    const primaryColor = '#4300FF'
    const secondaryColor = '#0065F8'
    const textColor = '#1E293B'
    const grayColor = '#64748B'

    // En-tête avec logo et informations de l'entreprise
    pdf.setFillColor(67, 0, 255)
    pdf.rect(0, 0, pageWidth, 40, 'F')
    
    // Titre de l'entreprise
    pdf.setTextColor(255, 255, 255)
    pdf.setFontSize(24)
    pdf.setFont('helvetica', 'bold')
    pdf.text('HomeDesign Rentals', 20, 25)
    
    // Numéro de facture
    pdf.setFontSize(14)
    pdf.setFont('helvetica', 'normal')
    pdf.text(`Facture ${invoiceData.invoiceNumber}`, pageWidth - 20, 25, { align: 'right' })

    yPosition = 60

    // Informations de l'entreprise
    pdf.setTextColor(30, 41, 59)
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')
    
    const companyLines = [
      invoiceData.companyInfo.name,
      invoiceData.companyInfo.address,
      `${invoiceData.companyInfo.postalCode} ${invoiceData.companyInfo.city}`,
      invoiceData.companyInfo.country,
      `Tél: ${invoiceData.companyInfo.phone}`,
      `Email: ${invoiceData.companyInfo.email}`,
      invoiceData.companyInfo.website
    ]

    companyLines.forEach((line, index) => {
      pdf.text(line, 20, yPosition + (index * 5))
    })

    // Informations du client
    pdf.setFont('helvetica', 'bold')
    pdf.text('Facturé à:', pageWidth - 80, yPosition)
    pdf.setFont('helvetica', 'normal')
    
    const clientLines = [
      invoiceData.clientInfo.name,
      invoiceData.clientInfo.email,
      invoiceData.clientInfo.phone || ''
    ].filter(line => line.trim() !== '')

    clientLines.forEach((line, index) => {
      pdf.text(line, pageWidth - 80, yPosition + 10 + (index * 5))
    })

    yPosition += 60

    // Dates
    pdf.setFont('helvetica', 'bold')
    pdf.text('Date d\'émission:', 20, yPosition)
    pdf.setFont('helvetica', 'normal')
    pdf.text(invoiceData.issueDate, 60, yPosition)

    pdf.setFont('helvetica', 'bold')
    pdf.text('Date d\'échéance:', pageWidth - 80, yPosition)
    pdf.setFont('helvetica', 'normal')
    pdf.text(invoiceData.dueDate, pageWidth - 40, yPosition, { align: 'right' })

    yPosition += 20

    // Détails de la réservation
    pdf.setFillColor(248, 250, 252)
    pdf.rect(15, yPosition, pageWidth - 30, 8, 'F')
    
    pdf.setTextColor(67, 0, 255)
    pdf.setFontSize(12)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Détails de la réservation', 20, yPosition + 6)

    yPosition += 20

    pdf.setTextColor(30, 41, 59)
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')

    const bookingDetails = [
      ['Propriété:', invoiceData.bookingDetails.propertyTitle],
      ['Adresse:', invoiceData.bookingDetails.propertyAddress],
      ['Check-in:', invoiceData.bookingDetails.checkIn],
      ['Check-out:', invoiceData.bookingDetails.checkOut],
      ['Nombre de nuits:', invoiceData.bookingDetails.nights.toString()],
      ['Nombre d\'invités:', invoiceData.bookingDetails.guests.toString()]
    ]

    bookingDetails.forEach(([label, value], index) => {
      pdf.setFont('helvetica', 'bold')
      pdf.text(label, 20, yPosition + (index * 6))
      pdf.setFont('helvetica', 'normal')
      pdf.text(value, 80, yPosition + (index * 6))
    })

    yPosition += 50

    // Tableau des coûts
    const tableTop = yPosition
    const tableHeaders = ['Description', 'Quantité', 'Prix unitaire', 'Total']
    const columnWidths = [80, 30, 40, 40]
    const columnPositions = [20, 100, 130, 170]

    // En-tête du tableau
    pdf.setFillColor(67, 0, 255)
    pdf.rect(15, tableTop, pageWidth - 30, 10, 'F')
    
    pdf.setTextColor(255, 255, 255)
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'bold')
    
    tableHeaders.forEach((header, index) => {
      pdf.text(header, columnPositions[index], tableTop + 7)
    })

    // Ligne de données
    yPosition = tableTop + 15
    pdf.setTextColor(30, 41, 59)
    pdf.setFont('helvetica', 'normal')

    const tableData = [
      [
        `Séjour - ${invoiceData.bookingDetails.propertyTitle}`,
        `${invoiceData.bookingDetails.nights} nuits`,
        this.formatCurrency(invoiceData.bookingDetails.pricePerNight),
        this.formatCurrency(invoiceData.bookingDetails.subtotal)
      ]
    ]

    tableData.forEach((row, rowIndex) => {
      const rowY = yPosition + (rowIndex * 8)
      
      // Ligne alternée
      if (rowIndex % 2 === 0) {
        pdf.setFillColor(248, 250, 252)
        pdf.rect(15, rowY - 2, pageWidth - 30, 8, 'F')
      }
      
      row.forEach((cell, cellIndex) => {
        const align = cellIndex >= 2 ? 'right' : 'left'
        const x = cellIndex >= 2 ? columnPositions[cellIndex] + columnWidths[cellIndex] - 5 : columnPositions[cellIndex]
        pdf.text(cell, x, rowY + 4, { align })
      })
    })

    yPosition += 25

    // Totaux
    const totalsX = pageWidth - 90
    
    // Sous-total
    pdf.setFont('helvetica', 'normal')
    pdf.text('Sous-total:', totalsX, yPosition)
    pdf.text(this.formatCurrency(invoiceData.bookingDetails.subtotal), pageWidth - 20, yPosition, { align: 'right' })
    
    yPosition += 8
    
    // TVA
    pdf.text('TVA (20%):', totalsX, yPosition)
    pdf.text(this.formatCurrency(invoiceData.bookingDetails.taxes), pageWidth - 20, yPosition, { align: 'right' })
    
    yPosition += 12
    
    // Total
    pdf.setFillColor(67, 0, 255)
    pdf.rect(totalsX - 5, yPosition - 5, 85, 10, 'F')
    
    pdf.setTextColor(255, 255, 255)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Total à payer:', totalsX, yPosition + 2)
    pdf.text(this.formatCurrency(invoiceData.bookingDetails.total), pageWidth - 20, yPosition + 2, { align: 'right' })

    yPosition += 30

    // Conditions de paiement
    pdf.setTextColor(100, 116, 139)
    pdf.setFontSize(9)
    pdf.setFont('helvetica', 'normal')
    
    const paymentTerms = [
      'Conditions de paiement:',
      '• Le paiement est dû dans les 30 jours suivant la date d\'émission',
      '• En cas de retard de paiement, des pénalités pourront être appliquées',
      '• Pour toute question, contactez-nous à contact@homedesign-rentals.com'
    ]

    paymentTerms.forEach((term, index) => {
      const font = index === 0 ? 'bold' : 'normal'
      pdf.setFont('helvetica', font)
      pdf.text(term, 20, yPosition + (index * 5))
    })

    // Pied de page
    const footerY = pageHeight - 20
    pdf.setFillColor(67, 0, 255)
    pdf.rect(0, footerY - 5, pageWidth, 25, 'F')
    
    pdf.setTextColor(255, 255, 255)
    pdf.setFontSize(8)
    pdf.setFont('helvetica', 'normal')
    pdf.text('HomeDesign Rentals - Votre partenaire location de confiance', pageWidth / 2, footerY, { align: 'center' })

    return pdf
  }

  public downloadInvoice(booking: Booking): void {
    try {
      const invoiceData = this.createInvoiceData(booking)
      const pdf = this.generatePDF(invoiceData)
      
      const fileName = `facture-${invoiceData.invoiceNumber}-${booking.client?.name?.replace(/\s+/g, '-') || 'client'}.pdf`
      pdf.save(fileName)
    } catch (error) {
      console.error('Erreur lors de la génération de la facture:', error)
      throw new Error('Impossible de générer la facture')
    }
  }

  public previewInvoice(booking: Booking): string {
    try {
      const invoiceData = this.createInvoiceData(booking)
      const pdf = this.generatePDF(invoiceData)
      
      return pdf.output('datauristring')
    } catch (error) {
      console.error('Erreur lors de l\'aperçu de la facture:', error)
      throw new Error('Impossible de générer l\'aperçu de la facture')
    }
  }
}

export const invoiceService = new InvoiceService()
export default invoiceService
