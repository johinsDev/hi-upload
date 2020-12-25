import type { AppProps } from "next/app";
import Link from "next/link";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <main className="w-full md:w-8/12 lg:w-6/12 mx-auto px-6 mt-6 md:mt-20">
      <header>
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
              <Link href="/">
                <a href="" className="text-sm inline-block p-3 text-gray-800">
                  Your files
                </a>
              </Link>
            </li>
          </ul>

          <ul className="flex items-center">
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
          </ul>
        </nav>
      </header>
      <Component {...pageProps} />
    </main>
  );
}

export default MyApp;
