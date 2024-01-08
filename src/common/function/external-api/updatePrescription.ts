import {from, lastValueFrom} from "rxjs";
import { HttpService } from '@nestjs/axios';

export async function syncPrescriptionChangesToExternalDb(URL: string, params: object) {
  const axios = new HttpService();
  const observable = from(axios.put(URL, params));
  lastValueFrom(observable)
    .then(response => {
      if (response) {
        //update flag in db for prescription update sync
      }
    })
    .catch(error => {
      console.error(`External Db Sync: Prescription update is not sync to external db `,error);
      //update flag in db for prescription update not sync
    });

}



