import { catchError, lastValueFrom, map } from "rxjs";
import { HttpService } from '@nestjs/axios';
import { HttpException } from "@nestjs/common";

 export async function searchPrescrtiton(URL: string) {
  const httpService = new HttpService();
  const searchData =  httpService.get(URL)
  .pipe(
    map(response => response?.data),
  );
  return await  lastValueFrom(searchData);
}



