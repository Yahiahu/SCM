"use client";

import {
  Box,
  Flex,
  IconButton,
  Button,
  Stack,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { FaHome } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";

interface NavbarProps {
  isLoggedIn: boolean;
}

export default function Navbar({ isLoggedIn }: NavbarProps) {
  const router = useRouter();
  const [showNavBg, setShowNavBg] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) router.push("/login");
  }, [isLoggedIn, router]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setShowNavBg(e.clientY < 80); // Show nav when mouse is near top
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  if (!isLoggedIn) return null;

  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      width="100%"
      zIndex="1000"
      transition="background-color 0.3s ease, backdrop-filter 0.3s ease"
      bg={showNavBg ? "rgba(255, 249, 255, 1)" : "transparent"}
      backdropFilter={showNavBg ? "saturate(180%) blur(10px)" : "none"}
      boxShadow={showNavBg ? "md" : "none"}
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
          icon={<FaHome />}
          variant="ghost"
          aria-label="Home"
          onClick={() => router.push("/product")}
          _hover={{ bg: "pink.100", transform: "scale(1.1)" }}
        />

        <Stack direction="row" spacing={4} align="center">
          <Button
            fontSize="sm"
            variant="ghost"
            onClick={() => router.push("/message")}
            _hover={{
              bg: "pink.50",
              transform: "scale(1.05)",
            }}
          >
            My Account
          </Button>
          <Button
            fontSize="sm"
            fontWeight={600}
            color="white"
            bg="pink.400"
            _hover={{ bg: "pink.500", transform: "scale(1.05)" }}
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            Sign Out
          </Button>
        </Stack>
      </Flex>
    </Box>
  );
}
