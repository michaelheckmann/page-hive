import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import Button from "../Primitives/Button";
import Logo from "../Shared/Logo";

type Props = {
  variant?: "home" | "category";
  onAddLinkPress: () => void;
};

export default function Header({ variant, onAddLinkPress }: Props) {
  const router = useRouter();
  const handleHomeNaviation = () => {
    void router.push("/");
  };
  const handleSignOut = () => {
    void signOut();
  };
  return (
    <>
      <div className="mb-10 flex w-full justify-between">
        {variant === "home" ||
          (!variant && (
            <Button type="secondary" title="Logout" action={handleSignOut} />
          ))}
        {variant === "category" && (
          <Button
            type="tertiary"
            title="Home"
            icon="HiChevronLeft"
            action={handleHomeNaviation}
          />
        )}
        <button>
          <Logo size="small" />
        </button>
        <Button type="secondary" title="Add" action={onAddLinkPress} />
      </div>
    </>
  );
}
