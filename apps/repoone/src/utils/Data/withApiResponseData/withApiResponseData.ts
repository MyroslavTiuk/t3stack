import { type APIResponse } from "opc-types/lib/api/responses/APIResponse";
import { type AxiosResponse } from "axios";

export default function withApiResponseData<T>(
  promise: Promise<AxiosResponse<APIResponse<T>>>
): Promise<T> {
  return promise
    .then((resp: AxiosResponse<APIResponse<T>>) => {
      if (!resp.data?.success) throw resp.data;
      else return resp.data?.data;
    })
    .catch((error) => {
      const resp = error.response;
      const apiResp = resp.data;
      throw apiResp;
    });
}
