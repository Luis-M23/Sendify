import { createClient } from "../client";
import { Distrito } from "@/lib/validation/distrito";
import { supabaseErrorMap } from "../errorMap";

const supabase = createClient();
const TABLE_NAME = "distritos";

export const DistritoService = {
  async getAll(): Promise<Distrito[]> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select("*")
      .order("id");

    if (error) {
      throw new Error(
        supabaseErrorMap[error.code] ||
          "Error al obtener las direcciones de los locales"
      );
    }

    return data as Distrito[];
  },
};
