// Configuración de Cloudinary usando variables de entorno
import { v2 as cloudinary } from 'cloudinary';

export function configureCloudinary() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export async function subirImagenCloudinary(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder: 'museo/piezas', resource_type: 'image' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result!.secure_url);
      },
    ).end(buffer);
  });
}

export async function eliminarImagenCloudinary(url: string): Promise<void> {
  // Extrae el public_id desde la URL de Cloudinary
  const match = url.match(/museo\/piezas\/([^.]+)/);
  if (!match) return;
  await cloudinary.uploader.destroy(`museo/piezas/${match[1]}`);
}
