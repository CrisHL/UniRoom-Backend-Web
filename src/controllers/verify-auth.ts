import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { db } from "../lib/db";

export const verifyAuth = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { token } = req.body;

  if (!token) {
    res.status(400).json({ error: "Token no proporcionado" });
    return;
  }

  // Buscar el token y también traer la relación con el usuario
  const jwtTokenRecord = await db.jwtToken.findUnique({
    where: { token: token },
    include: {
      user: true, // Incluimos los datos del usuario
    },
  });

  if (!jwtTokenRecord) {
    res.status(404).json({ validateToken: false, error: "Token no encontrado" });
    return;
  }

  const { user } = jwtTokenRecord;

  res.json({
    validateToken: true,
    message: "Sesión verificada correctamente",
    user: {
      name: user?.name || "Usuario sin nombre",
      image: user?.image || "Imagen no disponible",
    }
  });
});
