// pages/_app.tsx
import { ChakraProvider } from "@chakra-ui/react";
import { AuthProvider } from "../contexts/AuthContext";
import { SessionProvider, useSession } from "next-auth/react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useRouter } from "next/router";
import type { AppProps } from "next/app";
import "../styles/globals.css";
import { Theme } from "@radix-ui/themes";
import { useEffect } from "react";

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isPublic =
    router.pathname === "/" ||
    router.pathname === "/demo" ||
    router.pathname === "/login" ||
    router.pathname === "/landingPage" ||
    router.pathname === "/createAccount";

  useEffect(() => {
    if (!isPublic && status === "unauthenticated") {
      router.replace("/login"); // redirect to landing page
    }
  }, [status, isPublic, router]);

  if (!isPublic && status === "loading") return null; // or a loading spinner

  return <>{children}</>;
}

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <ChakraProvider>
        <AuthProvider>
          <TooltipProvider>
            <Theme>
              <AuthGuard>
                <Component {...pageProps} />
              </AuthGuard>
            </Theme>
          </TooltipProvider>
        </AuthProvider>
      </ChakraProvider>
    </SessionProvider>
  );
}

export default MyApp;
