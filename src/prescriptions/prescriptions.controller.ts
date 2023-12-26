import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpStatus,
  HttpCode,
  UseInterceptors,
  Put,
  Query
} from '@nestjs/common';
import { PrescriptionsService } from './prescriptions.service';
import { CreateprescriptionsDto } from './dto/request/create-prescriptions.dto';
import { UpdatePrescriptionDto } from './dto/request/update-prescriptions.dto';
import { TransformInterceptor } from 'src/common/interceptor/transform.interceptor';
import { PaginationWithFilters } from 'src/utils/paginationWithFilter';
import { ParamsWithId } from 'src/utils/paramWithId';
import { 
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { MESSAGES } from 'src/constants';
import { BadRequestSchema } from './dto/response/http-status/bad-request.dto';
import { ForbiddenSchema } from './dto/response/http-status/forbidden.dto';
import { InternalServerErrorSchema } from './dto/response/http-status/internal-server-error.dto';
import { PrescriptionSavedto, PrescriptionUpdateDto } from './dto/response/prescription-success.dto';


@ApiTags(MESSAGES.PRESCRIPTION_TAG)
@ApiBearerAuth()
@ApiBadRequestResponse({
  type: BadRequestSchema,
  description: MESSAGES.BAD_REQUEST_MSG,
})
@ApiResponse({
  status: 403,
  type: ForbiddenSchema,
  description: MESSAGES.FORBIDDEN_MSG,
})
@ApiResponse({
  status: 500,
  type: InternalServerErrorSchema,
  description: MESSAGES.INTERNAL_SERVER_ERROR_MSG,
})

@Controller()
export class PrescriptionsController {
  constructor(private readonly PrescriptionsService: PrescriptionsService) { }

  @Post('/v1/prescriptions')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    operationId: 'add-prescription',
    description: MESSAGES.ADD_PRESCRIPTION_DESCRIPTION,
    summary: MESSAGES.ADD_PRESCRIPTION_SUMMARY,
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: PrescriptionSavedto,
    isArray: false,
    description: MESSAGES.ADD_PRESCRIPTION_RESPONSE_DESCRIPTION,
  })
  @UseInterceptors(TransformInterceptor)
  create(@Body() CreateprescriptionsDto: CreateprescriptionsDto
  ) {
    return this.PrescriptionsService.createPrescriptions(CreateprescriptionsDto);
  }

  @Get('/v1/prescriptions')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    operationId: 'search-prescription',
    description: MESSAGES.SEARCH_PRESCRIPTION_DESCRIPTION,
    summary: MESSAGES.SEARCH_PRESCRIPTION_SUMMARY,
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: CreateprescriptionsDto,
    isArray: true,
    description: MESSAGES.SEARCH_PRESCRIPTION_RESPONSE_DESCRIPTION,
  })
  @UseInterceptors(TransformInterceptor)
  findPrescriptions(
    @Query() { filters, page, limit, sort }: PaginationWithFilters
  ) {
    return this.PrescriptionsService.prescriptionsList(filters, page, limit, sort);
  }

  @Get('/v1/prescriptions/:id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(TransformInterceptor)
  @ApiOperation({
    operationId: 'fetch-prescription',
    description: MESSAGES.GET_PRESCRIPTION_DESCRIPTION,
    summary: MESSAGES.GET_PRESCRIPTION_SUMMARY,
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: CreateprescriptionsDto,
    isArray: false,
    description: MESSAGES.GET_PRESCRIPTION_RESPONSE_DESCRIPTION,
  })
  findPrescription(
    @Param() { id }: ParamsWithId) {
    return this.PrescriptionsService.prescriptionDetails(id);
  }

  @Put('/v1/prescriptions/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    operationId: 'update-prescription',
    description: MESSAGES.UPDATE_PRESCRIPTION_DESCRIPTION,
    summary: MESSAGES.UPDATE_PRESCRIPTION_SUMMARY,
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: PrescriptionUpdateDto,
    isArray: false,
    description: MESSAGES.UPDATE_PRESCRIPTION_RESPONSE_DESCRIPTION,
  })
  @UseInterceptors(TransformInterceptor)
  updatePrescription(
    @Param('id') id: string,
    @Body() UpdatePrescriptionDto: UpdatePrescriptionDto
  ) {
    return this.PrescriptionsService.updatePrescription(id, UpdatePrescriptionDto);
  }
}
