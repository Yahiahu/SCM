"use client";

import React from "react";
import { Box, Flex, Icon, Text, useColorModeValue } from "@chakra-ui/react";
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
} from "react-icons/fi";
import { IconType } from "react-icons";
import Link from "next/link";

interface LinkItemProps {
  name: string;
  icon: IconType;
  path: string;
}

const LinkItems: Array<LinkItemProps> = [
  { name: "Home", icon: FiHome, path: "/home" },
  { name: "Products", icon: FiBox, path: "/product" },
  { name: "Components", icon: FiPackage, path: "/component" },
  { name: "Demo", icon: FiShoppingCart, path: "/demo" },
  { name: "Inventory", icon: FiDatabase, path: "/inventory" },
  { name: "Messages", icon: FiMessageSquare, path: "/message" },
  { name: "Marketplace", icon: FiShoppingBag, path: "/marketplace" },
  { name: "Product Orders", icon: FiShoppingCart, path: "/productorder" },
  { name: "Warehouse", icon: FiTruck, path: "/warehouse" },
  { name: "Settings", icon: FiSettings, path: "/settings" },
];

interface SidebarProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

export default function Sidebar({ visible, setVisible }: SidebarProps) {
  const sidebarWidth = "200px";
  const hoverBg = "#2596be20"; // 20% opacity of the blue color
  const activeBg = "#2596be40"; // 40% opacity of the blue color

  return (
    <>
      {/* Hover zone */}
      <Box
        position="fixed"
        top="0"
        left="0"
        h="100vh"
        w="10px"
        zIndex="overlay"
        onMouseEnter={() => setVisible(true)}
      />

      {/* Sidebar */}
      <Box
        position="fixed"
        top="0"
        left={visible ? "0" : `-${sidebarWidth}`}
        h="100vh"
        w={sidebarWidth}
        zIndex="overlay"
        bg="white"
        borderRight="1px solid"
        borderColor="gray.200"
        transition="left 0.3s ease"
        onMouseLeave={() => setVisible(false)}
      >
        <Flex align="flex-start" justify="center" px="4" mt="4" mb="2">
          <Text fontSize="lg" fontWeight="bold" color="#2596be">
            Orontis
          </Text>
        </Flex>
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
      </Box>
    </>
  );
}

interface NavItemProps {
  icon: IconType;
  label: string;
  path: string;
  hoverBg: string;
  activeBg: string;
}

const NavItem = ({ icon, label, path, hoverBg, activeBg }: NavItemProps) => {
  return (
    <Link href={path} passHref>
      <Flex
        as="a"
        align="center"
        px="4"
        py="3"
        mx="2"
        my="1"
        borderRadius="md"
        cursor="pointer"
        transition="all 0.2s"
        _hover={{
          bg: hoverBg,
          color: "#2596be",
        }}
        _activeLink={{
          bg: activeBg,
          color: "#2596be",
          fontWeight: "bold",
        }}
      >
        <Icon as={icon} fontSize="20" color="#2596be" />
        <Text ml="4" fontSize="sm" color="gray.700">
          {label}
        </Text>
      </Flex>
    </Link>
  );
};
