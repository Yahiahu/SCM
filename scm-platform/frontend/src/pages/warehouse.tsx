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
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Badge,
  HStack,
  Icon,
  Input,
  Button,
  Select,
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
  useToast,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Progress,
  Divider,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Tag,
  Avatar,
  AvatarGroup,
  Link,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Tooltip,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Spinner,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import {
  FiPlus,
  FiSearch,
  FiFilter,
  FiDownload,
  FiPrinter,
  FiAlertTriangle,
  FiCheckCircle,
  FiClock,
  FiTruck,
  FiEdit2,
  FiTrash2,
  FiMoreVertical,
  FiPackage,
  FiHome,
  FiTrendingUp,
  FiAlertCircle,
  FiBox,
  FiArrowUp,
  FiArrowDown,
  FiInfo,
  FiShoppingCart,
  FiMapPin,
  FiBarChart2,
  FiRefreshCw,
  FiCalendar,
  FiTruck as FiIncomingTruck,
  FiExternalLink,
} from "react-icons/fi";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Custom theme for warehouse dashboard
const theme = extendTheme({
  colors: {
    warehouse: {
      50: "#f0fdf4",
      100: "#dcfce7",
      200: "#bbf7d0",
      300: "#86efac",
      400: "#4ade80",
      500: "#22c55e",
      600: "#16a34a",
      700: "#15803d",
      800: "#166534",
      900: "#14532d",
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
          bg: "warehouse.500",
          color: "white",
          _hover: {
            bg: "warehouse.600",
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
                  background: "warehouse.50",
                },
              },
            },
          },
        },
      },
    },
  },
});

interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  location: string;
  quantity: number;
  minStockLevel: number;
  status: "In Stock" | "Low Stock" | "Out of Stock" | "Backordered";
  lastUpdated: string;
  image?: string;
  unitPrice?: number;
}

interface IncomingShipment {
  id: string;
  itemId: string;
  itemName: string;
  quantity: number;
  from: string;
  expectedDate: string;
  status: "In Transit" | "Delayed" | "Arrived" | "Processing";
  carrier: string;
  trackingNumber?: string;
}

interface OutgoingShipment {
  id: string;
  itemId: string;
  itemName: string;
  quantity: number;
  to: string;
  orderNumber: string;
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled";
  shippingDate: string;
  trackingNumber?: string;
}

interface WarehouseLocation {
  id: string;
  name: string;
  type: "Bay" | "Shelf" | "Bin" | "Rack";
  capacity: number;
  currentOccupancy: number;
  items: string[]; // Array of item IDs
}

