import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { envValidationSchema } from './config/env.validation';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from './app/category/category.module';
import { ProductModule } from './app/products/product.module';
import { BrandModule } from './app/brand/brand.module';
import { ImagesModule } from './images/images.module';
import { EquipmentTypesModule } from './app/technical_services/equipment_types/equipment_types.module';
import { ClientModule } from './app/client/client.module';
import { ServiceOrdersModule } from './app/technical_services/service_orders/service_orders.module';
import { ServiceDetailsModule } from './app/technical_services/service_details/service_details.module';
import { KnowledgeBaseModule } from './app/technical_services/knowledge_base/knowledge_base.module';

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
    }),
    CategoryModule, ProductModule, BrandModule,ImagesModule,
    EquipmentTypesModule, ClientModule, ServiceOrdersModule,
    ServiceDetailsModule,KnowledgeBaseModule
  ],
})
export class AppModule { }
