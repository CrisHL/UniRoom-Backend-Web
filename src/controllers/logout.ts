import { Request, Response } from "express";
import * as z from "zod";
import asyncHandler from "express-async-handler";
import { db } from "../lib/db"; 
import { ResetSchema } from "../schemas";
import { getUserByEmail } from "../data/users";
import { sendPasswordResetEmail } from "../lib/mail";
import { generatePasswordResetToken } from "../lib/tokens";

// Controlador para manejar la solicitud de recuperación de contraseña
export const logout =  asyncHandler(async (req: Request, res: Response): Promise<void> => {
  
// Validar jwtToken
  const { token } = req.body;

// Eliminar el jwt de la base de datos
  await db.jwtToken.delete({
    where: { token: token },
  });

  // Notificar al usuario que la sesión ha sido cerrada
  res.json({ success: true, message: "Sesión cerrada" });
});
