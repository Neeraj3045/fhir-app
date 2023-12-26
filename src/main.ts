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
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { writeFileSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  app.setGlobalPrefix(process.env.GLOBAL_PREFIX, {
    exclude: [
      { path: process.env.GLOBAL_PREFIX, method: RequestMethod.GET}
    ]
  });

  app.setViewEngine('hbs');
  app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      maxAge: 30 * 60 * 1000,
      httpOnly: true,
    }
  }));

  app.use(cookieParser());
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
        if (error.children != undefined && arr.length !=0) {
          const newError = error?.children.map(function (newError) {
            let error_nkey = 0;
            if (newError.contexts) {
              if (newError.contexts.isNotEmpty) {
                error_nkey = newError.contexts.isNotEmpty.key;
              } else if (newError.contexts.isInt) {
                error_nkey = newError.contexts.isInt.key;
              } else if (newError.contexts.isEmail) {
                error_nkey = newError.contexts.isEmail.key;
              } else if (newError.contexts.IsString) {
                error_nkey = newError.contexts.IsString.key;
              } else if (newError.contexts.IsUserAlreadyExistConstraint) {
                error_nkey = newError.contexts.IsUserAlreadyExistConstraint.key;
              } else if (newError.contexts.isMobilePhone) {
                error_nkey = newError.contexts.isMobilePhone.key;
              } else if (newError.contexts.Match) {
                error_nkey = newError.contexts.Match.key;
              }
            }
            var jsonData = {};
            jsonData['message'] = `${Object?.values(
              newError?.constraints,
            )}`;
            if (error_nkey) {
              jsonData['message'] = `${error_nkey}`;
            }
            return jsonData;
          })
          return newError;
        } else {
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
          //${error.property} has wrong value ${error.value},
          jsonData['message'] = `${Object.values(
            error.constraints,
          )}`;
          if (error_key) {
            jsonData['key'] = `${error_key}`;
          }
          return jsonData;
        }
      })
      return new PreconditionFailedException(message[0] ? message[0] : message);
    },
  }));

  app.useGlobalFilters(new AllExceptionsFilter());
  app.getHttpAdapter().getInstance().disable('x-powered-by');
  const d = new Date();
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  const nth = function (d: number) {
    if (d > 3 && d < 21) return 'th';
    switch (d % 10) {
      case 1: return "st";
      case 2: return "nd";
      case 3: return "rd";
      default: return "th";
    }
  }
  
  const config = new DocumentBuilder()
    .setTitle(MESSAGES.API_TITLE)
    .setDescription(` ${MESSAGES.API_DESCRIPTION} <i>Updated on ${d.getDate()}<sup>${nth(d.getDate())}</sup>  ${months[d.getMonth()]}  ${d.getFullYear()} <i/>`)
    .setVersion(process.env.SWAGGER_VERSION)
    .addServer(process.env.API_URL, '', {})
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
  
  await app.listen(process.env.PORT || 1000);
}
bootstrap();
