export const SITE = {
  STATIC_URI: "", // 'https://static -> assets.optionsprofitcalculator.com'
  ORIGIN:
    process?.env?.site_origin || "https://www.optionsprofitcalculator.com",
  API_URL: process.env.api_base_url || "/api",
  V2_ORIGIN:
    process?.env?.v2_origin || "https://old.optionsprofitcalculator.com",
  V2_API_URL: process.env.V2_API_BASE_URL_CALCULATOR || "",
  PASSWORD_REQUIREMENT_REGEX: new RegExp("^(?=.*?[A-Za-zd])(?=.*?[0-9]).{8,}$"),
  COOKIE_DOMAIN: ".optionsprofitcalculator.com",
};
