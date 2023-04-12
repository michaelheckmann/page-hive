import Link from "next/link";
import { HiDotsVertical } from "react-icons/hi";
import TimeAgo from "timeago-react";
import { getHostfromURL } from "../../utils/getHostfromURL";

type Props = {
  id: string;
  title: string;
  image: string;
  url: string;
  createdAt: Date;
  editLink: (id: string) => void;
};

export default function LinkItem({
  title,
  image,
  url,
  createdAt,
  id,
  editLink,
}: Props) {
  return (
    <div className="flex w-full">
      <Link href={url} className="group flex-1 p-4 hover:bg-neutral-700/10">
        <div className="flex items-center gap-4">
          {image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt={title}
              className="h-10 w-16 rounded object-cover"
            />
          )}
          <div className="flex flex-col text-left text-neutral-300 transition-colors group-hover:text-neutral-200">
            <div>{title}</div>
            <div className="text-sm text-neutral-500">
              <span>{getHostfromURL(url)}</span>
              <span className="mx-1">•</span>
              <TimeAgo datetime={createdAt} locale="en" live={false} />
            </div>
          </div>
        </div>
      </Link>
      <button
        className="flex min-w-[50px] items-center justify-center border-l-1 border-neutral-800 hover:bg-neutral-700/10"
        onClick={() => editLink(id)}
      >
        <HiDotsVertical />
      </button>
    </div>
  );
}
