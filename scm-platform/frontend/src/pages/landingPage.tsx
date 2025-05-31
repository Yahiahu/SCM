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
  Grid,
  GridItem,
  Divider,
  Badge,
  Avatar,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
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
  FaWarehouse,
  FaPallet,
  FaBarcode,
  FaMapMarkedAlt,
  FaClipboardCheck,
  FaExchangeAlt,
} from "react-icons/fa";
import {
  MdOutlineSecurity,
  MdSync,
  MdInventory,
  MdTimeline,
} from "react-icons/md";
import { GiFactory, GiDeliveryDrone } from "react-icons/gi";
import { keyframes } from "@emotion/react";
import { useRouter } from "next/navigation";

// Enhanced Chakra UI Theme with supply chain aesthetic
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
    Card: {
      baseStyle: {
        container: {
          border: "1px solid",
          borderColor: "gray.200",
          borderRadius: "lg",
          boxShadow: "sm",
          _hover: {
            boxShadow: "md",
            transform: "translateY(-2px)",
          },
          transition: "all 0.2s ease-in-out",
        },
      },
    },
  },
});

// Supply Chain Themed Animations
const conveyorBelt = keyframes`
  0% { background-position: 0 0; }
  100% { background-position: 100% 0; }
`;

const barcodeScan = keyframes`
  0% { transform: translateY(0); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateY(100%); opacity: 0; }
`;

const inventoryPulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
`;

const truckMovement = keyframes`
  0% { transform: translateX(-20vw) translateY(0); }
  25% { transform: translateX(20vw) translateY(-3px); }
  50% { transform: translateX(60vw) translateY(0); }
  75% { transform: translateX(100vw) translateY(-3px); }
  100% { transform: translateX(140vw) translateY(0); }
`;


const warehouseGlow = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(3, 169, 244, 0.4); }
  70% { box-shadow: 0 0 0 15px rgba(3, 169, 244, 0); }
  100% { box-shadow: 0 0 0 0 rgba(3, 169, 244, 0); }
`;

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
  badgeText?: string;
}

const FeatureCard = ({
  icon,
  title,
  description,
  animationDelay,
  animationType = "fadeIn",
  badgeText,
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
      position="relative"
    >
      {badgeText && (
        <Badge
          position="absolute"
          top={-3}
          right={4}
          colorScheme="brand"
          px={2}
          py={1}
          borderRadius="full"
          fontSize="xs"
          fontWeight="bold"
        >
          {badgeText}
        </Badge>
      )}
      <Icon
        as={icon}
        w={10}
        h={10}
        color="brand.500"
        _hover={{
          animation: `${chainLink} 0.5s ease-in-out`,
        }}
      />
      <Heading size="md">{title}</Heading>
      <Text fontSize="sm" color={useColorModeValue("gray.600", "gray.300")}>
        {description}
      </Text>
    </VStack>
  );
};

