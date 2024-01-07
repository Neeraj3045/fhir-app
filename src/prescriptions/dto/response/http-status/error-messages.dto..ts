import { ApiProperty } from "@nestjs/swagger";
import { GetSuccessSchema } from "./get-success.dto";

 class ErrorMesaages {
    @ApiProperty({required:false, example: 11 })
    "id": number;

    @ApiProperty({ required:false,example: "" })
    "error_code": string;

    @ApiProperty({ required:false,example: 1 })
    "type_message": number;

    @ApiProperty({ required:false,example: "" })
    "message": string;


}
export class ErrorMesaagesSchema extends GetSuccessSchema {

    @ApiProperty({ required:false,type: ErrorMesaages, isArray: true })
    "data": string;
}


