import { Module } from '@nestjs/common';
import { FirebaseService } from './firebase.service';

/**
 * Módulo de NestJS que encapsula e inicializa la integración con Firebase Admin SDK.
 * Exporta FirebaseService para permitir su uso en otros módulos (ej. AuthModule).
 */
@Module({
    providers: [FirebaseService],
    exports: [FirebaseService],
})
export class FirebaseModule { }
