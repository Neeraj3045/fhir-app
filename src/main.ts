import {
  RequestMethod,
  ValidationPipe
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { 
DocumentBuilder,
SwaggerDocumentOptions,
SwaggerModule
} from '@nestjs/swagger';
import { ValidationError } from 'class-validator';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filter/all-exceptions.filter';
import { stringify } from 'yaml'
import { MESSAGES } from './constants';
import { NestExpressApplication } from '@nestjs/platform-express';
import { writeFileSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  app.setGlobalPrefix(process.env.GLOBAL_PREFIX, {
    exclude: [
      { path: process.env.GLOBAL_PREFIX, method: RequestMethod.GET}
    ]
  });

  app.useGlobalPipes(new ValidationPipe({
    forbidNonWhitelisted: true,
    transform: true,
    whitelist: true,
    forbidUnknownValues: false,
    errorHttpStatusCode: 412,
    dismissDefaultMessages: false,
    disableErrorMessages: false,
    exceptionFactory: (errors: ValidationError[]) => {
      errors.map(function (error) {
          let jsonData = {};
          jsonData = `${Object.values(
            error.constraints,
          )}`;
          return jsonData;
      })
    },
  }));

  app.useGlobalFilters(new AllExceptionsFilter());
  app.getHttpAdapter().getInstance().disable('x-powered-by');
  
  const config = new DocumentBuilder()
    .setTitle(MESSAGES.API_TITLE)
    .setDescription(` ${MESSAGES.API_DESCRIPTION}`)
    .setVersion(process.env.SWAGGER_VERSION)
    .addServer(process.env.SWAGGER_BASE_URL, '', {})
    .setContact(process.env.SWAGGER_CONTACT_NAME, process.env.SWAGGER_CONTACT_WEBSITE, process.env.SWAGGER_CONTACT_EMAIL)
    .setTermsOfService(process.env.SWAGGER_TERMS_OF_SERVICES)
    .setExternalDoc(process.env.SWAGGER_EXTERNAL_DOC, process.env.SWAGGER_EXTERNAL_DOC_URL)
    .setLicense(process.env.SWAGGER_LICENSE_NAME, process.env.SWAGGER_LICENSE_URL)
    .build();
  const options: SwaggerDocumentOptions = {
    deepScanRoutes: true,
    ignoreGlobalPrefix: true,
  };
  const document = SwaggerModule.createDocument(app, config, options);
  writeFileSync("./swagger.yaml", stringify(document));
 SwaggerModule.setup(process.env.SWAGGER_URL, app, document, {
    swaggerOptions: { defaultModelsExpandDepth: -1, defaultModelExpandDepth: 3 },
    customSiteTitle: MESSAGES.API_TITLE});
  
  await app.listen(process.env.PORT);
}
bootstrap();
