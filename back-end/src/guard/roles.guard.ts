import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { RolUsuario } from "src/utils/enums/RolUsuarios.enum";
import { ROLES_KEY } from "../decorators/roles.decoratos";
import { AuthService } from "src/app/auth/auth/auth.service";

/**
 * Guardia de NestJS encargado del control de acceso basado en roles (RBAC).
 * Verifica si el usuario autenticado posee uno de los roles requeridos para acceder a la ruta.
 */
@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private readonly authService: AuthService,
        private readonly reflector: Reflector
    ) { }

    /**
     * Evalúa si el usuario autenticado tiene el rol necesario.
     * 1. Extrae los roles requeridos definidos mediante el decorador `@Roles()`.
     * 2. Si no hay roles requeridos definidos en la ruta o controlador, se autoriza el paso (`true`).
     * 3. Recupera el UID del usuario a partir del request (previamente inyectado por `FirebaseGuard`).
     * 4. Consulta los detalles del usuario (incluyendo su rol en base de datos) usando el `AuthService`.
     * 5. Compara el rol del usuario con los roles requeridos.
     * 
     * @param context - Contexto de ejecución de la petición.
     * @returns `true` si el rol coincide, de lo contrario lanza una excepción.
     * @throws {ForbiddenException} Si no se identifica al usuario o si este no posee los permisos necesarios.
     */
    async canActivate(context: ExecutionContext) {
        const rolesRequeridos = this.reflector.getAllAndOverride<RolUsuario[]>(
            ROLES_KEY,
            [context.getHandler(), context.getClass]
        );
        if (!rolesRequeridos || rolesRequeridos.length == 0) {
            return true
        }

        const request = context.switchToHttp().getRequest();
        const uid: string = request.user?.uid;

        if (!uid) {
            throw new ForbiddenException('No se ha identificado el usuario');
        }

        const user = await this.authService.buscarPorUidFirebase(uid);

        const tienePermiso = rolesRequeridos.includes(user.rol as RolUsuario)

        if (!tienePermiso) {
            throw new ForbiddenException('No tienes permisos para acceder a esta ruta');
        }

        return true;
    }


}  
