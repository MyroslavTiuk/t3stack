import { Button as FButton } from "flowbite-react";
import { ReactNode } from "react";
import { theme } from "./buttonStyles";

type ButtonProps = {
  children: ReactNode[] | ReactNode;
  color?: string;
};

export default function Button(props: ButtonProps) {
  return (
    <>
      <FButton
        fullSized
        theme={theme}
        className="rounded-sm"
        color={props.color}
      >
        {props.children}
      </FButton>
    </>
  );
}
