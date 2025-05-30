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

// API service functions
import {
  fetchWarehouses,
  fetchWarehouseInventory,
  fetchComponents,
  fetchProducts,
  fetchBOMs,
  fetchPurchaseOrders,
  fetchPOItems,
  fetchShippingInfo,
  createWarehouseInventory,
  updateWarehouseInventory,
  deleteWarehouseInventory,
  createPurchaseOrder,
  createPOItem,
  createShippingInfo,
} from "../services/api";

// Types matching your backend
import {
  Warehouse as BackendWarehouse,
  WarehouseInventory as BackendWarehouseInventory,
  Component as BackendComponent,
  Product as BackendProduct,
  BOM as BackendBOM,
  PurchaseOrder as BackendPurchaseOrder,
  POItem as BackendPOItem,
  ShippingInfo as BackendShippingInfo,
} from "../../../backend/src/interfaces/index";

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

// UI interfaces that map to backend models
interface InventoryItem {
  id: number;
  componentId: number;
  warehouseId: number;
  currentQty: number;
  incomingQty: number;
  outgoingQty: number;
  component: {
    num: string;
    description: string;
    supplierPartNumber: string;
    supplier: {
      name: string;
    };
  };
  warehouse: {
    name: string;
    location: string;
  };
}

interface IncomingShipment {
  id: number;
  poId: number;
  componentId: number;
  qty: number;
  origin: string;
  destination: string;
  carrier: string;
  trackingNumber: string;
  estimatedArrival: string;
  status: "In Transit" | "Delayed" | "Arrived" | "Processing";
  component: {
    description: string;
  };
  purchaseOrder: {
    supplier: {
      name: string;
    };
  };
}

interface OutgoingShipment {
  id: number;
  poId: number;
  componentId: number;
  qty: number;
  to: string;
  orderNumber: string;
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled";
  shippingDate: string;
  trackingNumber?: string;
  component: {
    description: string;
  };
}

interface WarehouseLocation {
  id: number;
  name: string;
  location: string;
  organizationId: number;
  capacity?: number;
  currentOccupancy?: number;
}

