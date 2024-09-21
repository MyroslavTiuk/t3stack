/**
 * This should be assumed as the basis of all other response types
 */

export type APIResponse<T> = {
  message: string;
  success: boolean;
  data: T;
};
