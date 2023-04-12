import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type Props = {
  children: React.ReactNode;
  selector: string;
};

export default function Portal({ children, selector }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    return () => setMounted(false);
  }, []);

  return mounted
    ? createPortal(children, document.querySelector(selector) as HTMLElement)
    : null;
}
