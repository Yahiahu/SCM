"use client";

import { Box, Flex, IconButton, Button, Stack } from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { FaHome } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { signOut } from "next-auth/react";

interface NavbarProps {
  isLoggedIn: boolean;
}

export default function Navbar({ isLoggedIn }: NavbarProps) {
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) router.push("/login");
  }, [isLoggedIn, router]);

  if (!isLoggedIn) return null;

  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      width="100%"
      zIndex="1000"
      bg="rgba(255, 249, 255, 1)"
      backdropFilter="saturate(180%) blur(10px)"
      boxShadow="md"
    >
      <Flex
        color="gray.700"
        minH="60px"
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
        />

        <Stack direction="row" spacing={4} align="center">
          <Button
            fontSize="sm"
            variant="ghost"
            onClick={() => router.push("/message")}
          >
            My Account
          </Button>
          <Button
            fontSize="sm"
            fontWeight={600}
            color="white"
            bg="pink.400"
            _hover={{ bg: "pink.500" }}
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            Sign Out
          </Button>
        </Stack>
      </Flex>
    </Box>
  );
}
