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
  Badge,
  Icon,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Text,
  Progress,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Textarea,
  useToast,
  Skeleton,
  HStack,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
} from "@chakra-ui/react";
import {
  FiSearch,
  FiFilter,
  FiPlus,
  FiDownload,
  FiPrinter,
  FiEdit2,
  FiTrash2,
  FiMoreVertical,
  FiArrowRight,
  FiTruck,
  FiPackage,
  FiClock,
  FiCheckCircle,
  FiAlertTriangle,
  FiMapPin,
} from "react-icons/fi";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

// Dynamically import the Map component to avoid SSR issues
const MapWithNoSSR = dynamic(() => import("../components/shipping-map"), {
  ssr: false,
});

// Custom theme with blue color scheme (same as suppliers page)
const theme = extendTheme({
  colors: {
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
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: "semibold",
        borderRadius: "md",
      },
      variants: {
        solid: {
          bg: "brand.500",
          color: "white",
          _hover: {
            bg: "brand.600",
          },
        },
      },
    },
    Table: {
      variants: {
        striped: {
          th: {
            color: "gray.600",
          },
          tbody: {
            tr: {
              "&:nth-of-type(odd)": {
                td: {
                  background: "brand.50",
                },
              },
            },
          },
        },
      },
    },
  },
});

interface Shipment {
  id: string;
  trackingNumber: string;
  carrier: string;
  status: "In Transit" | "Delivered" | "Exception" | "Pending";
  origin: string;
  destination: string;
  estimatedDelivery: string;
  lastUpdate: string;
  items: number;
  weight: number;
}

