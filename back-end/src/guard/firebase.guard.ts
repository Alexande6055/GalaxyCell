import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { FirebaseService } from "src/firebase/firebase.service";
import { PUBLIC_KEY } from "../decorators/public.decorator";

/**
 * Guardia de NestJS encargado de interceptar las peticiones HTTP para validar la autenticación del usuario.
 * Utiliza Firebase Admin para verificar el token ID JWT provisto en las cabeceras.
 */
@Injectable()
export class FirebaseGuard implements CanActivate {
    constructor(
        private readonly firebaseService: FirebaseService,
        private readonly reflector: Reflector
    ) { }

    /**
     * Determina si la petición actual tiene autorización para continuar.
     * 1. Verifica si la ruta o controlador está marcado como `@Public()`. De ser así, permite el acceso.
     * 2. Extrae el token de tipo 'Bearer' de la cabecera 'Authorization'.
     * 3. Llama a FirebaseService para validar el token JWT.
     * 4. Inyecta los datos decodificados del usuario (email y uid) en el objeto Request para su uso posterior.
     * 
     * @param context - Contexto de ejecución de la petición.
     * @returns `true` si la petición es autorizada, de lo contrario lanza una excepción.
     * @throws {UnauthorizedException} Si el token no es provisto o si es inválido.
     */
    async canActivate(context: ExecutionContext) {

        const isPublic = this.reflector.get<boolean>(PUBLIC_KEY, context.getHandler());

        if (isPublic) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException('Envie el token de autorizacion');
        }

        const tokenLimpio = authHeader.replace('Bearer ', '');
        try {
            const tokenDecodificaddo = await this.firebaseService.verifyIdToken(tokenLimpio);
            request.user = {
                email: tokenDecodificaddo.email,
                uid: tokenDecodificaddo.uid,
            }
            return true;
        } catch (error) {
            throw new UnauthorizedException('Token no valido');
        }

    }

}