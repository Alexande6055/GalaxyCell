import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { FirebaseService } from "src/firebase/firebase.service";
import { PUBLIC_KEY } from "../decorators/public.decorator";

@Injectable()
export class FirebaseGuard implements CanActivate {
    constructor(
        private readonly firebaseService: FirebaseService,
        private readonly reflector: Reflector
    ) { }
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