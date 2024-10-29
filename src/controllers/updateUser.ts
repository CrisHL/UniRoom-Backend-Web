import * as z from "zod";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { db } from "../lib/db";
import { UpdateSchema } from "../schemas";
import { getUserByEmail } from "../data/users";
import { generateVerificationToken } from "../lib/tokens";
import { sendVerificationEmail } from "../lib/mail";

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  // Validar los campos de entrada con el esquema definido
  const validateFields = UpdateSchema.safeParse(req.body);

  if (!validateFields.success) {
    res.status(400).json({ error: "Datos inválidos", details: validateFields.error.errors });
    return;
  }

  const values = validateFields.data;
  const { token } = req.body; 

  // Verifica si el token existe en la base de datos
  const jwtTokenRecord = await db.jwtToken.findUnique({
    where: { token: token },
    include: {
      user: true,
    },
  });

  if (!jwtTokenRecord) {
    res.status(403).json({ error: "Token inválido o no encontrado" });
    return;
  }

  const dbUser = jwtTokenRecord.user;

  // Verifica si el correo ha cambiado y si ya está en uso
  if (values.email && values.email !== dbUser.email) {
    const existingUser = await getUserByEmail(values.email);

    if (existingUser && existingUser.id !== dbUser.id) {
      res.status(400).json({ error: true, message: "El correo ya está en uso" });
      return;
    }

    // Genera y envía un token de verificación al nuevo correo
    const verificationToken = await generateVerificationToken(values.email);
    await sendVerificationEmail(verificationToken.email, verificationToken.token);

    res.status(200).json({ success: "Correo de verificación enviado!" });
    return;
  }

  // Verifica la contraseña actual antes de permitir un cambio
  if (values.password && values.newPassword && dbUser.password) {
    const passwordsMatch = await bcrypt.compare(
      values.password,
      dbUser.password,
    );

    if (!passwordsMatch) {
      res.status(204).json({error: true, message: "Contraseña incorrecta"});
      return;
    }

    // Hash de la nueva contraseña
    const hashedPassword = await bcrypt.hash(
      values.newPassword,
      10,
    );
    values.password = hashedPassword;
    values.newPassword = undefined;
  }


  // Actualiza los datos del usuario en la base de datos
  const updatedUser = await db.user.update({
    where: { id: dbUser.id },
    data: {
      ...values,
    },
  });

  // Devuelve una respuesta de éxito con el usuario actualizado
  res.status(200).json({ 
    success: true,
    message: "Cambios realizados correctamente",
    user: updatedUser 
  });
});