// Supply Chain Network Visualization
const SupplyChainNetwork = () => {
  const [ref, isVisible] = useScrollAnimation(0.3);
  const lineColor = useColorModeValue("brand.500", "brand.400");
  const nodeBg = useColorModeValue("brand.100", "brand.700");
  const nodeText = useColorModeValue("dark.text", "light.text");

  const nodes = [
    { icon: FaBoxOpen, label: "Suppliers", color: "brand.500" },
    { icon: GiFactory, label: "Manufacturing", color: "brand.500" },
    { icon: FaWarehouse, label: "Warehousing", color: "brand.500" },
    { icon: FaTruck, label: "Distribution", color: "brand.500" },
    { icon: GiDeliveryDrone, label: "Last Mile", color: "brand.500" },
  ];

  return (
    <Box
      ref={ref}
      py={16}
      position="relative"
      animation={isVisible ? `${fadeIn} 1s ease-out forwards` : "none"}
    >
      <Heading mb={12} size="xl" textAlign="center">
        End-to-End Supply Chain Visibility
      </Heading>

      {/* Conveyor belt background */}
      <Box
        position="absolute"
        bottom="40%"
        left={0}
        right={0}
        height="4px"
        bg={`linear-gradient(90deg, transparent, ${lineColor}, transparent)`}
        backgroundSize="200% 100%"
        animation={isVisible ? `${conveyorBelt} 3s linear infinite` : "none"}
        opacity={0.5}
        zIndex={0}
      />

      <Flex
        direction={{ base: "column", md: "row" }}
        justify="space-around"
        align="center"
        position="relative"
        w="full"
      >
        {/* Nodes with enhanced animations */}
        {nodes.map((node, index) => (
          <VStack
            key={node.label}
            spacing={2}
            p={4}
            borderRadius="full"
            bg={node.color}
            boxShadow={`0 0 15px ${node.color}`}
            _hover={{
              boxShadow: `0 0 25px ${node.color}`,
              transform: "scale(1.05)",
            }}
            transition="all 0.3s ease-in-out"
            zIndex={1}
            style={{
              animation: isVisible
                ? `${floatUp} 0.8s ease-out ${0.2 * index}s forwards`
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
              color="white"
              _hover={{
                animation: `${rotateIn} 0.5s ease-out`,
              }}
            />
            <Text fontWeight="bold" color="white">
              {node.label}
            </Text>
          </VStack>
        ))}
      </Flex>

      {/* Connecting lines for desktop */}
      <Box
        position="absolute"
        top="50%"
        left="10%"
        right="10%"
        height="2px"
        bg={lineColor}
        zIndex={0}
        display={{ base: "none", md: "block" }}
        style={{
          animation: isVisible ? `${fadeIn} 1.5s ease-out forwards` : "none",
        }}
      />

      <Text
        mt={8}
        fontSize="lg"
        textAlign="center"
        opacity={isVisible ? 1 : 0}
        animation={isVisible ? `${fadeIn} 1s ease-out 1.2s forwards` : "none"}
      >
        Our platform provides real-time tracking across your entire supply
        network.
      </Text>
    </Box>
  );
};

// Inventory Dashboard Preview Component
const InventoryDashboardPreview = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [ref, isVisible] = useScrollAnimation(0.3);

  const inventoryItems = [
    { id: "SKU-1001", name: "Widget A", quantity: 245, location: "WH-1-A12" },
    { id: "SKU-1002", name: "Gadget B", quantity: 189, location: "WH-2-B05" },
    {
      id: "SKU-1003",
      name: "Component C",
      quantity: 532,
      location: "WH-1-C22",
    },
    { id: "SKU-1004", name: "Part D", quantity: 76, location: "WH-3-D14" },
  ];

  return (
    <Box
      ref={ref}
      py={16}
      bg={useColorModeValue("gray.50", "gray.800")}
      animation={isVisible ? `${fadeIn} 1s ease-out forwards` : "none"}
    >
      <Container maxW="6xl">
        <VStack spacing={8}>
          <Heading size="xl" textAlign="center">
            Real-Time Inventory Management
          </Heading>

          <Box
            p={6}
            bg={useColorModeValue("white", "gray.700")}
            borderRadius="lg"
            boxShadow="xl"
            border="1px solid"
            borderColor={useColorModeValue("gray.200", "gray.600")}
            w="full"
            maxW="4xl"
            mx="auto"
            position="relative"
            overflow="hidden"
            _before={{
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "4px",
              bg: "brand.500",
              animation: `${conveyorBelt} 3s linear infinite`,
            }}
          >
            <HStack justify="space-between" mb={6}>
              <Heading size="md">Current Inventory</Heading>
              <Badge colorScheme="brand" px={3} py={1} borderRadius="full">
                Live Updates
              </Badge>
            </HStack>

            <VStack spacing={4} align="stretch">
              {inventoryItems.map((item, index) => (
                <Box
                  key={item.id}
                  p={4}
                  bg={useColorModeValue("gray.50", "gray.600")}
                  borderRadius="md"
                  borderLeft="4px solid"
                  borderColor="brand.500"
                  position="relative"
                  style={{
                    animation: isVisible
                      ? `${fadeIn} 0.5s ease-out ${0.1 * index}s forwards`
                      : "none",
                    opacity: isVisible ? 1 : 0,
                  }}
                  _hover={{
                    transform: "translateX(5px)",
                    boxShadow: "md",
                  }}
                  transition="all 0.2s ease-in-out"
                >
                  <HStack justify="space-between">
                    <VStack align="start" spacing={1}>
                      <Text fontWeight="bold">{item.name}</Text>
                      <Text
                        fontSize="sm"
                        color={useColorModeValue("gray.600", "gray.300")}
                      >
                        {item.id} • {item.location}
                      </Text>
                    </VStack>
                    <Badge
                      colorScheme={item.quantity < 100 ? "red" : "green"}
                      px={3}
                      py={1}
                      borderRadius="full"
                    >
                      {item.quantity} units
                    </Badge>
                  </HStack>
                </Box>
              ))}
            </VStack>

            <Button
              mt={6}
              w="full"
              variant="outline"
              rightIcon={<FaArrowRight />}
              onClick={onOpen}
            >
              View Full Dashboard
            </Button>
          </Box>
        </VStack>
      </Container>

      {/* Modal for dashboard preview */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Inventory Dashboard Preview</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Image
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
              alt="Inventory Dashboard"
              borderRadius="md"
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="brand" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost">Request Demo</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

// Supply Chain Metrics Component
const SupplyChainMetrics = () => {
  const [ref, isVisible] = useScrollAnimation(0.3);
  const metrics = [
    { value: "98.7%", label: "Order Accuracy", icon: FaClipboardCheck },
    { value: "24h", label: "Avg. Delivery Time", icon: FaTruck },
    { value: "35%", label: "Cost Reduction", icon: FaChartLine },
    { value: "99.9%", label: "System Uptime", icon: FaShieldAlt },
  ];

  return (
    <Box
      ref={ref}
      py={16}
      bg={useColorModeValue("brand.50", "brand.900")}
      animation={isVisible ? `${fadeIn} 1s ease-out forwards` : "none"}
    >
      <Container maxW="6xl">
        <VStack spacing={8}>
          <Heading size="xl" textAlign="center">
            Proven Supply Chain Results
          </Heading>

          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6} w="full">
            {metrics.map((metric, index) => (
              <VStack
                key={metric.label}
                p={6}
                bg={useColorModeValue("white", "dark.card")}
                borderRadius="lg"
                boxShadow="md"
                spacing={3}
                style={{
                  animation: isVisible
                    ? `${floatUp} 0.8s ease-out ${0.2 * index}s forwards`
                    : "none",
                  opacity: isVisible ? 1 : 0,
                }}
              >
                <Icon as={metric.icon} w={8} h={8} color="brand.500" />
                <Heading size="xl" color="brand.500">
                  {metric.value}
                </Heading>
                <Text fontSize="sm" fontWeight="medium">
                  {metric.label}
                </Text>
              </VStack>
            ))}
          </SimpleGrid>

          <Text
            fontSize="sm"
            textAlign="center"
            maxW="2xl"
            opacity={isVisible ? 1 : 0}
            animation={
              isVisible ? `${fadeIn} 1s ease-out 0.8s forwards` : "none"
            }
          >
            *Based on average results from clients after 12 months of
            implementation.
          </Text>
        </VStack>
      </Container>
    </Box>
  );
};

export default function LandingPage() {
  const router = useRouter();
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
            <Heading
              size="md"
              fontFamily="heading"
              letterSpacing="wide"
              color={isScrolled ? "brand.500" : "white"}
              transition="color 0.3s ease"
            >
              Orontis
            </Heading>
          </ChakraLink>

          <HStack spacing={6}>
            <ChakraLink
              color="white"
              _hover={{ color: "brand.500", transform: "translateY(-2px)" }}
              cursor="pointer"
              onClick={() => router.push("/login")}
              transition="all 0.2s ease-in-out"
            >
              Login
            </ChakraLink>
            <Button
              variant="solid"
              size="sm"
              onClick={() => router.push("/createAccount")}
              _hover={{
                transform: "translateY(-2px)",
                boxShadow: "0 4px 12px rgba(3, 169, 244, 0.3)",
              }}
              transition="all 0.2s ease-in-out"
            >
              Sign up
            </Button>
          </HStack>
        </Flex>

        {/* Hero Section with supply chain theme */}
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
            zIndex: -1,
          }}
        >
          <Container maxW="6xl">
            <VStack spacing={8} zIndex={1}>
              <Heading
                as="h1"
                size={{ base: "2xl", md: "3xl", lg: "4xl" }}
                fontWeight="extrabold"
                lineHeight="shorter"
                textShadow="0 0 15px rgba(0,0,0,0.5)"
                animation={`${floatUp} 1s ease-out forwards`}
                opacity={0}
              >
                Transform Your Supply Chain Operations
              </Heading>

              <Text
                fontSize={{ base: "lg", md: "xl" }}
                maxWidth="3xl"
                animation={`${floatUp} 1s ease-out 0.3s forwards`}
                opacity={0}
              >
                <Text
                  as="span"
                  fontWeight="bold"
                  borderBottom="2px solid"
                  borderColor="brand.500"
                >
                  Real-time visibility. Intelligent automation. Seamless
                  integration.
                </Text>
                <br />
                <Text as="span">
                  Our platform connects every link in your supply chain for
                  maximum efficiency and control.
                </Text>
              </Text>

              <HStack
                spacing={4}
                animation={`${floatUp} 1s ease-out 0.6s forwards`}
                opacity={1}
              >
                <NextLink href="/" passHref legacyBehavior>
                  <Button
                    as="a"
                    size="lg"
                    variant="solid"
                    rightIcon={<FaArrowRight />}
                    _hover={{
                      animation: `${pulseGlow} 1.5s infinite`,
                    }}
                    sx={{
                      position: "relative",
                      zIndex: 10,
                    }}
                  >
                    Request a Demo
                  </Button>
                </NextLink>

                <NextLink href="#features" passHref legacyBehavior>
                  <Button
                    as="a"
                    size="lg"
                    variant="outline"
                    borderColor="black" // 👈 Black outline
                    color="white"
                    sx={{
                      position: "relative",
                      zIndex: 10,
                    }}
                    _hover={{
                      animation: `${pulseGlow} 1.5s infinite`,
                    }}
                  >
                    Explore Features
                  </Button>
                </NextLink>
              </HStack>
            </VStack>
          </Container>

          {/* Animated truck moving across the bottom */}
          <Box
            position="absolute"
            bottom="0"
            left="0"
            right="0"
            height="60px"
            zIndex={1}
          >
            {/* Black box for the Factory */}
            <Box
              position="absolute"
              left="-2" // Match the factory's left position
              bottom="-2" // Match the factory's bottom position
              width="100px" // Adjust to cover the factory's width
              height="40px" // Adjust to cover the factory's height
              bg="black" // Or your dark background color
              zIndex={2} // Higher zIndex than trucks (2), lower than factory icon (2) - this is tricky
            />
            {/* Truck depot on the left */}
            <Icon
              as={GiFactory}
              w="120px"
              h="120px"
              color="white"
              position="absolute"
              left="-2"
              bottom="-2"
              zIndex={3} // Ensure factory icon is above the black box
            />

            {/* Black box for the Warehouse */}
            <Box
              position="absolute"
              right="-2" // Match the warehouse's right position
              bottom="-2" // Match the warehouse's bottom position
              width="80px" // Adjust to cover the warehouse's width
              height="50px" // Adjust to cover the warehouse's height
              bg="black" // Or your dark background color
              zIndex={2} // Higher zIndex than trucks (2), lower than warehouse icon (2)
            />
            {/* Warehouse on the right */}
            <Icon
              as={FaWarehouse}
              w={20}
              h={20}
              color="white"
              position="absolute"
              right="-2"
              bottom="-2"
              zIndex={3} // Ensure warehouse icon is above the black box
            />

            {/* Moving trucks */}
            {[0, 1, 2, 3, 4].map((i) => (
              <Icon
                key={i}
                as={FaTruck}
                w={8}
                h={8}
                color="white"
                position="absolute"
                left="0"
                bottom="-1"
                animation={`${truckMovement} 15s linear ${i * 2}s infinite`}
                zIndex={1} // Ensure trucks are behind the black boxes
              />
            ))}
          </Box>
        </AnimatedSection>

        {/* Supply Chain Network Visualization */}
        <AnimatedSection
          animationKeyframes={fadeIn}
          py={16}
          bg={useColorModeValue("white", "dark.card")}
        >
          <SupplyChainNetwork />
        </AnimatedSection>

        {/* Inventory Dashboard Preview */}
        <InventoryDashboardPreview />

        {/* Key Features Section with supply chain focus */}
        <AnimatedSection
          id="features"
          animationKeyframes={fadeIn}
          bg={useColorModeValue("white", "dark.card")}
          py={16}
        >
          <VStack spacing={8} textAlign="center">
            <Heading size="xl" animation={`${fadeIn} 0.8s ease-out forwards`}>
              Supply Chain Solutions
            </Heading>
            <Text
              fontSize="lg"
              maxW="4xl"
              animation={`${fadeIn} 0.8s ease-out 0.2s forwards`}
              opacity={0}
            >
              Comprehensive tools designed specifically for modern supply chain
              challenges.
            </Text>

            <SimpleGrid
              columns={{ base: 1, md: 2, lg: 3 }}
              spacing={8}
              mt={10}
              width="full"
            >
              <FeatureCard
                icon={MdInventory}
                title="Inventory Optimization"
                description="Automated tracking and predictive restocking to maintain optimal inventory levels."
                animationDelay={0.2}
                animationType="slideInLeft"
                badgeText="AI-Powered"
              />
              <FeatureCard
                icon={FaWarehouse}
                title="Warehouse Management"
                description="Streamline operations with smart bin locations and picking routes."
                animationDelay={0.3}
                animationType="floatUp"
              />
              <FeatureCard
                icon={FaTruck}
                title="Logistics Coordination"
                description="Real-time tracking and route optimization for all shipments."
                animationDelay={0.4}
                animationType="slideInRight"
                badgeText="New"
              />
              <FeatureCard
                icon={FaBarcode}
                title="Asset Tracking"
                description="End-to-end visibility from manufacturer to end customer."
                animationDelay={0.5}
                animationType="slideInLeft"
              />
              <FeatureCard
                icon={FaExchangeAlt}
                title="Supplier Integration"
                description="Seamless connection with your supplier network for just-in-time delivery."
                animationDelay={0.6}
                animationType="floatUp"
              />
              <FeatureCard
                icon={MdTimeline}
                title="Demand Forecasting"
                description="Predict market trends and adjust production accordingly."
                animationDelay={0.7}
                animationType="slideInRight"
                badgeText="AI-Powered"
              />
            </SimpleGrid>
          </VStack>
        </AnimatedSection>

        {/* Supply Chain Metrics */}
        <SupplyChainMetrics />

        {/* Problem/Solution Section */}
        <AnimatedSection
          id="solutions"
          animationKeyframes={fadeIn}
          bg={useColorModeValue("white", "dark.card")}
          py={16}
        >
          <VStack spacing={8} textAlign="center">
            <Heading size="xl" animation={`${fadeIn} 0.8s ease-out forwards`}>
              Supply Chain Pain Points We Solve
            </Heading>

            <Grid
              templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
              gap={8}
              width="full"
              maxW="4xl"
              mx="auto"
            >
              <GridItem>
                <VStack
                  p={6}
                  bg={useColorModeValue("brand.50", "brand.900")}
                  borderRadius="lg"
                  boxShadow="lg"
                  align="start"
                  textAlign="left"
                  spacing={4}
                  height="full"
                  animation={`${slideInLeft} 0.8s ease-out 0.2s forwards`}
                  opacity={0}
                >
                  <Heading size="md" color="brand.600">
                    Common Challenges
                  </Heading>
                  <VStack align="start" spacing={3}>
                    <HStack>
                      <Box w={2} h={2} bg="brand.500" borderRadius="full" />
                      <Text>Inventory inaccuracies</Text>
                    </HStack>
                    <HStack>
                      <Box w={2} h={2} bg="brand.500" borderRadius="full" />
                      <Text>Supplier communication gaps</Text>
                    </HStack>
                    <HStack>
                      <Box w={2} h={2} bg="brand.500" borderRadius="full" />
                      <Text>Lack of real-time visibility</Text>
                    </HStack>
                    <HStack>
                      <Box w={2} h={2} bg="brand.500" borderRadius="full" />
                      <Text>Inefficient warehouse operations</Text>
                    </HStack>
                    <HStack>
                      <Box w={2} h={2} bg="brand.500" borderRadius="full" />
                      <Text>Demand forecasting errors</Text>
                    </HStack>
                  </VStack>
                </VStack>
              </GridItem>

              <GridItem>
                <VStack
                  p={6}
                  bg={useColorModeValue("white", "gray.700")}
                  borderRadius="lg"
                  boxShadow="lg"
                  border="1px solid"
                  borderColor={useColorModeValue("gray.200", "gray.600")}
                  align="start"
                  textAlign="left"
                  spacing={4}
                  height="full"
                  animation={`${slideInRight} 0.8s ease-out 0.4s forwards`}
                  opacity={0}
                >
                  <Heading size="md" color="brand.600">
                    Our Solutions
                  </Heading>
                  <VStack align="start" spacing={3}>
                    <HStack>
                      <Icon as={FaClipboardCheck} color="brand.500" />
                      <Text>Automated inventory tracking</Text>
                    </HStack>
                    <HStack>
                      <Icon as={FaCloud} color="brand.500" />
                      <Text>Supplier collaboration portal</Text>
                    </HStack>
                    <HStack>
                      <Icon as={FaMapMarkedAlt} color="brand.500" />
                      <Text>Real-time GPS tracking</Text>
                    </HStack>
                    <HStack>
                      <Icon as={FaPallet} color="brand.500" />
                      <Text>Smart warehouse optimization</Text>
                    </HStack>
                    <HStack>
                      <Icon as={FaChartLine} color="brand.500" />
                      <Text>AI-powered demand forecasting</Text>
                    </HStack>
                  </VStack>
                </VStack>
              </GridItem>
            </Grid>
          </VStack>
        </AnimatedSection>

        {/* Call to Action / Contact Form Section */}
        <AnimatedSection
          id="contact"
          animationKeyframes={fadeIn}
          py={16}
          bg={useColorModeValue("gray.50", "gray.800")}
        >
          <VStack spacing={8} textAlign="center" maxW="3xl" mx="auto">
            <Heading size="xl" animation={`${fadeIn} 0.8s ease-out forwards`}>
              Ready to Optimize Your Supply Chain?
            </Heading>
            <Text
              fontSize="lg"
              animation={`${fadeIn} 0.8s ease-out 0.2s forwards`}
              opacity={0}
            >
              Speak with our supply chain experts to see how we can transform
              your operations.
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

        {/* Footer */}
        <Box
          as="footer"
          py={8}
          bg={useColorModeValue("gray.100", "dark.bg")}
          borderTop="1px solid"
          borderColor={useColorModeValue("light.border", "dark.border")}
          textAlign="center"
          animation={`${fadeIn} 0.8s ease-out forwards`}
        >
          <Container maxW="6xl">
            <VStack spacing={6}>
              <HStack spacing={6} justify="center">
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
              </HStack>

              <Divider
                borderColor={useColorModeValue("gray.300", "gray.600")}
              />

              <HStack spacing={4} justify="center">
                <IconButton
                  aria-label="LinkedIn"
                  icon={<FaCloud />}
                  variant="ghost"
                  colorScheme="brand"
                />
                <IconButton
                  aria-label="Twitter"
                  icon={<FaTruck />}
                  variant="ghost"
                  colorScheme="brand"
                />
                <IconButton
                  aria-label="GitHub"
                  icon={<FaWarehouse />}
                  variant="ghost"
                  colorScheme="brand"
                />
              </HStack>

              <Text fontSize="sm">
                &copy; {new Date().getFullYear()} Orontis Supply Chain
                Solutions. All rights reserved.
              </Text>
            </VStack>
          </Container>
        </Box>
      </Box>
    </ChakraProvider>
  );
}
