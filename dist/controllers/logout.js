"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const db_1 = require("../lib/db");
exports.logout = (0, express_async_handler_1.default)(async (req, res) => {
    const { token } = req.body;
    if (!token) {
        res.status(400).json({ error: "Token no proporcionado" });
        return;
    }
    // Buscar el token en la base de datos y obtener el userId
    const jwtTokenRecord = await db_1.db.jwtToken.findUnique({
        where: { token: token },
    });
    if (!jwtTokenRecord) {
        res.status(404).json({ error: "Token no encontrado" });
        return;
    }
    const userId = jwtTokenRecord.userId;
    // Eliminar todos los tokens asociados con este userId
    const deletedTokens = await db_1.db.jwtToken.deleteMany({
        where: { userId: userId },
    });
    // Verifica si se eliminaron tokens
    if (deletedTokens.count === 0) {
        res.status(404).json({ error: "No se encontraron tokens para este usuario" });
        return;
    }
    // Notificar al usuario que todos los JWT se han eliminado y la sesión ha sido cerrada
    res.json({ success: true, message: "Sesión cerrada y todos los tokens eliminados" });
});
