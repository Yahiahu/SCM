"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import Link from "next/link";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Separator from "@radix-ui/react-separator";
import { FaCodeBranch, FaUser, FaSignOutAlt } from "react-icons/fa";

interface NavbarProps {
  isLoggedIn: boolean;
}

export default function Navbar({ isLoggedIn }: NavbarProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Enhanced scroll effect
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoggedIn, router]);

  const handleSignOut = async () => {
    try {
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (!mounted || !isLoggedIn) return null;

  return (
    <div>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-out ${
          scrolled
            ? "bg-white/95 backdrop-blur-2xl border-b border-sky-300/40 shadow-xl shadow-sky-500/10"
            : "bg-white/85 backdrop-blur-xl border-b border-sky-200/30 shadow-lg shadow-sky-500/5"
        }`}
      >
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-sky-50/30 via-transparent to-blue-50/30 opacity-60"></div>

        <div className="relative w-full px-6">
          <div className="flex items-center justify-between h-16">
            {/* Enhanced Logo */}
            <div className="flex items-center space-x-4 group cursor-pointer">
              {/* Enhanced brand name */}
              <Link
                href="/"
                className="flex items-center space-x-4 group cursor-pointer"
              >
                <div className="relative">
                  <div className="absolute inset-0 w-12 h-12 bg-gradient-to-br from-sky-400 to-blue-500 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-700 transform group-hover:scale-150"></div>
                  <div className="relative w-12 h-12 flex items-center justify-center rounded-2xl bg-gradient-to-br from-sky-100 via-white to-blue-100 border border-sky-200/60 group-hover:border-sky-300/80 transition-all duration-500 group-hover:scale-110 group-hover:shadow-2xl group-hover:shadow-sky-500/25 transform-gpu">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-sky-400/5 via-transparent to-blue-400/10 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                    <FaCodeBranch
                      className={`w-6 h-6 text-sky-600 group-hover:text-sky-700 transform rotate-90 transition-all duration-700`}
                    />
                  </div>
                </div>
                <div className="relative">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent tracking-tight group-hover:from-sky-700 group-hover:via-blue-700 group-hover:to-cyan-600 transition-all duration-500">
                    Orontis
                  </h1>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-sky-500 to-blue-500 group-hover:w-full transition-all duration-500 ease-out"></div>
                </div>
              </Link>
            </div>

            {/* Enhanced Right Side */}
            <div className="flex items-center space-x-4">
              {/* My Account Button - Desktop */}
              <Link href="/demo" className="hidden sm:block">
                <button className="relative inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-sky-700 bg-sky-50/60 border border-sky-200/70 rounded-xl hover:bg-white hover:border-sky-300/80 hover:text-sky-800 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg hover:shadow-sky-500/10 group overflow-hidden">
                  {/* Button glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-sky-100/50 to-blue-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <FaUser className="relative w-3.5 h-3.5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  <span className="relative">Demo</span>
                </button>
              </Link>

              {/* Enhanced Sign Out Button */}
              <button
                onClick={handleSignOut}
                className="relative inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-sky-500 via-blue-500 to-sky-600 rounded-xl hover:from-sky-600 hover:via-blue-600 hover:to-sky-700 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-sky-400/50 focus:ring-offset-2 group overflow-hidden shadow-lg shadow-sky-500/25 hover:shadow-xl hover:shadow-sky-500/35"
              >
                {/* Button shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>

                {/* Button glow */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-sky-300/20 to-blue-300/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <FaSignOutAlt className="relative w-3.5 h-3.5 mr-2 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                <span className="relative">Sign in</span>
              </button>

              {/* Enhanced Mobile Menu */}
              <div className="sm:hidden">
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <button className="relative inline-flex items-center justify-center w-11 h-11 text-sky-600 bg-sky-50/60 border border-sky-200/70 rounded-xl hover:bg-white hover:text-sky-700 hover:border-sky-300/80 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-sky-400/50 focus:ring-offset-2 group overflow-hidden hover:shadow-lg hover:shadow-sky-500/10">
                      <div className="absolute inset-0 bg-gradient-to-br from-sky-100/50 to-blue-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <FaUser className="relative w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                    </button>
                  </DropdownMenu.Trigger>

                  <DropdownMenu.Portal>
                    <DropdownMenu.Content
                      className="min-w-[220px] bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-sky-500/20 border border-sky-200/50 p-3 z-50 animate-in slide-in-from-top-3 duration-300"
                      sideOffset={12}
                      align="end"
                    >
                      <DropdownMenu.Item asChild>
                        <Link
                          href="/myAccount"
                          className="flex items-center w-full px-4 py-3 text-sm text-sky-700 rounded-xl hover:bg-sky-50/80 hover:text-sky-800 transition-all duration-200 focus:outline-none focus:bg-sky-50/80 group"
                        >
                          <FaUser className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform duration-200" />
                          <span>My Account</span>
                        </Link>
                      </DropdownMenu.Item>

                      <Separator.Root className="h-px bg-gradient-to-r from-transparent via-sky-200 to-transparent my-3" />

                      <DropdownMenu.Item asChild>
                        <button
                          onClick={handleSignOut}
                          className="flex items-center w-full px-4 py-3 text-sm text-red-600 rounded-xl hover:bg-red-50/80 hover:text-red-700 transition-all duration-200 focus:outline-none focus:bg-red-50/80 group"
                        >
                          <FaSignOutAlt className="w-4 h-4 mr-3 group-hover:scale-110 group-hover:rotate-12 transition-all duration-200" />
                          <span>Sign Out</span>
                        </button>
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sky-400/40 to-transparent"></div>

        {/* Additional subtle glow line */}
        <div className="absolute bottom-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-blue-300/60 to-transparent blur-sm"></div>
      </nav>
    </div>
  );
}
