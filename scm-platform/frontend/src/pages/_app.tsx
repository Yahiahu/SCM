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
import '@react-three/fiber'; // (already used internally)
import '@react-three/drei'; // includes useGLTF preloader

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isPublic =
    router.pathname === "/" ||
    router.pathname === "/demo" ||
    router.pathname === "/login" ||
    router.pathname === "/landingPage" ||
    router.pathname === "/createAccount" ||
    router.pathname === "/aboutus" ||
    router.pathname.startsWith("/footer");
    

  useEffect(() => {
    if (!isPublic && status === "unauthenticated") {
      router.replace("/login"); // redirect to landing page
    }
  }, [status, isPublic, router]);

  if (!isPublic && status === "loading") return null; // or a loading spinner

  return <>{children}</>;
}

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  // 🔁 Keep-alive ping every 9 minutes (only in production)
  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      const interval = setInterval(() => {
        fetch("https://scm-5zih.onrender.com/api/ping")
          .then((res) => console.log("🔄 Keep-alive ping sent:", res.status))
          .catch((err) => console.error("❌ Keep-alive failed:", err));
      }, 1000 * 60 * 5); // 5 minutes

      return () => clearInterval(interval);
    }
  }, []);

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
