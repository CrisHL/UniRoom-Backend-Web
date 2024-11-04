"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserInfo = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const db_1 = require("../lib/db");
exports.getUserInfo = (0, express_async_handler_1.default)(async (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        res.status(400).json({ error: "ID de usuario no proporcionado" });
        return;
    }
    const user = await db_1.db.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
        },
    });
    if (!user) {
        res.status(404).json({ error: "Usuario no encontrado" });
        return;
    }
    res.json({
        success: true,
        message: "Información de usuario recuperada correctamente",
        user: {
            id: user.id,
            name: user.name || "Usuario sin nombre",
            email: user.email || "Usuario sin email",
        },
    });
});
