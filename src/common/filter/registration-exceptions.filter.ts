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
export class RegistrationExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<IRequestFlash>();
    request.flash('requestBody', request.body);


    if (
      exception instanceof UnauthorizedException ||
      exception instanceof ForbiddenException ||
      exception instanceof PreconditionFailedException
    ) {
      const errorMessage = exception.getResponse();
      for (let index = 0; index < errorMessage['message'].length; ++index) {
        if ((errorMessage['message'][index]) && errorMessage['message'][index].key) {
          request.flash(errorMessage['message'][index].key, errorMessage['message'][index].message);
        } else if ((errorMessage['message']) && errorMessage['message']) {
          request.flash(errorMessage['key'], errorMessage['message']);
        }
      }

    }
    response.redirect('/auth/admin/register');

  }
}
