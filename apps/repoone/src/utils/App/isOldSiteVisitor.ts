import parseInt10 from '../Maths/parseInt10';
import { getCookie } from '../Html/cookies';

const isOldSiteVisitor = () => parseInt10(getCookie('num_visits') || '0') > 0;

export default isOldSiteVisitor;
