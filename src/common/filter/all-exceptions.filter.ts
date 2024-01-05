import { Catch, ArgumentsHost, Inject, HttpServer, HttpStatus, HttpException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
@Catch(HttpException)
export class AllExceptionsFilter extends BaseExceptionFilter {

    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        let error = {};

        let status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.BAD_REQUEST;
        let error_message = 'This is bad request';

        if(exception?.response?.message){
            error = exception?.response?.message;
            if(typeof error === 'object' && error !== null){
                error = error;
            }else{
                error = {"message":error};
            }
        } else {
            error = {"message":exception?.message};
        }

        
        switch (status) {

            case HttpStatus.UNAUTHORIZED:
                status = HttpStatus.UNAUTHORIZED;
                error_message = 'Unauthorized access';
                break;
            case HttpStatus.PAYLOAD_TOO_LARGE:
                status = HttpStatus.PAYLOAD_TOO_LARGE;
                error_message = 'Payload data is too large.';
                break;
            case HttpStatus.NOT_FOUND:
                status = HttpStatus.NOT_FOUND;
                error_message = 'This request is not found';
                break;
            case HttpStatus.SERVICE_UNAVAILABLE:
                status = HttpStatus.SERVICE_UNAVAILABLE;
                error_message = 'Service is not available';
                break;
            case HttpStatus.NOT_ACCEPTABLE:
                status = HttpStatus.NOT_ACCEPTABLE;
                error_message = 'Not Acceptable';
                break;
            case HttpStatus.FORBIDDEN:
                status = HttpStatus.FORBIDDEN;
                error_message = 'Forbidden';
                break;
            case HttpStatus.EXPECTATION_FAILED:
                status = HttpStatus.EXPECTATION_FAILED;
                error_message = 'Exception Failed';
                break;
            case HttpStatus.BAD_REQUEST:
                status = HttpStatus.BAD_REQUEST;
                error_message = 'This is bad request';
                break;
            case HttpStatus.REQUEST_TIMEOUT:
                status = HttpStatus.REQUEST_TIMEOUT;
                error_message = 'Request has been time out';
                break;
            case HttpStatus.METHOD_NOT_ALLOWED:
                status = HttpStatus.METHOD_NOT_ALLOWED;
                error_message = 'This method is not allowed';
                break;
            case HttpStatus.INTERNAL_SERVER_ERROR:
                status = HttpStatus.INTERNAL_SERVER_ERROR;
                error_message = 'Internal server error';
                break;
            default:
                status = HttpStatus.PRECONDITION_FAILED;
                error_message = 'Input data validation failed';
                break;


        }

        response
            .status(status)
            .json({
                "status": "Failure",
                "statusCode": status,
                "data": "{}",
                "errorDescription": error_message,
                "error": error,
            });
    }
}