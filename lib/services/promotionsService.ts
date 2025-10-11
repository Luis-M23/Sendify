import { Promotion, CreatePromotion, UpdatePromotion } from "@/lib/validation/promotions"

// Mock data - En producción esto vendría de Supabase
const mockPromotions: Promotion[] = [
  {
    id: "1",
    nombre: "Black Friday 2025",
    descripcion: "Descuento especial por temporada navideña en todos los servicios",
    tipo: "descuento",
    valor: 20,
    tipoValor: "porcentaje",
    fechaInicio: "2025-11-24",
    fechaFin: "2025-11-30",
    condiciones: {
      nivelVIP: ["vip-oro", "vip-platino"],
      pesoMinimo: 1,
    },
    activo: true,
    codigoPromocional: "BLACKFRIDAY2025",
    limiteUsos: 1000,
    usosActuales: 0,
  },
  {
    id: "2",
    nombre: "Envío Gratis Aéreo",
    descripcion: "Envío gratuito para servicios aéreos en pedidos mayores a $100",
    tipo: "envio-gratis",
    valor: 100,
    tipoValor: "fijo",
    fechaInicio: "2025-01-01",
    fechaFin: "2025-03-31",
    condiciones: {
      servicio: ["aereo"],
      paisOrigen: ["US"],
      paisDestino: ["GT", "MX"],
    },
    activo: true,
    codigoPromocional: "FREESHIP2025",
    limiteUsos: 500,
    usosActuales: 45,
  },
  {
    id: "3",
    nombre: "Descuento por Volumen",
    descripcion: "Descuento progresivo según el peso del envío",
    tipo: "volumen",
    valor: 15,
    tipoValor: "porcentaje",
    fechaInicio: "2025-01-01",
    fechaFin: "2025-12-31",
    condiciones: {
      pesoMinimo: 10,
      servicio: ["terrestre", "maritimo"],
    },
    activo: true,
    codigoPromocional: "VOLUME2025",
    limiteUsos: 2000,
    usosActuales: 234,
  },
  {
    id: "4",
    nombre: "Promoción de Verano",
    descripcion: "Descuento especial para envíos marítimos durante el verano",
    tipo: "temporada",
    valor: 25,
    tipoValor: "porcentaje",
    fechaInicio: "2025-06-01",
    fechaFin: "2025-08-31",
    condiciones: {
      servicio: ["maritimo"],
      paisOrigen: ["CN"],
    },
    activo: false, // Promoción inactiva
    codigoPromocional: "SUMMER2025",
    limiteUsos: 800,
    usosActuales: 150,
  },
]

export class PromotionsService {
  private static promotions: Promotion[] = [...mockPromotions]

  static async getAll(): Promise<Promotion[]> {
    await new Promise(resolve => setTimeout(resolve, 300))
    return this.promotions.filter(promotion => promotion.activo)
  }