export default function WarehousePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [incoming, setIncoming] = useState<IncomingShipment[]>([]);
  const [outgoing, setOutgoing] = useState<OutgoingShipment[]>([]);
  const [locations, setLocations] = useState<WarehouseLocation[]>([]);
  const [components, setComponents] = useState<BackendComponent[]>([]);
  const [products, setProducts] = useState<BackendProduct[]>([]);
  const [boms, setBoms] = useState<BackendBOM[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<BackendPurchaseOrder[]>(
    []
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Form states
  const [formData, setFormData] = useState({
    componentId: "",
    warehouseId: "",
    currentQty: "",
    incomingQty: "",
    outgoingQty: "",
  });

  const [shipmentForm, setShipmentForm] = useState({
    type: "incoming",
    componentId: "",
    quantity: "",
    toFrom: "",
    expectedDate: "",
    carrier: "",
    trackingNumber: "",
  });

  // Load data from backend
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        // Fetch all necessary data
        const [
          warehouses,
          warehouseInventory,
          allComponents,
          allProducts,
          allBoms,
          pos,
          shippingInfos,
        ] = await Promise.all([
          fetchWarehouses(),
          fetchWarehouseInventory(),
          fetchComponents(),
          fetchProducts(),
          fetchBOMs(),
          fetchPurchaseOrders(),
          fetchShippingInfo(),
        ]);

        // Set basic data
        setLocations(warehouses);
        setComponents(allComponents);
        setProducts(allProducts);
        setBoms(allBoms);
        setPurchaseOrders(pos);

        // Map warehouse inventory to UI format
        const mappedInventory = warehouseInventory.map(
          (item: BackendWarehouseInventory) => ({
            id: item.id,
            componentId: item.componentId,
            warehouseId: item.warehouseId,
            currentQty: item.current_qty,
            incomingQty: item.incoming_qty,
            outgoingQty: item.outgoing_qty,
            component: {
              num: item.component?.num || "",
              description: item.component?.description || "",
              supplierPartNumber: item.component?.supplier_part_number || "",
              supplier: {
                name: item.component?.supplier?.name || "Unknown",
              },
            },
            warehouse: {
              name: item.warehouse?.name || "Unknown",
              location: item.warehouse?.location || "",
            },
          })
        );

        setInventory(mappedInventory);

        // Map incoming shipments (from shipping info)
        const mappedIncoming = shippingInfos.map(
          (shipment: BackendShippingInfo) => ({
            id: shipment.id,
            poId: shipment.poId,
            componentId: shipment.componentId,
            qty: shipment.qty,
            origin: shipment.origin,
            destination: shipment.destination,
            carrier: shipment.carrier,
            trackingNumber: shipment.tracking_number || "",
            estimatedArrival: shipment.estimated_arrival,
            status: shipment.status as
              | "In Transit"
              | "Delayed"
              | "Arrived"
              | "Processing",
            component: {
              description: shipment.component?.description || "",
            },
            purchaseOrder: {
              supplier: {
                name: shipment.po?.supplier?.name || "Unknown",
              },
            },
          })
        );

        setIncoming(mappedIncoming);

        // For outgoing shipments, you might need to create a different mapping
        // based on your business logic. This is a placeholder:
        setOutgoing([]); // You'll need to implement this based on your data
      } catch (error) {
        console.error("Failed to load data:", error);
        toast({
          title: "Error",
          description: "Failed to load warehouse data",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newInventory: Omit<BackendWarehouseInventory, "id"> = {
        componentId: parseInt(formData.componentId),
        warehouseId: parseInt(formData.warehouseId),
        current_qty: parseInt(formData.currentQty) || 0,
        incoming_qty: parseInt(formData.incomingQty) || 0,
        outgoing_qty: parseInt(formData.outgoingQty) || 0,
      };

      const createdItem = await createWarehouseInventory(newInventory);

      // Update local state with the new item
      const component = components.find(
        (c) => c.id === parseInt(formData.componentId)
      );
      const warehouse = locations.find(
        (w) => w.id === parseInt(formData.warehouseId)
      );

      if (component && warehouse) {
        setInventory((prev) => [
          ...prev,
          {
            id: createdItem.id,
            componentId: createdItem.componentId,
            warehouseId: createdItem.warehouseId,
            currentQty: createdItem.current_qty,
            incomingQty: createdItem.incoming_qty,
            outgoingQty: createdItem.outgoing_qty,
            component: {
              num: component.num,
              description: component.description,
              supplierPartNumber: component.supplier_part_number || "",
              supplier: {
                name: component.supplier?.name || "Unknown",
              },
            },
            warehouse: {
              name: warehouse.name,
              location: warehouse.location,
            },
          },
        ]);
      }

      setFormData({
        componentId: "",
        warehouseId: "",
        currentQty: "",
        incomingQty: "",
        outgoingQty: "",
      });
      onClose();

      toast({
        title: "Item Added",
        description: "New inventory item has been added",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Failed to create inventory item:", error);
      toast({
        title: "Error",
        description: "Failed to add inventory item",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleShipmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (shipmentForm.type === "incoming") {
        // Create a new purchase order for the incoming shipment
        const newPO: Omit<BackendPurchaseOrder, "id"> = {
          supplierId:
            components.find((c) => c.id === parseInt(shipmentForm.componentId))
              ?.supplierId || 0,
          createdById: 1, // TODO: Replace with actual user ID
          status: "Ordered",
          date_created: new Date().toISOString(),
          date_expected: shipmentForm.expectedDate,
        };

        const createdPO = await createPurchaseOrder(newPO);

        // Create PO item
        const newPOItem: Omit<BackendPOItem, "id"> = {
          poId: createdPO.id,
          componentId: parseInt(shipmentForm.componentId),
          ordered_qty: parseInt(shipmentForm.quantity) || 0,
          received_qty: 0,
          unit_cost: 0, // TODO: Get actual unit cost
        };

        const createdPOItem = await createPOItem(newPOItem);

        // Create shipping info
        const newShippingInfo: Omit<BackendShippingInfo, "id"> = {
          poId: createdPO.id,
          componentId: parseInt(shipmentForm.componentId),
          qty: parseInt(shipmentForm.quantity) || 0,
          origin: shipmentForm.toFrom,
          destination: "Warehouse", // TODO: Get actual warehouse
          carrier: shipmentForm.carrier,
          tracking_number: shipmentForm.trackingNumber,
          estimated_arrival: shipmentForm.expectedDate,
          status: "Processing",
          po: undefined
        };

        const createdShippingInfo = await createShippingInfo(newShippingInfo);

        // Update local state
        const component = components.find(
          (c) => c.id === parseInt(shipmentForm.componentId)
        );
        if (component) {
          setIncoming((prev) => [
            ...prev,
            {
              id: createdShippingInfo.id,
              poId: createdShippingInfo.poId,
              componentId: createdShippingInfo.componentId,
              qty: createdShippingInfo.qty,
              origin: createdShippingInfo.origin,
              destination: createdShippingInfo.destination,
              carrier: createdShippingInfo.carrier,
              trackingNumber: createdShippingInfo.tracking_number || "",
              estimatedArrival: createdShippingInfo.estimated_arrival,
              status: createdShippingInfo.status as
                | "In Transit"
                | "Delayed"
                | "Arrived"
                | "Processing",
              component: {
                description: component.description,
              },
              purchaseOrder: {
                supplier: {
                  name: createdPO.supplier?.name || "Unknown",
                },
              },
            },
          ]);
        }
      } else {
        // Handle outgoing shipment creation
        // TODO: Implement outgoing shipment creation
      }

      setShipmentForm({
        type: "incoming",
        componentId: "",
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
    } catch (error) {
      console.error("Failed to create shipment:", error);
      toast({
        title: "Error",
        description: "Failed to create shipment",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const deleteItem = async (id: number) => {
    try {
      await deleteWarehouseInventory(id);
      setInventory((prev) => prev.filter((item) => item.id !== id));
      toast({
        title: "Item Deleted",
        description: "The item has been removed from inventory",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Failed to delete inventory item:", error);
      toast({
        title: "Error",
        description: "Failed to delete inventory item",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const updateItemQuantity = async (id: number, newQuantity: number) => {
    try {
      const itemToUpdate = inventory.find((item) => item.id === id);
      if (!itemToUpdate) return;

      const updatedItem = await updateWarehouseInventory(id, {
        componentId: itemToUpdate.componentId,
        warehouseId: itemToUpdate.warehouseId,
        current_qty: newQuantity,
        incoming_qty: itemToUpdate.incomingQty,
        outgoing_qty: itemToUpdate.outgoingQty,
      });

      setInventory((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                currentQty: updatedItem.current_qty,
              }
            : item
        )
      );
    } catch (error) {
      console.error("Failed to update inventory quantity:", error);
      toast({
        title: "Error",
        description: "Failed to update inventory quantity",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
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

  // Calculate inventory status based on quantity (simplified)
  const getInventoryStatus = (item: InventoryItem) => {
    // TODO: Replace with actual logic based on your business rules
    if (item.currentQty <= 0) return "Out of Stock";
    if (item.currentQty < 10) return "Low Stock"; // Assuming 10 is the threshold
    return "In Stock";
  };

  // Filter inventory based on search and active tab
  const filteredInventory = inventory
    .filter((item) => {
      const matchesSearch =
        item.component.description
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        item.component.num.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.warehouse.name.toLowerCase().includes(searchTerm.toLowerCase());

      const status = getInventoryStatus(item);
      let matchesTab = true;
      switch (activeTab) {
        case 0:
          matchesTab = true;
          break; // All
        case 1:
          matchesTab = status === "In Stock";
          break;
        case 2:
          matchesTab = status === "Low Stock";
          break;
        case 3:
          matchesTab = status === "Out of Stock";
          break;
        case 4:
          matchesTab = item.currentQty < 10; // Assuming 10 is the min threshold
          break;
      }

      return matchesSearch && matchesTab;
    })
    .sort((a, b) =>
      a.component.description.localeCompare(b.component.description)
    );

  // Calculate inventory metrics
  const totalItems = inventory.length;
  const lowStockItems = inventory.filter(
    (item) => getInventoryStatus(item) === "Low Stock"
  ).length;
  const outOfStockItems = inventory.filter(
    (item) => getInventoryStatus(item) === "Out of Stock"
  ).length;

  // Shipment metrics
  const delayedIncoming = incoming.filter(
    (shipment) => shipment.status === "Delayed"
  ).length;
  const processingOutgoing = outgoing.filter(
    (shipment) => shipment.status === "Processing"
  ).length;

  // Location utilization (simplified)
  const utilizationPercentage = 75; // TODO: Calculate based on actual data

  const refreshData = async () => {
    setIsLoading(true);
    try {
      // Refetch all data
      const [warehouseInventory, shippingInfos] = await Promise.all([
        fetchWarehouseInventory(),
        fetchShippingInfo(),
      ]);

      // Map warehouse inventory to UI format
      const mappedInventory = warehouseInventory.map(
        (item: BackendWarehouseInventory) => ({
          id: item.id,
          componentId: item.componentId,
          warehouseId: item.warehouseId,
          currentQty: item.current_qty,
          incomingQty: item.incoming_qty,
          outgoingQty: item.outgoing_qty,
          component: {
            num: item.component?.num || "",
            description: item.component?.description || "",
            supplierPartNumber: item.component?.supplier_part_number || "",
            supplier: {
              name: item.component?.supplier?.name || "Unknown",
            },
          },
          warehouse: {
            name: item.warehouse?.name || "Unknown",
            location: item.warehouse?.location || "",
          },
        })
      );

      setInventory(mappedInventory);

      // Map incoming shipments
      const mappedIncoming = shippingInfos.map(
        (shipment: BackendShippingInfo) => ({
          id: shipment.id,
          poId: shipment.poId,
          componentId: shipment.componentId,
          qty: shipment.qty,
          origin: shipment.origin,
          destination: shipment.destination,
          carrier: shipment.carrier,
          trackingNumber: shipment.tracking_number || "",
          estimatedArrival: shipment.estimated_arrival,
          status: shipment.status as
            | "In Transit"
            | "Delayed"
            | "Arrived"
            | "Processing",
          component: {
            description: shipment.component?.description || "",
          },
          purchaseOrder: {
            supplier: {
              name: shipment.po?.supplier?.name || "Unknown",
            },
          },
        })
      );

      setIncoming(mappedIncoming);

      toast({
        title: "Data Refreshed",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Failed to refresh data:", error);
      toast({
        title: "Error",
        description: "Failed to refresh data",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTrackShipment = (trackingNumber: string, carrier: string) => {
    toast({
      title: "Tracking Information",
      description: `Opening tracking page for ${carrier} #${trackingNumber}`,
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleViewLocation = (locationId: number) => {
    const location = locations.find((loc) => loc.id === locationId);
    if (location) {
      toast({
        title: `Location: ${location.name}`,
        description: `Location: ${location.location}`,
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
                  $0 {/* TODO: Calculate based on component values */}
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
                        placeholder="Search by component, part number, or location..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
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
                                <Th>Part Number</Th>
                                <Th>Description</Th>
                                <Th>Supplier</Th>
                                <Th>Warehouse</Th>
                                <Th isNumeric>Quantity</Th>
                                <Th>Status</Th>
                                <Th>Actions</Th>
                              </Tr>
                            </Thead>
                            <Tbody>
                              {filteredInventory.length > 0 ? (
                                filteredInventory.map((item) => {
                                  const status = getInventoryStatus(item);
                                  return (
                                    <Tr key={item.id}>
                                      <Td fontWeight="medium">
                                        {item.component.num}
                                      </Td>
                                      <Td>
                                        <HStack>
                                          <Avatar
                                            size="sm"
                                            name={item.component.description}
                                            bg="warehouse.100"
                                            color="warehouse.700"
                                          />
                                          <Text>
                                            {item.component.description}
                                          </Text>
                                        </HStack>
                                      </Td>
                                      <Td>{item.component.supplier.name}</Td>
                                      <Td>
                                        <HStack>
                                          <Text>{item.warehouse.name}</Text>
                                          <Tooltip label="View location details">
                                            <IconButton
                                              aria-label="View location"
                                              icon={<FiMapPin />}
                                              variant="ghost"
                                              size="xs"
                                              onClick={() =>
                                                handleViewLocation(
                                                  item.warehouseId
                                                )
                                              }
                                            />
                                          </Tooltip>
                                        </HStack>
                                      </Td>
                                      <Td isNumeric>{item.currentQty}</Td>
                                      <Td>
                                        <Badge
                                          colorScheme={getStatusColor(status)}
                                          display="flex"
                                          alignItems="center"
                                          gap={1}
                                          px={2}
                                          py={1}
                                          borderRadius="full"
                                        >
                                          {getStatusIcon(status)}
                                          {status}
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
                                                  item.currentQty + 1
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
                                                  Math.max(
                                                    0,
                                                    item.currentQty - 1
                                                  )
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
                                                  componentId:
                                                    item.componentId.toString(),
                                                  quantity: "10", // Default quantity
                                                });
                                                // Open shipment modal here
                                              }}
                                            >
                                              Create Shipment
                                            </MenuItem>
                                            <MenuItem
                                              icon={<FiTrash2 />}
                                              color="red.500"
                                              onClick={() =>
                                                deleteItem(item.id)
                                              }
                                            >
                                              Delete
                                            </MenuItem>
                                          </MenuList>
                                        </Menu>
                                      </Td>
                                    </Tr>
                                  );
                                })
                              ) : (
                                <Tr>
                                  <Td colSpan={7} textAlign="center" py={8}>
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
                              label={`From: ${shipment.purchaseOrder.supplier.name}\nExpected: ${shipment.estimatedArrival}`}
                            >
                              <Text isTruncated maxW="100px">
                                {shipment.component.description}
                              </Text>
                            </Tooltip>
                          </Td>
                          <Td isNumeric>{shipment.qty}</Td>
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
                                      shipment.trackingNumber,
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

      {/* Add Inventory Item Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Inventory Item</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit}>
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Component</FormLabel>
                  <Select
                    name="componentId"
                    value={formData.componentId}
                    onChange={handleInputChange}
                    placeholder="Select component"
                  >
                    {components.map((component) => (
                      <option key={component.id} value={component.id}>
                        {component.num} - {component.description}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Warehouse</FormLabel>
                  <Select
                    name="warehouseId"
                    value={formData.warehouseId}
                    onChange={handleInputChange}
                    placeholder="Select warehouse"
                  >
                    {locations.map((location) => (
                      <option key={location.id} value={location.id}>
                        {location.name} - {location.location}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Current Quantity</FormLabel>
                  <NumberInput
                    min={0}
                    value={formData.currentQty}
                    onChange={(value) =>
                      setFormData({ ...formData, currentQty: value })
                    }
                  >
                    <NumberInputField name="currentQty" />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>

                <FormControl>
                  <FormLabel>Incoming Quantity</FormLabel>
                  <NumberInput
                    min={0}
                    value={formData.incomingQty}
                    onChange={(value) =>
                      setFormData({ ...formData, incomingQty: value })
                    }
                  >
                    <NumberInputField name="incomingQty" />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>

                <FormControl>
                  <FormLabel>Outgoing Quantity</FormLabel>
                  <NumberInput
                    min={0}
                    value={formData.outgoingQty}
                    onChange={(value) =>
                      setFormData({ ...formData, outgoingQty: value })
                    }
                  >
                    <NumberInputField name="outgoingQty" />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="warehouse" type="submit">
                Add Item
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </ChakraProvider>
  );
}
