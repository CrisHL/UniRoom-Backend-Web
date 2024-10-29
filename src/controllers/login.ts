import * as z from "zod";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import { db } from "../lib/db";
import { LoginSchema } from "../schemas";
import { getUserByEmail } from "../data/users";
import { getTwoFactorTokenByEmail } from "../data/two-factor-token";
import { 
  sendVerificationEmail,
  sendTwoFactorTokenEmail,
} from "../lib/mail";
import { 
  generateVerificationToken,
  generateTwoFactorToken
} from "../lib/tokens";
import { 
  getTwoFactorConfirmationByUserId
} from "../data/two-factor-confirmation";

const JWT_SECRET = process.env.JWT_SECRET || 'Un1R0Om202A*@*';

// Generar JWT
const generateJWT = (userId: string) => {
  const token = jwt.sign({ userId }, JWT_SECRET); // Sin expiración
  return token;
};

// Función para eliminar tokens antiguos y crear uno nuevo
const createJwtToken = async (userId: string) => {
  // Elimina todos los tokens antiguos para evitar duplicados
  await db.jwtToken.deleteMany({
    where: { userId: userId },
  });

  // Luego crea el nuevo token
  const newToken = generateJWT(userId);
  await db.jwtToken.create({
    data: {
      userId,
      token: newToken,
    },
  });

  return newToken;
};

// Controlador para manejar el inicio de sesión de usuarios
export const login = asyncHandler(async (req: Request, res: Response) => {
  const validateFields = LoginSchema.safeParse(req.body);

  if (!validateFields.success) {
    res.status(400).json({ error: "Credenciales inválidas" });
    return;
  }

  const { email, password, code } = validateFields.data;
  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    res.status(404).json({ error: "Credenciales inexistentes" });
    return;
  }

  // Verificar si el usuario es ARRENDADOR
  if (existingUser.role === "ARRENDADOR") {
    res.status(403).json({
      error: "No puedes iniciar sesión como arrendador. Si deseas rentar una habitación, por favor crea una cuenta como estudiante.",
    });
    return;
  }

  const isMatch = await bcrypt.compare(password, existingUser.password);
  if (!isMatch) {
    res.status(400).json({ error: "Contraseña incorrecta" });
    return;
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(existingUser.email);
    await sendVerificationEmail(verificationToken.email, verificationToken.token);
    res.status(200).json({ emailVerify: true, message: "Correo de confirmación enviado" });
    return;
  }

  if (existingUser.isTwoFactorEnabled) {
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

      if (!twoFactorToken || twoFactorToken.token !== code) {
        res.status(400).json({ error: "Código inválido" });
        return;
      }

      if (new Date(twoFactorToken.expires) < new Date()) {
        res.status(400).json({ error: "El código ha expirado" });
        return;
      }

      await db.twoFactorToken.delete({ where: { id: twoFactorToken.id } });

      const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);
      if (existingConfirmation) {
        await db.twoFactorConfirmation.delete({ where: { id: existingConfirmation.id } });
      }
      await db.twoFactorConfirmation.create({ data: { userId: existingUser.id } });

      // Generar nuevo JWT y eliminar los antiguos
      const jwtToken = await createJwtToken(existingUser.id);

      res.status(200).json({
        success: true,
        message: "Inicio de sesión exitoso",
        user: { email: existingUser.email, name: existingUser.name, image: existingUser.image,  token: jwtToken },
      });
      return;
    } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);
      await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token);

      res.status(200).json({ twoFactor: true, message: "Código 2FA enviado al correo" });
      return;
    }
  }

  // Si 2FA no está habilitado
  const jwtToken = await createJwtToken(existingUser.id);

  res.status(200).json({
    success: true,
    message: "Inicio de sesión exitoso",
    user: { email: existingUser.email, name: existingUser.name, image: existingUser.image,  token: jwtToken },
  });
});

