import { ApiProperty } from '@nestjs/swagger';
export class InternalServerErrorSchema {
  
    @ApiProperty({ required:false,type: String, description: "Failure Status",example: "Failure" })
    "status": string;

    @ApiProperty({ required:false,type: String, description: "Http Status Code",example: 500 })
    "statusCode": number;

    @ApiProperty({ required:false,type: Object, description: "Blank Object",example:{} })
    "data": {};

    @ApiProperty({ required:false,type: String, description: "Error Description",example: "Internal server error" })
    "errorDescription": string;
    

}


