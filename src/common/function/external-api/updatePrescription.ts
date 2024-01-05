import { catchError, lastValueFrom, map } from "rxjs";
import { HttpService } from '@nestjs/axios';
import { HttpException } from "@nestjs/common";

export async function updatePrescripton(URL: string, params: Object) {
  const httpService = new HttpService();
  const updateResult =  httpService.put(URL, params)
    .pipe(
      map(response => response.data),
    );

   return await  lastValueFrom(updateResult);
}



