"use client";

import {
  Box,
  ChakraProvider,
  extendTheme,
  Flex,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Heading,
  VStack,
  HStack, // For horizontal alignment like icon and text
  Text,
  IconButton,
  Tooltip, // For hover effect
  Icon,
  Divider, // For visual separation
} from "@chakra-ui/react";
import { CheckCircleIcon, InfoOutlineIcon } from "@chakra-ui/icons"; // Example icons
import React, { useState } from "react";

// Assuming Navbar and Footer components exist and are correctly imported
import Navbar from "../components/navbar";
import Footer from "../components/footer";

// Basic theme extension
const theme = extendTheme({
  fonts: {
    body: "Inter, sans-serif",
    heading: "Inter, sans-serif",
  },
});

// --- Data Types ---
interface ProductItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  description?: string; // Optional description for tooltip
}

interface ProductBundle {
  id: string;
  name: string;
  description: string;
  products: ProductItem[];
  discountPercentage?: number; // Optional discount for the bundle
}

// --- Sample Data ---
const sampleBundles: ProductBundle[] = [
  {
    id: "bundle001",
    name: "Starter Kit",
    description: "Essential tools to get you started.",
    products: [
      {
        id: "p001",
        name: "Basic Widget",
        quantity: 2,
        unitPrice: 25.0,
        description: "A reliable basic widget.",
      },
      {
        id: "p002",
        name: "Standard Gadget",
        quantity: 1,
        unitPrice: 40.0,
        description: "Your everyday standard gadget.",
      },
      {
        id: "p003",
        name: "Accessory Pack",
        quantity: 1,
        unitPrice: 15.0,
        description: "Includes 3 essential accessories.",
      },
    ],
    discountPercentage: 5, // 5% off this bundle
  },
  {
    id: "bundle002",
    name: "Pro Pack",
    description: "Advanced tools for the professional user.",
    products: [
      {
        id: "p004",
        name: "Advanced Widget Pro",
        quantity: 3,
        unitPrice: 75.0,
        description: "Top-of-the-line widget with advanced features.",
      },
      {
        id: "p005",
        name: "Super Gadget X",
        quantity: 2,
        unitPrice: 120.0,
        description: "The ultimate gadget for power users.",
      },
      {
        id: "p006",
        name: "Premium Accessory Kit",
        quantity: 1,
        unitPrice: 50.0,
        description: "All premium accessories included.",
      },
      {
        id: "p007",
        name: "Service Plan",
        quantity: 1,
        unitPrice: 100.0,
        description: "1-year premium support.",
      },
    ],
    discountPercentage: 10, // 10% off this bundle
  },
  {
    id: "bundle003",
    name: "Office Essentials",
    description: "Everything your office needs.",
    products: [
      {
        id: "p008",
        name: "Ergonomic Chair",
        quantity: 1,
        unitPrice: 150.0,
        description: "Comfortable and supportive.",
      },
      {
        id: "p009",
        name: "Desk Lamp LED",
        quantity: 2,
        unitPrice: 30.0,
        description: "Bright and energy-efficient.",
      },
      {
        id: "p010",
        name: "Stationery Set",
        quantity: 1,
        unitPrice: 20.0,
        description: "Pens, pencils, notebooks, and more.",
      },
    ],
  },
];

