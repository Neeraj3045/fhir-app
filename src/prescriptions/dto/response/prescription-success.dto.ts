import { ApiProperty } from '@nestjs/swagger';

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



export class PrescriptionSavedto  {
    @ApiProperty({ required: false, type: () => PrescriptionSave })
    data: PrescriptionSave;
}
export class PrescriptionUpdateDto {
    @ApiProperty({ required: false, isArray: true, type: () => PrescriptionSave })
    data: PrescriptionUpdate;
}
