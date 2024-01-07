import { Test, TestingModule } from "@nestjs/testing";
import { PrescriptionsService } from "./prescriptions.service";
import { Prescription } from "./schemas/prescriptions.schema";
import { getModelToken } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { STATUS } from "../enums/enums";
import { CreateprescriptionsDto } from "./dto/request/create-prescriptions.dto";

describe('PrescriptionsService', () => {
    let presService: PrescriptionsService;
    let model: Model<Prescription>;

    const mockPrescription = {
        _id: '659824c6250f08b420f9ed2a',
        patient: {
            nhi: '12345',
            name: 'Smith'
        },
        date: '2024-01-05T00:00:00.000Z',
        medications: [
            {
                id: '6598202a71a0e984f08ea5543',
                dosage: '5ml'
            }
        ],
        status: STATUS.ACTIVE,
        createdOn: '2024-01-05T15:48:22.281Z'
    };
    let mockPrescriptionsService = {
        findById: jest.fn(),
        prescriptionsList: jest.fn(),
        createPrescriptions:jest.fn(),
        updatePrescription:jest.fn(),
        findByIdAndUpdate:jest.fn(),
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

        presService = module.get<PrescriptionsService>(PrescriptionsService);
        model = module.get<Model<Prescription>>(getModelToken(Prescription.name));
    });

    describe('findById', () => {
        it('it should find prescription by prescription id', async () => {
            jest.spyOn(model, 'findById').mockResolvedValue(mockPrescription);

            const result = await presService.findById(mockPrescription._id);
            expect(model.findById).toHaveBeenCalledWith(mockPrescription._id);
            expect(result).toEqual(mockPrescription);
        });
    });

    describe('prescriptionsList', () => {
        const nhi = 'nhi-12345';
        const page = 1;
        const limit = 10;
        const prescriptions = {
            "result": [
                {
                    _id: '659824c6250f08b420f9ed2a',
                    patient: {
                        nhi: 'nhi-12345',
                        name: 'Smith'
                    },
                    date: '2024-01-05T00:00:00.000Z',
                    medications: [
                        {
                            id: '659824c6250f08b4',
                            dosage: '6 ml'
                        }
                    ],
                    status: STATUS.ACTIVE,
                    updatedOn: null,
                    createdOn: '2024-01-05T15:48:22.281Z',
                    __v: 0
                },
                {
                    _id: '659824c6250f08b420f9ed2a',
                    patient: {
                        nhi: 'nhi-12345',
                        name: 'Smith'
                    },
                    date: '2024-01-05T00:00:00.000Z',
                    medications: [
                        {
                            id: '659824c6250f08',
                            dosage: '10 ml'
                        }
                    ],
                    status: STATUS.ACTIVE,
                    createdOn: '2024-01-05T15:48:22.281Z'
                }
            ]
        };

        it('should handle error thrown by "find"', async () => {
            const errorMessage = 'error throw while searching';
      
            jest.spyOn(model,'find').mockImplementation(() => {
              throw new Error(errorMessage);
            });
            await expect(presService.prescriptionsList(nhi, page,limit)).rejects.toThrow(errorMessage);
          });

    });

    describe('createPrescriptions', () => {
        const createPrescrption = 
                {
                    patient: {
                        nhi: 'nhi-1234533',
                        name: 'Smith'
                    },
                    date: '2024-01-05T00:00:00.000Z',
                    medications: [
                        {
                            id: 'sdfsfsdfsdfsfsd',
                            dosage: '123'
                        }
                    ]
                };
            
        it('Should create and return prescription', async () => {
           jest.spyOn(presService, 'createPrescriptions').mockImplementation( async ()=>createPrescrption as unknown as Prescription);
            const result = await presService.createPrescriptions(createPrescrption as CreateprescriptionsDto);
            expect(result).toBe(createPrescrption);

        });

    });

    describe('updatePrescription', () => {
        const prescriptionId = "6598202a71a0e984f08ea52a";
        const nhi = '1234';
        const updatePatient = {patient: {nhi: '1234',name: 'Neeraj'}};
        const newUpdated = {...mockPrescription,updatePatient};
     
        it('Should be update prescription by "findByIdAndUpdate"', async () => {
           jest.spyOn(model, 'findByIdAndUpdate').mockResolvedValue(newUpdated);
           const result = await model.findByIdAndUpdate(mockPrescription._id,updatePatient,{new:true});
           expect(model.findByIdAndUpdate).toHaveBeenCalledWith(mockPrescription._id,updatePatient,{ new: true });
           expect(model.findByIdAndUpdate).toHaveBeenCalledTimes(1);

        });

        it('should handle error throw by "findOneAndUpdate"', async () => {
            const errorMessage = 'error occurs while calling findOneAndUpdate()';
      
            jest.spyOn(model,'findOneAndUpdate').mockImplementation(() => {
              throw new Error(errorMessage);
            });
          });

    })
});