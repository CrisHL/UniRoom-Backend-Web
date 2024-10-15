import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import { db } from "../lib/db";

// Asegúrate de que JWT_SECRET esté definido en tu archivo de configuración de entorno
const JWT_SECRET = process.env.JWT_SECRET || 'Un1R0Om202A*@*';

export const logout = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { token } = req.body;

  if (!token) {
    res.status(400).json({ error: "Token no proporcionado" });
    return;
  }

  // Decodificar el token para obtener el userId
  try {
    const decodedToken: any = jwt.verify(token, JWT_SECRET);

    const userId = decodedToken.userId;

    // Eliminar todos los tokens asociados con este usuario
    await db.jwtToken.deleteMany({
      where: { userId: userId },
    });

    // Notificar al usuario que todos los JWT se han eliminado y la sesión ha sido cerrada
    res.json({ success: true, message: "Sesión cerrada" });
  } catch (error) {
    res.status(400).json({ error: "Token inválido o expirado" });
  }
});
