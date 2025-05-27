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
import { ViewIcon, ViewOffIcon, StarIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { useRouter } from "next/navigation";

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
  <Flex justify="left">
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

function CreateAccount() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    organization_id: 1,
  });

  const toast = useToast();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast({
        title: "Passwords do not match",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const res = await fetch("http://localhost:5001/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          phone: form.phone,
          password_hash: form.password,
          role: "user",
          organization_id: form.organization_id,
        }),
      });

      const contentType = res.headers.get("content-type");
      if (!res.ok) {
        const errorText = contentType?.includes("application/json")
          ? (await res.json()).message
          : await res.text();
        throw new Error(errorText || "Unknown error");
      }

      toast({
        title: "Account created!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      router.push("/login");
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  return (
    <Box position="relative">
      <Container
        as={SimpleGrid}
        maxW="7xl"
        columns={{ base: 1, md: 2 }}
        spacing={10}
        py={20}
      >
        <Stack spacing={10}>
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

        <Stack bg="gray.50" rounded="xl" p={8} spacing={6} maxW="lg">
          <Heading color="gray.800" fontSize={{ base: "2xl", md: "4xl" }}>
            Create Account{" "}
            <Text
              as="span"
              bgGradient="linear(to-r, red.400, pink.400)"
              bgClip="text"
            >
              !
            </Text>
          </Heading>
          <Box as="form" onSubmit={handleSubmit}>
            <Stack spacing={4}>
              <Input
                name="username"
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
                {...commonInput}
              />
              <Input
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                {...commonInput}
              />
              <Input
                name="phone"
                placeholder="Phone"
                value={form.phone}
                onChange={handleChange}
                {...commonInput}
              />
              <InputGroup>
                <Input
                  name="password"
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  {...commonInput}
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
              <InputGroup>
                <Input
                  name="confirmPassword"
                  placeholder="Retype Password"
                  type={showPassword ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={handleChange}
                  {...commonInput}
                />
              </InputGroup>
              <Button type="submit" mt={4} colorScheme="pink" fontWeight="bold">
                Create Account
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Container>
      <Blur
        position="absolute"
        bottom={-10}
        left={-10}
        style={{ filter: "blur(70px)", transform: "scaleY(-1)" }}
      />
    </Box>
  );
}

const commonInput = {
  bg: "gray.100",
  border: 0,
  color: "gray.500",
  _placeholder: { color: "gray.500" },
  _hover: { bg: "gray.200" },
};

export default function WrappedCreateAccount() {
  return (
    <ChakraProvider theme={theme}>
      <CreateAccount />
    </ChakraProvider>
  );
}
