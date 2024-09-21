import React from "react";

import type noop from "../../../../utils/Functional/noop";
import ROUTE_PATHS from "../../../../consts/ROUTE_PATHS";
import Link from "../../primitives/Link";
import Box from "../../primitives/Box";

import css from "./Nav.module.scss";

type StaticNavLinksProps = {
  closeMenu: typeof noop;
  trackCalculatorClick: typeof noop;
  isMobileSize: boolean;
};

const StaticNavLinks = ({
  closeMenu,
  isMobileSize,
  trackCalculatorClick,
}: StaticNavLinksProps) => {
  return (
    <>
      <Box onClick={closeMenu} className={css["nav-link-ctnr"]}>
        <Link
          to={ROUTE_PATHS.ROOT}
          className={css._link}
          activeClass={css["--active"]}
        >
          Home
        </Link>
      </Box>
      <Box onClick={closeMenu} className={css["nav-link-ctnr"]}>
        <Link
          to={ROUTE_PATHS.CALCULATOR_NEW}
          className={css._link}
          activeClass={css["--active"]}
          onClick={trackCalculatorClick}
        >
          Strategy Calculators
        </Link>
      </Box>
      {/*<Box onClick={closeMenu} className={css['nav-link-ctnr']}>*/}
      {/*  <Link*/}
      {/*    to={ROUTE_PATHS.LEARN}*/}
      {/*    className={css._link}*/}
      {/*    activeClass={css['--active']}*/}
      {/*  >*/}
      {/*    Learn Options*/}
      {/*  </Link>*/}
      {/*</Box>*/}
      <Box onClick={closeMenu} className={css["nav-link-ctnr"]}>
        <Link
          to={ROUTE_PATHS.FEATURES}
          className={css._link}
          activeClass={css["--active"]}
        >
          Features
        </Link>
      </Box>
      <Box onClick={closeMenu} className={css["nav-link-ctnr"]}>
        <Link
          to={ROUTE_PATHS.HELP}
          className={css._link}
          activeClass={css["--active"]}
        >
          Help
        </Link>
      </Box>
      {!isMobileSize && (
        <Box className={css.menuDividerVertical} inline-block />
      )}
    </>
  );
};

export default StaticNavLinks;
