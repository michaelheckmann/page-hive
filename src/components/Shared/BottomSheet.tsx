import type { TargetAndTransition } from "framer-motion";
import { motion } from "framer-motion";
import type { Dispatch, SetStateAction } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { HiBadgeCheck, HiOutlineLink } from "react-icons/hi";
import { api } from "../../utils/api";
import { createSlug } from "../../utils/createSlug";
import { getHiIcons } from "../../utils/getHiIcons";
import { getWebsiteMeta } from "../../utils/getWebsiteMeta";
import { isValidURL } from "../../utils/isValidUrl";
import Button from "../Primitives/Button";
import Creatable from "../Primitives/Createable";
import type { HeroIconName } from "../Primitives/DynamicIcon";
import { DynamicHeroIcon } from "../Primitives/DynamicIcon";
import Input from "../Primitives/Input";
import MultiSelect from "../Primitives/MultiSelect";
import type { SelectOption } from "../Primitives/Select";
import Select from "../Primitives/Select";

export type DefaultLinkValues = {
  id: string | undefined;
  url: string | undefined;
  category: SelectOption<string> | null | undefined;
  categoryIcon: SelectOption<string> | null | undefined;
  tags: SelectOption<string>[] | null | undefined;
};

type Props = {
  isSheetOpen: boolean;
  setIsSheetOpen: Dispatch<SetStateAction<boolean>>;
  refetch?: () => Promise<unknown>;
  defaultLinkValues?: DefaultLinkValues;
};

