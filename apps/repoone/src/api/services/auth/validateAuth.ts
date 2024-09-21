import { type Outcome } from "opc-types/lib/Outcome";
import { errorFactory } from "../../infrastructure/errorHanding";
import MESSAGES from "../../../consts/MESSAGES";
import { API_TOKENS } from "~/config/ApiTokens";

type DTO<T> = { authToken: string | undefined } & T;

// Rudimentary authentication against list of token-holders
export function authenticateToken(token: string, apiTokens = API_TOKENS) {
  try {
    const decodedToken = Buffer.from(token, "base64").toString("utf8");
    const [username, apiKey] = decodedToken.split(":");
    const apiToken = apiTokens[username];
    return (
      apiToken?.apiKey === apiKey &&
      (apiToken?.expiry === null || apiToken?.expiry > Date.now())
    );
  } catch (e) {
    return false;
  }
}

export default function validateAuth<T>(
  dto: DTO<T>
): Outcome<T & { authToken: string }> {
  if (!dto.authToken) return errorFactory(MESSAGES.AUTHENTICATION_NOT_FOUND);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return authenticateToken(dto.authToken)
    ? dto
    : errorFactory(MESSAGES.AUTHENTICATION_FAILED);
}
