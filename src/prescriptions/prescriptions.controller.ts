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
import { 
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { MESSAGES } from 'src/constants';
import { PrescriptionSavedto, PrescriptionUpdateDto } from './dto/response/prescription-success.dto';


@ApiTags(MESSAGES.PRESCRIPTION_TAG)
@ApiBearerAuth()
@Controller()
export class PrescriptionsController {
  constructor(private readonly PrescriptionsService: PrescriptionsService) { }

  //Create Presciption
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
  create(
    @Body() CreateprescriptionsDto: CreateprescriptionsDto
  ) {
    return this.PrescriptionsService.createPrescriptions(CreateprescriptionsDto);
  }

  //Search prescriptions
  @Get('/v1/prescriptions/:nhi')
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
    @Query() {page, limit}: PaginationWithFilters,
    @Param('nhi')  nhi : string
  ) {
    return this.PrescriptionsService.prescriptionsList(nhi, page, limit);
  }

  // Update precription
  @Put('/v1/prescriptions/:nhi/:id')
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
    @Param('nhi') nhi: string,
    @Param('id') id: string,
    @Body() UpdatePrescriptionDto: UpdatePrescriptionDto
  ) {
    return this.PrescriptionsService.updatePrescription(nhi,id,UpdatePrescriptionDto);
  }
}
