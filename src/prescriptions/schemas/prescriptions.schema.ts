import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { STATUS } from "../../enums/enums";

@Schema()
export class Prescription {
  @Prop({ required: true, type: Object })
  patient: {
    nhi: string;
    name: string;
  };

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true, type: [Object] })
  medications: [
    {
      id: string;
      dosage: string;
    },
  ];

  @Prop({ default: STATUS.ACTIVE })
  status: string;

  @Prop({ default: Date.now })
  createdOn: Date;

  @Prop({ required: false, default: null, type: Date })
  updatedOn: Date;
}

export type PrescriptionDocument = Prescription & Document;
export const prescriptionSchema = SchemaFactory.createForClass(Prescription);
