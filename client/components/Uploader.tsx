import * as React from "react";
import { FilePond } from "react-filepond";
import "filepond/dist/filepond.min.css";
import axios from "axios";
import { api } from "../pages/_app";

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

export default function Uploader() {
  const pond = React.useRef<FilePond>(null);

  return (
    <section className="mb-8">
      <FilePond
        ref={pond}
        allowMultiple={true}
        name="file"
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
                console.log(field, data.fields[field as keyof Fields]);

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
        onprocessfile={(error, file) => {
          if (error) {
            return;
          }

          setTimeout(() => pond.current?.removeFile(file), 500);
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
