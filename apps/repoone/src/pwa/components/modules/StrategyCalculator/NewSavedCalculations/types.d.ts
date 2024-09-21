import { type Strategy } from "opcalc-database";

export type NewSavedCalculation = {
  id: string;
  userId: string;
  calculations: Strategy;
  dateAdded: Date;
  expiryDate: Date;
};
