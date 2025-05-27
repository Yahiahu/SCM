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
  Text, // Added for image labels
} from "@chakra-ui/react";
import React from "react"; // Import React for types like React.ReactNode and SyntheticEvent
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
interface OrderedItem {
  id: string;
  item: string;
  quantity: number;
  customer: string;
}

interface ShippedItem {
  id: string;
  item: string;
  quantity: number;
  destination: string;
  status: string;
}

interface WarehousedItem {
  id: string;
  item: string;
  quantity: number;
  location: string;
  lastStocked: string;
}

// Sample data for tables
const orderedItems: OrderedItem[] = [
  {
    id: "ORD001",
    item: "Sensor Unit X",
    quantity: 50,
    customer: "Tech Solutions Ltd.",
  },
  {
    id: "ORD002",
    item: "Actuator Arm Y",
    quantity: 25,
    customer: "Robotics Inc.",
  },
  {
    id: "ORD003",
    item: "Control Panel Z",
    quantity: 10,
    customer: "Automate Corp.",
  },
];

const shippedItems: ShippedItem[] = [
  {
    id: "SHP001",
    item: "Sensor Unit X",
    quantity: 50,
    destination: "New York Hub",
    status: "In Transit",
  },
  {
    id: "SHP002",
    item: "Actuator Arm Y",
    quantity: 20,
    destination: "London Depot",
    status: "Delivered",
  },
];

const warehousedItems: WarehousedItem[] = [
  {
    id: "WH001",
    item: "Component A",
    quantity: 500,
    location: "Shelf A1",
    lastStocked: "2024-05-15",
  },
  {
    id: "WH002",
    item: "Part B",
    quantity: 1200,
    location: "Bay B3",
    lastStocked: "2024-05-18",
  },
  {
    id: "WH003",
    item: "Sub-assembly C",
    quantity: 350,
    location: "Rack C2",
    lastStocked: "2024-05-20",
  },
];

// --- Reusable Table Component ---
interface DataTableProps<T> {
  title: string;
  headers: string[];
  data: T[];
  renderRow: (item: T) => React.ReactNode; // Function that takes an item of type T and returns a ReactNode
}

// Generic DataTable component
const DataTable = <T extends { id: string }>({
  title,
  headers,
  data,
  renderRow,
}: DataTableProps<T>) => (
  <Box
    width="100%"
    border="1px solid"
    borderColor="gray.300"
    borderRadius="md"
    p={4}
    boxShadow="sm"
  >
    <Heading size="md" mb={4} color="gray.700">
      {title}
    </Heading>
    <Box overflowX="auto">
      {" "}
      {/* Ensures table is scrollable on small screens if content overflows */}
      <Table variant="simple" size="sm">
        <Thead bg="gray.100">
          <Tr>
            {headers.map(
              (
                header: string // Explicitly type header as string
              ) => (
                <Th key={header} whiteSpace="nowrap">
                  {header}
                </Th>
              )
            )}
          </Tr>
        </Thead>
        <Tbody>{data.map(renderRow)}</Tbody>
      </Table>
    </Box>
  </Box>
);

export default function LogisticsPage() {
  // Type the event for onError
  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const target = e.target as HTMLImageElement; // Cast target to HTMLImageElement
    target.onerror = null; // Prevent infinite loop if fallback also fails
    target.src =
      "https://placehold.co/600x400/CCCCCC/FFFFFF?text=Image+Not+Found";
  };

  return (
    <ChakraProvider theme={theme}>
      <Navbar isLoggedIn={false} /> {/* Your navigation bar */}
      <Box p={{ base: 4, md: 6 }} bg="gray.50" minHeight="calc(100vh - 120px)">
        {" "}
        {/* Adjust minHeight based on Navbar/Footer height */}
        <Flex direction={{ base: "column", lg: "row" }} gap={6}>
          {/* Left Side: Tables (3/4 width on large screens) */}
          <VStack
            flex={{ base: 1, lg: 3 }} // Takes 3 parts of the width on lg screens
            spacing={6}
            align="stretch" // Ensures children take full width
          >
            {/* Ordered Table */}
            <DataTable<OrderedItem> // Specify the type for this instance of DataTable
              title="Ordered Items"
              headers={["Order ID", "Item", "Quantity", "Customer"]}
              data={orderedItems}
              renderRow={(
                item: OrderedItem // item is now correctly typed
              ) => (
                <Tr key={item.id}>
                  <Td>{item.id}</Td>
                  <Td>{item.item}</Td>
                  <Td isNumeric>{item.quantity}</Td>
                  <Td>{item.customer}</Td>
                </Tr>
              )}
            />

            {/* Shipped Table */}
            <DataTable<ShippedItem> // Specify the type
              title="Shipped Items"
              headers={[
                "Shipment ID",
                "Item",
                "Quantity",
                "Destination",
                "Status",
              ]}
              data={shippedItems}
              renderRow={(
                item: ShippedItem // item is now correctly typed
              ) => (
                <Tr key={item.id}>
                  <Td>{item.id}</Td>
                  <Td>{item.item}</Td>
                  <Td isNumeric>{item.quantity}</Td>
                  <Td>{item.destination}</Td>
                  <Td>{item.status}</Td>
                </Tr>
              )}
            />

            {/* Warehoused Table */}
            <DataTable<WarehousedItem> // Specify the type
              title="Warehoused Stock"
              headers={[
                "Stock ID",
                "Item",
                "Quantity",
                "Location",
                "Last Stocked",
              ]}
              data={warehousedItems}
              renderRow={(
                item: WarehousedItem // item is now correctly typed
              ) => (
                <Tr key={item.id}>
                  <Td>{item.id}</Td>
                  <Td>{item.item}</Td>
                  <Td isNumeric>{item.quantity}</Td>
                  <Td>{item.location}</Td>
                  <Td>{item.lastStocked}</Td>
                </Tr>
              )}
            />
          </VStack>

          {/* Right Side: Images (1/4 width on large screens) */}
          <VStack
            flex={{ base: 1, lg: 1 }} // Takes 1 part of the width on lg screens
            spacing={6}
            align="stretch"
            width="100%" // Ensures VStack takes full width of its flex container
          >
            {/* Local View Image */}
            <Box
              border="1px solid"
              borderColor="gray.300"
              borderRadius="md"
              p={4}
              textAlign="center"
              boxShadow="sm"
              height={{ base: "auto", lg: "50%" }}
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
            >
              <Heading size="sm" mb={2} color="gray.700">
                Local View
              </Heading>
              <Image
                src="https://placehold.co/600x400/007ACC/FFFFFF?text=Local+Warehouse+View"
                alt="Local Warehouse View"
                objectFit="contain"
                borderRadius="sm"
                maxHeight="calc(100% - 40px)"
                width="100%"
                onError={handleImageError} // Use the typed event handler
              />
            </Box>

            {/* Global View Image */}
            <Box
              border="1px solid"
              borderColor="gray.300"
              borderRadius="md"
              p={4}
              textAlign="center"
              boxShadow="sm"
              height={{ base: "auto", lg: "50%" }}
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
            >
              <Heading size="sm" mb={2} color="gray.700">
                Global Logistics View
              </Heading>
              <Image
                src="https://placehold.co/600x400/E8A030/FFFFFF?text=Global+Supply+Chain"
                alt="Global Supply Chain View"
                objectFit="contain"
                borderRadius="sm"
                maxHeight="calc(100% - 40px)"
                width="100%"
                onError={handleImageError} // Use the typed event handler
              />
            </Box>
          </VStack>
        </Flex>
      </Box>
      <Footer /> {/* Your footer */}
    </ChakraProvider>
  );
}
