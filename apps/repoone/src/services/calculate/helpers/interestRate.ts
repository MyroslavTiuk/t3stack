import { FINANCE } from '../../../config/Finance';

// Note has been masked by a service in case it should be retrieved from a remote source at some point
const getInterestRate = () => FINANCE.INTEREST_RATE;

export default getInterestRate;
