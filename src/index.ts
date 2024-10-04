import express from "express";
import userRoutes from "./routes/userRoutes";

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Usar las rutas de usuario
app.use("/api/users", userRoutes);

// Iniciar el servidor
export default app;