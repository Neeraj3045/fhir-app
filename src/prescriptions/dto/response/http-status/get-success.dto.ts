import { ApiProperty } from '@nestjs/swagger';
export class GetSuccessSchema {

    @ApiProperty({ required:false,type: String, description: "Success Status",example: "Success" })
    "status": string;

    @ApiProperty({ required:false,type: String, description: "Http Status Code",example: 200 })
    "statusCode": string;

    @ApiProperty({ required:false,type: String, description: "Error Description",example: "" })
    "errorDescription": string;

    @ApiProperty({ required:false,type: Object, description: "Blank Error Object",example:{} })
    "error": string;

   
}


