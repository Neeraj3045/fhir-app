import { ApiProperty } from '@nestjs/swagger';
import { SuccessSchema } from './http-status/success.dto';

class PrescriptionSave {
    @ApiProperty({ required: true, example:"63afe809158d860c20c94aae"})
    "id": string;

    @ApiProperty({ required: true, example:"Prescription created successfully"})
    "message": string;
}

class PrescriptionUpdate {
    @ApiProperty({ required: true, example:"63afe809158d860c20c94aae"})
    "id": string;

    @ApiProperty({ required: true, example:"Prescription updated successfully"})
    "message": string;
}



export class PrescriptionSavedto extends SuccessSchema {
    @ApiProperty({ required: false, type: () => PrescriptionSave })
    data: PrescriptionSave;
}
export class PrescriptionUpdateDto extends SuccessSchema {
    @ApiProperty({ required: false, isArray: true, type: () => PrescriptionSave })
    data: PrescriptionUpdate;
}
