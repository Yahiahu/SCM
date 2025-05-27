"use client";

import {
  Box,
  Flex,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  Button,
  Select,
  VStack,
  ChakraProvider,
  extendTheme,
} from "@chakra-ui/react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

const theme = extendTheme({});

export default function ComponentsPage() {
  return (
    <ChakraProvider theme={theme}>
      <Navbar isLoggedIn={false} />
      <Box p={6}>
        <Flex direction={{ base: "column", md: "row" }} gap={6}>
          {/* Left Side - Main Table */}
          <Box flex={3}>
            <Flex gap={2}>
            <Input placeholder="Search..." size="sm" maxW="200px" />
            <Select size="sm" maxW="150px">
                <option value="">Sort By</option>
                <option value="name">Name</option>
                <option value="type">Type</option>
            </Select>
            <Button size="sm" variant="outline" colorScheme="gray">
                Filter
            </Button>
            </Flex>
            <Box border="1px solid" borderColor="gray.300" borderRadius="md">
              <Table variant="simple" size="md">
                <Thead>
                  <Tr>
                    <Th>Component Name</Th>
                    <Th>Type</Th>
                    <Th>Quantity</Th>
                    <Th>Status</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td>Capacitor A</Td>
                    <Td>Electrical</Td>
                    <Td>500</Td>
                    <Td>Available</Td>
                  </Tr>
                  <Tr>
                    <Td>Gear B</Td>
                    <Td>Mechanical</Td>
                    <Td>120</Td>
                    <Td>Backordered</Td>
                  </Tr>
                  <Tr>
                    <Td>Screw C</Td>
                    <Td>Hardware</Td>
                    <Td>1000</Td>
                    <Td>Available</Td>
                  </Tr>
                </Tbody>
              </Table>
            </Box>
          </Box>

          {/* Right Side - Menu Table and Button */}
          <Box flex={1}>
            <Box
              border="1px solid"
              borderColor="gray.300"
              borderRadius="md"
              p={4}
            >
              <Heading size="sm" mb={3}>
                Actions
              </Heading>
              <Table size="sm" variant="simple">
                <Tbody>
                  <Tr>
                    <Td>View BOM</Td>
                  </Tr>
                  <Tr>
                    <Td>Check Inventory</Td>
                  </Tr>
                  <Tr>
                    <Td>Generate Report</Td>
                  </Tr>
                </Tbody>
              </Table>
              <Button colorScheme="blue" mt={4} width="100%">
                Create PO
              </Button>
            </Box>
          </Box>
        </Flex>
      </Box>
    <Footer />
    </ChakraProvider>
  );
}
