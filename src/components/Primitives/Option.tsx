import type { HeroIconName } from "./DynamicIcon";
import { DynamicHeroIcon } from "./DynamicIcon";

type Props = {
  title: string;
  icon?: HeroIconName;
  action: () => void;
};

export default function Option({ title, icon, action }: Props) {
  return (
    <button
      onClick={action}
      className="group flex w-full items-center justify-between p-4"
    >
      <div className="flex items-center gap-2">
        <DynamicHeroIcon icon={icon || "HiTag"} />
        <div className="transition-colors group-hover:text-neutral-200">
          {title}
        </div>
      </div>
      <div>
        <DynamicHeroIcon icon="HiChevronRight" />
      </div>
    </button>
  );
}
