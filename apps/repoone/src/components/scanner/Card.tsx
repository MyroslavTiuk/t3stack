import { ReactNode } from "react";

type CardProps = {
  children: ReactNode[] | ReactNode;
};

export default function Card(props: CardProps) {
  return (
    <div className="flex w-fit flex-col gap-4 bg-white p-6 drop-shadow-md">
      {props.children}
    </div>
  );
}
