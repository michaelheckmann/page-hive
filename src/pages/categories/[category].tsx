import type { InferGetServerSidePropsType } from "next";
import type { GetSessionParams } from "next-auth/react";
import { getSession } from "next-auth/react";
import Head from "next/head";
import { useState } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import Header from "../../components/Layout/Header";
import Input from "../../components/Primitives/Input";
import LinkItem from "../../components/Primitives/LinkItem";
import OptionContainer from "../../components/Primitives/OptionContainer";
import type { DefaultLinkValues } from "../../components/Shared/BottomSheet";
import BottomSheet from "../../components/Shared/BottomSheet";
import { api } from "../../utils/api";

interface Params {
  params: {
    category: string;
  };
}

const emptyLinkValues: DefaultLinkValues = {
  id: undefined,
  url: undefined,
  category: null,
  categoryIcon: null,
  tags: [],
};

export default function Category({
  category,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [defaultLinkValues, setDefaultLinkValues] = useState(emptyLinkValues);

  const {
    data: links,
    isLoading,
    refetch,
  } = api.link.getByCategorySlug.useQuery({
    slug: category,
  });
  const { data: categoryData } = api.category.getBySlug.useQuery({
    slug: category,
  });

  const onAddLinkPress = () => {
    setDefaultLinkValues(emptyLinkValues);
    setIsSheetOpen(true);
  };

  const onEditLinkPress = (id: string) => {
    console.log("oneeditlinkpress", id);
    const link = links?.find((link) => link.id === id);
    if (!link) return;
    if (!categoryData) return;

    console.log("link", link);

    setDefaultLinkValues({
      id: link.id,
      url: link.url,
      category: {
        label: categoryData?.name,
        value: categoryData?.id,
      },
      categoryIcon: {
        label: categoryData?.icon || "",
        value: categoryData?.icon || "",
      },
      tags: link.TagsOnLinks.map(({ tag }) => ({
        label: tag.name,
        value: tag.id,
      })),
    });
    setIsSheetOpen(true);
  };
  return (
    <>
      <Head>
        <title>{`PageHive${
          categoryData ? ` | ${categoryData.name}` : ""
        }`}</title>
        <meta name="description" content="Organize your bookmarks" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen flex-col overflow-y-scroll bg-neutral-900 p-4 text-neutral-500">
        <Header variant="category" onAddLinkPress={onAddLinkPress} />
        <Input
          placeholder="Enter a URL"
          icon={
            <HiOutlineSearch className="absolute top-3 left-3 z-10" size={18} />
          }
        />
        <OptionContainer
          title={categoryData?.name || "Loading..."}
          isLoading={isLoading}
          itemHeight={40}
        >
          {links &&
            links.map((link) => (
              <LinkItem
                key={link.id}
                title={link.title}
                url={link.url}
                image={link.image}
                createdAt={link.createdAt}
                id={link.id}
                editLink={onEditLinkPress}
              />
            ))}
        </OptionContainer>
        <BottomSheet
          {...{
            isSheetOpen,
            setIsSheetOpen,
            refetch,
            defaultLinkValues,
          }}
        />
      </main>
    </>
  );
}

export const getServerSideProps = async (
  context: GetSessionParams & Params
) => {
  const session = await getSession(context);
  const { category } = context.params;

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  } else {
    return {
      props: { session, category },
    };
  }
};
