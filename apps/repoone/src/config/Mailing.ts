import ENV from './Env';

const Mailing = {
  MOCK_EMAIL: ENV.IS_DEV,
  SENDGRID_API_KEY: process.env?.sendgrid_api_key || null,
  ADMIN_EMAIL: 'support@optionsprofitcalculator.com',
  ADMIN_EMAIL_NAME: 'OPCalc Team',
};

export default Mailing;
