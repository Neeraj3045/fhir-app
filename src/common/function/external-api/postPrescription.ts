import { catchError, lastValueFrom, map } from "rxjs";
import { HttpService } from '@nestjs/axios';
import { HttpException } from "@nestjs/common";

export async function postPrescription(URL: string, params: Object) {
  const httpService = new HttpService();
  const postResult =  httpService.post(URL, params)
    .pipe(
      map(response => response.data),
    );

   return await  lastValueFrom(postResult);
}



