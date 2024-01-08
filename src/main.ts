import {
  PreconditionFailedException,
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
import { RedocModule, RedocOptions } from 'nestjs-redoc';
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
      const message = errors.map(function (error) {
        const arr = error.children;
          let error_key = 0;
          if (error.contexts) {
            if (error.contexts.isNotEmpty) {
              error_key = error.contexts.isNotEmpty.key;
            } else if (error.contexts.isInt) {
              error_key = error.contexts.isInt.key;
            } else if (error.contexts.isEmail) {
              error_key = error.contexts.isEmail.key;
            } else if (error.contexts.IsString) {
              error_key = error.contexts.IsString.key;
            } else if (error.contexts.IsUserAlreadyExistConstraint) {
              error_key = error.contexts.IsUserAlreadyExistConstraint.key;
            } else if (error.contexts.isMobilePhone) {
              error_key = error.contexts.isMobilePhone.key;
            } else if (error.contexts.Match) {
              error_key = error.contexts.Match.key;
            }
          }
          var jsonData = {};
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
  const redocOptions: RedocOptions = {
    title: MESSAGES.API_TITLE,
    sortPropsAlphabetically: true,
    hideDownloadButton: false,
    hideHostname: false,
  };
  await RedocModule.setup(process.env.REDOC_URL, app, document, redocOptions);
  SwaggerModule.setup(process.env.SWAGGER_URL, app, document, {
    swaggerOptions: { defaultModelsExpandDepth: -1, defaultModelExpandDepth: 3 },
    customSiteTitle: MESSAGES.API_TITLE});
  
  await app.listen(process.env.PORT || 1001);
}
bootstrap();
