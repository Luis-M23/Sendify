import { createClient } from "../client";
import { supabaseErrorMap } from "../errorMap";
import { FactorConversionSchema } from "@/lib/validation/factorConversion";
import { FactorConversionData } from "@/lib/validation/factorConversion";


const supabase = createClient();

export const ModosTransporteService = {
  async getAll(): Promise<FactorConversionData[]> {
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

    return data as FactorConversionData[];
  },

  async updateAll(modos: FactorConversionData[]): Promise<void> {
    modos.forEach((modo) => FactorConversionSchema.parse(modo));

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
