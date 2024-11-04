"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAuth = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const db_1 = require("../lib/db");
exports.verifyAuth = (0, express_async_handler_1.default)(async (req, res) => {
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
    res.json({
        validateToken: true,
        message: "Sesión verificada correctamente",
        user: {
            id: user?.id,
            name: user?.name || "Usuario sin nombre",
            image: user?.image || null,
        }
    });
});
