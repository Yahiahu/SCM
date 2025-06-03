"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import Link from "next/link";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Separator from "@radix-ui/react-separator";
import { FaCodeBranch, FaUser, FaSignOutAlt } from "react-icons/fa";
import Sidebar from "./sidebar";

interface NavbarProps {
  isLoggedIn: boolean;
}

export default function Navbar({ isLoggedIn }: NavbarProps) {
  const router = useRouter();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isLoggedIn) router.push("/login");
  }, [isLoggedIn, router]);

  if (!mounted || !isLoggedIn) return null;

  return (
    <div
      onMouseEnter={() => setSidebarVisible(true)}
      onMouseLeave={() => setSidebarVisible(false)}
    >
      <Sidebar visible={sidebarVisible} setVisible={setSidebarVisible} />

      <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/20 shadow-sm">
        <div className="w-full px-5">
          <div className="flex items-center justify-between h-16">
            {/* Logo in Square */}
            <div className="flex items-center space-x-4 group">
              <div className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100/50 group-hover:from-blue-100 group-hover:to-indigo-100 transition-all duration-300 group-hover:scale-105 group-hover:shadow-md">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Rotate based on sidebarVisible */}
                <FaCodeBranch
                  className={`w-6 h-6 text-blue-600 transform transition-transform duration-300 ${
                    sidebarVisible ? "rotate-180" : "rotate-90"
                  }`}
                />
              </div>

              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
                Orontis
              </h1>
            </div>

            {/* Right Side - User Menu */}
            <div className="flex items-center space-x-3">
              <Link href="/myAccount" className="hidden sm:block">
                <button className="relative inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50/50 border border-gray-200/50 rounded-lg hover:bg-white hover:border-gray-300/50 hover:text-gray-900 hover:shadow-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
                  <FaUser className="w-3.5 h-3.5 mr-2" />
                  My Account
                </button>
              </Link>

              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="relative inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-400 to-indigo-400 opacity-0 hover:opacity-20 transition-opacity duration-200"></div>
                <FaSignOutAlt className="w-3.5 h-3.5 mr-2" />
                Sign Out
              </button>

              <div className="sm:hidden">
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <button className="inline-flex items-center justify-center w-10 h-10 text-gray-500 bg-gray-50/50 border border-gray-200/50 rounded-lg hover:bg-white hover:text-gray-700 hover:border-gray-300/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                      <FaUser className="w-4 h-4" />
                    </button>
                  </DropdownMenu.Trigger>

                  <DropdownMenu.Portal>
                    <DropdownMenu.Content
                      className="min-w-[200px] bg-white rounded-xl shadow-lg border border-gray-200/50 p-2 z-50 animate-in slide-in-from-top-2 duration-200"
                      sideOffset={8}
                      align="end"
                    >
                      <DropdownMenu.Item asChild>
                        <Link
                          href="/myAccount"
                          className="flex items-center w-full px-3 py-2.5 text-sm text-gray-700 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors duration-150 focus:outline-none focus:bg-gray-50"
                        >
                          <FaUser className="w-4 h-4 mr-3" />
                          My Account
                        </Link>
                      </DropdownMenu.Item>

                      <Separator.Root className="h-px bg-gray-200 my-2" />

                      <DropdownMenu.Item asChild>
                        <button
                          onClick={() => signOut({ callbackUrl: "/login" })}
                          className="flex items-center w-full px-3 py-2.5 text-sm text-red-600 rounded-lg hover:bg-red-50 hover:text-red-700 transition-colors duration-150 focus:outline-none focus:bg-red-50"
                        >
                          <FaSignOutAlt className="w-4 h-4 mr-3" />
                          Sign Out
                        </button>
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
      </nav>
    </div>
  );
}
