import clsx from "clsx";
import type { Dispatch, ReactElement, SetStateAction } from "react";
import { useEffect, useState } from "react";
import type { IconType } from "react-icons";

type Props = {
  placeholder: string;
  value?: string;
  setValue?: Dispatch<SetStateAction<string>>;
  icon?: ReactElement<IconType>;
  iconRight?: ReactElement<IconType>;
  onBlur?: () => void;
};

export default function Input({
  placeholder,
  value,
  setValue,
  icon,
  iconRight,
  onBlur,
}: Props) {
  const [inputValue, setInputValue] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (setValue) {
      setValue(e.target.value);
    }
  };

  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  return (
    <div className="relative mb-10 h-10 w-full">
      <span className="text-neutral-500">{icon}</span>
      <input
        placeholder={placeholder}
        type="text"
        className={clsx(
          "h-10 w-full rounded-lg border-1 border-neutral-500 bg-transparent px-4 font-mono text-sm text-neutral-100 outline-none placeholder:text-neutral-500 focus:border-neutral-200",
          {
            "pl-10": icon,
            "pr-10": iconRight,
          }
        )}
        value={inputValue}
        onChange={handleChange}
        onBlur={onBlur}
      />
      <span className="text-neutral-500">{iconRight}</span>
    </div>
  );
}
