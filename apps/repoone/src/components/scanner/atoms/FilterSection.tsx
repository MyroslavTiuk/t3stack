import { Select } from "flowbite-react";

export const FilterSection = ({ title, filters }: Props) => {
  return (
    <li className="mb-2 mt-4">
      <p className="text-base font-bold">{title}:</p>
      <ul className="pl-4">
        {filters.map((filter) => (
          <li key={filter.label}>
            <div className="flex items-center justify-between gap-2">
              {filter.label}:
              <div className="flex items-center gap-2 ">
                <Select
                  style={{
                    maxWidth: "100px",
                    width: "100%",
                    paddingTop: 3,
                    paddingBottom: 3,
                    paddingRight: 8,
                  }}
                  id={filter.id}
                  required
                >
                  <option>Less than</option>
                  <option>Greater than</option>
                  <option>Between</option>
                </Select>
                <div className="flex justify-end border-b-2">
                  <span className="mt-4 h-4 border border-r"></span>
                  <input className="w-full max-w-[72px] border-transparent focus:border-transparent focus:ring-0" />
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </li>
  );
};
type Props = {
  title: string;
  filters: { label: string; id: string }[];
};
