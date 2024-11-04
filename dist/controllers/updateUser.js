"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const axios_1 = __importDefault(require("axios")); // Para realizar la solicitud HTTP a la nueva API
const db_1 = require("../lib/db");
const schemas_1 = require("../schemas");
const users_1 = require("../data/users");
const tokens_1 = require("../lib/tokens");
const mail_1 = require("../lib/mail");
exports.updateUser = (0, express_async_handler_1.default)(async (req, res) => {
    // Validar los campos de entrada con el esquema definido
    const validateFields = schemas_1.UpdateSchema.safeParse(req.body);
    if (!validateFields.success) {
        res.status(400).json({ error: "Datos inválidos", details: validateFields.error.errors });
        return;
    }
    const values = validateFields.data;
    const { token } = req.body;
    // Verifica si el token existe en la base de datos
    const jwtTokenRecord = await db_1.db.jwtToken.findUnique({
        where: { token: token },
        include: {
            user: true,
        },
    });
    if (!jwtTokenRecord) {
        res.status(403).json({ error: "Token inválido o no encontrado" });
        return;
    }
    const dbUser = jwtTokenRecord.user;
    // Verifica si el correo ha cambiado y si ya está en uso
    if (values.email && values.email !== dbUser.email) {
        const existingUser = await (0, users_1.getUserByEmail)(values.email);
        if (existingUser && existingUser.id !== dbUser.id) {
            res.status(400).json({ error: true, message: "El correo ya está en uso" });
            return;
        }
        // Genera y envía un token de verificación al nuevo correo
        const verificationToken = await (0, tokens_1.generateVerificationToken)(values.email);
        await (0, mail_1.sendVerificationEmail)(verificationToken.email, verificationToken.token);
        res.status(200).json({ success: "Correo de verificación enviado!" });
        return;
    }
    // Verifica si el nombre ha cambiado y actualiza en chats y mensajes
    if (values.name && values.name !== dbUser.name) {
        try {
            // Llama a la API para actualizar el nombre en chats y mensajes
            await axios_1.default.post("https://uniroom-backend-services.onrender.com/update-user", {
                userId: dbUser.id,
                newName: values.name,
            });
        }
        catch (error) {
            console.error("Error al actualizar el nombre en chats y mensajes:", error);
            res.status(500).json({ error: "Error al actualizar el nombre en chats y mensajes" });
            return;
        }
    }
    // Verifica la contraseña actual antes de permitir un cambio
    if (values.password && values.newPassword && dbUser.password) {
        const passwordsMatch = await bcryptjs_1.default.compare(values.password, dbUser.password);
        if (!passwordsMatch) {
            res.status(204).json({ error: true, message: "Contraseña incorrecta" });
            return;
        }
        // Hash de la nueva contraseña
        const hashedPassword = await bcryptjs_1.default.hash(values.newPassword, 10);
        values.password = hashedPassword;
        values.newPassword = undefined;
    }
    // Actualiza los datos del usuario en la base de datos
    const updatedUser = await db_1.db.user.update({
        where: { id: dbUser.id },
        data: {
            ...values,
        },
    });
    // Devuelve una respuesta de éxito con el usuario actualizado
    res.status(200).json({
        success: true,
        message: "Cambios realizados correctamente",
        user: updatedUser
    });
});
