import { Country, CreateCountry, UpdateCountry } from "@/lib/validation/countries"

// Mock data - En producción esto vendría de Supabase
const mockCountries: Country[] = [
  {
    id: "1",
    codigo: "US",
    nombre: "Estados Unidos",
    nombreCompleto: "Estados Unidos de América",
    region: "América del Norte",
    moneda: "USD",
    activo: true,
    restricciones: {
      aduana: true,
      documentacion: "Requiere formulario de exportación para productos valorados >$2500",
      impuestos: 15,
    },
  },
  {
    id: "2",
    codigo: "GT",
    nombre: "Guatemala",
    nombreCompleto: "República de Guatemala",
    region: "América Central",
    moneda: "GTQ",
    activo: true,
    restricciones: {
      aduana: true,
      documentacion: "Requiere factura comercial y declaración de aduanas",
      impuestos: 12,
    },
  },
  {
    id: "3",
    codigo: "CN",
    nombre: "China",
    nombreCompleto: "República Popular China",
    region: "Asia",
    moneda: "CNY",
    activo: true,
    restricciones: {
      aduana: true,
      documentacion: "Requiere certificado de origen y licencia de importación",
      impuestos: 20,
    },
  },
  {
    id: "4",
    codigo: "MX",
    nombre: "México",
    nombreCompleto: "Estados Unidos Mexicanos",
    region: "América del Norte",
    moneda: "MXN",
    activo: true,
    restricciones: {
      aduana: true,
      documentacion: "Requiere pedimento de importación",
      impuestos: 16,
    },
  },
  {
    id: "5",
    codigo: "CA",
    nombre: "Canadá",
    nombreCompleto: "Canadá",
    region: "América del Norte",
    moneda: "CAD",
    activo: true,
    restricciones: {
      aduana: true,
      documentacion: "Requiere declaración de aduanas canadiense",
      impuestos: 13,
    },
  },
  {
    id: "6",
    codigo: "ES",
    nombre: "España",
    nombreCompleto: "Reino de España",
    region: "Europa",
    moneda: "EUR",
    activo: true,
    restricciones: {
      aduana: true,
      documentacion: "Requiere DUA (Documento Único Administrativo)",
      impuestos: 21,
    },
  },
]

export class CountriesService {
  private static countries: Country[] = [...mockCountries]

  static async getAll(): Promise<Country[]> {
    await new Promise(resolve => setTimeout(resolve, 300))
    return this.countries.filter(country => country.activo)
  }

  static async getById(id: string): Promise<Country | null> {
    await new Promise(resolve => setTimeout(resolve, 200))
    return this.countries.find(country => country.id === id) || null
  }

  static async getByCode(codigo: string): Promise<Country | null> {
    await new Promise(resolve => setTimeout(resolve, 200))
    return this.countries.find(country => country.codigo === codigo.toUpperCase()) || null
  }

  static async create(data: CreateCountry): Promise<Country> {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Verificar que el código no exista
    const existingCountry = this.countries.find(c => c.codigo === data.codigo)
    if (existingCountry) {
      throw new Error(`Ya existe un país con el código ${data.codigo}`)
    }
    
    const newCountry: Country = {
      id: (this.countries.length + 1).toString(),
      ...data,
      codigo: data.codigo.toUpperCase(),
      activo: true,
    }
    
    this.countries.push(newCountry)
    return newCountry
  }

  static async update(id: string, data: UpdateCountry): Promise<Country | null> {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const index = this.countries.findIndex(country => country.id === id)
    if (index === -1) return null
    
    // Si se está actualizando el código, verificar que no exista
    if (data.codigo) {
      const existingCountry = this.countries.find(c => c.codigo === data.codigo && c.id !== id)
      if (existingCountry) {
        throw new Error(`Ya existe un país con el código ${data.codigo}`)
      }
    }
    
    this.countries[index] = { 
      ...this.countries[index], 
      ...data,
      ...(data.codigo && { codigo: data.codigo.toUpperCase() })
    }
    return this.countries[index]
  }

  static async delete(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const index = this.countries.findIndex(country => country.id === id)
    if (index === -1) return false
    
    // Soft delete - marcar como inactivo
    this.countries[index].activo = false
    return true
  }

  static async search(query: string): Promise<Country[]> {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const lowercaseQuery = query.toLowerCase()
    return this.countries.filter(country => 
      country.activo && 
      (country.nombre.toLowerCase().includes(lowercaseQuery) ||
       country.codigo.toLowerCase().includes(lowercaseQuery) ||
       country.region.toLowerCase().includes(lowercaseQuery))
    )
  }

  static async getByRegion(region: string): Promise<Country[]> {
    await new Promise(resolve => setTimeout(resolve, 200))
    return this.countries.filter(country => 
      country.activo && country.region === region
    )
  }
}
