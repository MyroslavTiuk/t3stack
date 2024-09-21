import React, { type FC, useEffect } from "react";

import { useDispatch } from "react-redux";
import { type Dispatch } from "redux";
import useSelectorSafe from "../../../store/selectors/useSelectorSafe";
import { asyncData } from "../../../../utils/Redux";
import { ASYNC_STATUS } from "../../../../types/enums/ASYNC_STATUS";
import { fallback } from "../../../../utils/Data";
import { type Optional } from "opc-types/lib/util/Optional";
// import { routerActions } from '../../../store/actions';
import {
  type AuthGuardOptions,
  type AuthGuardPublicProps,
} from "./AuthGuard.props";

type UserState = NonNullable<unknown>;

const checkRedirect = (
  _dispatch: Dispatch,
  userState: UserState,
  options: AuthGuardOptions
) => {
  const uid = fallback<any, Optional<string>>(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    (u) => u?.data?.id,
    undefined,
    userState
  );

  if (!options.allowAnon && !uid) {
    // dispatch(routerActions.link(options.redirectAnon));
  } else if (!options.allowAuthed && uid) {
    // dispatch(routerActions.link(options.redirectAuthed));
  }
};

const AuthGuardContainer: FC<AuthGuardPublicProps> = (
  ownProps: AuthGuardPublicProps
) => {
  const dispatch = useDispatch();

  const userState = useSelectorSafe<UserState>(
    (store) => store.authStatus,
    asyncData(ASYNC_STATUS.INITIAL)
  );

  useEffect(() => {
    checkRedirect(dispatch, userState, ownProps);
  }, [dispatch, userState, ownProps]);

  return <div>{ownProps.children}</div>;
};

export default AuthGuardContainer;
