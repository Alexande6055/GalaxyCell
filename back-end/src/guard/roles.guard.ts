import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { RolUsuario } from "src/utils/enums/RolUsuarios.enum";
import { ROLES_KEY } from "../decorators/roles.decoratos";
import { AuthService } from "auth/auth/auth.service";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private readonly authService: AuthService,
        private readonly reflector: Reflector
    ) { }
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
