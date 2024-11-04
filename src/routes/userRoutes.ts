import { logout } from './../controllers/logout';
import { Router } from "express";
import { register } from "../controllers/register";
import { login } from "../controllers/login";
import { resetPassword } from "../controllers/resetPassword";
import { updateUser } from "../controllers/updateUser";
import { verifyAuth } from '../controllers/verify-auth';
import { getUserInfo } from '../controllers/user-info';
import { deleteToken } from '../controllers/delete-token';
import { deleteAccount } from '../controllers/delete-account';

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

//Ruta para verificar la autenticación
router.post("/user-info", getUserInfo);

// Ruta para solicitar un token de eliminación de cuenta
router.post("/delete-token", deleteToken);

// Ruta para eliminar la cuenta de usuario
router.post("/delete-account", deleteAccount);


export default router;
