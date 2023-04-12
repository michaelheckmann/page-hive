import React from "react";
import Skeleton from "react-loading-skeleton";

type Props = {
  children: React.ReactNode;
  title?: string;
  isLoading?: boolean;
  itemHeight?: number;
};

export default function OptionContainer({
  children,
  title,
  isLoading,
  itemHeight,
}: Props) {
  return (
    <>
      {title && (
        <div className="mb-4 text-xl font-medium tracking-wide ">{title}</div>
      )}
      <div className="border-lg w-full divide-y-1 divide-neutral-500 rounded-lg border-1 border-neutral-500">
        {!isLoading && children}
        {isLoading && (
          <>
            <div className="p-4">
              <Skeleton
                baseColor="#404040"
                highlightColor="#525252"
                height={itemHeight || 20}
              />
            </div>
            <div className="p-4">
              <Skeleton
                baseColor="#404040"
                highlightColor="#525252"
                height={itemHeight || 20}
              />
            </div>
            <div className="p-4">
              <Skeleton
                baseColor="#404040"
                highlightColor="#525252"
                height={itemHeight || 20}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
}
