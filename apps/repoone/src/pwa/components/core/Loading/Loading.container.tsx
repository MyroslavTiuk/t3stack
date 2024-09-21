import React from 'react';
import { useRouter } from 'next/router';

import View from './Loading.view';

const LOADING_LEEWAY = 300;

function Loading() {
  const router = useRouter();

  const [loading, setLoading] = React.useState(false);
  const [showLoaded, setShowLoaded] = React.useState(false);
  const [loadingOverlay, setLoadingOverlay] = React.useState(false);
  const [timeoutTracker, setTimeoutTracker] = React.useState<NodeJS.Timeout>();

  React.useEffect(() => {
    const handleStart = () => {
      setLoading(true);
      if (timeoutTracker) clearTimeout(timeoutTracker);
      setTimeoutTracker(
        setTimeout(() => setLoadingOverlay(true), LOADING_LEEWAY),
      );
    };
    const handleComplete = () => {
      if (timeoutTracker) clearTimeout(timeoutTracker);
      if (loadingOverlay) {
        setShowLoaded(true);
        setTimeout(() => setShowLoaded(false), 150);
      }
      setLoading(false);
      setLoadingOverlay(false);
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      if (timeoutTracker) {
        clearTimeout(timeoutTracker);
      }
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  });

  return loading || showLoaded ? (
    <View isLoading={loading} showOverlay={loadingOverlay} />
  ) : null;
}

export default Loading;
