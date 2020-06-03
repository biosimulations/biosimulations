/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  setupOpenApi(app);

  const port = process.env.port || 3333;
  await app.listen(port, () => {
    console.log('Listening at http://localhost:' + port + '/');
  });
}

function setupOpenApi(app) {
  const options = new DocumentBuilder()
    .setTitle('Biosimulations Resource API')
    .setDescription('The API to interact with the Biosimulations Database')
    .setVersion('0.1')
    .addTag('Models')
    .addTag('Projects')
    .addTag('Simulations')
    .addTag('Charts')
    .addTag('Visualizations')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('', app, document);
}
bootstrap();
