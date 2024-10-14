"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../lib/db");
const schemas_1 = require("../schemas");
const users_1 = require("../data/users");
const two_factor_token_1 = require("../data/two-factor-token");
const mail_1 = require("../lib/mail");
const tokens_1 = require("../lib/tokens");
const two_factor_confirmation_1 = require("../data/two-factor-confirmation");
const JWT_SECRET = process.env.JWT_SECRET || 'Un1R0Om202A*@*';
// Generar JWT
const generateJWT = (userId) => {
    const token = jsonwebtoken_1.default.sign({ userId }, JWT_SECRET); // Sin expiración
    return token;
};
// Controlador para manejar el inicio de sesión de usuarios
exports.login = (0, express_async_handler_1.default)(async (req, res) => {
    const validateFields = schemas_1.LoginSchema.safeParse(req.body);
    if (!validateFields.success) {
        res.status(400).json({ error: "Credenciales inválidas" });
        return;
    }
    const { email, password, code } = validateFields.data;
    const existingUser = await (0, users_1.getUserByEmail)(email);
    if (!existingUser || !existingUser.email || !existingUser.password) {
        res.status(404).json({ error: "Credenciales inexistentes" });
        return;
    }
    // Verificar si el usuario es ARRENDADOR
    if (existingUser.role === "ARRENDADOR") {
        res.status(403).json({
            error: "No puedes iniciar sesión como arrendador. Si deseas rentar una habitación, por favor crea una cuenta como estudiante.",
        });
        return;
    }
    const isMatch = await bcryptjs_1.default.compare(password, existingUser.password);
    if (!isMatch) {
        res.status(400).json({ error: "Contraseña incorrecta" });
        return;
    }
    if (!existingUser.emailVerified) {
        const verificationToken = await (0, tokens_1.generateVerificationToken)(existingUser.email);
        await (0, mail_1.sendVerificationEmail)(verificationToken.email, verificationToken.token);
        res.status(200).json({ emailVerify: true, message: "Correo de confirmación enviado" });
        return;
    }
    if (existingUser.isTwoFactorEnabled) {
        if (code) {
            const twoFactorToken = await (0, two_factor_token_1.getTwoFactorTokenByEmail)(existingUser.email);
            if (!twoFactorToken || twoFactorToken.token !== code) {
                res.status(400).json({ error: "Código inválido" });
                return;
            }
            if (new Date(twoFactorToken.expires) < new Date()) {
                res.status(400).json({ error: "El código ha expirado" });
                return;
            }
            await db_1.db.twoFactorToken.delete({ where: { id: twoFactorToken.id } });
            const existingConfirmation = await (0, two_factor_confirmation_1.getTwoFactorConfirmationByUserId)(existingUser.id);
            if (existingConfirmation) {
                await db_1.db.twoFactorConfirmation.delete({ where: { id: existingConfirmation.id } });
            }
            await db_1.db.twoFactorConfirmation.create({ data: { userId: existingUser.id } });
            const jwtToken = generateJWT(existingUser.id);
            await db_1.db.jwtToken.create({
                data: {
                    userId: existingUser.id,
                    token: jwtToken,
                },
            });
            res.status(200).json({
                success: true,
                message: "Inicio de sesión exitoso con 2FA",
                user: { id: existingUser.id, email: existingUser.email, name: existingUser.name },
                jwtToken,
            });
            return;
        }
        else {
            const twoFactorToken = await (0, tokens_1.generateTwoFactorToken)(existingUser.email);
            await (0, mail_1.sendTwoFactorTokenEmail)(twoFactorToken.email, twoFactorToken.token);
            res.status(200).json({ twoFactor: true, message: "Código 2FA enviado al correo" });
            return;
        }
    }
    // Si 2FA no está habilitado
    const jwtToken = generateJWT(existingUser.id);
    await db_1.db.jwtToken.create({
        data: {
            userId: existingUser.id,
            token: jwtToken,
        },
    });
    res.status(200).json({
        success: true,
        message: "Inicio de sesión exitoso",
        user: { email: existingUser.email, name: existingUser.name, image: existingUser.image },
        jwtToken,
    });
});
