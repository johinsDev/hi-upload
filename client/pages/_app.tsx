import axios from "axios";
import type { AppProps } from "next/app";
import {
  QueryClient,
  QueryClientProvider,
  QueryFunctionContext,
} from "react-query";
import Alert from "../components/Alert";
import NavBar from "../components/NavBar";
import { API_BASE_URL } from "../shared/env";
import AlertProvider from "../state/alert";
import "../styles/globals.css";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers["Authorization"] = "Bearer " + token;
    }

    config.headers["Content-Type"] = "application/json";

    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

export const defaultQueryFn = async ({ queryKey }: QueryFunctionContext) => {
  const { data } = await api.get(`${queryKey[0]}`, {
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  return data;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultQueryFn,
      staleTime: 60 * 1000,
    },
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AlertProvider>
      <QueryClientProvider client={queryClient}>
        <main className="w-full md:w-8/12 lg:w-6/12 mx-auto px-6 mt-6 md:mt-20">
          <Alert />

          <header>
            <NavBar />
          </header>

          <Component {...pageProps} />
        </main>
      </QueryClientProvider>
    </AlertProvider>
  );
}

export default MyApp;
