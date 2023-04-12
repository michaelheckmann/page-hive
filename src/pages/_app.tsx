import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "../utils/api";

import localFont from "@next/font/local";
import "react-loading-skeleton/dist/skeleton.css";
import "../styles/globals.css";

const freightFont = localFont({ src: "../../public/FreightDispProBlack.ttf" });

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <>
      <style jsx global>{`
        :root {
          /* ... */
          --freight-font: ${freightFont.style.fontFamily};
        }
      `}</style>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
      <div id="bottom-sheet" />
    </>
  );
};

export default api.withTRPC(MyApp);
