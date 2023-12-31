// src/common/filters/auth-exceptions.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  UnauthorizedException,
  ForbiddenException,
  PreconditionFailedException,
} from '@nestjs/common';
import { Request, Response } from 'express';

interface IRequestFlash extends Request {
  flash: any;
}

@Catch(HttpException)
export class AuthExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<IRequestFlash>();
    if (
      exception instanceof UnauthorizedException ||
      exception instanceof ForbiddenException ||
      exception instanceof PreconditionFailedException
    ) {
      
      request.flash('loginError', 'Please check credential and try again!');

    }
    response.redirect('/auth/admin/login');

  }
}
