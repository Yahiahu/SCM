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
  Image,
} from "@chakra-ui/react";
import Navbar from "../components/navbar"; // Assuming Navbar component exists
import Footer from "../components/footer"; // Assuming Footer component exists

const theme = extendTheme({});

export default function WarehousePage() {
  return (
    <ChakraProvider theme={theme}>
      <Navbar isLoggedIn={true} />
      <Box p={6}>
        <Flex direction={{ base: "column", lg: "row" }} gap={10}>
          {/* Far Left: Stock Table */}
          <Box flex={{ base: 1, lg: 1 }} width="100%">
            {" "}
            {/* Changed flex to 1 for equal thirds */}
            <Heading size="md" mb={3}>
              Stock
            </Heading>
            <Box border="1px solid" borderColor="gray.300" borderRadius="md">
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th>Item</Th>
                    <Th>Location</Th>
                    <Th isNumeric>Qty</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td>Widget A</Td>
                    <Td>Bay 1</Td>
                    <Td isNumeric>150</Td>
                  </Tr>
                  <Tr>
                    <Td>Gadget B</Td>
                    <Td>Bay 3</Td>
                    <Td isNumeric>89</Td>
                  </Tr>
                  <Tr>
                    <Td>Part C</Td>
                    <Td>Bay 2</Td>
                    <Td isNumeric>240</Td>
                  </Tr>
                </Tbody>
              </Table>
            </Box>
          </Box>

          {/* Center: Outgoing + Incoming Tables */}
          <VStack flex={{ base: 1, lg: 1 }} spacing={6} width="100%">
            {" "}
            {/* Changed flex to 1 */}
            <Box width="100%">
              <Heading size="sm" mb={2}>
                Outgoing
              </Heading>
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th>Item</Th>
                    <Th>To</Th>
                    <Th isNumeric>Qty</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td>Widget A</Td>
                    <Td>Toronto</Td>
                    <Td isNumeric>20</Td>
                  </Tr>
                  <Tr>
                    <Td>Part C</Td>
                    <Td>Vancouver</Td>
                    <Td isNumeric>10</Td>
                  </Tr>
                </Tbody>
              </Table>
            </Box>
            <Box width="100%">
              <Heading size="sm" mb={2}>
                Incoming
              </Heading>
              <Table variant="simple" size="sm">
                <Thead>
                  <Tr>
                    <Th>Item</Th>
                    <Th>From</Th>
                    <Th isNumeric>Qty</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td>Gadget B</Td>
                    <Td>Montreal</Td>
                    <Td isNumeric>50</Td>
                  </Tr>
                  <Tr>
                    <Td>Widget A</Td>
                    <Td>Calgary</Td>
                    <Td isNumeric>30</Td>
                  </Tr>
                </Tbody>
              </Table>
            </Box>
          </VStack>

          {/* Far Right: Analytics & Image */}
          <VStack flex={{ base: 1, lg: 1 }} spacing={6} width="100%">
            {" "}
            {/* Changed flex to 1 */}
            <Box
              border="1px solid"
              borderColor="gray.300"
              p={4}
              width="100%"
              height="200px"
              bg="gray.50"
            >
              <Heading size="sm" mb={2}>
                Analytics
              </Heading>
              <Box bg="gray.100" height="100%" />{" "}
              {/* Placeholder for analytics content */}
            </Box>
            <Box
              border="1px solid"
              borderColor="gray.300"
              p={2}
              width="100%"
              height="200px"
            >
              <Image
                src="https://via.placeholder.com/300x150" // Example image
                alt="Warehouse"
                objectFit="cover"
                height="100%"
                width="100%"
              />
            </Box>
          </VStack>
        </Flex>
      </Box>
      <Footer />
    </ChakraProvider>
  );
}
