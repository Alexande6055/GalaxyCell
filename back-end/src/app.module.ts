import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envValidationSchema } from './config/env.validation';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env',
    validationSchema: envValidationSchema,
    validationOptions: {
    allowUnknown: true, 
    abortEarly: true, 
  },
  })],
})
export class AppModule {}
