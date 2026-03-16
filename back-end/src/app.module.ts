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
