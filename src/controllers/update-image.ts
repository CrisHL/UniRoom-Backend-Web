import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { db } from "../lib/db";
import multer from "multer";
import { v2 as cloudinary } from 'cloudinary';

// Configura Cloudinary con tus credenciales
cloudinary.config({
  cloud_name: 'dekw4chhd',
  api_key: '377379286375581',
  api_secret: '_xkvPqQ7zFiHGRSu_Kb2BF22A-E',
});

// Configura multer para almacenar el archivo en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Controlador para actualizar la imagen del usuario
export const updateUserImage = [
  upload.single('image'), // Campo de la imagen en el formulario debe ser 'image'
  asyncHandler(async (req: Request, res: Response) => {
    const token = req.body.token;
    const file = req.file as any;

    if (!token) {
      res.status(400).json({ error: "El token es requerido" });
      return;
    }

    if (!file) {
      res.status(400).json({ error: "La imagen es requerida" });
      return;
    }

    // Verifica si el token existe en la base de datos
    const jwtTokenRecord = await db.jwtToken.findUnique({
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

    try {
      // Sube la imagen a Cloudinary
      const uploadResult: any = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'Users' }, // Opcional: especifica una carpeta en Cloudinary
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        uploadStream.end(file.buffer);
      });

      // Obtiene la URL segura de la imagen subida
      const imageUrl = uploadResult.secure_url;

      // Actualiza la URL de la imagen en la base de datos del usuario
      const updatedUser = await db.user.update({
        where: { id: dbUser.id },
        data: {
          image: imageUrl,
        },
      });

      // Devuelve una respuesta de éxito con el usuario actualizado
      res.status(200).json({
        success: true,
        message: "Imagen actualizada correctamente",
        user: updatedUser,
      });

    } catch (error) {
      console.error('Error al subir la imagen a Cloudinary:', error);
      res.status(500).json({ error: 'Error al subir la imagen' });
      return;
    }
  }),
];
