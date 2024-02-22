import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
// import { WsAdapter } from '@nestjs/platform-ws';

async function bootstrap() {
  const logger = new Logger('main');
  const app = await NestFactory.create(AppModule);
  // app.useWebSocketAdapter((new WsAdapter()))
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     validateCustomDecorators: true // <-- Add this to allow the validation pipe to work with our custom decorator
  //   })
  // );

  const cors_options = {
    "origin": ["https://dev-swap.openmeta.city", "https://localhost:8080", "http://localhost:8080"],
    // "origin": "https://dev-swap.openmeta.city",
    // "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    "preflightContinue": false,
    "credentials": true,
    "optionsSuccessStatus": 204
  }
  app.enableCors(cors_options);
  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('PORT') || 3000;
  await app.listen(PORT);

  const environment = configService.get<string>('NODE_ENV');

  logger.log(
    `Server Start[Port:${PORT}, Environment:${environment}]\n`,
  );
  // console.log(`Server Port:${PORT}`);
}
bootstrap();

