"use client";

import {
  Box,
  Flex,
  Stack,
  Heading,
  Text,
  Container,
  Input,
  Button,
  SimpleGrid,
  IconProps,
  Icon,
  InputGroup,
  InputRightElement,
  extendTheme,
  ChakraProvider,
  useToast,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { Link as ChakraLink } from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon, StarIcon } from "@chakra-ui/icons";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

const theme = extendTheme({
  colors: {
    red: { 400: "#FC8181" },
    pink: { 400: "#F687B3" },
    orange: { 400: "#ED8936" },
    yellow: { 400: "#ECC94B" },
  },
});

const Blur = (props: IconProps) => (
  <Icon
    width={"30vw"}
    zIndex={0}
    height="560px"
    viewBox="0 0 528 560"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx="71" cy="61" r="111" fill="#F56565" />
    <circle cx="244" cy="106" r="139" fill="#ED64A6" />
    <circle cy="291" r="139" fill="#ED64A6" />
    <circle cx="80.5" cy="189.5" r="101.5" fill="#ED8936" />
    <circle cx="196.5" cy="317.5" r="101.5" fill="#ECC94B" />
    <circle cx="70.5" cy="458.5" r="101.5" fill="#48BB78" />
    <circle cx="426.5" cy="-0.5" r="101.5" fill="#4299E1" />
  </Icon>
);

const TestimonialBox = () => (
  <Flex justify="center">
    <Box
      bg="white"
      p={4}
      borderRadius="md"
      boxShadow="lg"
      w="70%"
      maxW="m"
      border="1px solid"
      borderColor="gray.200"
      position="relative"
    >
      <Flex position="absolute" top={2} right={5} gap={0.5}>
        {[...Array(5)].map((_, i) => (
          <StarIcon key={i} color="yellow.400" boxSize={3} />
        ))}
      </Flex>
      <Text fontWeight="bold" mb={1}>
        LinkedIn User
      </Text>
      <Text fontSize="sm" color="gray.600">
        “This is the best thing I've ever used for managing inventory and supply
        chains!”
      </Text>
    </Box>
  </Flex>
);

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ username: "", password: "" });
  const toast = useToast();
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/product");
    }
  }, [status, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5001/api/users");
      const users = await res.json();
      const match = users.find(
        (u: any) =>
          u.username === form.username && u.password_hash === form.password
      );
      if (!match) throw new Error("Account not found");

      localStorage.setItem("user", JSON.stringify(match)); // keep your existing logic

      toast({
        title: "Login successful",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      router.push("/product");
    } catch (err: any) {
      toast({
        title: "Login failed",
        description: err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex position="relative" minH="100vh" align="center">
      <Container
        as={SimpleGrid}
        maxW="7xl"
        columns={{ base: 1, md: 2 }}
        spacing={10}
        py={{ base: 8, md: 12 }}
      >
        <Stack spacing={{ base: 8, md: 12 }}>
          <Heading
            fontSize={{ base: "3xl", md: "5xl", lg: "6xl" }}
            lineHeight={1.1}
          >
            Inventory{" "}
            <Text
              as="span"
              bgGradient="linear(to-r, red.400, pink.400)"
              bgClip="text"
            >
              &
            </Text>{" "}
            Supply Chain Managment
          </Heading>
          <TestimonialBox />
        </Stack>

        <Stack bg="gray.50" rounded="xl" p={8} spacing={8} maxW="lg">
          <Stack spacing={4}>
            <Heading
              color="gray.800"
              fontSize={{ base: "2xl", md: "4xl" }}
              lineHeight={1.1}
            >
              Login{" "}
              <Text
                as="span"
                bgGradient="linear(to-r, red.400, pink.400)"
                bgClip="text"
              >
                !
              </Text>
            </Heading>
            <Button
              mt={2}
              colorScheme="gray"
              variant="outline"
              onClick={() => signIn("google", { callbackUrl: "/product" })}
            >
              Sign in with Google
            </Button>
            <ChakraLink
              as={NextLink}
              href="/createAccount"
              color="blue.500"
              fontWeight="semibold"
              fontSize={{ base: "sm", sm: "md" }}
              _hover={{ textDecoration: "underline" }}
            >
              Create Account
            </ChakraLink>
          </Stack>

          <Box as="form" onSubmit={handleSubmit} mt={-5}>
            <Stack spacing={4}>
              <Input
                name="username"
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
                bg="gray.100"
                border={0}
                color="gray.500"
                _placeholder={{ color: "gray.500" }}
                _hover={{ bg: "gray.200" }}
              />
              <InputGroup>
                <Input
                  name="password"
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  bg="gray.100"
                  border={0}
                  color="gray.500"
                  _placeholder={{ color: "gray.500" }}
                  _hover={{ bg: "gray.200" }}
                />
                <InputRightElement width="3rem">
                  <Button
                    h="1.5rem"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <Button type="submit" mt={2} colorScheme="pink" fontWeight="bold">
                Login
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Container>
      <Blur
        position="absolute"
        bottom={-100}
        left={-20}
        style={{ filter: "blur(70px)", transform: "scaleY(-1)" }}
      />
    </Flex>
  );
}

export default function WrappedLogin() {
  return (
    <ChakraProvider theme={theme}>
      <Login />
    </ChakraProvider>
  );
}
