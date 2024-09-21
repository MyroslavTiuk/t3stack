import router from "next/router";

const resetAds = (newUrl: string, resetTime: (n: number) => void) => {
  const oldUrl = router.asPath;
  const newPage = newUrl.replace(/\?.*/, "");
  const oldPage = oldUrl.replace(/\?.*/, "");
  const nPIsStrat = /calculator\/?.+?/.test(newUrl);
  const oPIsStrat = /calculator\/?.+?/.test(oldUrl);
  if (newPage === oldPage || (nPIsStrat && oPIsStrat)) {
    return;
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window?.fusetag?.resetSlots();
  resetTime(Date.now());
};

export default resetAds;
