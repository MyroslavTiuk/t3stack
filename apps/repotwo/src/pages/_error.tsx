import * as Sentry from "@sentry/nextjs";
import { type NextPage } from "next";
import NextErrorComponent, { type ErrorProps } from "next/error";

const CustomErrorComponent: NextPage<ErrorProps> = ({ statusCode }) => {
  return <NextErrorComponent statusCode={statusCode} />;
};

CustomErrorComponent.getInitialProps = async (contextData) => {
  await Sentry.captureUnderscoreErrorException(contextData);
  return NextErrorComponent.getInitialProps(contextData);
};

export default CustomErrorComponent;