  static async getAllIncludingInactive(): Promise<Promotion[]> {
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...this.promotions]
  }

  static async getById(id: string): Promise<Promotion | null> {
    await new Promise(resolve => setTimeout(resolve, 200))
    return this.promotions.find(promotion => promotion.id === id) || null
  }

  static async getByCode(codigo: string): Promise<Promotion | null> {
    await new Promise(resolve => setTimeout(resolve, 200))
    return this.promotions.find(promotion => 
      promotion.codigoPromocional?.toUpperCase() === codigo.toUpperCase()
    ) || null
  }

  static async create(data: CreatePromotion): Promise<Promotion> {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Verificar que el código promocional no exista si se proporciona
    if (data.codigoPromocional) {
      const existingPromotion = this.promotions.find(p => 
        p.codigoPromocional?.toUpperCase() === data.codigoPromocional?.toUpperCase()
      )
      if (existingPromotion) {
        throw new Error(`Ya existe una promoción con el código ${data.codigoPromocional}`)
      }
    }
    
    const newPromotion: Promotion = {
      id: (this.promotions.length + 1).toString(),
      ...data,
      usosActuales: 0,
      activo: true,
      codigoPromocional: data.codigoPromocional?.toUpperCase(),
    }
    
    this.promotions.push(newPromotion)
    return newPromotion
  }

  static async update(id: string, data: UpdatePromotion): Promise<Promotion | null> {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const index = this.promotions.findIndex(promotion => promotion.id === id)
    if (index === -1) return null
    
    // Si se está actualizando el código promocional, verificar que no exista
    if (data.codigoPromocional) {
      const existingPromotion = this.promotions.find(p => 
        p.codigoPromocional?.toUpperCase() === data.codigoPromocional?.toUpperCase() && 
        p.id !== id
      )
      if (existingPromotion) {
        throw new Error(`Ya existe una promoción con el código ${data.codigoPromocional}`)
      }
    }
    
    this.promotions[index] = { 
      ...this.promotions[index], 
      ...data,
      ...(data.codigoPromocional && { codigoPromocional: data.codigoPromocional.toUpperCase() })
    }
    return this.promotions[index]
  }

  static async delete(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const index = this.promotions.findIndex(promotion => promotion.id === id)
    if (index === -1) return false
    
    // Soft delete - marcar como inactivo
    this.promotions[index].activo = false
    return true
  }

  static async search(query: string): Promise<Promotion[]> {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const lowercaseQuery = query.toLowerCase()
    return this.promotions.filter(promotion => 
      promotion.activo && 
      (promotion.nombre.toLowerCase().includes(lowercaseQuery) ||
       promotion.descripcion.toLowerCase().includes(lowercaseQuery) ||
       promotion.codigoPromocional?.toLowerCase().includes(lowercaseQuery))
    )
  }

  static async getActivePromotions(): Promise<Promotion[]> {
    await new Promise(resolve => setTimeout(resolve, 200))
    const now = new Date()
    return this.promotions.filter(promotion => 
      promotion.activo &&
      new Date(promotion.fechaInicio) <= now &&
      new Date(promotion.fechaFin) >= now
    )
  }

  static async incrementUsage(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const index = this.promotions.findIndex(promotion => promotion.id === id)
    if (index === -1) return false
    
    this.promotions[index].usosActuales += 1
    return true
  }

  static async validatePromotion(
    codigo: string,
    usuario: { nivelVIP: string; pais: string },
    envio: { servicio: string; peso: number; paisOrigen: string; paisDestino: string }
  ): Promise<{ valid: boolean; promotion?: Promotion; error?: string }> {
    const promotion = await this.getByCode(codigo)
    
    if (!promotion) {
      return { valid: false, error: "Código promocional no válido" }
    }
    
    if (!promotion.activo) {
      return { valid: false, error: "La promoción no está activa" }
    }
    
    const now = new Date()
    if (new Date(promotion.fechaInicio) > now || new Date(promotion.fechaFin) < now) {
      return { valid: false, error: "La promoción ha expirado" }
    }
    
    if (promotion.limiteUsos && promotion.usosActuales >= promotion.limiteUsos) {
      return { valid: false, error: "La promoción ha alcanzado su límite de usos" }
    }
    
    // Validar condiciones
    if (promotion.condiciones) {
      const { condiciones } = promotion
      
      if (condiciones.nivelVIP && !condiciones.nivelVIP.includes(usuario.nivelVIP)) {
        return { valid: false, error: "No cumples con los requisitos de nivel VIP" }
      }
      
      if (condiciones.servicio && !condiciones.servicio.includes(envio.servicio as any)) {
        return { valid: false, error: "La promoción no aplica para este servicio" }
      }
      
      if (condiciones.paisOrigen && !condiciones.paisOrigen.includes(envio.paisOrigen)) {
        return { valid: false, error: "La promoción no aplica para este país de origen" }
      }
      
      if (condiciones.paisDestino && !condiciones.paisDestino.includes(envio.paisDestino)) {
        return { valid: false, error: "La promoción no aplica para este país de destino" }
      }
      
      if (condiciones.pesoMinimo && envio.peso < condiciones.pesoMinimo) {
        return { valid: false, error: `El peso mínimo requerido es ${condiciones.pesoMinimo}kg` }
      }
      
      if (condiciones.pesoMaximo && envio.peso > condiciones.pesoMaximo) {
        return { valid: false, error: `El peso máximo permitido es ${condiciones.pesoMaximo}kg` }
      }
    }
    
    return { valid: true, promotion }
  }
}
