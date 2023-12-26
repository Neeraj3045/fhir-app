import { Controller, Get } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { AppService } from './app.service';

@Controller('fhir')
export class AppController {
  constructor(private readonly appService: AppService) { }

  //it's used for health check
  @Get()
  @ApiExcludeEndpoint()
  healthCheck(): string {
    return this.appService.healthCheck();
  }
}
