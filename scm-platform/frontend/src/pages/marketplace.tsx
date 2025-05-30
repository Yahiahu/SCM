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
  HStack,
  Text,
  IconButton,
  Tooltip,
  Icon,
  Divider,
  useToast,
  Skeleton,
  Button,
  Badge,
} from "@chakra-ui/react";
import { CheckCircleIcon, InfoOutlineIcon } from "@chakra-ui/icons";
import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

const theme = extendTheme({
  fonts: {
    body: "Inter, sans-serif",
    heading: "Inter, sans-serif",
  },
});

interface ProductBundle {
  id: number;
  name: string;
  description: string;
  qty: number;
  notes?: string;
  components: {
    id: number;
    num: string;
    description: string;
    required_qty: number;
    supplier_part_number?: string;
    current_qty?: number;
    unit_cost?: number;
  }[];
}

export default function MarketplacePage() {
  const [bundles, setBundles] = useState<ProductBundle[]>([]);
  const [selectedBundle, setSelectedBundle] = useState<ProductBundle | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch products (which will be our bundles)
        const productsResponse = await fetch("/api/product");
        if (!productsResponse.ok) throw new Error("Failed to load products");
        const productsData = await productsResponse.json();

        // Enhance products with their BOM components
        const enhancedBundles = await Promise.all(
          productsData.map(async (product: any) => {
            const bomResponse = await fetch(`/api/bom?productId=${product.id}`);
            if (!bomResponse.ok) throw new Error("Failed to load BOM data");
            const bomData = await bomResponse.json();

            // Get current quantities for components
            const componentsWithInventory = await Promise.all(
              bomData.map(async (bomItem: any) => {
                const inventoryResponse = await fetch(
                  `/api/warehouse_inventory?componentId=${bomItem.componentId}`
                );
                const inventoryData = inventoryResponse.ok
                  ? await inventoryResponse.json()
                  : [];

                return {
                  id: bomItem.component.id,
                  num: bomItem.component.num,
                  description: bomItem.component.description,
                  required_qty: bomItem.required_qty,
                  supplier_part_number: bomItem.component.supplier_part_number,
                  current_qty: inventoryData[0]?.current_qty || 0,
                  unit_cost: await getComponentCost(bomItem.componentId),
                };
              })
            );

            return {
              ...product,
              components: componentsWithInventory,
            };
          })
        );

        setBundles(enhancedBundles);
        setSelectedBundle(enhancedBundles[0] || null);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load product bundles",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    const getComponentCost = async (componentId: number) => {
      try {
        const response = await fetch(
          `/api/supplier_quote?componentId=${componentId}`
        );
        if (response.ok) {
          const quotes = await response.json();
          return quotes[0]?.price_per_unit || 0;
        }
        return 0;
      } catch (error) {
        return 0;
      }
    };

    fetchData();
  }, []);

  const calculateBundleCost = (bundle: ProductBundle | null) => {
    if (!bundle) {
      return { subtotal: 0, discountAmount: 0, tax: 0, total: 0 };
    }

    const subtotal = bundle.components.reduce(
      (acc, component) =>
        acc + component.required_qty * (component.unit_cost || 0),
      0
    );

    // In a real app, you might have bundle-specific discounts
    const discountAmount = 0;
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

  if (isLoading) {
    return (
      <ChakraProvider theme={theme}>
        <Navbar isLoggedIn={true} />
        <Box
          pt={20}
          px={{ base: 4, md: 6 }}
          bg="gray.50"
          minHeight="calc(100vh - 120px)"
        >
          <Flex direction={{ base: "column", lg: "row" }} gap={6}>
            <VStack flex={{ base: 1, lg: 3 }} spacing={8} align="stretch">
              {[...Array(3)].map((_, i) => (
                <Box
                  key={i}
                  p={5}
                  borderWidth="1px"
                  borderRadius="lg"
                  bg="white"
                >
                  <Skeleton height="30px" width="60%" mb={4} />
                  <Skeleton height="20px" width="80%" mb={6} />
                  <Skeleton height="200px" />
                </Box>
              ))}
            </VStack>
            <Box
              flex={{ base: 1, lg: 1 }}
              p={5}
              borderWidth="1px"
              borderRadius="lg"
              bg="white"
            >
              <Skeleton height="30px" mb={4} />
              <Skeleton height="150px" />
            </Box>
          </Flex>
        </Box>
        <Footer />
      </ChakraProvider>
    );
  }

  return (
    <ChakraProvider theme={theme}>
      <Navbar isLoggedIn={true} />
      <Box
        pt={20}
        px={{ base: 4, md: 6 }}
        bg="gray.50"
        minHeight="calc(100vh - 120px)"
      >
        <Flex direction={{ base: "column", lg: "row" }} gap={6}>
          {/* Left Side: Product Bundles */}
          <VStack flex={{ base: 1, lg: 3 }} spacing={8} align="stretch">
            {bundles.map((bundle) => (
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
                  {bundle.description ||
                    bundle.notes ||
                    "No description available"}
                </Text>
                <Box overflowX="auto">
                  <Table variant="simple" size="md">
                    <Thead bg="gray.100">
                      <Tr>
                        <Th>Component</Th>
                        <Th>Description</Th>
                        <Th isNumeric>Req. Qty</Th>
                        <Th isNumeric>Unit Cost</Th>
                        <Th isNumeric>Total Cost</Th>
                        <Th textAlign="center">Stock</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {bundle.components.map((component) => (
                        <Tr key={component.id} _hover={{ bg: "gray.50" }}>
                          <Td fontWeight="medium">{component.num}</Td>
                          <Td>
                            <HStack spacing={2}>
                              <Text>{component.description}</Text>
                              {component.supplier_part_number && (
                                <Tooltip
                                  label={`Supplier PN: ${component.supplier_part_number}`}
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
                          <Td isNumeric>{component.required_qty}</Td>
                          <Td isNumeric>
                            ${(component.unit_cost || 0).toFixed(2)}
                          </Td>
                          <Td isNumeric>
                            $
                            {(
                              component.required_qty *
                              (component.unit_cost || 0)
                            ).toFixed(2)}
                          </Td>
                          <Td textAlign="center">
                            <Badge
                              colorScheme={
                                component.current_qty &&
                                component.current_qty >= component.required_qty
                                  ? "green"
                                  : component.current_qty &&
                                    component.current_qty > 0
                                  ? "orange"
                                  : "red"
                              }
                            >
                              {component.current_qty || 0} in stock
                            </Badge>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              </Box>
            ))}
          </VStack>

          {/* Right Side: Cost Breakdown */}
          <Box
            flex={{ base: 1, lg: 1 }}
            p={5}
            borderWidth="1px"
            borderColor="gray.300"
            borderRadius="lg"
            boxShadow="md"
            bg="white"
            position={{ lg: "sticky" }}
            top={{ lg: "24px" }}
            alignSelf={{ lg: "flex-start" }}
            height="fit-content"
          >
            <Heading size="lg" mb={4} color="gray.700">
              Cost Breakdown
            </Heading>
            {selectedBundle ? (
              <VStack spacing={3} align="stretch">
                <HStack justifyContent="space-between">
                  <Text fontWeight="medium">Selected Product:</Text>
                  <Text color="teal.600" fontWeight="bold">
                    {selectedBundle.name}
                  </Text>
                </HStack>
                <Divider />
                <HStack justifyContent="space-between">
                  <Text>Subtotal:</Text>
                  <Text>${costs.subtotal.toFixed(2)}</Text>
                </HStack>
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
                  label="Create purchase order for this product"
                  placement="bottom"
                  hasArrow
                >
                  <Button
                    mt={4}
                    colorScheme="teal"
                    size="lg"
                    onClick={() => {
                      // In a real app, this would create a PO for the components
                      toast({
                        title: "Purchase Order Created",
                        description: `PO generated for ${selectedBundle.name}`,
                        status: "success",
                        duration: 3000,
                        isClosable: true,
                      });
                    }}
                  >
                    Generate Purchase Order
                  </Button>
                </Tooltip>
              </VStack>
            ) : (
              <Text color="gray.500">
                Select a product to see the cost breakdown.
              </Text>
            )}
          </Box>
        </Flex>
      </Box>
      <Footer />
    </ChakraProvider>
  );
}
