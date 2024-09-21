import React, { type FC } from "react";

import {
  type UserRegisterPublicProps,
  type UserRegisterProps,
} from "./UserRegister.props";
import UserRegisterView from "./UserRegister.view";

const UserRegisterContainer: FC<UserRegisterPublicProps> = (
  ownProps: UserRegisterPublicProps
) => {
  // {{containerBodyPrefabs}}
  const combinedProps: UserRegisterProps = {
    ...ownProps,
    // your calculated props
  };

  return <UserRegisterView {...combinedProps} />;
};

export default UserRegisterContainer;
