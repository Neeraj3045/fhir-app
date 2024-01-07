import {PartialType } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CreateprescriptionsDto } from './create-prescriptions.dto';
import { STATUS } from 'src/enums/enums';

export class UpdatePrescriptionDto extends PartialType(CreateprescriptionsDto) {
    updatedOn: Date;
    
    @IsOptional()
    @IsString()
    @IsEnum(STATUS)
    status:STATUS;
}