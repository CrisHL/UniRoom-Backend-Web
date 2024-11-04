"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteToken = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const db_1 = require("../lib/db");
const tokens_1 = require("../lib/tokens");
const mail_1 = require("../lib/mail");
// Controlador para manejar el registro de nuevos usuarios
exports.deleteToken = (0, express_async_handler_1.default)(async (req, res) => {
    const { token } = req.body;
    if (!token) {
        res.status(400).json({ error: "Token no proporcionado" });
        return;
    }
    const jwtTokenRecord = await db_1.db.jwtToken.findUnique({
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
    const deleteToken = await (0, tokens_1.generateDeleteToken)(user?.email || "");
    await (0, mail_1.sendDeleteTokenEmail)(deleteToken.email, deleteToken.token);
    // Responder con éxito y notificar al usuario que revise su correo
    res.status(201).json({ success: true, message: "Correo de confirmación enviado" });
});
