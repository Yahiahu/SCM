"use client";

import {
  Box,
  Flex,
  Button,
  Stack,
  Heading,
  Icon,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { FaCodeBranch } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import Sidebar from "./sidebar";
import Link from "next/link";
import { keyframes } from "@emotion/react";

interface NavbarProps {
  isLoggedIn: boolean;
}

const rotateIn = keyframes`
  0% { transform: rotate(0deg) scale(0.8); opacity: 0; }
  100% { transform: rotate(90deg) scale(1); opacity: 1; }
`;

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
          <Flex
            align="center"
            gap={4}
            cursor="pointer"
            onClick={() => setSidebarVisible(!sidebarVisible)}
            _hover={{ opacity: 0.8 }}
          >
            <Icon
              as={FaCodeBranch}
              w={7}
              h={7}
              mr={1}
              color="blue.500" // explicitly fixed
              transform="rotate(90deg)"
              transition="transform 0.3s ease"
              _hover={{
                animation: `${rotateIn} 0.5s ease-out`,
                color: "brand.500", // <<< ensure it doesn't change on hover
              }}
            />

            <Heading
              size="md"
              fontFamily="heading"
              letterSpacing="wide"
              color="blue.500" // fixed brand color
              transition="none"
              _hover={{
                color: "blue.700", // <<< ensure it never changes
              }}
            >
              Orontis
            </Heading>
          </Flex>

          <Stack direction="row" spacing={4} align="center">
            <Button
              as={Link}
              href="/myAccount"
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
