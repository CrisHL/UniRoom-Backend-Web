import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { db } from "../lib/db";

export const getUserInfo = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.body;

  if (!userId) {
    res.status(400).json({ error: "ID de usuario no proporcionado" });
    return;
  }

  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  if (!user) {
    res.status(404).json({ error: "Usuario no encontrado" });
    return;
  }

  res.json({
    success: true,
    message: "Información de usuario recuperada correctamente",
    user: {
      id: user.id,
      name: user.name || "Usuario sin nombre",
      email: user.email || "Usuario sin email",
    },
  });
});
