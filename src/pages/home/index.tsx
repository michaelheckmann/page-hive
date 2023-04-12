import type { GetServerSideProps } from "next";
import type { GetSessionParams } from "next-auth/react";
import { getSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import Header from "../../components/Layout/Header";
import type { HeroIconName } from "../../components/Primitives/DynamicIcon";
import Input from "../../components/Primitives/Input";
import Option from "../../components/Primitives/Option";
import OptionContainer from "../../components/Primitives/OptionContainer";
import Portal from "../../components/Primitives/Portal";
import BottomSheet from "../../components/Shared/BottomSheet";
import MobileOnly from "../../components/Shared/MobileOnly";
import { api } from "../../utils/api";

export default function Home() {
  const router = useRouter();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const onAddLinkPress = () => {
    setIsSheetOpen(true);
  };

  const {
    data: categories,
    isLoading,
    refetch,
  } = api.category.getAll.useQuery();
  const chooseCategory = (category: string) => {
    void router.push(`/categories/${category}`);
  };

  return (
    <>
      <Head>
        <title>PageHive</title>
        <meta name="description" content="Organize your bookmarks" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col bg-neutral-900 p-4 text-neutral-500">
        <MobileOnly>
          <Header variant="home" onAddLinkPress={onAddLinkPress} />
          <Input
            placeholder="Enter a URL"
            icon={
              <HiOutlineSearch
                className="absolute top-3 left-3 z-10"
                size={18}
              />
            }
          />
          <OptionContainer title="Categories" isLoading={isLoading}>
            {categories &&
              categories.map((category) => (
                <Option
                  key={category.id}
                  title={category.name}
                  icon={category.icon as HeroIconName}
                  action={() => chooseCategory(category.slug)}
                />
              ))}
          </OptionContainer>
        </MobileOnly>
      </main>

      <Portal selector="#bottom-sheet">
        <BottomSheet {...{ isSheetOpen, setIsSheetOpen, refetch }} />
      </Portal>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (
  context: GetSessionParams
) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  } else {
    return {
      props: { session },
    };
  }
};
