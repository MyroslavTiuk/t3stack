import {
  ClipboardDocumentIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import React from "react";
import { toast } from "react-toastify";
import { toastProps } from "~/styles/toast";
import { api } from "~/utils/api";

const Publish: React.FC = () => {
  const {
    data: publicId,
    isLoading,
    refetch,
    // @ts-ignore
  } = api.portfolio.getPublicId.useQuery();
  const { mutate: publish, isLoading: isPublishLoading } =
    // @ts-ignore
    api.portfolio.publish.useMutation({
      onSuccess: () => refetch(),
    });
  const { mutate: makePrivate, isLoading: isMakePrivateLoading } =
    // @ts-ignore
    api.portfolio.makePrivate.useMutation({
      onSuccess: () => refetch(),
    });

  const handleCopyClick = () => {
    navigator.clipboard.writeText(
      `https://trackgreeks.com/portfolio/${publicId}`
    );
    toast.success("Copied to clipboard", toastProps);
  };

  if (isLoading) {
    return (
      <div className="animate-pulsemt-10 h-10 w-full rounded-lg bg-gray-200 py-4 dark:bg-gray-700"></div>
    );
  }

  if (publicId) {
    return (
      <div className="flex w-full items-center gap-3 py-4 pr-4">
        <p className="ml-auto">
          Publicly available at{" "}
          <Link
            href={`/portfolio/${publicId}`}
            className="text-teal-600 underline"
          >
            https://trackgreeks.com/portfolio/{publicId}
          </Link>
        </p>
        <button onClick={handleCopyClick}>
          <ClipboardDocumentIcon className="h-6 w-6" />
        </button>
        <button
          className="flex items-center gap-2 rounded-lg border-2 border-teal-600 p-1 text-sm font-semibold text-teal-600 no-underline drop-shadow transition duration-150 ease-in-out hover:bg-neutral-500 hover:bg-opacity-10 md:px-2 lg:text-base"
          onClick={() => makePrivate()}
          disabled={isMakePrivateLoading}
        >
          <LockClosedIcon className="h-5 w-5" />
          {isMakePrivateLoading ? (
            <div
              className="aspect-square h-6 animate-spin rounded-full border-4 border-solid border-current border-r-transparent  motion-reduce:animate-[spin_1.5s_linear_infinite]"
              role="status"
            />
          ) : (
            "make private"
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="flex w-full gap-3 py-4 pr-4">
      <button
        className="ml-auto flex items-center gap-2 rounded-lg border-2 border-teal-600 p-1 text-sm font-semibold text-teal-600 no-underline drop-shadow transition duration-150 ease-in-out hover:bg-neutral-500 hover:bg-opacity-10 md:px-2 lg:text-base"
        onClick={() => publish()}
        disabled={isPublishLoading}
      >
        {isPublishLoading ? (
          <div
            className="aspect-square h-6 animate-spin rounded-full border-4 border-solid border-current border-r-transparent  motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          />
        ) : (
          "publish"
        )}
      </button>
    </div>
  );
};

export default Publish;
