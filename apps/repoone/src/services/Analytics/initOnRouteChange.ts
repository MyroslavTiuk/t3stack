import { ANALYTICS } from '../../config/Analytics';
import noop from '../../utils/Functional/noop';
import getGTag from '../../utils/App/getGTag';

const initAnalyticsOnRouteChange = () => {
  if (
    ANALYTICS.ENABLE_TRACKING &&
    ANALYTICS.GA_TRACKING_ID &&
    typeof window !== 'undefined'
  ) {
    return (url: string) => {
      const page = url.replace(/\?.*/, '');
      const gtag = getGTag();
      gtag?.('event', 'page_view', {
        page_path: page,
      });
    };
  } else return noop;
};

export default initAnalyticsOnRouteChange;
