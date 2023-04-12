import clsx from "clsx";
import Link from "next/link";

type Props = {
  size?: "small" | "medium" | "large";
};

const defaultProps: Props = {
  size: "medium",
};

export default function Logo({ size } = defaultProps) {
  return (
    <Link
      href="/"
      className={clsx(
        "bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text font-freight tracking-wide text-transparent",
        {
          "text-2xl": size === "small",
          "text-4xl": size === "medium",
          "text-6xl": size === "large",
        }
      )}
    >
      PageHive
    </Link>
  );
}
