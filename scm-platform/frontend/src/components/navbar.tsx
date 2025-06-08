"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import Link from "next/link";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Separator from "@radix-ui/react-separator";
import {
  FaCodeBranch,
  FaUser,
  FaSignOutAlt,
  FaBars,
  FaChevronDown,
} from "react-icons/fa";
import Sidebar from "./sidebar";

interface NavbarProps {
  isLoggedIn: boolean;
}

const navItems = [
  {
    label: "Admin",
    items: [
      { label: "Dashboard", href: "/admin/dashboard" },
      { label: "Finance", href: "/admin/finance" },
      { label: "Integrations", href: "/admin/integrations" },
    ],
  },
  {
    label: "Insights",
    items: [
      { label: "Forecasts", href: "/insights/forecasts" },
      { label: "Inventory Insights", href: "/inventory/insights" },
    ],
  },
  {
    label: "Inventory",
    items: [
      { label: "Inventory", href: "/inventory" },
      { label: "Warehouse", href: "/warehouse" },
    ],
  },
  {
    label: "Logistics",
    items: [{ label: "Logistics", href: "/logistics/logistics" }],
  },
  {
    label: "Procurement",
    items: [{ label: "RFQs", href: "/procurement/rfq" }],
  },
  {
    label: "Production",
    items: [
      { label: "BOM", href: "/production/bom" },
      { label: "Work Orders", href: "/production/workOrders" },
    ],
  },
  {
    label: "Sales",
    items: [
      { label: "Fulfillment", href: "/sales/fullfillment" },
      { label: "Orders", href: "/sales/orders" },
      { label: "Shipping", href: "/shipping" },
    ],
  },
  {
    label: "Products",
    items: [
      { label: "Product List", href: "/product" },
      { label: "Product Orders", href: "/productOrder" },
      { label: "Specific Product", href: "/specificProduct" },
      { label: "Specific Component", href: "/specificComponent" },
    ],
  },
  {
    label: "Accounts",
    items: [
      { label: "My Account", href: "/myAccount" },
      { label: "Create Account", href: "/createAccount" },
      { label: "Login", href: "/login" },
    ],
  },
  {
    label: "Suppliers",
    items: [
      { label: "Supplier List", href: "/supplier" },
      { label: "New Supplier", href: "/newsupplier" },
    ],
  },
  {
    label: "Marketing",
    items: [
      { label: "Landing Page", href: "/landingPage" },
      { label: "About Us", href: "/aboutus" },
      { label: "Demo", href: "/demo" },
    ],
  },
  {
    label: "Misc",
    items: [
      { label: "Messages", href: "/message" },
      { label: "Settings", href: "/settings" },
    ],
  },
];

