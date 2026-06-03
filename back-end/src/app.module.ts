import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envValidationSchema } from './config/env.validation';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from './app/category/category.module';
import { ProductModule } from './app/products/product.module';
import { BrandModule } from './app/brand/brand.module';
import { APP_GUARD } from '@nestjs/core';
import { FirebaseGuard } from './guard/firebase.guard';
import { RolesGuard } from './guard/roles.guard';
import { FirebaseModule } from './firebase/firebase.module';
import { AuthModule } from 'src/app/auth/auth/auth.module';

/**
 * Módulo raíz (Root Module) de la aplicación NestJS.
 * Se encarga de:
 * 1. Cargar la configuración global de entorno (.env) y validar su esquema.
 * 2. Establecer la conexión global con la base de datos PostgreSQL mediante TypeORM.
 * 3. Importar los módulos funcionales del negocio (Categorías, Productos, Marcas, Firebase, Autenticación).
 * 4. Registrar globalmente los guardias de seguridad `FirebaseGuard` (autenticación) y `RolesGuard` (control de acceso/roles).
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: envValidationSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: true
      },
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
      logging: true
    }),
    CategoryModule, ProductModule, BrandModule,FirebaseModule,AuthModule
  ],
  providers: [{
    provide: APP_GUARD,
    useClass: FirebaseGuard
  }, {
    provide: APP_GUARD,
    useClass: RolesGuard
  }],
})
export class AppModule { }
