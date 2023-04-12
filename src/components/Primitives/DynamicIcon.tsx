import type { ClassValue } from "clsx";
import clsx from "clsx";
import type { CSSProperties } from "react";
import * as HeroIcons from "react-icons/hi";

export type HeroIconName = keyof typeof HeroIcons;
interface IconProps {
  icon: HeroIconName;
  classNames?: ClassValue;
  styles?: CSSProperties;
  overwriteClassNames?: boolean;
}

export const DynamicHeroIcon = ({
  icon,
  classNames,
  styles,
  overwriteClassNames,
}: IconProps) => {
  const SingleIcon = HeroIcons[icon];

  return (
    <SingleIcon
      className={clsx(
        overwriteClassNames ? "" : "h-5 w-5 flex-shrink-0 text-neutral-50",
        classNames
      )}
      style={styles}
    />
  );
};
