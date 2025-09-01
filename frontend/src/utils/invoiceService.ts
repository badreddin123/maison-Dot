import jsPDF from 'jspdf'

export interface BookingData {
  id: number
  start_date: string
  end_date: string
  guests: number
  status: string
  special_requests?: string
  property?: {
    title: string
    address: string
    type: string
    price_per_night: number
  }
  client?: {
    name: string
    email: string
    phone?: string
  }
}

export interface InvoiceData {
  id: number
  invoice_number: string
  created_at: string
  due_date: string
  status: string
  paid_at?: string
  payment_method?: string
  payment_reference?: string
}

export interface InvoiceOptions {
  booking: BookingData
  invoiceData?: InvoiceData
  companyInfo?: {
    name: string
    address: string
    phone: string
    email: string
    siret: string
    tva: string
  }
}

export class InvoiceService {
  private static readonly DEFAULT_COMPANY_INFO = {
    name: 'PropertyRental',
    address: '123 Avenue des Propriétés\n75001 Paris, France',
    phone: '+33 1 23 45 67 89',
    email: 'contact@propertyrental.fr',
    siret: '123 456 789 00012',
    tva: 'FR12345678901'
  }

  static async generatePDF(options: InvoiceOptions): Promise<void> {
    const { booking, invoiceData, companyInfo = this.DEFAULT_COMPANY_INFO } = options
    
    // Créer un nouveau PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })

    // Configuration de base
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const margin = 20
    const contentWidth = pageWidth - 2 * margin
    let yPosition = margin

    // Couleurs
    const primaryColor = '#3b82f6'
    const textColor = '#1f2937'
    const secondaryColor = '#6b7280'

    // Fonctions utilitaires
    interface TextOptions {
      color?: string
      fontSize?: number
      fontStyle?: 'normal' | 'bold' | 'italic'
    }

    const addText = (text: string, x: number, y: number, options: TextOptions = {}) => {
      pdf.setTextColor(options.color || textColor)
      pdf.setFontSize(options.fontSize || 10)
      if (options.fontStyle) pdf.setFont('helvetica', options.fontStyle)
      pdf.text(text, x, y)
      if (options.fontStyle) pdf.setFont('helvetica', 'normal')
    }

    const addLine = (x1: number, y1: number, x2: number, y2: number, color: string = primaryColor) => {
      pdf.setDrawColor(color)
      pdf.setLineWidth(0.5)
      pdf.line(x1, y1, x2, y2)
    }

    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR'
      }).format(amount)
    }

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    }

    const getDurationInNights = (startDate: string, endDate: string) => {
      const start = new Date(startDate)
      const end = new Date(endDate)
      return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    }

    const getPropertyTypeLabel = (type: string) => {
      const labels: Record<string, string> = {
        'house': 'Maison',
        'apartment': 'Appartement',
        'office': 'Bureau'
      }
      return labels[type] || type
    }

    // Générer les données de facturation
    const currentInvoice = invoiceData || {
      id: 1,
      invoice_number: `INV-${booking.id}-${new Date().getFullYear()}`,
      created_at: new Date().toISOString(),
      due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'pending'
    }

    const nights = getDurationInNights(booking.start_date, booking.end_date)
    const subtotal = (booking.property?.price_per_night || 0) * nights
    const serviceFee = Math.round(subtotal * 0.10)
    const cleaningFees: Record<string, number> = {
      'apartment': 50,
      'house': 80,
      'office': 30
    }
    const cleaningFee = cleaningFees[booking.property?.type || 'apartment'] || 50
    const baseAmount = subtotal + serviceFee + cleaningFee
    const taxAmount = Math.round(baseAmount * 0.20)
    const totalAmount = baseAmount + taxAmount

    try {
      // En-tête avec logo et informations de l'entreprise
      pdf.setFillColor(primaryColor)
      pdf.rect(0, 0, pageWidth, 40, 'F')
      
      // Titre FACTURE
      addText('FACTURE', margin, 25, { 
        fontSize: 24, 
        fontStyle: 'bold', 
        color: '#ffffff' 
      })
      
      // Informations de l'entreprise (en blanc sur fond bleu)
      addText(companyInfo.name, pageWidth - margin - 60, 15, { 
        fontSize: 16, 
        fontStyle: 'bold', 
        color: '#ffffff' 
      })
      addText(companyInfo.address.split('\n')[0], pageWidth - margin - 60, 22, { 
        fontSize: 9, 
        color: '#ffffff' 
      })
      addText(companyInfo.address.split('\n')[1], pageWidth - margin - 60, 27, { 
        fontSize: 9, 
        color: '#ffffff' 
      })
      addText(companyInfo.phone, pageWidth - margin - 60, 32, { 
        fontSize: 9, 
        color: '#ffffff' 
      })
      addText(companyInfo.email, pageWidth - margin - 60, 37, { 
        fontSize: 9, 
        color: '#ffffff' 
      })

      yPosition = 55

      // Informations de facturation
      addText('Facturé à:', margin, yPosition, { fontSize: 12, fontStyle: 'bold' })
      yPosition += 8
      addText(booking.client?.name || 'Client', margin, yPosition, { fontSize: 11, fontStyle: 'bold' })
      yPosition += 6
      addText(booking.client?.email || '', margin, yPosition, { fontSize: 10 })
      if (booking.client?.phone) {
        yPosition += 6
        addText(booking.client.phone, margin, yPosition, { fontSize: 10 })
      }

      // Informations de facture (à droite)
      const rightColumn = pageWidth - 80
      let rightY = 55
      addText(`N° ${currentInvoice.invoice_number}`, rightColumn, rightY, { fontSize: 11, fontStyle: 'bold' })
      rightY += 8
      addText(`Date: ${formatDate(currentInvoice.created_at)}`, rightColumn, rightY, { fontSize: 10 })
      rightY += 6
      addText(`Échéance: ${formatDate(currentInvoice.due_date)}`, rightColumn, rightY, { fontSize: 10 })

      yPosition = Math.max(yPosition, rightY) + 15

      // Ligne de séparation
      addLine(margin, yPosition, pageWidth - margin, yPosition)
      yPosition += 15

      // Informations de la propriété
      addText('Propriété louée:', margin, yPosition, { fontSize: 12, fontStyle: 'bold' })
      yPosition += 8
      addText(booking.property?.title || 'Propriété', margin, yPosition, { fontSize: 11, fontStyle: 'bold' })
      yPosition += 6
      addText(booking.property?.address || '', margin, yPosition, { fontSize: 10 })
      yPosition += 6
      addText(`Type: ${getPropertyTypeLabel(booking.property?.type || '')}`, margin, yPosition, { fontSize: 10 })
      yPosition += 15

      // Détails de la réservation
      addText('Détails de la réservation:', margin, yPosition, { fontSize: 12, fontStyle: 'bold' })
      yPosition += 8
      
      // Tableau des informations de réservation
      const infoData = [
        ['Période:', `Du ${formatDate(booking.start_date)} au ${formatDate(booking.end_date)}`],
        ['Durée:', `${nights} nuit(s)`],
        ['Invités:', `${booking.guests} personne(s)`],
        ['Statut:', booking.status === 'confirmed' ? 'Confirmée' : 
                   booking.status === 'pending' ? 'En attente' :
                   booking.status === 'completed' ? 'Terminée' : 'Annulée']
      ]

      infoData.forEach(([label, value]) => {
        addText(label, margin, yPosition, { fontSize: 10, fontStyle: 'bold' })
        addText(value, margin + 40, yPosition, { fontSize: 10 })
        yPosition += 6
      })

      yPosition += 10

      // Tableau des articles
      addText('Détail de la facturation:', margin, yPosition, { fontSize: 12, fontStyle: 'bold' })
      yPosition += 10

      // En-tête du tableau
      pdf.setFillColor(245, 245, 245)
      pdf.rect(margin, yPosition, contentWidth, 8, 'F')
      
      addText('Description', margin + 2, yPosition + 5, { fontSize: 9, fontStyle: 'bold' })
      addText('Qté', margin + 90, yPosition + 5, { fontSize: 9, fontStyle: 'bold' })
      addText('Prix unitaire', margin + 110, yPosition + 5, { fontSize: 9, fontStyle: 'bold' })
      addText('Total', margin + 150, yPosition + 5, { fontSize: 9, fontStyle: 'bold' })
      
      yPosition += 12

      // Articles de facturation
      const items = [
        {
          description: `Location ${getPropertyTypeLabel(booking.property?.type || '').toLowerCase()}`,
          subtitle: booking.property?.title || '',
          quantity: `${nights}`,
          unitPrice: formatCurrency(booking.property?.price_per_night || 0),
          total: formatCurrency(subtotal)
        },
        {
          description: 'Frais de service',
          subtitle: 'Commission plateforme (10%)',
          quantity: '1',
          unitPrice: formatCurrency(serviceFee),
          total: formatCurrency(serviceFee)
        },
        {
          description: 'Frais de nettoyage',
          subtitle: 'Nettoyage professionnel',
          quantity: '1',
          unitPrice: formatCurrency(cleaningFee),
          total: formatCurrency(cleaningFee)
        }
      ]

      items.forEach((item, index) => {
        // Ligne d'alternance
        if (index % 2 === 0) {
          pdf.setFillColor(250, 250, 250)
          pdf.rect(margin, yPosition - 2, contentWidth, 12, 'F')
        }

        addText(item.description, margin + 2, yPosition + 3, { fontSize: 9, fontStyle: 'bold' })
        addText(item.subtitle, margin + 2, yPosition + 8, { fontSize: 8, color: secondaryColor })
        addText(item.quantity, margin + 95, yPosition + 5, { fontSize: 9 })
        addText(item.unitPrice, margin + 115, yPosition + 5, { fontSize: 9 })
        addText(item.total, margin + 155, yPosition + 5, { fontSize: 9 })
        
        yPosition += 15
      })

      // Ligne de séparation avant les totaux
      addLine(margin, yPosition, pageWidth - margin, yPosition)
      yPosition += 10

      // Totaux
      const totalStartX = margin + 100
      const totals = [
        ['Sous-total HT:', formatCurrency(baseAmount)],
        ['TVA (20%):', formatCurrency(taxAmount)],
        ['Total TTC:', formatCurrency(totalAmount)]
      ]

      totals.forEach(([label, value], index) => {
        const fontSize = index === totals.length - 1 ? 12 : 10
        const fontStyle = index === totals.length - 1 ? 'bold' : 'normal'
        
        addText(label, totalStartX, yPosition, { fontSize, fontStyle })
        addText(value, totalStartX + 50, yPosition, { fontSize, fontStyle })
        yPosition += index === totals.length - 1 ? 10 : 6
      })

      yPosition += 15

      // Statut de paiement
      addText('Statut du paiement:', margin, yPosition, { fontSize: 12, fontStyle: 'bold' })
      yPosition += 8

      if (currentInvoice.status === 'paid') {
        addText('✓ PAYÉ', margin, yPosition, { fontSize: 11, fontStyle: 'bold', color: '#10b981' })
        if (currentInvoice.paid_at) {
          yPosition += 6
          addText(`Payé le ${formatDate(currentInvoice.paid_at)}`, margin, yPosition, { fontSize: 10 })
        }
      } else {
        addText('⏳ EN ATTENTE DE PAIEMENT', margin, yPosition, { fontSize: 11, fontStyle: 'bold', color: '#f59e0b' })
        yPosition += 6
        addText(`Échéance: ${formatDate(currentInvoice.due_date)}`, margin, yPosition, { fontSize: 10 })
      }

      yPosition += 20

      // Conditions et mentions légales
      if (yPosition > pageHeight - 60) {
        pdf.addPage()
        yPosition = margin
      }

      addText('Conditions et mentions légales:', margin, yPosition, { fontSize: 10, fontStyle: 'bold' })
      yPosition += 8

      const legalText = [
        'Cette facture est générée automatiquement par notre système.',
        'TVA applicable selon la réglementation française en vigueur.',
        `Numéro de TVA intracommunautaire: ${companyInfo.tva}`,
        `SIRET: ${companyInfo.siret}`,
        'Paiement par carte bancaire, virement ou PayPal acceptés.',
        'En cas de retard de paiement, des pénalités pourront être appliquées.'
      ]

      legalText.forEach(text => {
        addText(text, margin, yPosition, { fontSize: 8, color: secondaryColor })
        yPosition += 5
      })

      // Pied de page
      const footerY = pageHeight - 20
      addLine(margin, footerY - 10, pageWidth - margin, footerY - 10, secondaryColor)
      addText('PropertyRental - Plateforme de location immobilière', margin, footerY - 5, { 
        fontSize: 8, 
        color: secondaryColor 
      })
      addText(`Facture générée le ${new Date().toLocaleDateString('fr-FR')}`, 
        pageWidth - margin - 50, footerY - 5, { fontSize: 8, color: secondaryColor })

      // Télécharger le PDF
      const fileName = `facture-${currentInvoice.invoice_number}-${booking.property?.title?.replace(/[^a-zA-Z0-9]/g, '-') || 'property'}.pdf`
      pdf.save(fileName)

    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error)
      throw new Error('Impossible de générer la facture PDF')
    }
  }

  static async generateInvoiceHTML(options: InvoiceOptions): Promise<string> {
    // Cette méthode pourrait être utilisée pour générer du HTML pour l'aperçu
    // ou l'envoi par email
    return `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
        <h1>Facture ${options.invoiceData?.invoice_number || 'DRAFT'}</h1>
        <p>Propriété: ${options.booking.property?.title}</p>
        <p>Client: ${options.booking.client?.name}</p>
        <!-- Plus de contenu HTML ici -->
      </div>
    `
  }
}

export default InvoiceService
