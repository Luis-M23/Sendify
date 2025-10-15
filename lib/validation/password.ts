import { z } from "zod";

export const ChangePasswordSchema = z
  .object({
    current_password: z
      .string()
      .min(6, { message: "La contraseña actual debe tener al menos 6 caracteres" }),
    new_password: z
      .string()
      .min(6, { message: "La nueva contraseña debe tener al menos 6 caracteres" }),
  })
  .refine(
    (data) => data.current_password !== data.new_password,
    {
      message: "La nueva contraseña debe ser diferente a la actual",
      path: ["new_password"],
    }
  );

export type ChangePasswordData = z.infer<typeof ChangePasswordSchema>;
