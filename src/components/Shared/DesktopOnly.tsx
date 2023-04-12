import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function DesktopOnly({ children }: Props) {
  return <div className="hidden md:block">{children}</div>;
}
