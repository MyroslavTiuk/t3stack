import useBreakpoint from './useBreakpoint';
import { useMemo } from 'react';

type ValidMediaQuery =
  | 'mobile-only'
  | 'tablet-down'
  | 'tablet-only'
  | 'tablet-plus'
  | 'tablet-large-down'
  | 'tablet-large-only'
  | 'tablet-large-plus'
  | 'desktop-small-down'
  | 'desktop-small-only'
  | 'desktop-small-plus'
  | 'desktop-large-plus';

const useMediaQuery = (mq: ValidMediaQuery) => {
  const bkp = useBreakpoint();
  return useMemo(() => {
    switch (bkp) {
      case 'mobile':
        return [
          'mobile-only',
          'desktop-small-down',
          'tablet-large-down',
          'tablet-down',
        ].includes(mq);

      case 'tablet':
        return [
          'tablet-only',
          'desktop-small-down',
          'tablet-large-down',
          'tablet-down',
          'tablet-plus',
        ].includes(mq);

      case 'tablet-large':
        return [
          'tablet-large-only',
          'desktop-small-down',
          'tablet-large-down',
          'tablet-large-plus',
          'tablet-plus',
        ].includes(mq);

      case 'desktop-small':
        return [
          'desktop-small-only',
          'desktop-small-down',
          'desktop-small-plus',
          'tablet-large-plus',
          'tablet-plus',
        ].includes(mq);

      case 'desktop-large':
        return [
          'desktop-large-plus',
          'desktop-small-plus',
          'tablet-large-plus',
          'tablet-plus',
        ].includes(mq);
    }
  }, [bkp]);
};

export default useMediaQuery;
