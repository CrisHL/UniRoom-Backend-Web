import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { db } from "../lib/db";
import { generateDeleteToken } from "../lib/tokens";
import { sendDeleteTokenEmail } from "../lib/mail";

// Controlador para manejar el registro de nuevos usuarios
export const deleteToken = asyncHandler(async (req: Request, res: Response) => {

  const { token } = req.body;

  if (!token) {
    res.status(400).json({ error: "Token no proporcionado" });
    return;
  }

  const jwtTokenRecord = await db.jwtToken.findUnique({
    where: { token: token },
    include: {
      user: true,
    },
  });

  if (!jwtTokenRecord) {
    res.status(404).json({ validateToken: false, error: "Token no encontrado" });
    return;
  }

  const { user } = jwtTokenRecord;

  // Generar un token de verificación y enviar el correo de confirmación
  const deleteToken = await generateDeleteToken(user?.email || "");
  await sendDeleteTokenEmail(deleteToken.email, deleteToken.token);

  // Responder con éxito y notificar al usuario que revise su correo
  res.status(201).json({ success: true, message: "Correo de confirmación enviado" });
});
