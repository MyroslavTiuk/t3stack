export type ReportParams = {
  category?: string;
  id: string;
  detail?: string;
  data?: NonNullable<unknown>;
  severity?: number;
  bufferCategory?: number; // in minutes
  toleranceCategory?: number; // decimal
  bufferID?: number; // in minutes
  toleranceID?: number; // decimal
};
