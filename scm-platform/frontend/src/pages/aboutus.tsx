"use client";

import {
  Box,
  ChakraProvider,
  extendTheme,
  Flex,
  Heading,
  VStack,
  HStack,
  Text,
  Icon,
  useColorModeValue,
  Container,
  SimpleGrid,
  Divider,
  Image,
  Grid,
  GridItem,
  Avatar,
  AvatarGroup,
  useBreakpointValue,
  Button,
  Input,
  Textarea,
} from "@chakra-ui/react";
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  RefObject,
} from "react";
import { Link as ChakraLink } from "@chakra-ui/react";
import NextLink from "next/link";
import { keyframes } from "@emotion/react";
import {
  FaCodeBranch,
  FaUsers,
  FaAward,
  FaSeedling,
  FaHandshake,
  FaQuoteLeft,
  FaArrowRight,
} from "react-icons/fa";
import { FaEye as FaVision } from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";

// Theme configuration
const config = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const colors = {
  brand: {
    50: "#e0f7fa",
    100: "#b3e5fc",
    200: "#81d4fa",
    300: "#4fc3f7",
    400: "#29b6f6",
    500: "#03a9f4",
    600: "#039be5",
    700: "#0288d1",
    800: "#0277bd",
    900: "#01579b",
  },
  dark: {
    bg: "#1A202C",
    text: "#E2E8F0",
    card: "#2D3748",
    border: "#4A5568",
  },
  light: {
    bg: "#F7FAFC",
    text: "#2D3748",
    card: "#FFFFFF",
    border: "#E2E8F0",
  },
};

const theme = extendTheme({
  config,
  colors,
  fonts: {
    heading: `'Inter', sans-serif`,
    body: `'Inter', sans-serif`,
  },
  styles: {
    global: (props: { colorMode: string }) => ({
      body: {
        bg: props.colorMode === "dark" ? "dark.bg" : "light.bg",
        color: props.colorMode === "dark" ? "dark.text" : "light.text",
        transitionProperty: "background-color",
        transitionDuration: "normal",
        overflowX: "hidden",
      },
      "::selection": {
        bg: "brand.500",
        color: "white",
      },
    }),
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: "none",
        fontWeight: "semibold",
      },
      variants: {
        solid: (props: { colorMode: string }) => ({
          bg: props.colorMode === "dark" ? "brand.500" : "brand.600",
          color: "white",
          _hover: {
            bg: props.colorMode === "dark" ? "brand.600" : "brand.700",
          },
        }),
        outline: (props: { colorMode: string }) => ({
          borderColor: props.colorMode === "dark" ? "brand.500" : "brand.600",
          color: props.colorMode === "dark" ? "brand.500" : "brand.600",
          _hover: {
            bg: props.colorMode === "dark" ? "brand.500" : "brand.600",
            color: "white",
          },
        }),
      },
    },
  },
});

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideInLeft = keyframes`
  from { opacity: 0; transform: translateX(-50px); }
  to { opacity: 1; transform: translateX(0); }
`;

const slideInRight = keyframes`
  from { opacity: 0; transform: translateX(50px); }
  to { opacity: 1; transform: translateX(0); }
`;

const slideInUp = keyframes`
  from { opacity: 0; transform: translateY(50px); }
  to { opacity: 1; transform: translateY(0); }
`;

const scaleIn = keyframes`
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
`;

// Scroll animation hook
const useScrollAnimation = (
  threshold: number = 0.2
): [RefObject<HTMLDivElement>, boolean] => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = useCallback(() => {
    if (ref.current) {
      const { top } = ref.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      if (top < viewportHeight * (1 - threshold)) {
        setIsVisible(true);
      }
    }
  }, [threshold]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return [ref, isVisible];
};

interface AnimatedSectionProps {
  children: React.ReactNode;
  animationKeyframes?: string;
  delay?: number;
  [key: string]: any;
}

const AnimatedSection = ({
  children,
  animationKeyframes = fadeIn,
  delay = 0,
  ...props
}: AnimatedSectionProps) => {
  const [ref, isVisible] = useScrollAnimation(0.1);
  const cardBg = useColorModeValue("light.card", "dark.card");

  return (
    <Box
      ref={ref}
      {...props}
      style={{
        animation: isVisible
          ? `${animationKeyframes} 0.8s ease-out ${delay}s forwards`
          : "none",
        opacity: isVisible ? 1 : 0,
      }}
    >
      {children}
    </Box>
  );
};

const ColorBlock = ({ color }: { color: string }) => (
  <Box
    w="100%"
    h="300px"
    bg={color}
    transition="all 0.3s ease"
    _hover={{ transform: "scale(1.05)" }}
  />
);

const AboutUsPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const isMobile = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <ChakraProvider theme={theme}>
      <Box minH="100vh" overflowX="hidden">
        {/* Header */}
        <Flex
          as="header"
          position="fixed"
          top={0}
          left={0}
          right={0}
          zIndex={100}
          p={4}
          justifyContent="space-between"
          alignItems="center"
          bg={isScrolled ? "white" : "transparent"}
          boxShadow={isScrolled ? "sm" : "none"}
          transition="all 0.3s ease"
        >
          <NextLink href="/" passHref legacyBehavior>
            <ChakraLink
              display="flex"
              alignItems="center"
              _hover={{ textDecoration: "none" }}
            >
              <Icon as={FaCodeBranch} w={8} h={8} mr={2} color="brand.500" />
              <Heading size="md" fontFamily="heading" letterSpacing="wide">
                FlowChain
              </Heading>
            </ChakraLink>
          </NextLink>

          <HStack spacing={6}>
            <NextLink href="/" passHref legacyBehavior>
              <ChakraLink _hover={{ color: "brand.500" }}>Home</ChakraLink>
            </NextLink>
            <NextLink href="/about" passHref legacyBehavior>
              <ChakraLink _hover={{ color: "brand.500" }} fontWeight="bold">
                About
              </ChakraLink>
            </NextLink>
            <NextLink href="/contact" passHref legacyBehavior>
              <ChakraLink _hover={{ color: "brand.500" }}>Contact</ChakraLink>
            </NextLink>
          </HStack>
        </Flex>

        {/* Split Hero Section */}
        <Box
          position="relative"
          h="100vh"
          display="flex"
          flexDirection={{ base: "column", md: "row" }}
        >
          {/* Left Blue Section */}
          <Box
            flex={1}
            bg="brand.600"
            color="white"
            display="flex"
            alignItems="center"
            justifyContent="center"
            p={8}
          >
            <AnimatedSection animationKeyframes={slideInLeft} delay={0.2}>
              <VStack spacing={6} align="flex-start" maxW="500px">
                <Heading
                  as="h1"
                  size="2xl"
                  fontWeight="bold"
                  lineHeight="shorter"
                >
                  We Build Digital Experiences
                </Heading>
                <Text fontSize="xl">
                  Transforming ideas into powerful digital solutions that drive
                  business growth.
                </Text>
                <Button
                  rightIcon={<FaArrowRight />}
                  variant="outline"
                  color="white"
                  borderColor="white"
                  _hover={{ bg: "white", color: "brand.600" }}
                  size="lg"
                >
                  Learn More
                </Button>
              </VStack>
            </AnimatedSection>
          </Box>

          {/* Right White Section */}
          <Box
            flex={1}
            bg="white"
            position="relative"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Box
              position="absolute"
              left={0}
              top={0}
              bottom={0}
              w="1px"
              bg="gray.200"
            />
            <AnimatedSection animationKeyframes={slideInRight} delay={0.4}>
              <VStack spacing={6} maxW="500px" p={8}>
                <Heading
                  as="h2"
                  size="xl"
                  fontWeight="bold"
                  color="brand.600"
                  textAlign="center"
                >
                  Innovation at Every Step
                </Heading>
                <Text fontSize="lg" color="gray.600" textAlign="center">
                  Our team combines creativity with technical expertise to
                  deliver exceptional results.
                </Text>
                <Box mt={8}>
                  <Icon
                    as={FiChevronDown}
                    w={12}
                    h={12}
                    color="brand.500"
                    animation={`${keyframes`
                      0%, 100% { transform: translateY(0); }
                      50% { transform: translateY(10px); }
                    `} 2s infinite`}
                  />
                </Box>
              </VStack>
            </AnimatedSection>
          </Box>
        </Box>

        {/* About Us Text Section */}
        <AnimatedSection
          py={20}
          px={{ base: 4, md: 8 }}
          bg="white"
          animationKeyframes={fadeIn}
        >
          <Container maxW="6xl">
            <Grid
              templateColumns={{ base: "1fr", md: "1fr 1fr" }}
              gap={12}
              alignItems="center"
            >
              <GridItem>
                <VStack spacing={6} align="flex-start">
                  <Text
                    fontSize="sm"
                    fontWeight="bold"
                    color="brand.500"
                    letterSpacing="wide"
                  >
                    ABOUT US
                  </Text>
                  <Heading as="h2" size="xl" fontWeight="bold">
                    Our Story
                  </Heading>
                  <Divider borderColor="brand.500" w="50px" borderWidth="2px" />
                  <Text fontSize="lg" color="gray.600">
                    Founded in 2018, FlowChain started as a small team of
                    passionate developers and designers with a vision to
                    revolutionize digital experiences.
                  </Text>
                  <Text fontSize="lg" color="gray.600">
                    Today, we've grown into a full-service digital agency
                    serving clients across multiple industries, delivering
                    innovative solutions that drive real business results.
                  </Text>
                </VStack>
              </GridItem>
              <GridItem>
                <Box
                  position="relative"
                  h="400px"
                  bg="brand.50"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Box
                    position="absolute"
                    top="-20px"
                    left="-20px"
                    w="100%"
                    h="100%"
                    border="2px solid"
                    borderColor="brand.500"
                    zIndex={0}
                  />
                  <Box
                    position="relative"
                    zIndex={1}
                    w="90%"
                    h="90%"
                    bg="brand.100"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text fontWeight="bold" color="brand.600">
                      Our Team
                    </Text>
                  </Box>
                </Box>
              </GridItem>
            </Grid>
          </Container>
        </AnimatedSection>

        {/* Image Gallery */}
        <AnimatedSection
          py={20}
          px={{ base: 4, md: 8 }}
          bg="gray.50"
          animationKeyframes={scaleIn}
        >
          <Container maxW="6xl">
            <VStack spacing={12}>
              <VStack spacing={4} textAlign="center">
                <Text
                  fontSize="sm"
                  fontWeight="bold"
                  color="brand.500"
                  letterSpacing="wide"
                >
                  OUR WORK
                </Text>
                <Heading as="h2" size="xl" fontWeight="bold">
                  Project Gallery
                </Heading>
                <Divider
                  borderColor="brand.500"
                  w="50px"
                  borderWidth="2px"
                  mx="auto"
                />
              </VStack>

              <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={6}>
                {[
                  "brand.500",
                  "brand.600",
                  "brand.700",
                  "brand.400",
                  "brand.300",
                  "brand.800",
                ].map((color, index) => (
                  <ColorBlock key={index} color={color} />
                ))}
              </SimpleGrid>
            </VStack>
          </Container>
        </AnimatedSection>

        {/* Testimonials */}
        <AnimatedSection
          py={20}
          px={{ base: 4, md: 8 }}
          bg="white"
          animationKeyframes={slideInUp}
        >
          <Container maxW="6xl">
            <VStack spacing={12}>
              <VStack spacing={4} textAlign="center">
                <Text
                  fontSize="sm"
                  fontWeight="bold"
                  color="brand.500"
                  letterSpacing="wide"
                >
                  TESTIMONIALS
                </Text>
                <Heading as="h2" size="xl" fontWeight="bold">
                  What Our Clients Say
                </Heading>
                <Divider
                  borderColor="brand.500"
                  w="50px"
                  borderWidth="2px"
                  mx="auto"
                />
              </VStack>

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
                {[1, 2].map((item) => (
                  <Box
                    key={item}
                    p={8}
                    border="1px solid"
                    borderColor="gray.200"
                    position="relative"
                    _hover={{
                      boxShadow: "lg",
                      transform: "translateY(-5px)",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <Icon
                      as={FaQuoteLeft}
                      color="brand.500"
                      fontSize="3xl"
                      mb={4}
                    />
                    <Text fontSize="lg" color="gray.600" mb={6}>
                      Working with FlowChain has been a game-changer for our
                      business. Their innovative approach and attention to
                      detail delivered results beyond our expectations.
                    </Text>
                    <Flex align="center">
                      <Avatar
                        name="Sarah Johnson"
                        src="https://randomuser.me/api/portraits/women/44.jpg"
                        mr={4}
                      />
                      <Box>
                        <Text fontWeight="bold">Sarah Johnson</Text>
                        <Text fontSize="sm" color="gray.500">
                          CEO, TechSolutions Inc.
                        </Text>
                      </Box>
                    </Flex>
                  </Box>
                ))}
              </SimpleGrid>
            </VStack>
          </Container>
        </AnimatedSection>

        {/* Stats */}
        <AnimatedSection
          py={20}
          px={{ base: 4, md: 8 }}
          bg="brand.600"
          color="white"
          animationKeyframes={fadeIn}
        >
          <Container maxW="6xl">
            <SimpleGrid
              columns={{ base: 2, md: 4 }}
              spacing={10}
              textAlign="center"
            >
              {[
                { value: "100+", label: "Projects Completed" },
                { value: "50+", label: "Happy Clients" },
                { value: "24/7", label: "Support" },
                { value: "100%", label: "Satisfaction" },
              ].map((stat, index) => (
                <Box key={index}>
                  <Heading size="2xl" mb={2}>
                    {stat.value}
                  </Heading>
                  <Text fontSize="lg">{stat.label}</Text>
                </Box>
              ))}
            </SimpleGrid>
          </Container>
        </AnimatedSection>

        {/* Contact */}
        <AnimatedSection
          py={20}
          px={{ base: 4, md: 8 }}
          bg="white"
          animationKeyframes={slideInUp}
        >
          <Container maxW="6xl">
            <Grid
              templateColumns={{ base: "1fr", md: "1fr 1fr" }}
              gap={12}
              alignItems="center"
            >
              <GridItem>
                <VStack spacing={6} align="flex-start">
                  <Text
                    fontSize="sm"
                    fontWeight="bold"
                    color="brand.500"
                    letterSpacing="wide"
                  >
                    CONTACT US
                  </Text>
                  <Heading as="h2" size="xl" fontWeight="bold">
                    Get In Touch
                  </Heading>
                  <Divider borderColor="brand.500" w="50px" borderWidth="2px" />
                  <Text fontSize="lg" color="gray.600">
                    Have a project in mind or want to learn more about our
                    services? We'd love to hear from you.
                  </Text>
                  <Text fontSize="lg" color="gray.600">
                    Email: info@flowchain.com
                    <br />
                    Phone: (123) 456-7890
                  </Text>
                </VStack>
              </GridItem>
              <GridItem>
                <VStack spacing={6} as="form">
                  <Input
                    placeholder="Your Name"
                    size="lg"
                    borderColor="gray.300"
                    _focus={{ borderColor: "brand.500" }}
                  />
                  <Input
                    placeholder="Your Email"
                    size="lg"
                    borderColor="gray.300"
                    _focus={{ borderColor: "brand.500" }}
                  />
                  <Textarea
                    placeholder="Your Message"
                    size="lg"
                    borderColor="gray.300"
                    _focus={{ borderColor: "brand.500" }}
                    rows={6}
                  />
                  <Button
                    type="submit"
                    colorScheme="brand"
                    size="lg"
                    w="full"
                    rightIcon={<FaArrowRight />}
                  >
                    Send Message
                  </Button>
                </VStack>
              </GridItem>
            </Grid>
          </Container>
        </AnimatedSection>

        {/* Footer */}
        <Box
          as="footer"
          py={12}
          px={{ base: 4, md: 8 }}
          bg="gray.900"
          color="white"
        >
          <Container maxW="6xl">
            <Grid
              templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }}
              gap={8}
            >
              <GridItem>
                <VStack align="flex-start" spacing={4}>
                  <Flex align="center">
                    <Icon
                      as={FaCodeBranch}
                      w={8}
                      h={8}
                      mr={2}
                      color="brand.500"
                    />
                    <Heading size="md">FlowChain</Heading>
                  </Flex>
                  <Text color="gray.400">
                    Innovating digital experiences for businesses worldwide.
                  </Text>
                </VStack>
              </GridItem>
              <GridItem>
                <VStack align="flex-start" spacing={4}>
                  <Heading size="sm">Quick Links</Heading>
                  <VStack align="flex-start" spacing={2}>
                    <ChakraLink href="/" _hover={{ color: "brand.500" }}>
                      Home
                    </ChakraLink>
                    <ChakraLink href="/about" _hover={{ color: "brand.500" }}>
                      About
                    </ChakraLink>
                    <ChakraLink
                      href="/services"
                      _hover={{ color: "brand.500" }}
                    >
                      Services
                    </ChakraLink>
                    <ChakraLink href="/contact" _hover={{ color: "brand.500" }}>
                      Contact
                    </ChakraLink>
                  </VStack>
                </VStack>
              </GridItem>
              <GridItem>
                <VStack align="flex-start" spacing={4}>
                  <Heading size="sm">Services</Heading>
                  <VStack align="flex-start" spacing={2}>
                    <ChakraLink href="#" _hover={{ color: "brand.500" }}>
                      Web Development
                    </ChakraLink>
                    <ChakraLink href="#" _hover={{ color: "brand.500" }}>
                      Mobile Apps
                    </ChakraLink>
                    <ChakraLink href="#" _hover={{ color: "brand.500" }}>
                      UI/UX Design
                    </ChakraLink>
                    <ChakraLink href="#" _hover={{ color: "brand.500" }}>
                      Digital Marketing
                    </ChakraLink>
                  </VStack>
                </VStack>
              </GridItem>
              <GridItem>
                <VStack align="flex-start" spacing={4}>
                  <Heading size="sm">Connect</Heading>
                  <Text color="gray.400">
                    123 Business Ave
                    <br />
                    San Francisco, CA 94107
                    <br />
                    info@flowchain.com
                    <br />
                    (123) 456-7890
                  </Text>
                </VStack>
              </GridItem>
            </Grid>
            <Divider borderColor="gray.700" my={8} />
            <Text textAlign="center" color="gray.400">
              &copy; {new Date().getFullYear()} FlowChain. All rights reserved.
            </Text>
          </Container>
        </Box>
      </Box>
    </ChakraProvider>
  );
};

export default AboutUsPage;
