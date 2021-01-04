import * as React from "react";
import { FilePond } from "react-filepond";
import "filepond/dist/filepond.min.css";
import axios from "axios";
import { api } from "../pages/_app";
import { useMutation, useQueryClient } from "react-query";
import { v4 as uuidv4 } from "uuid";

interface Fields {
  bucket: string;
  "X-Amz-Signature": string;
  "X-Amz-Date": string;
  "X-Amz-Credential": string;
  "X-Amz-Algorithm": string;
  Policy: string;
  "Content-Type": string;
  key: string;
}

interface IResponse {
  fields: Fields;
  url: string;
}

interface IData {
  path: string;
  name: string;
  size: string;
}

export default function Uploader() {
  const pond = React.useRef<FilePond>(null);

  const queryClient = useQueryClient();

  const { mutate } = useMutation<any, any, IData, { previousFiles: IFile[] }>(
    (data) => {
      return api.post("files", data);
    },
    {
      onMutate: async (newFile) => {
        await queryClient.cancelQueries("files");

        const previousFiles = queryClient.getQueryData<IFile[]>("files") ?? [];

        queryClient.setQueryData<IFile[]>("files", (files) => [
          { name: newFile.name, uuid: uuidv4() },
          ...(files ?? []),
        ]);

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
    <section className="mb-8">
      <FilePond
        ref={pond}
        allowMultiple={true}
        name="file"
        maxParallelUploads={3}
        maxFiles={10}
        server={{
          process: async (_, file, metadata, load, __, progress, ___) => {
            try {
              const form = new FormData();

              const cancelTokenSource = axios.CancelToken.source();

              const { data } = await api.post<IResponse>("files/signed", {
                name: metadata.fileInfo.name,
                extension: metadata.fileInfo.extension,
                size: metadata.fileInfo.size,
              });

              Object.keys(data.fields).forEach((field) => {
                form.append(field, data.fields[field as keyof Fields]);
              });

              form.append("file", file);

              await axios({
                headers: {
                  "Content-Type": "multipart/form-data",
                },
                data: form,
                method: "POST",
                url: data.url,
                cancelToken: cancelTokenSource.token,
                onUploadProgress(e) {
                  progress(e.lengthComputable, e.loaded, e.total);
                },
              });

              load(`${data.fields.key}`);

              return {
                abort: () => {
                  cancelTokenSource.cancel();
                },
              };
            } catch (error) {
              console.log("ERROR", error);
            }
          },
        }}
        onprocessfile={async (error, file) => {
          if (error) {
            return;
          }

          await mutate({
            path: file.serverId,
            name: file.filename,
            size: file.fileSize.toString(),
          });

          setTimeout(() => {
            pond.current?.removeFile(file);
          }, 500);
        }}
        onaddfile={(error, file) => {
          if (error) {
            return;
          }

          file.setMetadata("fileInfo", {
            name: file.filenameWithoutExtension,
            extension: file.fileExtension,
            size: file.fileSize,
          });
        }}
      />
    </section>
  );
}
