import { CategoriaService } from "./supabase/services/categoriaService";

export const PermisoMap: Record<number, string> = {
  1: "Prohibido",
  2: "Permitido",
  3: "Requiere Permiso",
};

export const RecompensaMap: Record<number, string> = {
  1: "Bronce",
  2: "Plata",
  3: "Oro",
  4: "Platino",
};

export async function CategoriaMap(): Promise<Record<number, string>> {
  try {
    const categorias = await CategoriaService.getAll();
    return Object.fromEntries(categorias.map((cat) => [cat.id, cat.nombre]));
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    return {};
  }
}