export default function ShippingPage() {
  const router = useRouter();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [filteredShipments, setFilteredShipments] = useState<Shipment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Mock data for shipments
  useEffect(() => {
    const fetchShipments = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800));

        const mockShipments: Shipment[] = [
          {
            id: "1",
            trackingNumber: "UPS123456789",
            carrier: "UPS",
            status: "In Transit",
            origin: "New York, NY",
            destination: "Los Angeles, CA",
            estimatedDelivery: "2023-06-15",
            lastUpdate: "2023-06-10 14:30",
            items: 5,
            weight: 12.5,
          },
          {
            id: "2",
            trackingNumber: "FEDEX987654321",
            carrier: "FedEx",
            status: "Delivered",
            origin: "Chicago, IL",
            destination: "Miami, FL",
            estimatedDelivery: "2023-06-08",
            lastUpdate: "2023-06-08 09:15",
            items: 3,
            weight: 8.2,
          },
          {
            id: "3",
            trackingNumber: "USPS456123789",
            carrier: "USPS",
            status: "Exception",
            origin: "Seattle, WA",
            destination: "Boston, MA",
            estimatedDelivery: "2023-06-12",
            lastUpdate: "2023-06-11 16:45",
            items: 7,
            weight: 15.8,
          },
          {
            id: "4",
            trackingNumber: "DHL789456123",
            carrier: "DHL",
            status: "Pending",
            origin: "Houston, TX",
            destination: "Denver, CO",
            estimatedDelivery: "2023-06-18",
            lastUpdate: "2023-06-09 11:20",
            items: 2,
            weight: 5.3,
          },
          {
            id: "5",
            trackingNumber: "UPS321654987",
            carrier: "UPS",
            status: "In Transit",
            origin: "Atlanta, GA",
            destination: "Phoenix, AZ",
            estimatedDelivery: "2023-06-14",
            lastUpdate: "2023-06-11 08:10",
            items: 4,
            weight: 9.7,
          },
        ];

        setShipments(mockShipments);
        setFilteredShipments(mockShipments);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load shipments",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchShipments();
  }, [toast]);

  // Filter shipments
  useEffect(() => {
    let result = [...shipments];

    // Filter by search term
    if (searchTerm) {
      result = result.filter(
        (shipment) =>
          shipment.trackingNumber
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          shipment.carrier.toLowerCase().includes(searchTerm.toLowerCase()) ||
          shipment.destination.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      result = result.filter((shipment) => shipment.status === statusFilter);
    }

    setFilteredShipments(result);
  }, [searchTerm, statusFilter, shipments]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Transit":
        return "blue";
      case "Delivered":
        return "green";
      case "Exception":
        return "red";
      case "Pending":
        return "orange";
      default:
        return "gray";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "In Transit":
        return <Icon as={FiTruck} />;
      case "Delivered":
        return <Icon as={FiCheckCircle} />;
      case "Exception":
        return <Icon as={FiAlertTriangle} />;
      case "Pending":
        return <Icon as={FiClock} />;
      default:
        return <Icon as={FiPackage} />;
    }
  };

  const handleCreateShipment = () => {
    toast({
      title: "Create Shipment",
      description: "Opening shipment creation form...",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
    onOpen();
  };

  const handleExport = () => {
    toast({
      title: "Export Data",
      description: "Preparing shipment data for export...",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
    // In a real app, this would trigger CSV/Excel export
  };

  const handlePrint = () => {
    window.print();
  };

  const handleTrackShipment = (trackingNumber: string) => {
    toast({
      title: "Track Shipment",
      description: `Tracking ${trackingNumber} with carrier...`,
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  const shipmentStats = [
    {
      title: "Total Shipments",
      value: shipments.length,
      change: "+12%",
      isIncrease: true,
      icon: FiPackage,
    },
    {
      title: "In Transit",
      value: shipments.filter((s) => s.status === "In Transit").length,
      change: "+5%",
      isIncrease: true,
      icon: FiTruck,
    },
    {
      title: "Delivered",
      value: shipments.filter((s) => s.status === "Delivered").length,
      change: "+8%",
      isIncrease: true,
      icon: FiCheckCircle,
    },
    {
      title: "Exceptions",
      value: shipments.filter((s) => s.status === "Exception").length,
      change: "-2%",
      isIncrease: false,
      icon: FiAlertTriangle,
    },
  ];

  return (
    <ChakraProvider theme={theme}>
      <Box minHeight="100vh" display="flex" flexDirection="column">
        <Navbar isLoggedIn={true} />

        <Box flex="1" pt={20} px={6} bg="gray.50">
          <Flex direction="column" gap={6}>
            {/* Header */}
            <Flex justify="space-between" align="center">
              <Heading size="xl" color="gray.800">
                Shipping Dashboard
              </Heading>

              <Button
                colorScheme="brand"
                leftIcon={<FiPlus />}
                onClick={handleCreateShipment}
              >
                Create Shipment
              </Button>
            </Flex>

            {/* Stats Cards */}
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
              {shipmentStats.map((stat, index) => (
                <Card key={index} boxShadow="sm">
                  <CardBody>
                    <Stat>
                      <Flex align="center" justify="space-between">
                        <Box>
                          <StatLabel>{stat.title}</StatLabel>
                          <StatNumber>{stat.value}</StatNumber>
                          <StatHelpText>
                            <StatArrow
                              type={stat.isIncrease ? "increase" : "decrease"}
                            />
                            {stat.change}
                          </StatHelpText>
                        </Box>
                        <Icon as={stat.icon} boxSize={6} color="brand.500" />
                      </Flex>
                    </Stat>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>

            {/* Map View */}
            <Card boxShadow="sm" h="400px">
              <CardHeader>
                <Heading size="md">Shipment Tracking Map</Heading>
              </CardHeader>
              <CardBody p={0}>
                {isLoading ? (
                  <Skeleton h="100%" />
                ) : (
                  <MapWithNoSSR shipments={filteredShipments} />
                )}
              </CardBody>
            </Card>

            {/* Search and Filter */}
            <Card boxShadow="sm">
              <CardBody>
                <Flex gap={4} flexWrap="wrap">
                  <HStack flex={1} minW="300px">
                    <Icon as={FiSearch} color="gray.500" />
                    <Input
                      placeholder="Search shipments..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </HStack>

                  <HStack>
                    <Icon as={FiFilter} color="gray.500" />
                    <Select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      minW="180px"
                    >
                      <option value="all">All Statuses</option>
                      <option value="In Transit">In Transit</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Exception">Exception</option>
                      <option value="Pending">Pending</option>
                    </Select>
                  </HStack>

                  <Button
                    leftIcon={<FiDownload />}
                    variant="outline"
                    onClick={handleExport}
                  >
                    Export
                  </Button>
                  <Button
                    leftIcon={<FiPrinter />}
                    variant="outline"
                    onClick={handlePrint}
                  >
                    Print
                  </Button>
                </Flex>
              </CardBody>
            </Card>

            {/* Shipments Table */}
            <Card boxShadow="sm" overflowX="auto">
              {isLoading ? (
                <CardBody>
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} height="40px" mb={2} />
                  ))}
                </CardBody>
              ) : (
                <>
                  <Table variant="striped" size="md">
                    <Thead>
                      <Tr>
                        <Th>Tracking #</Th>
                        <Th>Carrier</Th>
                        <Th>Status</Th>
                        <Th>Route</Th>
                        <Th>Items</Th>
                        <Th>Weight (lbs)</Th>
                        <Th>Est. Delivery</Th>
                        <Th>Last Update</Th>
                        <Th>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {filteredShipments.map((shipment) => (
                        <Tr key={shipment.id}>
                          <Td fontWeight="medium">{shipment.trackingNumber}</Td>
                          <Td>{shipment.carrier}</Td>
                          <Td>
                            <Badge
                              colorScheme={getStatusColor(shipment.status)}
                              display="flex"
                              alignItems="center"
                              gap={1}
                              px={2}
                              py={1}
                              borderRadius="full"
                            >
                              {getStatusIcon(shipment.status)}
                              {shipment.status}
                            </Badge>
                          </Td>
                          <Td>
                            <Flex direction="column" fontSize="sm">
                              <Text>{shipment.origin}</Text>
                              <Icon as={FiArrowRight} mx="auto" my={1} />
                              <Text>{shipment.destination}</Text>
                            </Flex>
                          </Td>
                          <Td>{shipment.items}</Td>
                          <Td>{shipment.weight}</Td>
                          <Td>{shipment.estimatedDelivery}</Td>
                          <Td>{shipment.lastUpdate}</Td>
                          <Td>
                            <Button
                              size="sm"
                              variant="outline"
                              leftIcon={<FiMapPin />}
                              onClick={() =>
                                handleTrackShipment(shipment.trackingNumber)
                              }
                            >
                              Track
                            </Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>

                  {filteredShipments.length === 0 && !isLoading && (
                    <CardBody>
                      <Text textAlign="center" py={8} color="gray.500">
                        No shipments found. Try adjusting your filters.
                      </Text>
                    </CardBody>
                  )}
                </>
              )}
            </Card>
          </Flex>
        </Box>

        <Footer />
      </Box>

      {/* Create Shipment Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Shipment</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Carrier</FormLabel>
                <Select placeholder="Select carrier">
                  <option value="UPS">UPS</option>
                  <option value="FedEx">FedEx</option>
                  <option value="USPS">USPS</option>
                  <option value="DHL">DHL</option>
                </Select>
              </FormControl>

              <SimpleGrid columns={2} spacing={4} w="full">
                <FormControl isRequired>
                  <FormLabel>Origin</FormLabel>
                  <Input placeholder="City, State" />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Destination</FormLabel>
                  <Input placeholder="City, State" />
                </FormControl>
              </SimpleGrid>

              <SimpleGrid columns={2} spacing={4} w="full">
                <FormControl isRequired>
                  <FormLabel>Number of Items</FormLabel>
                  <Input type="number" placeholder="e.g., 5" />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Total Weight (lbs)</FormLabel>
                  <Input type="number" placeholder="e.g., 12.5" />
                </FormControl>
              </SimpleGrid>

              <FormControl>
                <FormLabel>Special Instructions</FormLabel>
                <Textarea placeholder="Fragile, temperature sensitive, etc." />
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="brand">Create Shipment</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </ChakraProvider>
  );
}
