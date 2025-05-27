"use client";

import React from "react";
import { Box, Flex, Icon, Text, useColorModeValue } from "@chakra-ui/react";
import {
  FiHome,
  FiTrendingUp,
  FiCompass,
  FiStar,
  FiSettings,
} from "react-icons/fi";
import { IconType } from "react-icons";

interface LinkItemProps {
  name: string;
  icon: IconType;
}
const LinkItems: Array<LinkItemProps> = [
  { name: "Home", icon: FiHome },
  { name: "Trending", icon: FiTrendingUp },
  { name: "Explore", icon: FiCompass },
  { name: "Favourites", icon: FiStar },
  { name: "Settings", icon: FiSettings },
];

// Define prop types for the Sidebar
interface SidebarProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

// Accept props
export default function Sidebar({ visible, setVisible }: SidebarProps) {
  const sidebarWidth = "200px"; // Define width for reuse

  return (
    <>
      {/* Hover zone (invisible) - Remains the same */}
      <Box
        position="fixed"
        top="0"
        left="0"
        h="100vh"
        w="10px" // Keep the thin hover zone
        zIndex="overlay"
        onMouseEnter={() => setVisible(true)} // Use prop setVisible
        // Add onMouseLeave here if you want moving away from the thin bar
        // to also close it, though typically you'd only close when
        // leaving the *main* sidebar.
      />

      {/* Sidebar */}
      <Box
        position="fixed" // Keep it fixed
        top="0"
        left={visible ? "0" : `-${sidebarWidth}`} // Slide in/out
        h="100vh"
        w={sidebarWidth} // Use defined width
        zIndex="overlay"
        bg={useColorModeValue("white", "gray.800")}
        borderRight="1px solid"
        borderColor={useColorModeValue("gray.200", "gray.700")}
        transition="left 0.3s ease" // Transition the 'left' property
        onMouseLeave={() => setVisible(false)} // Use prop setVisible
        pt={20} // Add padding-top to align below a potential navbar
      >
        <Flex h="20" align="center" justify="center" px="4">
          {/* You can add a Logo or Title here */}
        </Flex>
        {LinkItems.map((link) => (
          <NavItem key={link.name} icon={link.icon} label={link.name} />
        ))}
      </Box>
    </>
  );
}

// NavItem remains the same
interface NavItemProps {
  icon: IconType;
  label: string;
}

const NavItem = ({ icon, label }: NavItemProps) => {
  return (
    <Flex
      align="center"
      px="4"
      py="3"
      cursor="pointer"
      role="group"
      transition="all 0.2s"
      _hover={{ bg: "cyan.500", color: "white" }}
    >
      <Icon as={icon} fontSize="20" />
      <Text ml="4" fontSize="sm">
        {label}
      </Text>
    </Flex>
  );
};
