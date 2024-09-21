export type ApiToken = {
  apiKey: string,
  expiry: number | null,
}

export const API_TOKENS: Record<string, ApiToken | undefined> =
  typeof process?.env?.api_tokens === 'object'
    ? process?.env?.api_tokens
    : {};
