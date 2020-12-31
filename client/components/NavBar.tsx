import Link from "next/link";
import * as React from "react";
import { useMutation, useQueryClient } from "react-query";
import { defaultMutationFn } from "../shared/api";
import useUser from "../shared/useUser";

export default function NavBar() {
  const { data, isLoading } = useUser();

  const queryClient = useQueryClient();

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
              Home {data?.email}
            </a>
          </Link>
        </li>

        <li>
          <Link href="/">
            <a href="" className="text-sm inline-block p-3 text-gray-800">
              Your files
            </a>
          </Link>
        </li>
      </ul>

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
