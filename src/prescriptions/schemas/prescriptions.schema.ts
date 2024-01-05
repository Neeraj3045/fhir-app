
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { STATUS } from 'src/enums/enums';

export type PrescriptionDocument = Prescription & Document;


@Schema()
 export class Prescription{

    @Prop({required:true,type:Object})
    patient:{
        "nhi":string,
        "name":string
    };

    @Prop({required:true})
    date:Date;

    @Prop({required:true,type:[Object]})
    medications:[{
        "id":string,
        "dosage":string
    }];
    
    @Prop({default:STATUS.ACTIVE})
    status:STATUS;

    @Prop({ default: Date.now })
    createdOn: Date;

    @Prop({required:false, default:null,type:Date })
    updatedOn: Date;
}

const createSchema = SchemaFactory.createForClass(Prescription);
const prescriptionSchema = createSchema.index({'patient.nhi': 1}, {unique: true});
export {prescriptionSchema}
