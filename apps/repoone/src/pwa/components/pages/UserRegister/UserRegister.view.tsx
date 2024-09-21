import React, { type FC, type ReactElement } from "react";

import { type UserRegisterProps } from "./UserRegister.props";

const UserRegisterView: FC<UserRegisterProps> = (
  _props: UserRegisterProps
): ReactElement<"div"> => {
  return <div>This is Registration</div>;
};

export default UserRegisterView;
