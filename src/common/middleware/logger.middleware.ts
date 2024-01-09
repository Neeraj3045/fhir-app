import { Request, Response, NextFunction } from "express";
import { Inject, Injectable, NestMiddleware } from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
  ) {}

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, originalUrl, body } = request;
    const userAgent = request.get("user-agent") || "";
    response.on("finish", () => {
      const { statusCode } = response;
      const contentLength = response.get("content-length");
      this.logger.info(
        JSON.stringify(
          `${method} ${originalUrl}  ${body} ${statusCode} ${contentLength} - ${userAgent} ${ip}`,
        ),
      );
    });

    next();
  }
}
