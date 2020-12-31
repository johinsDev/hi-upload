import type { AppProps } from "next/app";
import {
  QueryClient,
  QueryClientProvider,
  QueryFunctionContext,
} from "react-query";
import NavBar from "../components/NavBar";
import { API_BASE_URL } from "../shared/env";
import "../styles/globals.css";

export const defaultQueryFn = async <T extends any = any>({
  queryKey,
}: QueryFunctionContext): Promise<T> => {
  const r = await fetch(`${API_BASE_URL}/${queryKey[0]}`, {
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (r.status !== 200) {
    throw new Error(await r.text());
  }

  return await r.json();
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultQueryFn,
    },
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <main className="w-full md:w-8/12 lg:w-6/12 mx-auto px-6 mt-6 md:mt-20">
        <header>
          <NavBar />
        </header>

        <Component {...pageProps} />
      </main>
    </QueryClientProvider>
  );
}

export default MyApp;
