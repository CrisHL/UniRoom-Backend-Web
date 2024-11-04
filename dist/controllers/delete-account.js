"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAccount = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const axios_1 = __importDefault(require("axios"));
const db_1 = require("../lib/db");
// Controlador para manejar la eliminación de cuenta
exports.deleteAccount = (0, express_async_handler_1.default)(async (req, res) => {
    const { token, code, reason } = req.body;
    if (!token || !code) {
        res.status(400).json({ error: "Token o código no proporcionado" });
        return;
    }
    // Buscar el registro del token JWT
    const jwtTokenRecord = await db_1.db.jwtToken.findUnique({
        where: { token },
        include: {
            user: true,
        },
    });
    if (!jwtTokenRecord || !jwtTokenRecord.user) {
        res.status(404).json({ validateToken: false, error: "Token no encontrado" });
        return;
    }
    const { user } = jwtTokenRecord;
    // Verificar el código de eliminación (DeleteToken) basado en el email
    const deleteTokenRecord = await db_1.db.deleteToken.findFirst({
        where: { email: user.email || "" },
    });
    if (!deleteTokenRecord || deleteTokenRecord.token !== code) {
        res.status(400).json({ error: "Código de eliminación inválido" });
        return;
    }
    if (new Date(deleteTokenRecord.expires) < new Date()) {
        res.status(400).json({ error: "El código de eliminación ha expirado" });
        return;
    }
    // Generar nuevo nombre para el usuario
    const randomNum = Math.floor(1000 + Math.random() * 9000); // Número aleatorio de 4 dígitos
    const newName = `Usuario${randomNum} (Cuenta eliminada)`;
    // Llamar a la API externa para actualizar el nombre
    try {
        await axios_1.default.post("https://uniroom-backend-services.onrender.com/update-user", {
            userId: user.id,
            newName,
        });
    }
    catch (error) {
        res.status(500).json({ error: "Error al actualizar el nombre en el servicio externo" });
        return;
    }
    // Actualizar la información del usuario en la base de datos
    await db_1.db.user.update({
        where: { id: user.id },
        data: {
            name: newName,
            email: "delete@usuarioeliminado.com",
            password: null,
            image: null,
            emailVerified: null,
        },
    });
    // Eliminar registros asociados al usuario
    await db_1.db.account.deleteMany({ where: { userId: user.id } });
    await db_1.db.jwtToken.deleteMany({ where: { userId: user.id } });
    await db_1.db.twoFactorToken.deleteMany({ where: { email: user.email } });
    await db_1.db.twoFactorConfirmation.deleteMany({ where: { userId: user.id } });
    await db_1.db.verificationToken.deleteMany({ where: { email: user.email } });
    await db_1.db.passwordResetToken.deleteMany({ where: { email: user.email } });
    await db_1.db.deleteToken.deleteMany({ where: { email: user.email } });
    // Guardar el motivo de eliminación si fue proporcionado
    if (reason) {
        await db_1.db.reasonDeleteAccount.create({
            data: { reason },
        });
    }
    res.status(200).json({ success: true, message: "Cuenta eliminada exitosamente" });
});
