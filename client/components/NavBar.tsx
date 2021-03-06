import { useRouter } from "next/dist/client/router";
import Link from "next/link";
import * as React from "react";
import { useMutation, useQueryClient } from "react-query";
import { defaultMutationFn } from "../shared/api";
import useUser from "../shared/useUser";
import StorageUsage from "./StorageUsage";

export default function NavBar() {
  const { data, isLoading } = useUser();

  const queryClient = useQueryClient();

  const router = useRouter();

  const { mutate } = useMutation(defaultMutationFn, {
    onSuccess: () => {
      localStorage.removeItem("token");

      queryClient.setQueryData("auth/me", {});
    },
  });

  const isAuthenticated = !!data?.email && !isLoading;

  return (
    <nav className="flex flex-wrap md:flex-no-wrap items-center justify-between mb-6 -mx-3 -mt-3">
      <ul className="flex items-center">
        <li>
          <Link href="/">
            <a href="" className="text-sm inline-block p-3 text-gray-800">
              Home
            </a>
          </Link>
        </li>

        <li>
          <Link href="/upload">
            <a href="" className="text-sm inline-block p-3 text-gray-800">
              Your files
            </a>
          </Link>
        </li>
      </ul>

      <div className="flex justify-center order-last w-full md:w-auto md:order-none">
        {isAuthenticated && <StorageUsage />}
      </div>

      <ul className="flex items-center">
        {!isAuthenticated && (
          <>
            <li>
              <Link href="/login">
                <a className="text-sm inline-block p-3 text-gray-800">
                  Sign In
                </a>
              </Link>
            </li>

            <li>
              <Link href="/login">
                <a href="" className="text-sm inline-block p-3 text-gray-800">
                  Create Account
                </a>
              </Link>
            </li>
          </>
        )}

        {isAuthenticated && (
          <>
            <li>
              <Link href="/login">
                <a className="text-sm inline-block p-3 text-gray-800">
                  Account
                </a>
              </Link>
            </li>

            <li>
              <button
                className="text-sm inline-block p-3 text-gray-800 focus:outline-none"
                onClick={() => {
                  mutate(["/auth/logout", {}, "DELETE"]);

                  queryClient.clear();

                  router.push("/");
                }}
              >
                Log out
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
