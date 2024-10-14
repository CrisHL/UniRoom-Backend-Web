"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const db_1 = require("../lib/db");
// Controlador para manejar la solicitud de recuperación de contraseña
exports.logout = (0, express_async_handler_1.default)(async (req, res) => {
    // Validar jwtToken
    const { token } = req.body;
    // Eliminar el jwt de la base de datos
    await db_1.db.jwtToken.delete({
        where: { token: token },
    });
    // Notificar al usuario que la sesión ha sido cerrada
    res.json({ success: true, message: "Sesión cerrada" });
});
