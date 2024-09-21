import { useSession } from '../SessionProvider';

const useLayout = () => {
  const {
    userData: {
      userSettings: { layout },
    },
  } = useSession();
  return layout;
};

export default useLayout;
