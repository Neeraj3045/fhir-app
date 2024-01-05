import {from, lastValueFrom, map } from "rxjs";
import { HttpService } from '@nestjs/axios';


export async function searchPrescriptionFromExternalDb(URL: string) {
  const axios = new HttpService();
  const observable = from(await axios.get(URL));
  lastValueFrom(observable)
    .then(response => {
      if (response) {
        return  response;
      }
    })
    .catch(error => {
      console.error(`External Db search: Prescription is not found`);
      //update flag in db for prescription not sync
    });

}



