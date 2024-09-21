type Props = {
  isActive?: boolean;
  title: string;
  number: string;
  description?: string;
};

export default function Tab({
  isActive = false,
  title,
  description,
  number,
}: Props) {
  return (
    <div className={"cursor-pointer pb-6 "}>
      <div className="flex flex-col justify-start gap-4 py-4 pl-6 text-black">
        <p
          className={
            "text-2xl font-bold sm:text-[26px]" +
            (isActive ? "text-[#2D78C8]" : "text-black")
          }
        >
          <span
            className={isActive ? "text-[#2D78C8] opacity-50" : "text-black"}
          >
            {number}
          </span>{" "}
          {title}
        </p>
        <p
          className={`${
            isActive ? "text-[#2D78C8]" : "text-[#808080]"
          } text-lg opacity-50`}
        >
          {description}
        </p>
      </div>
    </div>
  );
}