export default function WarehousePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [incoming, setIncoming] = useState<IncomingShipment[]>([]);
  const [outgoing, setOutgoing] = useState<OutgoingShipment[]>([]);
  const [locations, setLocations] = useState<WarehouseLocation[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "",
    location: "",
    quantity: "",
    minStockLevel: "",
    unitPrice: "",
  });

  const [shipmentForm, setShipmentForm] = useState({
    type: "incoming",
    itemId: "",
    quantity: "",
    toFrom: "",
    expectedDate: "",
    carrier: "",
    trackingNumber: "",
  });

  // Initialize with mock data
  useEffect(() => {
    const loadData = () => {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setInventory([
          {
            id: "INV001",
            sku: "WGT-A-001",
            name: "Widget A",
            category: "Components",
            location: "BAY-1-S2",
            quantity: 150,
            minStockLevel: 50,
            status: "In Stock",
            lastUpdated: new Date().toISOString().split("T")[0],
            image: "https://via.placeholder.com/50",
            unitPrice: 12.5,
          },
          {
            id: "INV002",
            sku: "GDT-B-002",
            name: "Gadget B",
            category: "Assemblies",
            location: "BAY-3-S1",
            quantity: 89,
            minStockLevel: 100,
            status: "Low Stock",
            lastUpdated: new Date().toISOString().split("T")[0],
            image: "https://via.placeholder.com/50",
            unitPrice: 25.0,
          },
          {
            id: "INV003",
            sku: "PRT-C-003",
            name: "Part C",
            category: "Hardware",
            location: "BAY-2-S3",
            quantity: 240,
            minStockLevel: 75,
            status: "In Stock",
            lastUpdated: new Date().toISOString().split("T")[0],
            image: "https://via.placeholder.com/50",
            unitPrice: 2.5,
          },
          {
            id: "INV004",
            sku: "MTR-D-004",
            name: "Motor D",
            category: "Electromechanical",
            location: "BAY-4-S1",
            quantity: 0,
            minStockLevel: 10,
            status: "Out of Stock",
            lastUpdated: new Date().toISOString().split("T")[0],
            image: "https://via.placeholder.com/50",
            unitPrice: 45.0,
          },
          {
            id: "INV005",
            sku: "SNS-E-005",
            name: "Sensor E",
            category: "Electronics",
            location: "BAY-1-S4",
            quantity: 12,
            minStockLevel: 25,
            status: "Low Stock",
            lastUpdated: new Date().toISOString().split("T")[0],
            image: "https://via.placeholder.com/50",
            unitPrice: 18.0,
          },
        ]);

        setIncoming([
          {
            id: "INC001",
            itemId: "INV002",
            itemName: "Gadget B",
            quantity: 50,
            from: "Montreal Supplier",
            expectedDate: new Date(Date.now() + 86400000 * 3)
              .toISOString()
              .split("T")[0],
            status: "In Transit",
            carrier: "FedEx",
            trackingNumber: "FX123456789",
          },
          {
            id: "INC002",
            itemId: "INV001",
            itemName: "Widget A",
            quantity: 30,
            from: "Calgary Distributor",
            expectedDate: new Date(Date.now() + 86400000 * 5)
              .toISOString()
              .split("T")[0],
            status: "Processing",
            carrier: "UPS",
            trackingNumber: "UPS987654321",
          },
          {
            id: "INC003",
            itemId: "INV004",
            itemName: "Motor D",
            quantity: 15,
            from: "Toronto Wholesale",
            expectedDate: new Date(Date.now() - 86400000)
              .toISOString()
              .split("T")[0],
            status: "Delayed",
            carrier: "DHL",
            trackingNumber: "DLH456789123",
          },
        ]);

        setOutgoing([
          {
            id: "OUT001",
            itemId: "INV001",
            itemName: "Widget A",
            quantity: 20,
            to: "Toronto Customer",
            orderNumber: "ORD-2024-105",
            status: "Shipped",
            shippingDate: new Date(Date.now() - 86400000 * 2)
              .toISOString()
              .split("T")[0],
            trackingNumber: "CAN123456789",
          },
          {
            id: "OUT002",
            itemId: "INV003",
            itemName: "Part C",
            quantity: 10,
            to: "Vancouver Client",
            orderNumber: "ORD-2024-106",
            status: "Processing",
            shippingDate: new Date(Date.now() + 86400000)
              .toISOString()
              .split("T")[0],
          },
          {
            id: "OUT003",
            itemId: "INV002",
            itemName: "Gadget B",
            quantity: 5,
            to: "Ottawa Partner",
            orderNumber: "ORD-2024-107",
            status: "Delivered",
            shippingDate: new Date(Date.now() - 86400000 * 5)
              .toISOString()
              .split("T")[0],
            trackingNumber: "CAN987654321",
          },
        ]);

        setLocations([
          {
            id: "BAY-1",
            name: "Bay 1",
            type: "Bay",
            capacity: 1000,
            currentOccupancy: 750,
            items: ["INV001", "INV005"],
          },
          {
            id: "BAY-2",
            name: "Bay 2",
            type: "Bay",
            capacity: 1000,
            currentOccupancy: 800,
            items: ["INV003"],
          },
          {
            id: "BAY-3",
            name: "Bay 3",
            type: "Bay",
            capacity: 800,
            currentOccupancy: 300,
            items: ["INV002"],
          },
          {
            id: "BAY-4",
            name: "Bay 4",
            type: "Bay",
            capacity: 1200,
            currentOccupancy: 400,
            items: ["INV004"],
          },
        ]);

        setIsLoading(false);
      }, 1000);
    };

    loadData();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleShipmentFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setShipmentForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `INV${Math.random()
      .toString(36)
      .substring(2, 6)
      .toUpperCase()}`;
    const sku =
      formData.sku ||
      `${formData.name.substring(0, 3).toUpperCase()}-${formData.category
        .substring(0, 1)
        .toUpperCase()}-${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0")}`;

    const quantity = parseInt(formData.quantity) || 0;
    const minStockLevel = parseInt(formData.minStockLevel) || 0;
    const unitPrice = parseFloat(formData.unitPrice) || 0;

    let status: InventoryItem["status"] = "In Stock";
    if (quantity === 0) status = "Out of Stock";
    else if (quantity <= minStockLevel) status = "Low Stock";

    const newItem: InventoryItem = {
      id: newId,
      sku,
      name: formData.name,
      category: formData.category,
      location: formData.location,
      quantity,
      minStockLevel,
      status,
      lastUpdated: new Date().toISOString().split("T")[0],
      unitPrice,
    };

    setInventory((prev) => [...prev, newItem]);
    setFormData({
      name: "",
      sku: "",
      category: "",
      location: "",
      quantity: "",
      minStockLevel: "",
      unitPrice: "",
    });
    onClose();

    toast({
      title: "Item Added",
      description: `${newItem.name} has been added to inventory`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleShipmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const item = inventory.find((i) => i.id === shipmentForm.itemId);
    if (!item) return;

    if (shipmentForm.type === "incoming") {
      const newId = `INC${Math.random()
        .toString(36)
        .substring(2, 6)
        .toUpperCase()}`;
      const newShipment: IncomingShipment = {
        id: newId,
        itemId: shipmentForm.itemId,
        itemName: item.name,
        quantity: parseInt(shipmentForm.quantity) || 0,
        from: shipmentForm.toFrom,
        expectedDate: shipmentForm.expectedDate,
        status: "Processing",
        carrier: shipmentForm.carrier,
        trackingNumber: shipmentForm.trackingNumber,
      };

      setIncoming((prev) => [...prev, newShipment]);
    } else {
      const newId = `OUT${Math.random()
        .toString(36)
        .substring(2, 6)
        .toUpperCase()}`;
      const newShipment: OutgoingShipment = {
        id: newId,
        itemId: shipmentForm.itemId,
        itemName: item.name,
        quantity: parseInt(shipmentForm.quantity) || 0,
        to: shipmentForm.toFrom,
        orderNumber: `ORD-${new Date().getFullYear()}-${Math.floor(
          Math.random() * 1000
        )}`,
        status: "Processing",
        shippingDate: shipmentForm.expectedDate,
        trackingNumber: shipmentForm.trackingNumber,
      };

      setOutgoing((prev) => [...prev, newShipment]);
    }

    setShipmentForm({
      type: "incoming",
      itemId: "",
      quantity: "",
      toFrom: "",
      expectedDate: "",
      carrier: "",
      trackingNumber: "",
    });

    toast({
      title: "Shipment Created",
      description: `New ${shipmentForm.type} shipment has been created`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const deleteItem = (id: string) => {
    setInventory((prev) => prev.filter((item) => item.id !== id));
    toast({
      title: "Item Deleted",
      description: "The item has been removed from inventory",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  const updateItemQuantity = (id: string, newQuantity: number) => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          let status = item.status;
          if (newQuantity === 0) status = "Out of Stock";
          else if (newQuantity <= item.minStockLevel) status = "Low Stock";
          else status = "In Stock";

          return {
            ...item,
            quantity: newQuantity,
            status,
            lastUpdated: new Date().toISOString().split("T")[0],
          };
        }
        return item;
      })
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Stock":
      case "Shipped":
      case "Delivered":
      case "Arrived":
        return "green";
      case "Low Stock":
      case "Processing":
        return "orange";
      case "Out of Stock":
      case "Delayed":
      case "Cancelled":
        return "red";
      case "Backordered":
      case "In Transit":
        return "blue";
      default:
        return "gray";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "In Stock":
      case "Delivered":
      case "Arrived":
        return <Icon as={FiCheckCircle} />;
      case "Low Stock":
      case "Processing":
        return <Icon as={FiClock} />;
      case "Out of Stock":
      case "Delayed":
      case "Cancelled":
        return <Icon as={FiAlertTriangle} />;
      case "Backordered":
        return <Icon as={FiShoppingCart} />;
      case "In Transit":
      case "Shipped":
        return <Icon as={FiTruck} />;
      default:
        return null;
    }
  };

  // Filter inventory based on search and active tab
  const filteredInventory = inventory
    .filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase());

      let matchesTab = true;
      switch (activeTab) {
        case 0:
          matchesTab = true;
          break; // All
        case 1:
          matchesTab = item.status === "In Stock";
          break;
        case 2:
          matchesTab = item.status === "Low Stock";
          break;
        case 3:
          matchesTab = item.status === "Out of Stock";
          break;
        case 4:
          matchesTab = item.quantity <= item.minStockLevel;
          break;
      }

      return matchesSearch && matchesTab;
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  // Calculate inventory metrics
  const totalItems = inventory.length;
  const totalValue = inventory.reduce(
    (sum, item) => sum + item.quantity * (item.unitPrice || 10),
    0
  );
  const lowStockItems = inventory.filter(
    (item) => item.status === "Low Stock"
  ).length;
  const outOfStockItems = inventory.filter(
    (item) => item.status === "Out of Stock"
  ).length;
  const itemsNeedingReorder = inventory.filter(
    (item) => item.quantity <= item.minStockLevel
  ).length;

  // Shipment metrics
  const delayedIncoming = incoming.filter(
    (shipment) => shipment.status === "Delayed"
  ).length;
  const processingOutgoing = outgoing.filter(
    (shipment) => shipment.status === "Processing"
  ).length;

  // Location utilization
  const totalCapacity = locations.reduce((sum, loc) => sum + loc.capacity, 0);
  const totalOccupancy = locations.reduce(
    (sum, loc) => sum + loc.currentOccupancy,
    0
  );
  const utilizationPercentage = Math.round(
    (totalOccupancy / totalCapacity) * 100
  );

  const refreshData = () => {
    setIsLoading(true);
    // Simulate refresh
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Data Refreshed",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    }, 800);
  };

  const handleTrackShipment = (trackingNumber: string, carrier: string) => {
    // In a real app, this would redirect to the carrier's tracking page
    toast({
      title: "Tracking Information",
      description: `Opening tracking page for ${carrier} #${trackingNumber}`,
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleViewLocation = (locationId: string) => {
    // In a real app, this would show detailed location info
    const location = locations.find((loc) => loc.id === locationId);
    if (location) {
      toast({
        title: `Location: ${location.name}`,
        description: `Capacity: ${location.currentOccupancy}/${location.capacity}`,
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <ChakraProvider theme={theme}>
      <Navbar isLoggedIn={true} />

      <Box pt={20} px={6} bg="gray.50" minH="calc(100vh - 128px)">
        {/* Header and Actions */}
        <Flex justify="space-between" align="center" mb={6}>
          <Heading size="xl" color="gray.800">
            Warehouse Management
          </Heading>

          <HStack spacing={3}>
            <Button
              variant="outline"
              leftIcon={<FiRefreshCw />}
              onClick={refreshData}
              isLoading={isLoading}
            >
              Refresh
            </Button>
            <Button
              colorScheme="warehouse"
              leftIcon={<FiPlus />}
              onClick={onOpen}
            >
              Add Item
            </Button>
          </HStack>
        </Flex>

        {/* Alerts and Notifications */}
        {(outOfStockItems > 0 || delayedIncoming > 0) && (
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={6}>
            {outOfStockItems > 0 && (
              <Alert status="error" borderRadius="md">
                <AlertIcon />
                <Box>
                  <AlertTitle>{outOfStockItems} items out of stock</AlertTitle>
                  <AlertDescription>
                    Urgent action needed to replenish inventory
                  </AlertDescription>
                </Box>
              </Alert>
            )}
            {delayedIncoming > 0 && (
              <Alert status="warning" borderRadius="md">
                <AlertIcon />
                <Box>
                  <AlertTitle>{delayedIncoming} delayed shipments</AlertTitle>
                  <AlertDescription>
                    Check incoming shipments for updates
                  </AlertDescription>
                </Box>
              </Alert>
            )}
          </SimpleGrid>
        )}

        {/* Quick Stats */}
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4} mb={6}>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Total Items</StatLabel>
                <StatNumber>{totalItems}</StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  8% from last month
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Inventory Value</StatLabel>
                <StatNumber>
                  $
                  {totalValue.toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                  })}
                </StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  12% from last month
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Warehouse Utilization</StatLabel>
                <StatNumber>{utilizationPercentage}%</StatNumber>
                <Progress
                  value={utilizationPercentage}
                  colorScheme={
                    utilizationPercentage > 90
                      ? "red"
                      : utilizationPercentage > 75
                      ? "orange"
                      : "green"
                  }
                  size="sm"
                  mt={2}
                  borderRadius="md"
                />
              </Stat>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Pending Shipments</StatLabel>
                <StatNumber
                  color={processingOutgoing > 0 ? "orange.500" : "green.500"}
                >
                  {processingOutgoing}
                </StatNumber>
                <StatHelpText>
                  {processingOutgoing > 0 ? (
                    <HStack color="orange.500">
                      <Icon as={FiClock} />
                      <Text>Needs processing</Text>
                    </HStack>
                  ) : (
                    <HStack color="green.500">
                      <Icon as={FiCheckCircle} />
                      <Text>All shipments processed</Text>
                    </HStack>
                  )}
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Main Content */}
        <Flex direction={{ base: "column", lg: "row" }} gap={6}>
          {/* Inventory Table */}
          <Box flex={3}>
            <Card>
              <CardHeader bg="warehouse.500" borderTopRadius="md">
                <Flex
                  direction={{ base: "column", md: "row" }}
                  justify="space-between"
                  align="center"
                >
                  <HStack>
                    <Icon as={FiBox} color="white" />
                    <Heading size="md" color="white">
                      Inventory Management
                    </Heading>
                  </HStack>

                  <Flex gap={2} mt={{ base: 3, md: 0 }} wrap="wrap">
                    <InputGroup maxW="300px" size="sm" bg="white">
                      <InputLeftElement pointerEvents="none">
                        <Icon as={FiSearch} color="gray.400" />
                      </InputLeftElement>
                      <Input
                        placeholder="Search by SKU, name, or location..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      \
                    </InputGroup>
                    <Menu>
                      <MenuButton
                        as={Button}
                        size="sm"
                        variant="outline"
                        leftIcon={<FiFilter />}
                        bg="white"
                      >
                        Filters
                      </MenuButton>
                      <MenuList>
                        <MenuItem onClick={() => setSearchTerm("")}>
                          Clear Filters
                        </MenuItem>
                        <MenuItem onClick={() => setActiveTab(2)}>
                          Show Low Stock
                        </MenuItem>
                        <MenuItem onClick={() => setActiveTab(3)}>
                          Show Out of Stock
                        </MenuItem>
                      </MenuList>
                    </Menu>
                    <Button
                      size="sm"
                      variant="outline"
                      leftIcon={<FiDownload />}
                      bg="white"
                    >
                      Export
                    </Button>
                  </Flex>
                </Flex>
              </CardHeader>

              <CardBody p={0}>
                {isLoading ? (
                  <Flex justify="center" align="center" minH="200px">
                    <Spinner size="xl" />
                  </Flex>
                ) : (
                  <Tabs
                    variant="enclosed"
                    onChange={(index) => setActiveTab(index)}
                  >
                    <TabList>
                      <Tab>All Items</Tab>
                      <Tab>In Stock</Tab>
                      <Tab>Low Stock</Tab>
                      <Tab>Out of Stock</Tab>
                      <Tab>Below Min</Tab>
                    </TabList>

                    <TabPanels>
                      {[0, 1, 2, 3, 4].map((tabIndex) => (
                        <TabPanel key={tabIndex} p={0}>
                          <Table variant="striped" size="sm">
                            <Thead>
                              <Tr>
                                <Th>SKU</Th>
                                <Th>Item</Th>
                                <Th>Category</Th>
                                <Th>Location</Th>
                                <Th isNumeric>Quantity</Th>
                                <Th isNumeric>Value</Th>
                                <Th>Status</Th>
                                <Th>Actions</Th>
                              </Tr>
                            </Thead>
                            <Tbody>
                              {filteredInventory.length > 0 ? (
                                filteredInventory.map((item) => (
                                  <Tr key={item.id}>
                                    <Td fontWeight="medium">{item.sku}</Td>
                                    <Td>
                                      <HStack>
                                        {item.image && (
                                          <Avatar
                                            size="sm"
                                            src={item.image}
                                            name={item.name}
                                            bg="warehouse.100"
                                            color="warehouse.700"
                                          />
                                        )}
                                        <Text>{item.name}</Text>
                                      </HStack>
                                    </Td>
                                    <Td>{item.category}</Td>
                                    <Td>
                                      <HStack>
                                        <Text>{item.location}</Text>
                                        <Tooltip label="View location details">
                                          <IconButton
                                            aria-label="View location"
                                            icon={<FiMapPin />}
                                            variant="ghost"
                                            size="xs"
                                            onClick={() =>
                                              handleViewLocation(item.location)
                                            }
                                          />
                                        </Tooltip>
                                      </HStack>
                                    </Td>
                                    <Td isNumeric>
                                      <Flex direction="column">
                                        {item.quantity}
                                        <Text fontSize="xs" color="gray.500">
                                          Min: {item.minStockLevel}
                                        </Text>
                                      </Flex>
                                    </Td>
                                    <Td isNumeric>
                                      $
                                      {(
                                        (item.unitPrice || 10) * item.quantity
                                      ).toFixed(2)}
                                    </Td>
                                    <Td>
                                      <Badge
                                        colorScheme={getStatusColor(
                                          item.status
                                        )}
                                        display="flex"
                                        alignItems="center"
                                        gap={1}
                                        px={2}
                                        py={1}
                                        borderRadius="full"
                                      >
                                        {getStatusIcon(item.status)}
                                        {item.status}
                                      </Badge>
                                    </Td>
                                    <Td>
                                      <Menu>
                                        <MenuButton
                                          as={IconButton}
                                          aria-label="Actions"
                                          icon={<FiMoreVertical />}
                                          variant="ghost"
                                          size="sm"
                                        />
                                        <MenuList>
                                          <MenuItem icon={<FiEdit2 />}>
                                            Edit
                                          </MenuItem>
                                          <MenuItem
                                            icon={<FiArrowUp />}
                                            onClick={() =>
                                              updateItemQuantity(
                                                item.id,
                                                item.quantity + 1
                                              )
                                            }
                                          >
                                            Increase Quantity
                                          </MenuItem>
                                          <MenuItem
                                            icon={<FiArrowDown />}
                                            onClick={() =>
                                              updateItemQuantity(
                                                item.id,
                                                Math.max(0, item.quantity - 1)
                                              )
                                            }
                                          >
                                            Decrease Quantity
                                          </MenuItem>
                                          <MenuItem
                                            icon={<FiIncomingTruck />}
                                            onClick={() => {
                                              setShipmentForm({
                                                ...shipmentForm,
                                                itemId: item.id,
                                                quantity:
                                                  item.minStockLevel.toString(),
                                              });
                                              // Open shipment modal here
                                            }}
                                          >
                                            Create Shipment
                                          </MenuItem>
                                          <MenuItem
                                            icon={<FiTrash2 />}
                                            color="red.500"
                                            onClick={() => deleteItem(item.id)}
                                          >
                                            Delete
                                          </MenuItem>
                                        </MenuList>
                                      </Menu>
                                    </Td>
                                  </Tr>
                                ))
                              ) : (
                                <Tr>
                                  <Td colSpan={8} textAlign="center" py={8}>
                                    <Text color="gray.500">
                                      No inventory items found matching your
                                      criteria
                                    </Text>
                                  </Td>
                                </Tr>
                              )}
                            </Tbody>
                          </Table>
                        </TabPanel>
                      ))}
                    </TabPanels>
                  </Tabs>
                )}
              </CardBody>

              <CardFooter>
                <Flex justify="space-between" w="full">
                  <Text fontSize="sm" color="gray.500">
                    Showing {filteredInventory.length} of {inventory.length}{" "}
                    items
                  </Text>
                  <Button
                    variant="link"
                    colorScheme="warehouse"
                    size="sm"
                    rightIcon={<FiExternalLink />}
                    onClick={() => router.push("/inventory/reports")}
                  >
                    View Detailed Reports
                  </Button>
                </Flex>
              </CardFooter>
            </Card>
          </Box>

          {/* Right Sidebar */}
          <Box flex={1}>
            <VStack spacing={6} align="stretch">
              {/* Quick Actions */}
              <Card>
                <CardHeader bg="warehouse.50">
                  <HStack>
                    <Icon as={FiPackage} color="warehouse.600" />
                    <Heading size="md">Quick Actions</Heading>
                  </HStack>
                </CardHeader>
                <CardBody>
                  <SimpleGrid columns={2} spacing={3}>
                    <Button
                      leftIcon={<FiShoppingCart />}
                      colorScheme="blue"
                      size="sm"
                    >
                      Create PO
                    </Button>
                    <Button
                      leftIcon={<FiIncomingTruck />}
                      colorScheme="orange"
                      size="sm"
                    >
                      Receive Shipment
                    </Button>
                    <Button
                      leftIcon={<FiArrowUp />}
                      colorScheme="green"
                      size="sm"
                    >
                      Pick Items
                    </Button>
                    <Button
                      leftIcon={<FiBarChart2 />}
                      colorScheme="purple"
                      size="sm"
                    >
                      Generate Report
                    </Button>
                  </SimpleGrid>
                </CardBody>
              </Card>

              {/* Incoming Shipments */}
              <Card>
                <CardHeader bg="blue.50">
                  <HStack justify="space-between">
                    <HStack>
                      <Icon as={FiArrowDown} color="blue.500" />
                      <Heading size="md">Incoming Shipments</Heading>
                    </HStack>
                    <Badge colorScheme="blue" borderRadius="full" px={2}>
                      {incoming.length}
                    </Badge>
                  </HStack>
                </CardHeader>
                <CardBody p={0}>
                  <Table size="sm">
                    <Thead>
                      <Tr>
                        <Th>Item</Th>
                        <Th>Qty</Th>
                        <Th>Status</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {incoming.slice(0, 4).map((shipment) => (
                        <Tr key={shipment.id}>
                          <Td>
                            <Tooltip
                              label={`From: ${shipment.from}\nExpected: ${shipment.expectedDate}`}
                            >
                              <Text isTruncated maxW="100px">
                                {shipment.itemName}
                              </Text>
                            </Tooltip>
                          </Td>
                          <Td isNumeric>{shipment.quantity}</Td>
                          <Td>
                            <HStack>
                              <Badge
                                colorScheme={getStatusColor(shipment.status)}
                                px={2}
                                py={1}
                                borderRadius="md"
                              >
                                {shipment.status}
                              </Badge>
                              {shipment.trackingNumber && (
                                <IconButton
                                  aria-label="Track shipment"
                                  icon={<FiExternalLink />}
                                  size="xs"
                                  variant="ghost"
                                  onClick={() =>
                                    handleTrackShipment(
                                      shipment.trackingNumber!,
                                      shipment.carrier
                                    )
                                  }
                                />
                              )}
                            </HStack>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </CardBody>
                <CardFooter>
                  <Button variant="link" colorScheme="blue">
                    View All Shipments
                  </Button>
                </CardFooter>
              </Card>
            </VStack>
          </Box>
        </Flex>
      </Box>

      <Footer />
    </ChakraProvider>
  );
}
