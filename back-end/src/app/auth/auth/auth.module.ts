import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from 'src/app/auth/entities/auth.entity';
import { FirebaseModule } from 'src/firebase/firebase.module';

/**
 * Módulo de NestJS para la gestión de autenticación y usuarios.
 * Integra TypeORM para la entidad Auth, importa FirebaseModule para la integración con Firebase Admin,
 * expone el servicio AuthService y registra el controlador AuthController.
 */
@Module({
  imports: [TypeOrmModule.forFeature([Auth]),FirebaseModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService]
})
export class AuthModule { }