export default function Navbar({ isLoggedIn }: NavbarProps) {
  const router = useRouter();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // State to manage individual dropdown open/close on hover
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    // Enhanced scroll effect
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []); // Empty dependency array as isLoggedIn and router are not directly used here

  const handleSignOut = async () => {
    try {
      await signOut({ redirect: false }); // Use signOut from next-auth/react
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (!mounted || !isLoggedIn) return null;

  return (
    <div>
      <Sidebar visible={sidebarVisible} setVisible={setSidebarVisible} />
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
            {/* Enhanced Logo - Hover for Sidebar */}
            <div
              className="flex items-center space-x-4 group cursor-pointer"
              onMouseEnter={() => setSidebarVisible(true)}
              onMouseLeave={() => setSidebarVisible(false)}
            >
              <Link
                href="/"
                className="flex items-center space-x-4 group cursor-pointer"
              >
                <div className="relative">
                  <div className="absolute inset-0 w-12 h-12 bg-gradient-to-br from-sky-400 to-blue-500 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-700 transform group-hover:scale-150"></div>
                  <div className="relative w-12 h-12 flex items-center justify-center rounded-2xl bg-gradient-to-br from-sky-100 via-white to-blue-100 border border-sky-200/60 group-hover:border-sky-300/80 transition-all duration-500 group-hover:scale-110 group-hover:shadow-2xl group-hover:shadow-sky-500/25 transform-gpu">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-sky-400/5 via-transparent to-blue-400/10 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                    <FaCodeBranch
                      className={`w-6 h-6 text-sky-600 group-hover:text-sky-700 transform transition-all duration-700 ${
                        sidebarVisible ? "rotate-180 scale-110" : "rotate-90"
                      }`}
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

            {/* Desktop Navigation Menu */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.slice(0, 6).map((section, index) => (
                <DropdownMenu.Root
                  key={index}
                  open={openDropdown === section.label}
                  onOpenChange={(isOpen) =>
                    setOpenDropdown(isOpen ? section.label : null)
                  }
                >
                  <DropdownMenu.Trigger asChild>
                    <button
                      className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-sky-700 hover:text-sky-800 rounded-lg hover:bg-sky-50/60 transition-all duration-200 group"
                      onMouseEnter={() => setOpenDropdown(section.label)}
                      onMouseLeave={() => setOpenDropdown(null)}
                    >
                      <span>{section.label}</span>
                      <FaChevronDown className="ml-1 w-3 h-3 group-hover:rotate-180 transition-transform duration-200" />
                    </button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Portal>
                    <DropdownMenu.Content
                      className="min-w-[200px] bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl shadow-sky-500/20 border border-sky-200/50 p-2 z-50 animate-in slide-in-from-top-3 duration-300"
                      sideOffset={8}
                      align="start"
                      onMouseEnter={() => setOpenDropdown(section.label)} // Keep open when hovering content
                      onMouseLeave={() => setOpenDropdown(null)} // Close when leaving content
                    >
                      {section.items.map((item, itemIndex) => (
                        <DropdownMenu.Item key={itemIndex} asChild>
                          <Link
                            href={item.href}
                            className="flex items-center w-full px-3 py-2.5 text-sm text-sky-700 rounded-lg hover:bg-sky-50/80 hover:text-sky-800 transition-all duration-200 focus:outline-none focus:bg-sky-50/80"
                            onClick={() => setOpenDropdown(null)} // Close on click
                          >
                            {item.label}
                          </Link>
                        </DropdownMenu.Item>
                      ))}
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
              ))}

              {/* More dropdown for remaining items */}
              <DropdownMenu.Root
                open={openDropdown === "More"}
                onOpenChange={(isOpen) =>
                  setOpenDropdown(isOpen ? "More" : null)
                }
              >
                <DropdownMenu.Trigger asChild>
                  <button
                    className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-sky-700 hover:text-sky-800 rounded-lg hover:bg-sky-50/60 transition-all duration-200 group"
                    onMouseEnter={() => setOpenDropdown("More")}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <span>More</span>
                    <FaChevronDown className="ml-1 w-3 h-3 group-hover:rotate-180 transition-transform duration-200" />
                  </button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    className="min-w-[250px] bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl shadow-sky-500/20 border border-sky-200/50 p-2 z-50 animate-in slide-in-from-top-3 duration-300 max-h-96 overflow-y-auto"
                    sideOffset={8}
                    align="end"
                    onMouseEnter={() => setOpenDropdown("More")} // Keep open when hovering content
                    onMouseLeave={() => setOpenDropdown(null)} // Close when leaving content
                  >
                    {navItems.slice(6).map((section, index) => (
                      <div key={index}>
                        <div className="px-3 py-2 text-xs font-semibold text-sky-600 uppercase tracking-wider">
                          {section.label}
                        </div>
                        {section.items.map((item, itemIndex) => (
                          <DropdownMenu.Item key={itemIndex} asChild>
                            <Link
                              href={item.href}
                              className="flex items-center w-full px-3 py-2.5 text-sm text-sky-700 rounded-lg hover:bg-sky-50/80 hover:text-sky-800 transition-all duration-200 focus:outline-none focus:bg-sky-50/80 ml-2"
                              onClick={() => setOpenDropdown(null)} // Close on click
                            >
                              {item.label}
                            </Link>
                          </DropdownMenu.Item>
                        ))}
                        {index < navItems.slice(6).length - 1 && (
                          <Separator.Root className="h-px bg-gradient-to-r from-transparent via-sky-200 to-transparent my-2" />
                        )}
                      </div>
                    ))}
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            </div>

            {/* Right Side */}
            <div className="flex items-center space-x-4">
              {/* My Account Button - Desktop */}
              <Link href="/myAccount" className="hidden sm:block">
                <button className="relative inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-sky-700 bg-sky-50/60 border border-sky-200/70 rounded-xl hover:bg-white hover:border-sky-300/80 hover:text-sky-800 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg hover:shadow-sky-500/10 group overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-sky-100/50 to-blue-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <FaUser className="relative w-3.5 h-3.5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  <span className="relative">My Account</span>
                </button>
              </Link>

              {/* Enhanced Sign Out Button */}
              <button
                onClick={handleSignOut}
                className="relative inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-sky-500 via-blue-500 to-sky-600 rounded-xl hover:from-sky-600 hover:via-blue-600 hover:to-sky-700 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-sky-400/50 focus:ring-offset-2 group overflow-hidden shadow-lg shadow-sky-500/25 hover:shadow-xl hover:shadow-sky-500/35"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-sky-300/20 to-blue-300/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <FaSignOutAlt className="relative w-3.5 h-3.5 mr-2 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                <span className="relative">Sign Out</span>
              </button>

              {/* Mobile Menu Button */}
              <div className="lg:hidden">
                <DropdownMenu.Root
                  open={mobileMenuOpen}
                  onOpenChange={setMobileMenuOpen}
                >
                  <DropdownMenu.Trigger asChild>
                    <button className="relative inline-flex items-center justify-center w-11 h-11 text-sky-600 bg-sky-50/60 border border-sky-200/70 rounded-xl hover:bg-white hover:text-sky-700 hover:border-sky-300/80 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-sky-400/50 focus:ring-offset-2 group overflow-hidden hover:shadow-lg hover:shadow-sky-500/10">
                      <div className="absolute inset-0 bg-gradient-to-br from-sky-100/50 to-blue-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <FaBars className="relative w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                    </button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Portal>
                    <DropdownMenu.Content
                      className="min-w-[280px] bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-sky-500/20 border border-sky-200/50 p-3 z-50 animate-in slide-in-from-top-3 duration-300 max-h-[80vh] overflow-y-auto"
                      sideOffset={12}
                      align="end"
                    >
                      {/* Mobile Account Link */}
                      <DropdownMenu.Item asChild>
                        <Link
                          href="/myAccount"
                          className="flex items-center w-full px-4 py-3 text-sm text-sky-700 rounded-xl hover:bg-sky-50/80 hover:text-sky-800 transition-all duration-200 focus:outline-none focus:bg-sky-50/80 group sm:hidden"
                          onClick={() => setMobileMenuOpen(false)} // Close on click
                        >
                          <FaUser className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform duration-200" />
                          <span>My Account</span>
                        </Link>
                      </DropdownMenu.Item>

                      <Separator.Root className="h-px bg-gradient-to-r from-transparent via-sky-200 to-transparent my-3 sm:hidden" />

                      {/* Mobile Navigation */}
                      {navItems.map((section, index) => (
                        <div key={index}>
                          <div className="px-4 py-2 text-xs font-semibold text-sky-600 uppercase tracking-wider">
                            {section.label}
                          </div>
                          {section.items.map((item, itemIndex) => (
                            <DropdownMenu.Item key={itemIndex} asChild>
                              <Link
                                href={item.href}
                                className="flex items-center w-full px-4 py-2.5 text-sm text-sky-700 rounded-xl hover:bg-sky-50/80 hover:text-sky-800 transition-all duration-200 focus:outline-none focus:bg-sky-50/80 ml-2"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                {item.label}
                              </Link>
                            </DropdownMenu.Item>
                          ))}
                          {index < navItems.length - 1 && (
                            <Separator.Root className="h-px bg-gradient-to-r from-transparent via-sky-200 to-transparent my-3" />
                          )}
                        </div>
                      ))}

                      <Separator.Root className="h-px bg-gradient-to-r from-transparent via-sky-200 to-transparent my-3" />

                      {/* Mobile Sign Out */}
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
        <div className="absolute bottom-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-blue-300/60 to-transparent blur-sm"></div>
      </nav>
    </div>
  );
}
