import { useCallback, useEffect, useState } from 'react';

function useDebounceEffect(effect: () => any, deps: any[], delay = 250) {
  const callback = useCallback(effect, deps);
  const [tid, setTid] = useState<NodeJS.Timeout>();

  useEffect(() => {
    if (tid) {
      clearTimeout(tid);
    }
    setTid(setTimeout(callback, delay));

    return () => tid && clearTimeout(tid);
  }, [callback, delay]);
}

export default useDebounceEffect;
