import type { GetServerSidePropsContext } from "next";
import { type NextPage } from "next";
import { getServerSession } from "next-auth/next";
import { signIn } from "next-auth/react";
import Head from "next/head";
import Logo from "../components/Shared/Logo";

import { authOptions } from "../server/auth";

const Home: NextPage = () => {
  const handleSignIn = () => {
    void signIn("github");
  };

  return (
    <>
      <Head>
        <title>PageHive</title>
        <meta name="description" content="Organize your bookmarks" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-neutral-900 text-neutral-500">
        <button
          onClick={handleSignIn}
          className="group flex flex-col items-center justify-center gap-12 rounded border-1 border-neutral-700 px-20 pt-20 pb-6 transition-all hover:border-2"
        >
          <Logo size="large" />
          <div className="flex font-mono text-xs tracking-tight transition-colors group-hover:text-neutral-400">
            Continue to sign-in
          </div>
        </button>
      </main>
    </>
  );
};

export default Home;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  // If the user is already logged in, redirect.
  if (session) {
    return { redirect: { destination: "/home" } };
  }

  return {
    props: {},
  };
}
