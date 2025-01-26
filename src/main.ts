import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("api/v1");

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  const config = new DocumentBuilder()
     .setTitle("Cats example")
     .setDescription("The cats API description")
     .setVersion("1.0")
     .addBearerAuth() // utilizado para poder introducir el Token desde swagger
     .build();
  const document = SwaggerModule.createDocument(app, config);
  // Enlace para revisar la documentación del API utilizando Swagger
  // http://localhost:3000/docs
  SwaggerModule.setup("docs", app, document);
  

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
