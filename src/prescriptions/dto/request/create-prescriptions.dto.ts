
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsNotEmpty,
    IsArray,
    IsDateString,
    IsString,
    ValidateNested,
    Length,
    } from 'class-validator';

export class MedicationParam{

    @IsNotEmpty()
    @IsString()
    "dosage":string
}

export class PatientParam{
    @IsNotEmpty()
    @IsString()
    @Length(10)
    "nhi":string;

    @IsNotEmpty({"message":"Name should be string & required"})
    @IsString()
    "name":string
}

export class CreateprescriptionsDto {
    @ApiProperty({example:{'nhi':'nhi-1234','name':'Smith'},})
    @IsNotEmpty()
    @ValidateNested({each:true})
    @Type(()=>PatientParam)
    patient: PatientParam;

    @ApiProperty({example:new Date(),type:Date})
    @IsNotEmpty()
    @IsDateString()
    date: string;

    @ApiProperty({example:[{'id':'63afe809158d860c20c94aae','dosage':'5ml'}],type:[Object]})
    @IsNotEmpty()
    @IsArray()
    @ValidateNested({each:true})
    @Type(()=>MedicationParam)
    medications: MedicationParam[];
}
