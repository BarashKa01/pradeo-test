import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const allowed = 'http://localhost:3000';

  const app = await NestFactory.create(AppModule);
  app.enableCors({origin: allowed});
  await app.listen(5000);
}
bootstrap();