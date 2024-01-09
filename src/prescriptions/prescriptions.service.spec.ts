import { Test, TestingModule } from "@nestjs/testing";
import { PrescriptionsService } from "./prescriptions.service";
import { Prescription } from "./schemas/prescriptions.schema";
import { getModelToken } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { STATUS } from "../enums/enums";
import { CreateprescriptionsDto } from "./dto/request/create-prescriptions.dto";

describe("PrescriptionsService", () => {
  let prescriptionService: PrescriptionsService;
  let model: Model<Prescription>;

  const mockPrescription = {
    _id: "659824c6250f08b420f9ed2a",
    patient: {
      nhi: "12345",
      name: "Smith",
    },
    date: "2024-01-05T00:00:00.000Z",
    medications: [
      {
        id: "6598202a71a0e984f08ea5543",
        dosage: "5ml",
      },
    ],
    status: STATUS.ACTIVE,
    createdOn: "2024-01-05T15:48:22.281Z",
  };
  const mockPrescriptionsService = {
    prescriptionsList: jest.fn(),
    createPrescriptions: jest.fn(),
    updatePrescription: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrescriptionsService,
        {
          provide: getModelToken(Prescription.name),
          useValue: mockPrescriptionsService,
        },
      ],
    }).compile();

    prescriptionService =
      module.get<PrescriptionsService>(PrescriptionsService);
    model = module.get<Model<Prescription>>(getModelToken(Prescription.name));
  });

  describe("prescriptionsList", () => {
    const nhi = "nhi-1234";
    const page = 1;
    const limit = 10;
    it("Should be defined", () => {
      expect(prescriptionService).toBeDefined();
    });
    it('should handle error thrown by "prescriptionsList"', async () => {
      const errorMessage = "Search prescription is not found";
      await expect(
        prescriptionService.prescriptionsList(nhi, page, limit),
      ).rejects.toThrow(errorMessage);
    });
    it('should handle error thrown by "prescriptionsList"', async () => {
      const errorMessage = "Search prescription is not found";
      jest
        .spyOn(prescriptionService, "prescriptionsList")
        .mockImplementation(() => {
          throw new Error(errorMessage);
        });
    });
  });

  describe("createPrescriptions", () => {
    const createPrescrption = {
      patient: {
        nhi: "nhi-1234533",
        name: "Smith",
      },
      date: "2024-01-05T00:00:00.000Z",
      medications: [
        {
          id: "6598202a71a",
          dosage: "5ml",
        },
      ],
    };

    it("Should create and return prescription", async () => {
      jest
        .spyOn(prescriptionService, "createPrescriptions")
        .mockImplementation(
          async () => createPrescrption as unknown as Prescription,
        );
      const result = await prescriptionService.createPrescriptions(
        createPrescrption as CreateprescriptionsDto,
      );
      expect(result).toBe(createPrescrption);
    });
  });

  describe("updatePrescription", () => {
    const updatePatient = { patient: { nhi: "1234", name: "Neeraj" } };
    const newUpdated = { ...mockPrescription, updatePatient };

    it("Should be defined service", () => {
      expect(prescriptionService).toBeDefined();
    });

    it('Should be update prescription by "findByIdAndUpdate"', async () => {
      jest.spyOn(model, "findByIdAndUpdate").mockResolvedValue(newUpdated);
      await model.findByIdAndUpdate(mockPrescription._id, updatePatient, {
        new: true,
      });
      expect(model.findByIdAndUpdate).toHaveBeenCalledWith(
        mockPrescription._id,
        updatePatient,
        { new: true },
      );
      expect(model.findByIdAndUpdate).toHaveBeenCalledTimes(1);
    });
  });
});
