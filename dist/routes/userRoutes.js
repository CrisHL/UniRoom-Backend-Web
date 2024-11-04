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
const delete_token_1 = require("../controllers/delete-token");
const delete_account_1 = require("../controllers/delete-account");
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
// Ruta para solicitar un token de eliminación de cuenta
router.post("/delete-token", delete_token_1.deleteToken);
// Ruta para eliminar la cuenta de usuario
router.post("/delete-account", delete_account_1.deleteAccount);
exports.default = router;
