"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logout_1 = require("./../controllers/logout");
const express_1 = require("express");
const register_1 = require("../controllers/register");
const login_1 = require("../controllers/login");
const resetPassword_1 = require("../controllers/resetPassword");
const updateUser_1 = require("../controllers/updateUser");
const verify_auth_1 = require("../controllers/verify-auth");
const user_info_1 = require("../controllers/user-info");
const router = (0, express_1.Router)();
// Ruta para registrar un nuevo usuario
router.post("/register", register_1.register);
// Ruta para iniciar sesión
router.post("/login", login_1.login);
// Ruta para restablecer la contraseña
router.post("/reset-password", resetPassword_1.resetPassword);
//Ruta para actualizar la información del usuario
router.put("/update", updateUser_1.updateUser);
// Ruta para cerrar sesión
router.post("/logout", logout_1.logout);
//Ruta para verificar la autenticación
router.post("/verify-auth", verify_auth_1.verifyAuth);
//Ruta para verificar la autenticación
router.post("/user-info", user_info_1.getUserInfo);
exports.default = router;
