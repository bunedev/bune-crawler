import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import {
  swaggerPath,
  swaggerDocumentOptions,
  swaggerSetupOptions,
} from './swagger';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const document = SwaggerModule.createDocument(app, swaggerDocumentOptions);
  Object.values((document as OpenAPIObject).paths).forEach((path: any) => {
    Object.values(path).forEach((method: any) => {
      if (
        Array.isArray(method.security) &&
        method.security.includes('isPublic')
      ) {
        method.security = [];
      }
    });
  });
  SwaggerModule.setup(swaggerPath, app, document, swaggerSetupOptions);

  await app.listen(5000);
}
bootstrap();
