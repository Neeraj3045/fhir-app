import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { CreateprescriptionsDto } from "./dto/request/create-prescriptions.dto";
import { UpdatePrescriptionDto } from "./dto/request/update-prescriptions.dto";
//import { searchPrescriptionFromExternalDb } from "../common/function/external-api/search-prescription";
//import { syncPrescriptionToExternalDb } from "../common/function/external-api/postPrescription";
//import { syncPrescriptionChangesToExternalDb } from "../common/function/external-api/updatePrescription";
import { Prescription } from "./schemas/prescriptions.schema";
import { searchPrescriptionFromExternalDb } from "@/common/function/external-api/search-prescription";
import { syncPrescriptionChangesToExternalDb } from "@/common/function/external-api/updatePrescription";
import { syncPrescriptionToExternalDb } from "@/common/function/external-api/postPrescription";

@Injectable()
export class PrescriptionsService {
  constructor(
    @InjectModel(Prescription.name)
    private prescriptionModel: Model<Prescription>,
  ) {}

  async createPrescriptions(
    createPrescriptionDto: CreateprescriptionsDto,
  ): Promise<Prescription> {
    try {
      const prescrptionCreate = new this.prescriptionModel(
        createPrescriptionDto,
      );
      const created = prescrptionCreate.save();
      // call prescription push third party api
      syncPrescriptionToExternalDb(
        `${process.env.PRESCRIPTION_URL}`,
        createPrescriptionDto,
      );
      return created;
    } catch (error) {
      throw new BadRequestException(
        `Somthing went wrong please try agian `,
        error,
      );
    }
  }

  async prescriptionsList(nhi: string, page: number = 1, limit: number = 20) {
    try {
      const skip = (page - 1) * limit;
      const searchNhi = nhi
        ? {
            "patient.nhi": {
              $regex: nhi,
            },
          }
        : {};
      const searchList = await this.prescriptionModel
        .find(searchNhi)
        .skip(skip)
        .limit(limit);
      const totalCount = await this.prescriptionModel
        .find(searchNhi)
        .countDocuments();
      const pageNo = skip > 0 ? skip : 1;
      if (searchList?.length > 0) {
        return { page: pageNo, total: totalCount, results: searchList };
      } else {
        // call external api & search precriptions
        const externalSearchResult = await searchPrescriptionFromExternalDb(
          `${process.env.PRESCRIPTION_URL}/${nhi}`,
        );
        if (externalSearchResult != undefined) {
          return { results: externalSearchResult };
        }
        throw new NotFoundException("External prescription not found");
      }
    } catch (Error) {
      throw new NotFoundException("Search prescription is not found");
    }
  }

  async updatePrescription(
    nhi: string,
    prescriptionId: string,
    updatePrescriptionData: UpdatePrescriptionDto,
  ): Promise<Prescription> {
    try {
      updatePrescriptionData.updatedOn = new Date();
      const updatedPrescription =
        await this.prescriptionModel.findByIdAndUpdate(
          { _id: prescriptionId },
          updatePrescriptionData,
        );
      // Update prescriptionId
      await syncPrescriptionChangesToExternalDb(
        `${process.env.PRESCRIPTION_URL}/${nhi}`,
        updatePrescriptionData,
      );
      return updatedPrescription;
    } catch (Error) {
      throw new BadRequestException(
        `Something went wrong please try again!`,
        Error,
      );
    }
  }
}
