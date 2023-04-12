import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function MobileOnly({ children }: Props) {
  return <div className="md:hidden">{children}</div>;
}
