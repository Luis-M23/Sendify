import { Category, CreateCategory, UpdateCategory } from "@/lib/validation/categories"

// Mock data - En producción esto vendría de Supabase
const mockCategories: Category[] = [
  {
    id: "1",
    nombre: "Líquidos inflamables",
    descripcion: "Productos químicos y líquidos que pueden encenderse fácilmente",
    aereo: "prohibido",
    terrestre: "permitido",
    maritimo: "permitido",
    notas: "Requiere embalaje especial para transporte terrestre y marítimo",
    activo: true,
  },
  {
    id: "2",
    nombre: "Gases presurizados",
    descripcion: "Gases comprimidos en contenedores presurizados",
    aereo: "prohibido",
    terrestre: "permitido",
    maritimo: "permitido",
    notas: "Incluye aerosoles, extintores, tanques de gas",
    activo: true,
  },
  {
    id: "3",
    nombre: "Baterías de litio",
    descripcion: "Baterías recargables de iones de litio",
    aereo: "requiere-permiso",
    terrestre: "permitido",
    maritimo: "permitido",
    notas: "Aéreo: máximo 100Wh sin permiso especial",
    activo: true,
  },
  {
    id: "4",
    nombre: "Productos químicos",
    descripcion: "Sustancias químicas y productos de laboratorio",
    aereo: "prohibido",
    terrestre: "requiere-permiso",
    maritimo: "permitido",
    notas: "Requiere hoja de seguridad (MSDS)",
    activo: true,
  },
  {
    id: "5",
    nombre: "Alimentos perecederos",
    descripcion: "Productos alimenticios que requieren refrigeración",
    aereo: "permitido",
    terrestre: "requiere-permiso",
    maritimo: "prohibido",
    notas: "Requiere refrigeración y empaque especial",
    activo: true,
  },
]

export class CategoriesService {
  private static categories: Category[] = [...mockCategories]

  static async getAll(): Promise<Category[]> {
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 300))
    return this.categories.filter(category => category.activo)
  }

  static async getById(id: string): Promise<Category | null> {
    await new Promise(resolve => setTimeout(resolve, 200))
    return this.categories.find(category => category.id === id) || null
  }

  static async create(data: CreateCategory): Promise<Category> {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const newCategory: Category = {
      id: (this.categories.length + 1).toString(),
      ...data,
      activo: true,
    }
    
    this.categories.push(newCategory)
    return newCategory
  }

  static async update(id: string, data: UpdateCategory): Promise<Category | null> {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const index = this.categories.findIndex(category => category.id === id)
    if (index === -1) return null
    
    this.categories[index] = { ...this.categories[index], ...data }
    return this.categories[index]
  }

  static async delete(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const index = this.categories.findIndex(category => category.id === id)
    if (index === -1) return false
    
    // Soft delete - marcar como inactivo
    this.categories[index].activo = false
    return true
  }

  static async search(query: string): Promise<Category[]> {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const lowercaseQuery = query.toLowerCase()
    return this.categories.filter(category => 
      category.activo && 
      (category.nombre.toLowerCase().includes(lowercaseQuery) ||
       category.descripcion.toLowerCase().includes(lowercaseQuery))
    )
  }
}
