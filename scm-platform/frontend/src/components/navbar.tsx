"use client";

import {
  Box,
  Flex,
  IconButton,
  Button,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import Sidebar from "./sidebar";
import Link from "next/link";

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
    <>
      <Sidebar visible={sidebarVisible} setVisible={setSidebarVisible} />
      <Box
        position="fixed"
        top="0"
        left="0"
        width="100%"
        zIndex="1000"
        bg="blue.50"
        opacity={1}
        backdropFilter="saturate(180%) blur(10px)"
        boxShadow="sm"
        borderBottom="1px solid"
        borderColor="blue.100"
      >
        <Flex
          color="gray.700"
          minH={"60px"}
          py={2}
          px={4}
          align="center"
          justify="space-between"
        >
          <IconButton
            icon={<HamburgerIcon />}
            variant="ghost"
            aria-label="Open Sidebar"
            onClick={() => setSidebarVisible(!sidebarVisible)}
            _hover={{
              bg: "rgba(255,255,255,0.5)",
              transform: "scale(1.1)",
            }}
          />

          <Stack direction="row" spacing={4} align="center">
            <Button
              as={Link}
              href="/message"
              fontSize="sm"
              variant="ghost"
              passHref
              _hover={{
                bg: "rgba(255,255,255,0.5)",
                color: "#2596be",
                transform: "scale(1.05)",
              }}
            >
              My Account
            </Button>

            <Button
              fontSize="sm"
              fontWeight={600}
              color="white"
              bg="#58BDEF"
              _hover={{
                bg: "#1a7ca8",
                transform: "scale(1.05)",
                boxShadow: "0 0 0 2px rgba(37, 150, 190, 0.3)",
              }}
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              Sign Out
            </Button>
          </Stack>
        </Flex>
      </Box>
    </>
  );
}
