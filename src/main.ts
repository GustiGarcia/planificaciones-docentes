import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  // 1) Armamos la configuración con DocumentBuilder.
  //    Es un "builder": cada método devuelve el mismo objeto con un dato más
  //    seteado, por eso podés encadenarlos con puntos. .build() cierra la
  //    cadena y te devuelve el objeto de configuración final.
  const config = new DocumentBuilder()
    .setTitle('Carpeta Docente API')
    .setDescription('API para la gestión de planificaciones docentes según el DCP de Mendoza')
    .setVersion('1.0')
    .build();

  // 2) SwaggerModule.createDocument lee TODOS los controllers y DTOs de tu
  //    AppModule (por eso le pasamos "app") y, usando la config de arriba,
  //    arma el documento OpenAPI completo (en formato JSON internamente).
  //    Todavía no es visible en el navegador, solo está generado en memoria.
  const document = SwaggerModule.createDocument(app, config);

  // 3) SwaggerModule.setup monta ese documento como una página navegable.
  //    El primer argumento ('api') es la ruta donde vas a verlo:
  //    http://localhost:3000/api
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();