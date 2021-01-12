import { useMutation, useQueryClient } from "react-query";
import { api } from "../pages/_app";
import { SLUG_STORAGE } from "./StorageUsage";

export default function File({ file }: { file: IFile }) {
  const queryClient = useQueryClient();

  const { mutate: remove } = useMutation<
    any,
    any,
    string,
    { previousFiles: IFile[] }
  >(
    (uuid) => {
      return api.delete("files/" + uuid);
    },
    {
      onMutate: async (uuid) => {
        await queryClient.cancelQueries("files");

        const previousFiles = queryClient.getQueryData<IFile[]>("files") ?? [];

        queryClient.setQueryData<IFile[]>(
          "files",
          (files) => files?.filter((f) => f.uuid !== uuid) ?? []
        );

        const prevSubscription = queryClient.getQueryData<ISubscription>(
          "/subscription/me"
        );

        queryClient.setQueryData("/subscription/me", () => {
          return {
            ...prevSubscription,
            usages: prevSubscription?.usages.map((usage) => {
              if (usage.feature.slug.includes(SLUG_STORAGE)) {
                return {
                  ...usage,
                  used: usage.used - file.size,
                };
              }

              return usage;
            }),
          };
        });

        return { previousFiles };
      },
      onError: (_, __, context) => {
        if (context?.previousFiles) {
          queryClient.setQueryData("files", context?.previousFiles);
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries("files");
      },
    }
  );

  return (
    <div className="flex items-center justify-between border-b-2 border-gray-100">
      <div className="text-sm truncate overflow-ellipsis w-6/12">
        {file.name}
      </div>

      <div className="-mr-3 flex items-center">
        <a
          href=""
          className="inline-block text-sm p-3 text-indigo-500 font-medium"
        >
          Get sharable link
        </a>
        <button
          className="inline-block text-sm p-3 text-pink-500 font-medium focus:outline-none"
          onClick={() => {
            if (window.confirm("Really delete this file?")) {
              remove(file.uuid);
            }
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
