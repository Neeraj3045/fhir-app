import {
  Injectable,
  NotFoundException,
  PreconditionFailedException
} from '@nestjs/common';
import { Model } from 'mongoose';
import { CreateprescriptionsDto } from './dto/request/create-prescriptions.dto';
import { UpdatePrescriptionDto } from './dto/request/update-prescriptions.dto';
import { PrescriptionDocument, Prescription } from './schemas/prescriptions.schema';
import { InjectModel } from '@nestjs/mongoose';
import { MESSAGES } from 'src/constants';
import { searchPrescrtiton } from 'src/common/function/external-api/search-prescription';
import { postPrescription } from 'src/common/function/external-api/postPrescription';
import { updatePrescripton } from 'src/common/function/external-api/updatePrescription';
@Injectable()
export class PrescriptionsService {
  constructor(@InjectModel(Prescription.name)
  private readonly PrescriptionModel: Model<PrescriptionDocument>
  ) { }

  async createPrescriptions(createPrescription: CreateprescriptionsDto) {
    try {
      const saveData = await this.PrescriptionModel.create(createPrescription);
      if (saveData) {
        // call prescription push third party api
        postPrescription(`${process.env.PRESCRIPTION_URL}`,createPrescription);

        return { "prescriptionId": saveData._id, "message": MESSAGES.CREATED_SUCCESS_MSG };
      } else {
        throw new PreconditionFailedException({
          "message": MESSAGES.COMMON_ERROR_MSG
        });
      }
    } catch (Error) {
      throw new PreconditionFailedException(Error);
    }
  }

  async prescriptionsList(
    nhi: string,
    page = 1,
    limit = 20
  ) {
    try {
      let matchCondition = {};
      if(nhi){
        matchCondition = {"patient.nhi":{"$regex": nhi}};
      }
    
      let prescriptionsList = await this.PrescriptionModel.aggregate([
        {
          "$match": matchCondition,
        },
        { "$sort": { "CreatedOn": -1 } },
        { $skip: (page - 1) * limit },
        { $limit: limit }
      ]);

      if (prescriptionsList?.length>0) {
        return {
          "paginated": {
            count: prescriptionsList?.length,
            from: (page - 1) * limit,
            page: page,
            limit: limit
          },
          "results": prescriptionsList
        };
      }else{
        //call external api & search precriptions
        const externalSearchResult = searchPrescrtiton(`${process.env.PRESCRIPTION_URL}/${nhi}`);
        if(externalSearchResult){
            return externalSearchResult;
        }
        return [];
      }

    

    } catch (Error) {
      throw new PreconditionFailedException(Error);
    }
  }


  async updatePrescription(nhi:string,prescriptionId: string, updatePrescriptionData: UpdatePrescriptionDto) {
    try {
          updatePrescriptionData.updatedOn = new Date();
          const isUpdate = await this.PrescriptionModel.findByIdAndUpdate({ _id: prescriptionId },
            updatePrescriptionData, { upsert: false });

            //Update prescription
            updatePrescripton(`${process.env.PRESCRIPTION_URL}/${nhi}`,updatePrescriptionData);
          if (isUpdate) {
            return {
              "prescriptionId": isUpdate._id,
              "messages": MESSAGES.UPDATED_SUCCESS_MSG
            }
          }
    } catch (Error) {
      throw new PreconditionFailedException(Error)
    }
  }
}
