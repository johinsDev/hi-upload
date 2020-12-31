export default function File({ file }: { file: IFile }) {
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
        <a
          href=""
          className="inline-block text-sm p-3 text-pink-500 font-medium"
        >
          Delete
        </a>
      </div>
    </div>
  );
}
