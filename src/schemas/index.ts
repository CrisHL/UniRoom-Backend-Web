import * as z from "zod";
import { UserRole } from "@prisma/client";

export const UpdateSchema = z.object({
  name: z.optional(z.string()),
  isTwoFactorEnabled: z.optional(z.boolean()),
  role: z.optional(z.enum([UserRole.ARRENDADOR, UserRole.ESTUDIANTE])),
  email: z.optional(z.string().email()),
  newPassword: z.optional(z.string().min(6)) 
});

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Minimo 6 caracteres requeridos!",
  }),
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Correo electrónico requerido!",
  }),
});

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Correo electrónico requerido!",
  }),
  password: z.string().min(1, {
    message: "la contraseña es requerida!",
  }),
  code: z.optional(z.string()),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Correo electrónico requerido!",
  }),
  password: z.string().min(6, {
    message: "6 caracteres requeridos!",
  }),
  name: z.string().min(1, {
    message: "El nombre es requerido!",
  }),
  role: z.enum(["ARRENDADOR", "ESTUDIANTE"]).optional(), 
});