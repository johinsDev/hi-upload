import { useQuery } from "react-query";
import File from "./File";

export default function Files() {
  const { data } = useQuery<IFile[]>("files", {
    staleTime: 60 * 1000 * 5,
    retry: false,
  });

  return (
    <section>
      <h2 className="font-medium pb-3 border-b-2 border-gray-100 text-gray-800">
        Your files
      </h2>

      {data?.map((file) => (
        <File file={file} key={file.uuid} />
      ))}

      {!data?.length && (
        <p className="mt-3 text-sm text-gray-800">
          There are not files here right now.
        </p>
      )}
    </section>
  );
}
