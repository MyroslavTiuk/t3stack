import clsx from "clsx";

export function Container({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div className={clsx("mx-auto px-4 px-8 sm:px-6", className)} {...props} />
  );
}
