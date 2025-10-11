import { createClient } from "../client";
import { supabaseErrorMap } from "../errorMap";
import { factorConversionSchema } from "@/lib/validation/factorConversion";
import { FactorConversion } from "@/lib/validation/factorConversion";


const supabase = createClient();

export const ModosTransporteService = {
  async getAll(): Promise<FactorConversion[]> {
    const { data, error } = await supabase
      .from("factores_conversion")
      .select("*")
      .order("nombre", { ascending: true });

    if (error) {
      const translated =
        (error.code && supabaseErrorMap[error.code]) ||
        "Ocurrió un error al obtener los modos de transporte";
      throw new Error(translated);
    }

    return data as FactorConversion[];
  },

  async updateAll(modos: FactorConversion[]): Promise<void> {
    modos.forEach((modo) => factorConversionSchema.parse(modo));

    for (const modo of modos) {
      const { error } = await supabase
        .from("factores_conversion")
        .update({ divisor_vol: modo.divisor_vol })
        .eq("id", modo.id);

      if (error) {
        const translated =
          (error.code && supabaseErrorMap[error.code]) ||
          `Ocurrió un error al actualizar "${modo.nombre}"`;
        throw new Error(translated);
      }
    }
  },
};
