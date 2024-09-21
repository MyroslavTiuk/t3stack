// import { format } from "date-fns";
// import { type Strategy } from "opc-types/lib/Strategy";
// import { uuid } from "short-uuid";

// interface createCalculationProps {
//   calculation: Strategy;
//   userId: string;
// }

const createUpdateCalculation = async () => {
  // const dateAdded = format(new Date(), "yyyy-MM-dd HH:mm:ss");
  const expiryDateUnFormatted = new Date();
  expiryDateUnFormatted.setMonth(new Date().getMonth() + 1);
  // const expiryDate = format(expiryDateUnFormatted, "yyyy-MM-dd HH:mm:ss");

  // const calculationId = calculation.id;
  // const calculationIdNew = uuid();
  // const calculations = JSON.stringify(calculation);
};

export default createUpdateCalculation;
