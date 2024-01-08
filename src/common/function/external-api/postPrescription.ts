import { from, lastValueFrom} from "rxjs";
import { HttpService } from '@nestjs/axios';

export async function syncPrescriptionToExternalDb(URL: string, params: object) {
  const axios = new HttpService();
  const observable = from(axios.post(URL, params));
  lastValueFrom(observable)
    .then(response => {
      if (response) {
        //update flag in db for prescription sync
      }
    })
    .catch(error => {
      console.error(`External Db Sync: Prescription is not sync to external db`,error);
      //update flag in db for prescription not sync
    });

}





