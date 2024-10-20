import { logout } from './../controllers/logout';
import { Router } from "express";
import { register } from "../controllers/register";
import { login } from "../controllers/login";
import { resetPassword } from "../controllers/resetPassword";
import { updateUser } from "../controllers/updateUser";
import { verifyAuth } from '../controllers/verify-auth';

const router = Router();

// Ruta para registrar un nuevo usuario
router.post("/register", register);

// Ruta para iniciar sesión
router.post("/login", login);

// Ruta para restablecer la contraseña
router.post("/reset-password", resetPassword);

//Ruta para actualizar la información del usuario
router.put("/update", updateUser);

// Ruta para cerrar sesión
router.post("/logout", logout);

//Ruta para verificar la autenticación
router.post("/verify-auth", verifyAuth);

export default router;
