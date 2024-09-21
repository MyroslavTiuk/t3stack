const getHotjarUserId = () => {
  // @ts-ignore
  if (typeof window !== 'undefined') {
    // @ts-ignore
    return window?.hj?.globals?.get?.('userId')?.split('-')?.shift();
  }
  return null;
};

export default getHotjarUserId;
