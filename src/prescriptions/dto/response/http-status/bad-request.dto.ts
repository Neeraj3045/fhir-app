import { ApiProperty } from '@nestjs/swagger';
export class BadRequestSchema {
    @ApiProperty({ required:false,type: String, description: "Failure Status",example: "Failure" })
    "status": string;

    @ApiProperty({ required:false,type: String, description: "Http Status Code",example: 400 })
    "statusCode": number;

    @ApiProperty({ required:false,type: Object, description: "Blank Object",example:{} })
    "data": {};

    @ApiProperty({ required:false,type: String, description: "Error Description",example: "This is bad request" })
    "errorDescription": string;

    

}