// --- Marketplace Page Component ---
export default function MarketplacePage() {
  const [selectedBundle, setSelectedBundle] = useState<ProductBundle | null>(
    sampleBundles[0]
  ); // Default to first bundle selected

  const calculateBundleCost = (bundle: ProductBundle | null) => {
    if (!bundle) {
      return { subtotal: 0, discountAmount: 0, tax: 0, total: 0 };
    }
    const subtotal = bundle.products.reduce(
      (acc, product) => acc + product.quantity * product.unitPrice,
      0
    );
    const discountAmount = bundle.discountPercentage
      ? (subtotal * bundle.discountPercentage) / 100
      : 0;
    const priceAfterDiscount = subtotal - discountAmount;
    const tax = priceAfterDiscount * 0.13; // Assuming 13% tax
    const total = priceAfterDiscount + tax;
    return {
      subtotal: parseFloat(subtotal.toFixed(2)),
      discountAmount: parseFloat(discountAmount.toFixed(2)),
      tax: parseFloat(tax.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
    };
  };

  const costs = calculateBundleCost(selectedBundle);

  return (
    <ChakraProvider theme={theme}>
      <Navbar isLoggedIn={true} />
      <Box pt = {20} px={{ base: 4, md: 6 }} bg="gray.50" minHeight="calc(100vh - 120px)">
        <Flex direction={{ base: "column", lg: "row" }} gap={6}>
          {/* Left Side: Product Bundles (takes more space) */}
          <VStack
            flex={{ base: 1, lg: 3 }} // Takes 3 parts of the width on lg screens
            spacing={8} // Increased spacing between bundles
            align="stretch"
          >
            {sampleBundles.map((bundle) => (
              <Box
                key={bundle.id}
                p={5}
                borderWidth="1px"
                borderColor={
                  selectedBundle?.id === bundle.id ? "teal.500" : "gray.300"
                }
                borderRadius="lg"
                boxShadow={
                  selectedBundle?.id === bundle.id
                    ? "0 0 0 2px var(--chakra-colors-teal-500)"
                    : "md"
                }
                bg="white"
                cursor="pointer"
                onClick={() => setSelectedBundle(bundle)}
                transition="all 0.2s ease-in-out"
                _hover={{ borderColor: "teal.400", boxShadow: "lg" }}
              >
                <Heading size="lg" mb={2} color="teal.600">
                  {bundle.name}
                </Heading>
                <Text fontSize="md" color="gray.600" mb={4}>
                  {bundle.description}
                </Text>
                <Box overflowX="auto">
                  <Table variant="simple" size="md">
                    <Thead bg="gray.100">
                      <Tr>
                        <Th>Product Name</Th>
                        <Th isNumeric>Qty</Th>
                        <Th isNumeric>Unit Price</Th>
                        <Th isNumeric>Total Price</Th>
                        <Th textAlign="center">Select</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {bundle.products.map((product) => (
                        <Tr key={product.id} _hover={{ bg: "gray.50" }}>
                          <Td>
                            <HStack spacing={2}>
                              <Text fontWeight="medium">{product.name}</Text>
                              {product.description && (
                                <Tooltip
                                  label={product.description}
                                  placement="top"
                                  hasArrow
                                >
                                  <Icon
                                    as={InfoOutlineIcon}
                                    color="gray.500"
                                    boxSize={4}
                                  />
                                </Tooltip>
                              )}
                            </HStack>
                          </Td>
                          <Td isNumeric>{product.quantity}</Td>
                          <Td isNumeric>${product.unitPrice.toFixed(2)}</Td>
                          <Td isNumeric>
                            ${(product.quantity * product.unitPrice).toFixed(2)}
                          </Td>
                          <Td textAlign="center">
                            <Tooltip
                              label="Select this item"
                              placement="top"
                              hasArrow
                            >
                              <IconButton
                                aria-label="Select item"
                                icon={<CheckCircleIcon />}
                                size="sm"
                                variant="ghost"
                                colorScheme="teal"
                                _hover={{ bg: "teal.100" }}
                                onClick={(e) => {
                                  e.stopPropagation(); // Prevent bundle selection when clicking icon
                                  console.log(
                                    `Selected item: ${product.name} from ${bundle.name}`
                                  );
                                  // Add item selection logic here if needed
                                }}
                              />
                            </Tooltip>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
                {bundle.discountPercentage && (
                  <Text
                    mt={3}
                    fontSize="sm"
                    color="green.600"
                    fontWeight="bold"
                  >
                    Bundle Discount: {bundle.discountPercentage}% off!
                  </Text>
                )}
              </Box>
            ))}
          </VStack>

          {/* Right Side: Cost Breakdown (takes less space, sticky) */}
          <Box
            flex={{ base: 1, lg: 1 }} // Takes 1 part of the width on lg screens
            p={5}
            borderWidth="1px"
            borderColor="gray.300"
            borderRadius="lg"
            boxShadow="md"
            bg="white"
            position={{ lg: "sticky" }} // Makes it sticky on large screens
            top={{ lg: "24px" }} // Adjust based on your navbar height or desired spacing
            alignSelf={{ lg: "flex-start" }} // Aligns to top
            height="fit-content" // Ensures it doesn't stretch unnecessarily
          >
            <Heading size="lg" mb={4} color="gray.700">
              Cost Breakdown
            </Heading>
            {selectedBundle ? (
              <VStack spacing={3} align="stretch">
                <HStack justifyContent="space-between">
                  <Text fontWeight="medium">Selected Bundle:</Text>
                  <Text color="teal.600" fontWeight="bold">
                    {selectedBundle.name}
                  </Text>
                </HStack>
                <Divider />
                <HStack justifyContent="space-between">
                  <Text>Subtotal:</Text>
                  <Text>${costs.subtotal.toFixed(2)}</Text>
                </HStack>
                {selectedBundle.discountPercentage && (
                  <HStack justifyContent="space-between">
                    <Text color="green.600">
                      Discount ({selectedBundle.discountPercentage}%):
                    </Text>
                    <Text color="green.600">
                      -${costs.discountAmount.toFixed(2)}
                    </Text>
                  </HStack>
                )}
                <HStack justifyContent="space-between">
                  <Text>Tax (13%):</Text>
                  <Text>${costs.tax.toFixed(2)}</Text>
                </HStack>
                <Divider my={2} />
                <HStack justifyContent="space-between">
                  <Text fontSize="xl" fontWeight="bold">
                    Total:
                  </Text>
                  <Text fontSize="xl" fontWeight="bold">
                    ${costs.total.toFixed(2)}
                  </Text>
                </HStack>
                <Tooltip
                  label="Proceed to checkout with this bundle"
                  placement="bottom"
                  hasArrow
                >
                  <IconButton
                    mt={4}
                    aria-label="Proceed to Checkout"
                    icon={<CheckCircleIcon />}
                    colorScheme="teal"
                    size="lg"
                    onClick={() =>
                      alert(
                        `Proceeding to checkout with ${selectedBundle.name}`
                      )
                    }
                  >
                    Proceed to Checkout
                  </IconButton>
                </Tooltip>
              </VStack>
            ) : (
              <Text color="gray.500">
                Select a bundle to see the cost breakdown.
              </Text>
            )}
          </Box>
        </Flex>
      </Box>
      <Footer />
    </ChakraProvider>
  );
}
