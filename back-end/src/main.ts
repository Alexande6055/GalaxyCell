import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 1. Pipes Globales (Solo uno es necesario)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      // Esto ayuda a que los IDs en los params se conviertan a número/string automáticamente
      transformOptions: { enableImplicitConversion: true }, 
    }),
  );

  // 2. CORS (Configurado para desarrollo)
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // 3. Servir Archivos Estáticos (Ruta robusta usando el Directorio de Trabajo)
  // process.cwd() apunta a la raíz de tu proyecto 'back-end'
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });

  // 4. Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Galaxi Cell')
    .setDescription('Test endpoints for api')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter your Firebase token',
        in: 'header',
      },
      'firebase-auth' // Este es el ID que usarás en @ApiBearerAuth()
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // 5. Puerto
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  
  console.log(`🚀 Application is running on: http://localhost:${port}/api`);
}
bootstrap();