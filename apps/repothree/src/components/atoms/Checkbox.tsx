type Props = {
  id: string;
  checked: boolean;
  title: string;
  onChange: () => void;
};
export default function Checkbox(props: Props) {
  return (
    <li className="flex items-center">
      <input
        id={props.id}
        type="checkbox"
        value=""
        onChange={props.onChange}
        checked={props.checked}
        className={
          "border-1 dark:focus:ring-primary-600 h-4 w-4 rounded border-gray-300 hover:cursor-pointer focus:ring-red-400 " +
          (props.checked ? "bg-red-400 text-red-400" : "bg-gray-100")
        }
      />
      <label
        htmlFor={props.id}
        className="ml-2 text-sm font-medium text-gray-900"
      >
        {props.title}
      </label>
    </li>
  );
}
