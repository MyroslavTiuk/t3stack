import React, { type FC } from "react";

import {
  type UserProfilePublicProps,
  type UserProfileProps,
} from "./UserProfile.props";
import UserProfileView from "./UserProfile.view";

const UserProfileContainer: FC<UserProfilePublicProps> = (
  ownProps: UserProfilePublicProps
) => {
  // {{containerBodyPrefabs}}
  const combinedProps: UserProfileProps = {
    ...ownProps,
    // your calculated props
  };

  return <UserProfileView {...combinedProps} />;
};

export default UserProfileContainer;
