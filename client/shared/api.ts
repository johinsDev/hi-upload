import { API_BASE_URL } from "./env";

export const defaultMutationFn = async ([path, body, method = "POST"]: [
  string,
  any,
  "POST" | "PUT" | "DELETE"
]) => {
  const r = await fetch(API_BASE_URL + path, {
    method,
    body: JSON.stringify(body),
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!r.ok) {
    throw new Error(await r.text());
  }

  return await r.json();
};
