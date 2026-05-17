import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
// import { TransformInterceptor } from './transform.interceptor';
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION', err);
});

process.on('unhandledRejection', (reason) => {
  console.error('UNHANDLED REJECTION', reason);
});
async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  // app.useGlobalInterceptors(new TransformInterceptor());
  const port = process.env.PORT || 3000;

  await app.listen(port, '0.0.0.0');
  logger.log(`Application listening on port ${port}`);
}
void bootstrap();
