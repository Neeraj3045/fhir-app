import axios from "axios";
export async function syncPrescriptionChangesToExternalDb(
  URL: string,
  params: object,
) {
  axios
    .put(URL, params)
    .then((response) => {
      return response;
      // sync status update
    })
    .catch(() => console.log("External Db update prescription sync failed"));
}
