import { SetMetadata } from "@nestjs/common";
import { RolUsuario } from "src/utils/enums/RolUsuarios.enum";

/**
 * Clave de metadatos utilizada para almacenar los roles requeridos para una ruta.
 */
export const ROLES_KEY = "roles";

/**
 * Decorador personalizado para definir los roles de usuario permitidos en un endpoint o controlador.
 * La guardia de roles utilizará este metadato para restringir el acceso a usuarios que posean al menos uno de los roles especificados.
 * 
 * @param {...RolUsuario[]} roles - Lista de roles permitidos (por ejemplo, ADMIN, CLIENTE).
 * @returns {CustomDecorator<string>} Un decorador de metadatos de NestJS.
 */
export const Roles = (...roles: RolUsuario[]) => SetMetadata(ROLES_KEY, roles);