export default function BottomSheet({
  isSheetOpen,
  setIsSheetOpen,
  refetch: executeRefetch,
  defaultLinkValues,
}: Props) {
  const [url, setUrl] = useState<string>(defaultLinkValues?.url || "");
  const [urlValid, setUrlValid] = useState<boolean>(!!defaultLinkValues?.url);
  const [category, setCategory] = useState<SelectOption | null>(
    defaultLinkValues?.category || null
  );
  const [categoryIcon, setCategoryIcon] = useState<SelectOption | null>(
    defaultLinkValues?.categoryIcon || null
  );
  const [tags, setTags] = useState<SelectOption[]>(
    defaultLinkValues?.tags || []
  );
  const [formComplete, setFormComplete] = useState<boolean>(false);
  const [metaTitle, setMetaTitle] = useState<string>("");
  const [metaDescription, setMetaDescription] = useState<string>("");
  const [metaImage, setMetaImage] = useState<string>("");

  const transactionType = useMemo(() => {
    return defaultLinkValues?.url ? "edit" : "add";
  }, [defaultLinkValues]);

  const resetMetaData = () => {
    setMetaTitle("");
    setMetaDescription("");
    setMetaImage("");
  };

  const resetForm = useCallback(() => {
    setUrl("");
    setCategory(null);
    setCategoryIcon(null);
    setTags([]);
    resetMetaData();
  }, []);

  const teardown = () => {
    resetForm();
    setIsSheetOpen(false);
  };

  const { data: existingCategories, refetch: refetchCategories } =
    api.category.getAll.useQuery();
  const { data: existingTags, refetch: refetchTags } =
    api.tag.getAll.useQuery();

  const { mutate: createLinkMutation, isLoading: createLinkLoading } =
    api.link.create.useMutation({
      onSuccess: () => {
        if (executeRefetch) {
          void executeRefetch();
        }
        void refetchCategories();
        void refetchTags();
        teardown();
      },
    });

  const { mutate: updateLinkMutation, isLoading: updateLinkLoading } =
    api.link.update.useMutation({
      onSuccess: () => {
        if (executeRefetch) {
          void executeRefetch();
        }
        void refetchCategories();
        void refetchTags();
        teardown();
      },
    });

  const { mutate: deleteLinkMutation, isLoading: deleteLinkLoading } =
    api.link.delete.useMutation({
      onSuccess: () => {
        if (executeRefetch) {
          void executeRefetch();
        }
        void refetchCategories();
        void refetchTags();
        teardown();
      },
    });

  const hiIconOptions = getHiIcons().map((i) => ({
    label: i,
    value: i,
  }));

  const fetchData = useCallback(async (url?: string) => {
    if (!url) return resetMetaData();
    if (!isValidURL(url)) return resetMetaData();
    const metaData = await getWebsiteMeta(url);
    setMetaTitle(metaData.title);
    setMetaDescription(metaData.description);
    if (metaData.images && metaData.images.length > 0) {
      setMetaImage(metaData.images[0] as string);
    }
  }, []);

  useEffect(() => {
    if (url && isValidURL(url)) {
      setUrlValid(true);
    } else {
      setUrlValid(false);
    }
  }, [url]);

  useEffect(() => {
    if (!urlValid) return setFormComplete(false);
    if (!category) return setFormComplete(false);
    if (category?.__isNew__ && !categoryIcon) return setFormComplete(false);
    setFormComplete(true);
  }, [urlValid, category, categoryIcon]);

  useEffect(() => {
    if (!defaultLinkValues) {
      resetForm();
    } else {
      const { url, category, categoryIcon, tags } = defaultLinkValues;
      setUrl(url || "");
      setCategory(category || null);
      setCategoryIcon(categoryIcon || null);
      setTags(tags || []);
      void fetchData(url);
    }
  }, [defaultLinkValues, fetchData, resetForm]);

  const createLink = () => {
    console.log("Add link");
    console.log("URL: ", url);
    console.log("Category: ", category);
    console.log("Tags: ", tags);

    // Make sure that the category is not empty
    if (!category) {
      return;
    }
    const isNewCategory = category?.__isNew__;

    createLinkMutation({
      link: {
        url,
        title: metaTitle,
        description: metaDescription,
        image: metaImage,
        // TODO: Create comment input
        comment: "",
      },
      category: isNewCategory
        ? {
            transaction: "create",
            name: category.value,
            slug: createSlug(category.label),
            icon: categoryIcon?.value,
          }
        : {
            transaction: "connect",
            id: category.value,
          },
      tag: tags.map((t) => {
        const isNewTag = t.__isNew__;
        return isNewTag
          ? {
              transaction: "create",
              name: t.value,
            }
          : {
              transaction: "connect",
              id: t.value,
            };
      }),
    });
  };

  const updateLink = () => {
    console.log("Update link");
    console.log("URL: ", url);
    console.log("Category: ", category);
    console.log("Tags: ", tags);
    if (!defaultLinkValues) return;
    // Make sure that the category is not empty
    if (!category) {
      return;
    }
    const isNewCategory = category?.__isNew__;

    updateLinkMutation({
      id: defaultLinkValues.id,
      link: {
        url,
        title: metaTitle,
        description: metaDescription,
        image: metaImage,
        // TODO: Create comment input
        comment: "",
      },
      category: isNewCategory
        ? {
            transaction: "create",
            name: category.value,
            slug: createSlug(category.label),
            icon: categoryIcon?.value,
          }
        : {
            transaction: "connect",
            id: category.value,
          },
      tag: tags.map((t) => {
        const isNewTag = t.__isNew__;
        return isNewTag
          ? {
              transaction: "create",
              name: t.value,
            }
          : {
              transaction: "connect",
              id: t.value,
            };
      }),
    });
  };

  const deleteLink = () => {
    if (!defaultLinkValues?.id) return;
    deleteLinkMutation({
      id: defaultLinkValues.id,
    });
  };

  const isMutationLoading = useMemo(() => {
    return createLinkLoading || updateLinkLoading || deleteLinkLoading;
  }, [createLinkLoading, updateLinkLoading, deleteLinkLoading]);

  const animatedBackdropStyle: TargetAndTransition = {
    opacity: isSheetOpen ? 0.5 : 0,
    pointerEvents: isSheetOpen ? "auto" : "none",
  };
  const animatedStyle: TargetAndTransition = {
    height: isSheetOpen ? "90vh" : "0vh",
  };
  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="absolute left-0 top-0 bottom-0 z-40 flex h-screen w-full cursor-pointer bg-black"
        animate={animatedBackdropStyle}
        initial={{ opacity: 0 }}
        transition={{
          ease: "linear",
          duration: 0.5,
        }}
        onClick={() => setIsSheetOpen(false)}
      ></motion.div>

      {/* Sheet */}
      <motion.div
        className="absolute left-0 bottom-0 z-50 flex w-full overflow-hidden rounded-t-2xl bg-neutral-900 shadow-2xl"
        initial={{ height: "0vh" }}
        animate={animatedStyle}
        transition={{
          ease: "anticipate",
          duration: 0.5,
        }}
      >
        <div className="mx-auto flex w-full max-w-lg flex-col overflow-y-scroll p-4">
          <div className="mb-8 flex w-full justify-between">
            <Button title="Cancel" type="secondary" action={teardown} />
            <Button
              title={`${transactionType === "add" ? "Add" : "Update"} link`}
              type="primary"
              intent={formComplete ? "success" : "normal"}
              action={() =>
                void transactionType === "add" ? createLink() : updateLink()
              }
              disabled={!formComplete || isMutationLoading}
              isLoading={isMutationLoading}
            />
          </div>
          <Input
            placeholder="Enter a URL"
            value={url}
            setValue={setUrl}
            onBlur={() => void fetchData(url)}
            icon={
              <HiOutlineLink
                className="absolute top-2.5 left-3 z-10"
                size={18}
              />
            }
            iconRight={
              urlValid ? (
                <HiBadgeCheck
                  className="absolute top-[10px] right-3 z-10 text-green-400"
                  size={18}
                />
              ) : undefined
            }
          />
          <Creatable
            options={
              existingCategories
                ? existingCategories.map(({ id, name }) => ({
                    label: name,
                    value: id,
                  }))
                : []
            }
            placeholder="Select a category..."
            value={category}
            setValue={setCategory}
          />
          {category?.__isNew__ && (
            <div className="flex w-full items-stretch gap-2">
              <div className="w-full">
                <Select
                  options={hiIconOptions}
                  placeholder="Select an icon for the new category..."
                  value={categoryIcon}
                  setValue={setCategoryIcon}
                />
              </div>
              {categoryIcon?.value && (
                <DynamicHeroIcon
                  icon={categoryIcon.value as HeroIconName}
                  classNames="h-10 w-10 border-neutral-500 rounded-lg border-1 text-neutral-50 mb-10 p-2"
                  overwriteClassNames
                />
              )}
            </div>
          )}
          <MultiSelect
            options={
              existingTags
                ? existingTags.map(({ id, name }) => ({
                    label: name,
                    value: id,
                  }))
                : []
            }
            placeholder="Select one or more tags..."
            value={tags}
            setValue={setTags}
          />
          {metaTitle && (
            <div className="mb-10 rounded-lg border-1  border-neutral-500 p-4 text-sm text-neutral-500">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={metaImage}
                alt={metaTitle}
                className="mb-2 h-44 w-full rounded-lg object-cover opacity-50"
              />
              <div className="mb-2 font-medium tracking-wide">{metaTitle}</div>
              <div>{metaDescription}</div>
            </div>
          )}
          {transactionType !== "edit" && (
            <div className="" w-full>
              <Button
                title="Delete link"
                type="secondary"
                action={() => void deleteLink()}
              />
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}
