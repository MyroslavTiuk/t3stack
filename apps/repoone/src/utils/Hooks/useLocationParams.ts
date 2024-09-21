import { useRouter } from 'next/router';

const useLocationParams = () => {
  return useRouter()?.query;
};

export default useLocationParams;
