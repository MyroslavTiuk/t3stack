type Props = {
  title: string;
};

function getBadgeColor(title: string) {
  switch (title) {
    case "Win":
      return "bg-green-100 text-green-800";
    case "Loss":
      return "bg-red-100 text-red-800";
    case "Open":
      return "bg-[#FFB342] text-yellow-800";
    default:
      return "";
  }
}

export default function Badge({ title }: Props) {
  return (
    <span
      className={
        "dark:bg-blue-900 dark:text-blue-300 me-2 rounded-lg px-2.5 py-0.5 text-xs font-medium " +
        getBadgeColor(title)
      }
    >
      {title}
    </span>
  );
}
