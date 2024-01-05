import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import { ConfigModule, ConfigService } from '@nestjs/config';
import winston from 'winston';
import { MongooseModule } from '@nestjs/mongoose';
import { PrescriptionModule } from './prescriptions/prescriptions.module';


const configModules = [
  ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: ['.env'],
  }),

  WinstonModule.forRootAsync({
    useFactory: (configService: ConfigService) => ({
      transports: [
        new winston.transports.File({
          filename: `log/request-response.log`,
        }),
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            nestWinstonModuleUtilities.format.nestLike(),
          ),
        }),
      ],
    }),
    inject: [ConfigService],
  }),
  PrescriptionModule,
]


var mongoDB = `mongodb://${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/${process.env.MONGODB_DATABASE}`;
configModules.push(MongooseModule.forRoot(mongoDB));

@Module({
  imports: configModules,
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
      consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
