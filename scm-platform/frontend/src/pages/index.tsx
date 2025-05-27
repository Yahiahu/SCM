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
  IconButton,
  Tooltip,
  Icon,
  Button,
  useColorModeValue,
  Image,
  FormControl,
  Input,
  Textarea,
  FormLabel,
  Container,
  SimpleGrid,
  useBreakpointValue,
} from "@chakra-ui/react";
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  RefObject,
} from "react";
import { Link as ChakraLink } from "@chakra-ui/react";
import NextLink from "next/link";
import {
  FaTruck,
  FaCogs,
  FaChartLine,
  FaCloud,
  FaShieldAlt,
  FaRocket,
  FaArrowRight,
  FaCodeBranch,
  FaBoxOpen,
  FaRegLightbulb,
} from "react-icons/fa";
import { MdOutlineSecurity, MdSync } from "react-icons/md";
import { keyframes } from "@emotion/react";

// 1. Custom Chakra UI Theme
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
    500: "#03a9f4", // Main accent color
    600: "#039be5",
    700: "#0288d1",
    800: "#0277bd",
    900: "#01579b",
  },
  dark: {
    bg: "#1A202C", // Dark background
    text: "#E2E8F0", // Light text
    card: "#2D3748", // Slightly lighter dark for cards
    border: "#4A5568", // Subtle border
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
        borderRadius: "md",
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
    Input: {
      baseStyle: (props: { colorMode: string }) => ({
        field: {
          bg: props.colorMode === "dark" ? "dark.card" : "light.card",
          borderColor:
            props.colorMode === "dark" ? "dark.border" : "light.border",
          _focus: {
            borderColor: "brand.500",
            boxShadow: `0 0 0 1px ${colors.brand[500]}`,
          },
        },
      }),
    },
    Textarea: {
      baseStyle: (props: { colorMode: string }) => ({
        bg: props.colorMode === "dark" ? "dark.card" : "light.card",
        borderColor:
          props.colorMode === "dark" ? "dark.border" : "light.border",
        _focus: {
          borderColor: "brand.500",
          boxShadow: `0 0 0 1px ${colors.brand[500]}`,
        },
      }),
    },
    Tooltip: {
      baseStyle: {
        bg: "brand.500",
        color: "white",
      },
    },
  },
});

// Enhanced Keyframes for animations
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

const scaleUp = keyframes`
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
`;

const rotateIn = keyframes`
  from { opacity: 0; transform: rotate(-15deg) scale(0.8); }
  to { opacity: 1; transform: rotate(0) scale(1); }
`;

const floatUp = keyframes`
  0% { opacity: 0; transform: translateY(30px); }
  50% { transform: translateY(-10px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const conveyorBelt = keyframes`
  0% { background-position: 0 0; }
  100% { background-position: 100% 0; }
`;

const pulseGlow = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(3, 169, 244, 0.4); }
  70% { box-shadow: 0 0 0 15px rgba(3, 169, 244, 0); }
  100% { box-shadow: 0 0 0 0 rgba(3, 169, 244, 0); }
`;

