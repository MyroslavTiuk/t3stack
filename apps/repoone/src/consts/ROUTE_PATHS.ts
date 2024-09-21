/**
 * This definition is merely for reference and centralisation; next's pages protocol controls how\
 * route path mapping operates
 */
const ROUTE_PATHS = {
  ROOT: '/',
  // USER_REGISTER: '/user/register',
  // USER_PROFILE: '/user',
  // USER_LOGIN: '/user/login',
  PORTFOLIO: '/portfolio',
  CALCULATOR_NEW: '/calculator',
  CALCULATOR: '/calculator/[strat]',
  // LEARN: '/learn',
  HELP: '/faq.html', // '/help',
  FEATURES: '/membership.html', // '/features',
  ABOUT: '/about.html', // '/about',
  TERMS_AND_CONDITIONS: '/terms-and-conditions.html', //'/terms-and-conditions',
  PRIVACY_POLICY: '/privacy-policy.html', //'/privacy-policy',
  CONTACT: '/contact.html', //'/contact',
  HELP_PAGE: '/help/[path]',
  NOT_FOUND: '/404',
};

export const PATHS_NEED_DOTHTML = [ROUTE_PATHS.CALCULATOR];

export default ROUTE_PATHS;
