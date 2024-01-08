import { ArgumentsHost, createParamDecorator,HttpStatus } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate,ValidationError } from 'class-validator';

export const RequestHeader = createParamDecorator(
  async (value: any, host: ArgumentsHost) => {

    // extract headers
    const ctx = host.switchToHttp();
    const headers = ctx.getRequest().headers;
    const response = ctx.getResponse();
    // Convert headers to DTO object
    const dto = plainToClass(value, headers, { excludeExtraneousValues: true });
    // Validate 
    const errors: ValidationError[] = await validate(dto);

    if (errors.length > 0) {
      //Get the errors and push to custom array
      let validationErrors = errors.map(obj => Object.values(obj.constraints));
      return response
        //.status(HttpStatus.FORBIDDEN)
        .status(HttpStatus.BAD_REQUEST)
        .json({
          "status": "Failure",
          "statusCode": "400",
          "data": "{}",
          "errorDescription": "Missing Authorization Header",
          "error": validationErrors,

        });
    }
    // return header dto object
    return dto;

  },
)