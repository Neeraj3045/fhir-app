import axios from "axios";
export async function searchPrescriptionFromExternalDb(URL: string) {
  {
    axios
      .get(URL)
      .then((response) => {
        return response;
        // sync status update
      })
      .catch(() => console.log("External search: prescription is not found"));
  }
}
