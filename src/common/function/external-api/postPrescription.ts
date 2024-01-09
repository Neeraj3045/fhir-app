import axios from "axios";
export async function syncPrescriptionToExternalDb(
  URL: string,
  params: object,
) {
  axios
    .post(URL, params)
    .then((response) => {
      return response;
    })
    .catch(() => console.log("External Db Sync error"));
}
