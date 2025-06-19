"use client";

import React, { forwardRef } from "react";
import {
  FiHome,
  FiBox,
  FiPackage,
  FiShoppingCart,
  FiTruck,
  FiMessageSquare,
  FiDatabase,
  FiShoppingBag,
  FiSettings,
  FiArrowDownRight,
  FiArrowDown,
  FiAnchor,
} from "react-icons/fi";
import { IconType } from "react-icons";
import Link from "next/link";
import { GiFishingBoat } from "react-icons/gi";

interface LinkItemProps {
  name: string;
  icon: IconType;
  path: string;
}

const LinkItems: Array<LinkItemProps> = [
  { name: "Home", icon: FiHome, path: "/landingPage" },
  { name: "Products", icon: FiBox, path: "/product" },
  { name: "Components", icon: FiPackage, path: "/component" },
  { name: "Suppliers", icon: FiArrowDownRight, path: "/supplier" },
  { name: "Shipping", icon: FiAnchor, path: "/shipping" },
  { name: "Demo", icon: FiShoppingCart, path: "/demo" },
  { name: "Inventory", icon: FiDatabase, path: "/inventory" },
  { name: "Messages", icon: FiMessageSquare, path: "/message" },
  { name: "Marketplace", icon: FiShoppingBag, path: "/marketplace" },
  { name: "Product Orders", icon: FiShoppingCart, path: "/productOrder" },
  { name: "Warehouse", icon: FiTruck, path: "/warehouse" },
  { name: "Imports", icon: FiArrowDown, path: "/imports" },
  { name: "Settings", icon: FiSettings, path: "/settings" },
];

interface SidebarProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const Sidebar = forwardRef<HTMLDivElement, SidebarProps>(
  ({ visible, setVisible, onMouseEnter, onMouseLeave }, ref) => {
    const sidebarWidth = "w-52";
    const hoverBg = "hover:bg-sky-100";
    const activeBg = "bg-sky-200";

    return (
      <>
        <div
          className="fixed top-0 left-0 h-screen w-3 z-50"
          onMouseEnter={() => setVisible(true)}
        />

        <div
          ref={ref}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          className={`fixed top-0 h-screen ${sidebarWidth} z-40 bg-white border-r border-sky-200 transition-all duration-300 ease-in-out shadow-lg ${
            visible ? "left-0" : "-left-52"
          }`}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-center px-4 py-6">
              <span className="text-xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                Orontis
              </span>
            </div>

            <nav className="flex-1 overflow-y-auto py-4">
              <ul className="space-y-1 px-2">
                {LinkItems.map((link) => (
                  <NavItem
                    key={link.name}
                    icon={link.icon}
                    label={link.name}
                    path={link.path}
                    hoverBg={hoverBg}
                    activeBg={activeBg}
                  />
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </>
    );
  }
);

Sidebar.displayName = "Sidebar";
export default Sidebar;

interface NavItemProps {
  icon: IconType;
  label: string;
  path: string;
  hoverBg: string;
  activeBg: string;
}

const NavItem = ({
  icon: Icon,
  label,
  path,
  hoverBg,
  activeBg,
}: NavItemProps) => {
  return (
    <li>
      <Link href={path} passHref>
        <div
          className={`flex items-center px-4 py-3 mx-2 rounded-md cursor-pointer transition-colors duration-200 ${hoverBg} text-sky-700
            hover:text-sky-600 [&.active]:${activeBg} [&.active]:text-sky-700 [&.active]:font-medium`}
        >
          <Icon className="w-5 h-5 text-sky-600" />
          <span className="ml-4 text-sm">{label}</span>
        </div>
      </Link>
    </li>
  );
};
