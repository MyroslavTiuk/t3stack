export type RequestVarsRequired = {
  params?: {};
  query?: {};
  body?: string | [] | {};
};

export type RequestVars = void | RequestVarsRequired;
