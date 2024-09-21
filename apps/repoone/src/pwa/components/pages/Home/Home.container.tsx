import { type NextPage } from "next";
import React from "react";

import { withRedux } from "../../../store/withRedux";
import { type HomePublicProps, type HomeProps } from "./Home.props";
import MainLayout from "../../layouts/MainLayout";
import HomeView from "./Home.view";
import { AUTH_STATUS } from "../../modules/Session/Session.types";
import { useSession } from "../../modules/Session/SessionProvider";

const HomeContainer: NextPage<HomePublicProps> = (
  ownProps: HomePublicProps
) => {
  const authStatus = useSession().authStatus;

  const combinedProps: HomeProps = {
    ...ownProps,
    loggedIn: Boolean(authStatus === AUTH_STATUS.STATE_AUTHED),
  };

  return (
    <MainLayout showLogoTitleMobile>
      <div className="flex w-full pt-6">
        <HomeView {...combinedProps} />
      </div>
    </MainLayout>
  );
};

export default withRedux(HomeContainer);
