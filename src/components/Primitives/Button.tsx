import clsx from "clsx";
import type { HeroIconName } from "./DynamicIcon";
import { DynamicHeroIcon } from "./DynamicIcon";

type Props = {
  type: "primary" | "secondary" | "tertiary";
  title: string;
  icon?: HeroIconName;
  intent?: "normal" | "success" | "error";
  action: () => void;
  disabled?: boolean;
  isLoading?: boolean;
};

export default function Button({
  type,
  title,
  intent,
  icon,
  action,
  disabled,
  isLoading,
}: Props) {
  return (
    <button
      disabled={disabled}
      onClick={action}
      className={clsx(
        "flex items-center rounded-lg py-1.5 font-mono text-sm tracking-tighter",
        {
          "border-1  px-5  transition-all disabled:border-neutral-500 disabled:text-neutral-500":
            type === "primary",
          " border-1 border-neutral-800 bg-neutral-800 px-5 text-neutral-500 transition-all hover:bg-transparent hover:text-neutral-200 disabled:bg-neutral-800 disabled:text-neutral-500":
            type === "secondary",
          "border-0 bg-transparent text-neutral-500 transition-all hover:text-neutral-200 disabled:text-neutral-500":
            type === "tertiary",
        },
        {
          "border-green-400/70 text-green-400/70 hover:border-green-400/100 hover:text-green-400/100":
            type === "primary" && intent === "success",
          "border-neutral-500 text-neutral-500 hover:border-neutral-200 hover:text-neutral-200":
            type === "primary" && intent !== "success",
        }
      )}
    >
      {icon && <DynamicHeroIcon icon={icon} classNames="mr-1" />}
      <span>{isLoading ? "•••" : title}</span>
    </button>
  );
}
