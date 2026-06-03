import { SetMetadata } from "@nestjs/common";

/**
 * Clave de metadatos utilizada para marcar rutas como públicas (omitir la guardia de autenticación).
 */
export const PUBLIC_KEY = 'public';

/**
 * Decorador personalizado para marcar un endpoint o controlador como público.
 * Cuando se aplica, la guardia de Firebase omitirá la verificación del token de autenticación para esta ruta.
 * 
 * @returns {CustomDecorator<string>} Un decorador de metadatos de NestJS.
 */
export const Public = () => SetMetadata(PUBLIC_KEY, true);