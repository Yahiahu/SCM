// pages/_app.tsx
import { ChakraProvider } from "@chakra-ui/react";
import { AuthProvider } from "../contexts/AuthContext";
import { SessionProvider } from "next-auth/react";
import { TooltipProvider } from "@/components/ui/tooltip"; // ✅ Import TooltipProvider
import type { AppProps } from "next/app";
import '../styles/globals.css'; // <-- This is required
import { Theme } from "@radix-ui/themes";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <ChakraProvider>
        <AuthProvider>
          <TooltipProvider>
            <Theme>
            {" "}
            {/* ✅ Wrap your app */}
            <Component {...pageProps} />
            </Theme>
          </TooltipProvider>
        </AuthProvider>
      </ChakraProvider>
    </SessionProvider>
  );
}

export default MyApp;