const gradientFlow = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const chainLink = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0); }
`;

// Utility hook for scroll animations
const useScrollAnimation = (
  threshold: number = 0.2
): [RefObject<HTMLDivElement>, boolean] => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = useCallback(() => {
    if (ref.current) {
      const { top, bottom } = ref.current.getBoundingClientRect();
      const viewportHeight =
        window.innerHeight || document.documentElement.clientHeight;

      if (
        top < viewportHeight * (1 - threshold) &&
        bottom > viewportHeight * threshold
      ) {
        setIsVisible(true);
      }
    }
  }, [threshold]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check on mount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return [ref, isVisible];
};

// Props interface for AnimatedSection
interface AnimatedSectionProps {
  children: React.ReactNode;
  animationKeyframes: string;
  delay?: number;
  duration?: number;
  [key: string]: any;
}

// Enhanced Section Component with more animation control
const AnimatedSection = ({
  children,
  animationKeyframes,
  delay = 0,
  duration = 0.8,
  ...props
}: AnimatedSectionProps) => {
  const [ref, isVisible] = useScrollAnimation(0.2);
  const cardBg = useColorModeValue("light.card", "dark.card");
  const borderColor = useColorModeValue("light.border", "dark.border");

  return (
    <Box
      ref={ref}
      py={{ base: 12, md: 20 }}
      px={{ base: 4, md: 8 }}
      textAlign="center"
      bg={cardBg}
      borderBottom="1px solid"
      borderColor={borderColor}
      style={{
        animation: isVisible
          ? `${animationKeyframes} ${duration}s ease-out ${delay}s forwards`
          : "none",
        opacity: isVisible ? 1 : 0,
      }}
      {...props}
    >
      <Container maxW="6xl">{children}</Container>
    </Box>
  );
};

// Enhanced FeatureCard with staggered animations
interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  animationDelay: number;
  animationType?: string;
}

const FeatureCard = ({
  icon,
  title,
  description,
  animationDelay,
  animationType = "fadeIn",
}: FeatureCardProps) => {
  const [ref, isVisible] = useScrollAnimation(0.3);
  const cardBg = useColorModeValue("light.card", "dark.card");
  const borderColor = useColorModeValue("light.border", "dark.border");

  const animations = {
    fadeIn,
    slideInLeft,
    slideInRight,
    scaleUp,
    floatUp,
  };

  const selectedAnimation =
    animations[animationType as keyof typeof animations] || fadeIn;

  return (
    <VStack
      ref={ref}
      p={6}
      bg={cardBg}
      borderRadius="lg"
      boxShadow="xl"
      border="1px solid"
      borderColor={borderColor}
      alignItems="center"
      spacing={4}
      textAlign="center"
      transition="all 0.3s ease-in-out"
      _hover={{
        transform: "translateY(-5px)",
        animation: `${pulseGlow} 1.5s infinite`,
      }}
      style={{
        animation: isVisible
          ? `${selectedAnimation} 0.8s ease-out ${animationDelay}s forwards`
          : "none",
        opacity: isVisible ? 1 : 0,
      }}
    >
      <Icon
        as={icon}
        w={12}
        h={12}
        color="brand.500"
        _hover={{
          animation: `${chainLink} 0.5s ease-in-out`,
        }}
      />
      <Heading size="md">{title}</Heading>
      <Text>{description}</Text>
    </VStack>
  );
};

// Enhanced AnimatedSupplyChainVisual with more dynamic animations
const AnimatedSupplyChainVisual = () => {
  const [ref, isVisible] = useScrollAnimation(0.3);
  const lineColor = useColorModeValue("brand.500", "brand.400");
  const nodeBg = useColorModeValue("brand.100", "brand.700");
  const nodeText = useColorModeValue("dark.text", "light.text");

  const pathAnimation = keyframes`
    0% { stroke-dashoffset: 1000; }
    100% { stroke-dashoffset: 0; }
  `;

  const nodeEnter = keyframes`
    0% { transform: scale(0) rotate(180deg); opacity: 0; }
    80% { transform: scale(1.1) rotate(0); opacity: 1; }
    100% { transform: scale(1) rotate(0); opacity: 1; }
  `;

  const conveyorAnimation = keyframes`
    0% { background-position: 0 0; }
    100% { background-position: 100% 0; }
  `;

  return (
    <Box
      ref={ref}
      py={16}
      overflow="hidden"
      position="relative"
      animation={isVisible ? `${fadeIn} 1s ease-out forwards` : "none"}
      _before={{
        content: '""',
        position: "absolute",
        bottom: "20%",
        left: 0,
        right: 0,
        height: "4px",
        bg: "linear-gradient(90deg, transparent, ${lineColor}, transparent)",
        backgroundSize: "200% 100%",
        animation: isVisible
          ? `${conveyorAnimation} 3s linear infinite`
          : "none",
        opacity: 0.5,
        zIndex: 0,
      }}
    >
      <Heading mb={12} size="xl" textAlign="center">
        Visualize Your Optimized Flow
      </Heading>
      <Flex
        direction={{ base: "column", md: "row" }}
        justify="space-around"
        align="center"
        position="relative"
        w="full"
      >
        {/* Lines connecting nodes */}
        <Box
          position="absolute"
          top="50%"
          left="10%"
          right="10%"
          height="2px"
          bg={lineColor}
          zIndex={-1}
          display={{ base: "none", md: "block" }}
          style={{
            animation: isVisible
              ? `${pathAnimation} 1.5s ease-out forwards`
              : "none",
            strokeDasharray: 1000,
            strokeDashoffset: 1000,
          }}
        />

        {/* Nodes with enhanced animations */}
        {[
          { icon: FaBoxOpen, label: "Sourcing", color: "brand.500" },
          { icon: FaTruck, label: "Logistics", color: "brand.400" },
          { icon: FaCogs, label: "Production", color: "brand.300" },
          { icon: FaRegLightbulb, label: "Innovation", color: "brand.200" },
          { icon: FaRocket, label: "Delivery", color: "brand.100" },
        ].map((node, index) => (
          <VStack
            key={node.label}
            spacing={2}
            p={4}
            borderRadius="full"
            bg={nodeBg}
            color={nodeText}
            boxShadow={`0 0 15px ${node.color}`}
            _hover={{
              boxShadow: `0 0 25px ${node.color}`,
              transform: "scale(1.05)",
            }}
            transition="all 0.3s ease-in-out"
            zIndex={1}
            style={{
              animation: isVisible
                ? `${nodeEnter} 0.8s ease-out ${0.2 * index}s forwards`
                : "none",
              opacity: isVisible ? 1 : 0,
            }}
            mx={useBreakpointValue({ base: 0, md: 4 })}
            my={useBreakpointValue({ base: 4, md: 0 })}
          >
            <Icon
              as={node.icon}
              w={10}
              h={10}
              _hover={{
                animation: `${rotateIn} 0.5s ease-out`,
              }}
            />
            <Text fontWeight="bold">{node.label}</Text>
          </VStack>
        ))}
      </Flex>
      <Text
        mt={8}
        fontSize="lg"
        textAlign="center"
        opacity={isVisible ? 1 : 0}
        animation={isVisible ? `${fadeIn} 1s ease-out 1.2s forwards` : "none"}
      >
        Our solution streamlines every step, from raw materials to customer
        delivery.
      </Text>
    </Box>
  );
};

export default function LandingPage() {
  const bgColor = useColorModeValue("light.bg", "dark.bg");
  const textColor = useColorModeValue("light.text", "dark.text");
  const headerBg = useColorModeValue("whiteAlpha.900", "dark.bg");
  const headerBorder = useColorModeValue("light.border", "dark.border");

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <ChakraProvider theme={theme}>
      <Box minH="100vh" bg={bgColor} color={textColor} overflowX="hidden">
        {/* Fixed Header with animation */}
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
          bg={isScrolled ? headerBg : "transparent"}
          boxShadow={isScrolled ? "md" : "none"}
          borderBottom={isScrolled ? "1px solid" : "none"}
          borderColor={headerBorder}
          transition="all 0.3s ease-in-out"
          backdropFilter={isScrolled ? "blur(8px)" : "none"}
          transform={isScrolled ? "none" : "translateY(-20px)"}
          opacity={isScrolled ? 1 : 0}
          animation={`${fadeIn} 0.5s ease-out 0.5s forwards`}
        >
          <ChakraLink
            href="/"
            display="flex"
            alignItems="center"
            _hover={{ textDecoration: "none" }}
          >
            <Icon
              as={FaCodeBranch}
              w={8}
              h={8}
              mr={2}
              color="brand.500"
              _hover={{
                animation: `${rotateIn} 0.5s ease-out`,
              }}
            />
            <Heading size="md" fontFamily="heading" letterSpacing="wide">
              FlowChain
            </Heading>
          </ChakraLink>

          <HStack spacing={6}>
            <ChakraLink
              _hover={{ color: "brand.500", transform: "translateY(-2px)" }}
              cursor="pointer"
              onClick={() => scrollToSection("features")}
              transition="all 0.2s ease-in-out"
            >
              Features
            </ChakraLink>
            <ChakraLink
              _hover={{ color: "brand.500", transform: "translateY(-2px)" }}
              cursor="pointer"
              onClick={() => scrollToSection("solutions")}
              transition="all 0.2s ease-in-out"
            >
              Solutions
            </ChakraLink>
            <Button
              variant="solid"
              size="sm"
              onClick={() => scrollToSection("contact")}
              _hover={{
                transform: "translateY(-2px)",
                boxShadow: "0 4px 12px rgba(3, 169, 244, 0.3)",
              }}
              transition="all 0.2s ease-in-out"
            >
              Get Started
            </Button>
          </HStack>
        </Flex>

        {/* Hero Section with enhanced animations */}
        <AnimatedSection
          animationKeyframes={fadeIn}
          pt={{ base: 20, md: 24 }}
          pb={{ base: 12, md: 20 }}
          minH="80vh"
          display="flex"
          alignItems="center"
          justifyContent="center"
          bgGradient="linear(to-br, brand.900, brand.700, brand.900)"
          color="white"
          textAlign="center"
          position="relative"
          overflow="hidden"
          _after={{
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bg: "linear-gradient(90deg, rgba(3,169,244,0.1) 0%, rgba(3,169,244,0) 50%, rgba(3,169,244,0.1) 100%)",
            animation: `${gradientFlow} 15s linear infinite`,
            backgroundSize: "200% 100%",
            opacity: 0.3,
            zIndex: 0,
          }}
        >
          <VStack spacing={6} zIndex={1}>
            <Heading
              as="h1"
              size={{ base: "2xl", md: "3xl", lg: "4xl" }}
              fontWeight="extrabold"
              lineHeight="shorter"
              textShadow="0 0 15px rgba(0,0,0,0.5)"
              animation={`${floatUp} 1s ease-out forwards`}
              opacity={0}
            >
              Revolutionize Your Supply Chain.
              <br />
              Achieve Unprecedented Efficiency.
            </Heading>
            <Text
              fontSize={{ base: "lg", md: "xl" }}
              maxWidth="3xl"
              animation={`${floatUp} 1s ease-out 0.3s forwards`}
              opacity={0}
            >
              Our intelligent platform optimizes every link, from sourcing to
              delivery, reducing costs, minimizing risks, and accelerating
              growth.
            </Text>
            <HStack
              spacing={4}
              animation={`${floatUp} 1s ease-out 0.6s forwards`}
              opacity={0}
            >
              <Button
                size="lg"
                variant="solid"
                rightIcon={<FaArrowRight />}
                onClick={() => scrollToSection("contact")}
                _hover={{
                  animation: `${pulseGlow} 1.5s infinite`,
                }}
              >
                Request a Demo
              </Button>
              <Button
                size="lg"
                variant="outline"
                colorScheme="whiteAlpha"
                onClick={() => scrollToSection("features")}
              >
                Learn More
              </Button>
            </HStack>
          </VStack>
        </AnimatedSection>

        {/* Problem/Solution Section with staggered animations */}
        <AnimatedSection
          id="solutions"
          animationKeyframes={fadeIn}
          bg={useColorModeValue("white", "dark.card")}
          py={16}
        >
          <VStack spacing={8} textAlign="center">
            <Heading size="xl" animation={`${fadeIn} 0.8s ease-out forwards`}>
              The Challenges You Face, Solved.
            </Heading>
            <Text
              fontSize="lg"
              maxW="4xl"
              animation={`${fadeIn} 0.8s ease-out 0.2s forwards`}
              opacity={0}
            >
              Traditional supply chains are riddled with inefficiencies, lack of
              visibility, and unexpected disruptions. We provide the clarity and
              control you need to thrive.
            </Text>

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} mt={10}>
              <VStack
                p={6}
                bg={useColorModeValue("brand.50", "brand.900")}
                borderRadius="lg"
                boxShadow="lg"
                transition="all 0.3s ease-in-out"
                _hover={{
                  transform: "translateY(-5px)",
                  boxShadow: "2xl",
                  animation: `${pulseGlow} 1.5s infinite`,
                }}
                animation={`${slideInLeft} 0.8s ease-out 0.2s forwards`}
                opacity={0}
              >
                <Icon
                  as={FaChartLine}
                  w={10}
                  h={10}
                  color="brand.600"
                  _hover={{
                    animation: `${rotateIn} 0.5s ease-out`,
                  }}
                />
                <Heading size="md" pt={2}>
                  Poor Visibility
                </Heading>
                <Text>
                  Track every shipment and component in real-time, eliminating
                  blind spots.
                </Text>
              </VStack>
              <VStack
                p={6}
                bg={useColorModeValue("brand.50", "brand.900")}
                borderRadius="lg"
                boxShadow="lg"
                transition="all 0.3s ease-in-out"
                _hover={{
                  transform: "translateY(-5px)",
                  boxShadow: "2xl",
                  animation: `${pulseGlow} 1.5s infinite`,
                }}
                animation={`${floatUp} 0.8s ease-out 0.4s forwards`}
                opacity={0}
              >
                <Icon
                  as={MdOutlineSecurity}
                  w={10}
                  h={10}
                  color="brand.600"
                  _hover={{
                    animation: `${rotateIn} 0.5s ease-out`,
                  }}
                />
                <Heading size="md" pt={2}>
                  Security Risks
                </Heading>
                <Text>
                  Secure your data and operations with blockchain-enhanced
                  transparency.
                </Text>
              </VStack>
              <VStack
                p={6}
                bg={useColorModeValue("brand.50", "brand.900")}
                borderRadius="lg"
                boxShadow="lg"
                transition="all 0.3s ease-in-out"
                _hover={{
                  transform: "translateY(-5px)",
                  boxShadow: "2xl",
                  animation: `${pulseGlow} 1.5s infinite`,
                }}
                animation={`${slideInRight} 0.8s ease-out 0.6s forwards`}
                opacity={0}
              >
                <Icon
                  as={FaCogs}
                  w={10}
                  h={10}
                  color="brand.600"
                  _hover={{
                    animation: `${rotateIn} 0.5s ease-out`,
                  }}
                />
                <Heading size="md" pt={2}>
                  Operational Inefficiencies
                </Heading>
                <Text>
                  Automate workflows and optimize resource allocation for
                  maximum output.
                </Text>
              </VStack>
            </SimpleGrid>
          </VStack>
        </AnimatedSection>

        {/* Dynamic Supply Chain Visual */}
        <AnimatedSection
          animationKeyframes={fadeIn}
          py={16}
          bg={useColorModeValue("gray.50", "gray.800")}
        >
          <AnimatedSupplyChainVisual />
        </AnimatedSection>

        {/* Key Features Section with enhanced animations */}
        <AnimatedSection
          id="features"
          animationKeyframes={fadeIn}
          bg={useColorModeValue("brand.50", "dark.card")}
          py={16}
        >
          <VStack spacing={8} textAlign="center">
            <Heading size="xl" animation={`${fadeIn} 0.8s ease-out forwards`}>
              Unleash the Power of FlowChain
            </Heading>
            <Text
              fontSize="lg"
              maxW="4xl"
              animation={`${fadeIn} 0.8s ease-out 0.2s forwards`}
              opacity={0}
            >
              Our comprehensive suite of tools empowers you to manage, optimize,
              and secure your entire supply network with unparalleled ease.
            </Text>
            <SimpleGrid
              columns={{ base: 1, md: 2, lg: 3 }}
              spacing={10}
              mt={10}
              width="full"
            >
              <FeatureCard
                icon={FaCloud}
                title="Cloud-Powered Intelligence"
                description="Leverage the cloud for scalable analytics and global data access."
                animationDelay={0.2}
                animationType="slideInLeft"
              />
              <FeatureCard
                icon={FaShieldAlt}
                title="Blockchain Security"
                description="Ensure immutable records and enhanced trust across your network."
                animationDelay={0.3}
                animationType="floatUp"
              />
              <FeatureCard
                icon={FaChartLine}
                title="Predictive Analytics"
                description="Forecast demand, identify bottlenecks, and make data-driven decisions."
                animationDelay={0.4}
                animationType="slideInRight"
              />
              <FeatureCard
                icon={MdSync}
                title="Real-time Synchronization"
                description="Keep all stakeholders aligned with up-to-the-minute data."
                animationDelay={0.5}
                animationType="slideInLeft"
              />
              <FeatureCard
                icon={FaCogs}
                title="Automated Workflows"
                description="Streamline repetitive tasks and reduce manual errors."
                animationDelay={0.6}
                animationType="floatUp"
              />
              <FeatureCard
                icon={FaRocket}
                title="Scalable & Adaptable"
                description="Grow with your business, adapting to evolving market demands."
                animationDelay={0.7}
                animationType="slideInRight"
              />
            </SimpleGrid>
          </VStack>
        </AnimatedSection>

        {/* Call to Action / Contact Form Section with enhanced animations */}
        <AnimatedSection
          id="contact"
          animationKeyframes={fadeIn}
          py={16}
          bg={useColorModeValue("white", "gray.800")}
        >
          <VStack spacing={8} textAlign="center" maxW="3xl" mx="auto">
            <Heading size="xl" animation={`${fadeIn} 0.8s ease-out forwards`}>
              Ready to Transform Your Supply Chain?
            </Heading>
            <Text
              fontSize="lg"
              animation={`${fadeIn} 0.8s ease-out 0.2s forwards`}
              opacity={0}
            >
              Unlock peak performance and drive sustainable growth. Contact us
              today for a personalized demonstration.
            </Text>
            <Box
              as="form"
              width="full"
              p={{ base: 6, md: 8 }}
              bg={useColorModeValue("white", "dark.card")}
              borderRadius="lg"
              boxShadow="2xl"
              border="1px solid"
              borderColor={useColorModeValue("light.border", "dark.border")}
              animation={`${scaleUp} 0.8s ease-out 0.4s forwards`}
              opacity={0}
              _hover={{
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
              }}
              transition="all 0.3s ease-in-out"
            >
              <VStack spacing={5}>
                <FormControl id="name" isRequired>
                  <FormLabel>Your Name</FormLabel>
                  <Input
                    type="text"
                    placeholder="John Doe"
                    _focus={{
                      boxShadow: "0 0 0 2px brand.500",
                    }}
                  />
                </FormControl>
                <FormControl id="email" isRequired>
                  <FormLabel>Work Email</FormLabel>
                  <Input
                    type="email"
                    placeholder="john.doe@company.com"
                    _focus={{
                      boxShadow: "0 0 0 2px brand.500",
                    }}
                  />
                </FormControl>
                <FormControl id="company">
                  <FormLabel>Company Name</FormLabel>
                  <Input
                    type="text"
                    placeholder="Acme Logistics Inc."
                    _focus={{
                      boxShadow: "0 0 0 2px brand.500",
                    }}
                  />
                </FormControl>
                <FormControl id="message">
                  <FormLabel>How can we help you?</FormLabel>
                  <Textarea
                    placeholder="Tell us about your supply chain challenges..."
                    rows={4}
                    _focus={{
                      boxShadow: "0 0 0 2px brand.500",
                    }}
                  />
                </FormControl>
                <Button
                  type="submit"
                  size="lg"
                  variant="solid"
                  width="full"
                  rightIcon={<FaArrowRight />}
                  _hover={{
                    animation: `${pulseGlow} 1.5s infinite`,
                  }}
                >
                  Get in Touch
                </Button>
              </VStack>
            </Box>
          </VStack>
        </AnimatedSection>

        {/* Footer with subtle animation */}
        <Box
          as="footer"
          py={8}
          bg={useColorModeValue("gray.100", "dark.bg")}
          borderTop="1px solid"
          borderColor={useColorModeValue("light.border", "dark.border")}
          textAlign="center"
          animation={`${fadeIn} 0.8s ease-out forwards`}
        >
          <HStack spacing={6} justify="center" mb={4}>
            <ChakraLink
              href="/"
              fontSize="sm"
              _hover={{
                color: "brand.500",
                transform: "translateY(-2px)",
              }}
              transition="all 0.2s ease-in-out"
            >
              Home
            </ChakraLink>
            <ChakraLink
              fontSize="sm"
              _hover={{
                color: "brand.500",
                transform: "translateY(-2px)",
              }}
              cursor="pointer"
              onClick={() => scrollToSection("features")}
              transition="all 0.2s ease-in-out"
            >
              Features
            </ChakraLink>
            <ChakraLink
              fontSize="sm"
              _hover={{
                color: "brand.500",
                transform: "translateY(-2px)",
              }}
              cursor="pointer"
              onClick={() => scrollToSection("solutions")}
              transition="all 0.2s ease-in-out"
            >
              Solutions
            </ChakraLink>
            <ChakraLink
              fontSize="sm"
              _hover={{
                color: "brand.500",
                transform: "translateY(-2px)",
              }}
              cursor="pointer"
              onClick={() => scrollToSection("contact")}
              transition="all 0.2s ease-in-out"
            >
              Contact
            </ChakraLink>
            <ChakraLink
              href="/privacy"
              fontSize="sm"
              _hover={{
                color: "brand.500",
                transform: "translateY(-2px)",
              }}
              transition="all 0.2s ease-in-out"
            >
              Privacy Policy
            </ChakraLink>
          </HStack>
          <Text fontSize="sm">
            &copy; {new Date().getFullYear()} FlowChain. All rights reserved.
          </Text>
        </Box>
      </Box>
    </ChakraProvider>
  );
}
