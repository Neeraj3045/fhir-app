import {
  Injectable,
  PreconditionFailedException
} from '@nestjs/common';
import { Model } from 'mongoose';
import { CreateprescriptionsDto } from './dto/request/create-prescriptions.dto';
import { UpdatePrescriptionDto } from './dto/request/update-prescriptions.dto';
import { PrescriptionDocument, Prescription } from './schemas/prescriptions.schema';
import { InjectModel } from '@nestjs/mongoose';
import { MESSAGES } from 'src/constants';
@Injectable()
export class PrescriptionsService {
  constructor(@InjectModel(Prescription.name)
  private readonly PrescriptionModel: Model<PrescriptionDocument>
  ) { }

  async createPrescriptions(createPrescription: CreateprescriptionsDto) {
    try {
      const saveData = await this.PrescriptionModel.create(createPrescription);
      if (saveData) {
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
    filters: any,
    page = 1,
    limitOfDocuments = 20,
    sorting: any,
  ) {
    try {
      let matchCondition = {};
      if (filters) {
        matchCondition = JSON.parse(decodeURIComponent(filters));
      }
      if (sorting) {
        sorting = JSON.parse(decodeURI(sorting));
      } else {
        sorting = { "CreatedOn": -1 };
      }

      const prescriptionsList = await this.PrescriptionModel.aggregate([
        {
          "$match": matchCondition,
        },
        { "$sort": sorting },
        {
          $project: { "__v": 0, "createdBy": 0, "updatedBy": 0 }
        },
        { $skip: (page - 1) * limitOfDocuments },
        { $limit: limitOfDocuments }
      ]);

      if (prescriptionsList?.length > 0) {
        return {
          "paginated": {
            count: prescriptionsList?.length,
            from: (page - 1) * limitOfDocuments,
            page: page,
            limit: limitOfDocuments
          },
          "results": prescriptionsList
        };
      }
      return { results: [] };

    } catch (Error) {
      throw new PreconditionFailedException(Error);
    }
  }

  async prescriptionDetails(id: string) {
    try {
      return await this.PrescriptionModel.findOne(
        { _id: id },
        { "__v": 0, "createdOn": 0, "status": 0 })
    } catch (Error) {
      throw new PreconditionFailedException(Error);
    }
  }

  async updatePrescription(prescriptionId: string, updatePrescriptionData: UpdatePrescriptionDto) {
    try {

      const isExistPrescription = await this.PrescriptionModel.findOne({ "_id": prescriptionId });

      if (!isExistPrescription) {
        throw new PreconditionFailedException({
          "message": MESSAGES.INVALID_PRESCRIPTION_ID
        })
      }
      updatePrescriptionData.updatedOn = new Date();

      const isUpdate = await this.PrescriptionModel.findByIdAndUpdate({ _id: prescriptionId },
        updatePrescriptionData, { upsert: false });
      if (isUpdate) {
        return {
          "prescriptionId": isUpdate._id,
          "messages": MESSAGES.UPDATED_SUCCESS_MSG
        }
      }
      throw new PreconditionFailedException({
        "message": MESSAGES.UPDATED_FAILED_MSG
      })
    } catch (Error) {
      throw new PreconditionFailedException(Error)
    }
  }
}
