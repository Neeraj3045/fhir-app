import {from, lastValueFrom} from "rxjs";
import { HttpService } from '@nestjs/axios';

export async function syncPrescriptionChangesToExternalDb(URL: string, params: Object) {
  const axios = new HttpService();
  const observable = from(await axios.put(URL, params));
  lastValueFrom(observable)
    .then(response => {
      if (response) {
        //update flag in db for prescription update sync
      }
    })
    .catch(error => {
      console.error(`External Db Sync: Prescription update is not sync to external db`);
      //update flag in db for prescription update not sync
    });

}



