import { Module } from '@nestjs/common';
import { PrescriptionsService } from './prescriptions.service';
import { PrescriptionsController } from './prescriptions.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import {Prescription, prescriptionSchema } from './schemas/prescriptions.schema';


@Module({
  controllers: [PrescriptionsController],
  providers: [PrescriptionsService],
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: Prescription.name, schema: prescriptionSchema}
    ]),
  ],
  exports:[PrescriptionsService]
})
export class PrescriptionModule {}
