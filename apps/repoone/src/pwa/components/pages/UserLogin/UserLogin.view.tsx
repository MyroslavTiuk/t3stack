import React, { type FC, type ReactElement } from "react";

import { type UserLoginProps } from "./UserLogin.props";

const UserLoginView: FC<UserLoginProps> = (
  _props: UserLoginProps
): ReactElement<"div"> => {
  return <div>This is Login</div>;
};

export default UserLoginView;
