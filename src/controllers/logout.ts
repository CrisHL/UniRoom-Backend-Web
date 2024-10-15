import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { db } from "../lib/db";

export const logout = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { token } = req.body;

  if (!token) {
    res.status(400).json({ error: "Token no proporcionado" });
    return;
  }

  // Buscar el token en la base de datos y obtener el userId
  const jwtTokenRecord = await db.jwtToken.findUnique({
    where: { token: token },
  });

  if (!jwtTokenRecord) {
    res.status(404).json({ error: "Token no encontrado" });
    return;
  }

  const userId = jwtTokenRecord.userId;

  // Eliminar todos los tokens asociados con este userId
  const deletedTokens = await db.jwtToken.deleteMany({
    where: { userId: userId },
  });

  // Verifica si se eliminaron tokens
  if (deletedTokens.count === 0) {
    res.status(404).json({ error: "No se encontraron tokens para este usuario" });
    return;
  }

  // Notificar al usuario que todos los JWT se han eliminado y la sesión ha sido cerrada
  res.json({ success: true, message: "Sesión cerrada y todos los tokens eliminados" });
});
