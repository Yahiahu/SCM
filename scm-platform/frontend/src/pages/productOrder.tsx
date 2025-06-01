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
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Badge,
  HStack,
  Icon,
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
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tag,
  Avatar,
  AvatarGroup,
  Link,
  InputGroup,
  InputLeftElement,
  Spinner, // Import Spinner for loading state
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
  FiDollarSign,
  FiTruck,
  FiEdit2,
  FiTrash2,
  FiMoreVertical,
  FiFileText,
  FiShoppingCart,
  FiCheck,
  FiX,
} from "react-icons/fi";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { useState, useEffect } from "react";
import {
  fetchPurchaseOrders,
  fetchSuppliers,
  fetchUsers,
  fetchPOItemsByPOId,
  createPurchaseOrder,
  deletePurchaseOrder,
  updatePurchaseOrder,
} from "../services/api"; // Adjust path as needed
import {
  PurchaseOrder as BackendPurchaseOrder,
  Supplier as BackendSupplier,
  User as BackendUser,
  POItem as BackendPOItem,
  Component as BackendComponent, // Import BackendComponent for POItem mapping
} from "../../../backend/src/interfaces/index"; // Adjust path as needed

// Custom theme for PO dashboard
const theme = extendTheme({
  colors: {
    po: {
      50: "#f0f9ff",
      100: "#e0f2fe",
      200: "#bae6fd",
      300: "#7dd3fc",
      400: "#38bdf8",
      500: "#0ea5e9",
      600: "#0284c7",
      700: "#0369a1",
      800: "#075985",
      900: "#0c4a6e",
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
          bg: "po.500",
          color: "white",
          _hover: {
            bg: "po.600",
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
                  background: "po.50",
                },
              },
            },
          },
        },
      },
    },
  },
});

// UI specific interfaces (can derive from backend interfaces)
interface Vendor {
  id: number;
  name: string;
  contact: string; // This might be contact_email from backend
  rating: number;
}

interface POItem {
  id: number;
  component: string; // This would be component.description from backend
  quantity: number; // This would be ordered_qty from backend
  unitPrice: number; // This would be unit_cost from backend
  total: number; // Calculated
}

interface PurchaseOrder {
  id: number; // Backend ID
  poNumber: string; // Derived or from backend
  vendor: Vendor;
  items: POItem[];
  totalAmount: number; // Calculated
  dateCreated: string; // From backend date_created
  dateDue: string; // From backend date_expected
  status:
    | "Draft"
    | "Submitted" // UI specific status, not directly from backend
    | "Approved" // UI specific status, not directly from backend
    | "Ordered"
    | "Delivered" // UI specific status, maps to Backend 'Received'
    | "Paid" // UI specific status, derived
    | "Cancelled";
  paymentStatus: "Unpaid" | "Partially Paid" | "Fully Paid"; // Derived
  assignedTo: string; // From backend createdBy.username
  notes: string; // Assuming notes can be in PO model, and required for UI
}

export default function PurchaseOrderDashboard() {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const [suppliers, setSuppliers] = useState<BackendSupplier[]>([]); // Backend suppliers
  const [users, setUsers] = useState<BackendUser[]>([]); // Backend users

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Form state for creating new PO
  const [formData, setFormData] = useState({
    supplierId: "", // Matches backend supplierId
    date_expected: "", // Matches backend date_expected
    createdById: "", // Matches backend createdById
    notes: "", // Placeholder for notes field
    status: "Draft" as const, // Default status for new PO in backend
    poItems: [] as { componentId: number; ordered_qty: number; unit_cost: number }[], // For items
  });

  // Helper function to map backend PO to UI PO
  const mapBackendPOToUIPO = async (
    po: BackendPurchaseOrder,
    fetchedSuppliers: BackendSupplier[],
    fetchedUsers: BackendUser[]
  ): Promise<PurchaseOrder> => {
    const supplier = fetchedSuppliers.find((s) => s.id === po.supplierId);
    const createdByUser = fetchedUsers.find((u) => u.id === po.createdById);
    const poItems = await fetchPOItemsByPOId(po.id); // Fetch PO items for each PO

    const mappedItems: POItem[] = poItems.map((item: BackendPOItem) => ({
      id: item.id,
      // Safely access component.description, handle cases where component might be undefined
      component: item.component?.description || "Unknown Component",
      quantity: item.ordered_qty,
      unitPrice: item.unit_cost,
      total: item.ordered_qty * item.unit_cost,
    }));

    const totalAmount = mappedItems.reduce(
      (sum, item) => sum + item.total,
      0
    );

    // Determine UI status and payment status based on backend data
    let uiStatus: PurchaseOrder["status"];
    let paymentStatus: PurchaseOrder["paymentStatus"] = "Unpaid";

    // IMPORTANT: Align these mappings with your actual backend status lifecycle
    // and how you want to represent "Submitted", "Approved", "Paid" in the UI.
    if (po.status === "Received") {
      uiStatus = "Delivered";
      paymentStatus = "Fully Paid"; // Assuming 'Received' implies 'Fully Paid' for simplicity
    } else if (po.status === "Ordered") {
      uiStatus = "Ordered";
      // This is where you'd check actual payment records if available
      // For now, if it's 'Ordered' but not 'Received', it's unpaid.
      paymentStatus = "Unpaid";
    } else if (po.status === "Approved") {
      uiStatus = "Approved"; // If your backend has 'Approved' as a distinct status
    } else if (po.status === "Draft") {
      uiStatus = "Draft";
    } else if (po.status === "Cancelled") {
      uiStatus = "Cancelled";
    }
    // If backend only has 'Draft', 'Ordered', 'Received', 'Cancelled', and UI needs 'Submitted',
    // then 'Submitted' might be a 'Draft' that has been "sent" but not yet 'Ordered' by backend.
    else {
      uiStatus = "Submitted"; // Default or fallback for intermediate states
    }


    return {
      id: po.id,
      poNumber: `PO-${po.id.toString().padStart(3, "0")}`, // Derived from backend ID
      vendor: {
        id: supplier?.id || 0,
        name: supplier?.name || "Unknown Supplier",
        contact: supplier?.contact_email || "N/A",
        rating: supplier?.rating || 0,
      },
      items: mappedItems,
      totalAmount: totalAmount,
      dateCreated: po.date_created,
      dateDue: po.date_expected,
      status: uiStatus,
      paymentStatus: paymentStatus, // This needs actual logic based on your backend
      assignedTo: createdByUser?.username || "N/A",
      notes: po.notes || "", // Ensure notes is handled, default to empty string if null/undefined
    };
  };

  // Fetch data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch master data first
        const fetchedSuppliers = await fetchSuppliers();
        setSuppliers(fetchedSuppliers);

        const fetchedUsers = await fetchUsers();
        setUsers(fetchedUsers);

        // Fetch purchase orders
        const fetchedPOs = await fetchPurchaseOrders();

        // Process POs to match UI interface
        const processedPOs: PurchaseOrder[] = await Promise.all(
          fetchedPOs.map((po) => mapBackendPOToUIPO(po, fetchedSuppliers, fetchedUsers))
        );
        setPurchaseOrders(processedPOs);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []); // Empty dependency array means this runs once on mount

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreatePO = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Map UI form data to backend expected format
      const newPODto: Partial<BackendPurchaseOrder> = {
        supplierId: parseInt(formData.supplierId),
        date_expected: formData.date_expected,
        createdById: parseInt(formData.createdById),
        status: formData.status as BackendPurchaseOrder["status"], // Ensure status is a valid BackendPurchaseOrder status
        notes: formData.notes,
        // If your backend supports nested creation of po_items, include them here.
        // Otherwise, you'd create the PO first, then add items in subsequent calls.
        // poItems: formData.poItems,
      };

      const createdPO = await createPurchaseOrder(newPODto);

      // Re-fetch all data to ensure UI is up-to-date, including new PO and its potential items
      const fetchedPOs = await fetchPurchaseOrders();
      const processedPOs: PurchaseOrder[] = await Promise.all(
        fetchedPOs.map((po) => mapBackendPOToUIPO(po, suppliers, users))
      );
      setPurchaseOrders(processedPOs);

      setFormData({
        supplierId: "",
        date_expected: "",
        createdById: "",
        notes: "",
        status: "Draft",
        poItems: [],
      });
      onClose();

      toast({
        title: "PO Created",
        description: `Purchase Order PO-${createdPO.id
          .toString()
          .padStart(3, "0")} has been created`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.error("Failed to create PO:", err);
      toast({
        title: "Error Creating PO",
        description: "Failed to create purchase order. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeletePO = async (id: number) => {
    try {
      await deletePurchaseOrder(id);
      setPurchaseOrders((prev) => prev.filter((po) => po.id !== id));
      toast({
        title: "PO Deleted",
        description: "The purchase order has been removed",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.error("Failed to delete PO:", err);
      toast({
        title: "Error Deleting PO",
        description: "Failed to delete purchase order. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleUpdatePOStatus = async (
    id: number,
    newUIStatus: PurchaseOrder["status"] // Parameter is UI status
  ) => {
    try {
      let backendStatus: BackendPurchaseOrder["status"];

      // Map UI status to backend status
      switch (newUIStatus) {
        case "Draft":
          backendStatus = "Draft";
          break;
        case "Submitted":
        case "Approved":
          backendStatus = "Approved"; // Assuming "Submitted" and "Approved" map to "Approved" on backend or a specific 'Ordered' state
          break;
        case "Ordered":
          backendStatus = "Ordered";
          break;
        case "Delivered":
          backendStatus = "Received"; // UI "Delivered" maps to backend "Received"
          break;
        case "Cancelled":
          backendStatus = "Cancelled";
          break;
        case "Paid":
            // This is a UI-only status. Your backend would need a separate payment status.
            // For now, if you "mark as paid" in UI, it might imply "Received" on backend.
            backendStatus = "Received"; // Simplification
            break;
        default:
          backendStatus = "Draft"; // Fallback
          break;
      }

      await updatePurchaseOrder(id, { status: backendStatus });

      setPurchaseOrders((prev) =>
        prev.map((po) =>
          po.id === id ? { ...po, status: newUIStatus } : po // Update with new UI status
        )
      );
      toast({
        title: "Status Updated",
        description: `PO status changed to ${newUIStatus}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.error("Failed to update PO status:", err);
      toast({
        title: "Error Updating Status",
        description: "Failed to update purchase order status. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Draft":
        return "gray";
      case "Submitted":
        return "blue";
      case "Approved":
        return "teal";
      case "Ordered":
        return "orange";
      case "Delivered":
        return "green";
      case "Paid":
        return "purple";
      case "Cancelled":
        return "red";
      default:
        return "gray";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Draft":
        return <Icon as={FiFileText} />;
      case "Submitted":
      case "Approved":
        return <Icon as={FiCheck} />;
      case "Ordered":
        return <Icon as={FiShoppingCart} />;
      case "Delivered":
        return <Icon as={FiTruck} />;
      case "Paid":
        return <Icon as={FiDollarSign} />;
      case "Cancelled":
        return <Icon as={FiX} />;
      default:
        return null;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "Fully Paid":
        return "green";
      case "Partially Paid":
        return "orange";
      case "Unpaid":
        return "red";
      default:
        return "gray";
    }
  };

  // Filter POs based on active tab
  const filteredPOs = purchaseOrders
    .filter((po) => {
      // Search filter
      const matchesSearch =
        po.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        po.vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        po.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());

      // Status filter based on active tab
      let matchesTab = true;
      switch (activeTab) {
        case 0:
          matchesTab = true;
          break; // All
        case 1:
          matchesTab = po.status === "Draft";
          break;
        case 2:
          matchesTab = po.status === "Submitted" || po.status === "Approved";
          break;
        case 3:
          matchesTab = po.status === "Ordered";
          break;
        case 4:
          matchesTab = po.status === "Delivered";
          break;
        case 5:
          matchesTab = po.paymentStatus !== "Fully Paid";
          break;
      }

      return matchesSearch && matchesTab;
    })
    .sort(
      (a, b) =>
        new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime()
    );

  // Calculate dashboard metrics
  const totalPOs = purchaseOrders.length;
  const totalValue = purchaseOrders.reduce(
    (sum, po) => sum + po.totalAmount,
    0
  );
  const unpaidValue = purchaseOrders
    .filter((po) => po.paymentStatus !== "Fully Paid")
    .reduce((sum, po) => sum + po.totalAmount, 0);
  const pendingApproval = purchaseOrders.filter(
    (po) => po.status === "Submitted" || po.status === "Approved"
  ).length;
  const overduePOs = purchaseOrders.filter(
    (po) =>
      new Date(po.dateDue) < new Date() &&
      po.status !== "Delivered" &&
      po.status !== "Paid"
  ).length;

  if (loading) {
    return (
      <ChakraProvider theme={theme}>
        <Navbar isLoggedIn={true} />
        <Flex justify="center" align="center" minH="calc(100vh - 128px)">
          <Spinner size="xl" color="po.500" />
          <Text ml={4}>Loading purchase orders...</Text>
        </Flex>
        <Footer />
      </ChakraProvider>
    );
  }

  if (error) {
    return (
      <ChakraProvider theme={theme}>
        <Navbar isLoggedIn={true} />
        <Flex
          justify="center"
          align="center"
          minH="calc(100vh - 128px)"
          direction="column"
        >
          <Icon as={FiAlertTriangle} boxSize={12} color="red.500" />
          <Heading size="lg" mt={4} color="red.600">
            Error Loading Data
          </Heading>
          <Text mt={2} color="gray.600">
            {error}
          </Text>
          <Button mt={6} onClick={() => window.location.reload()}>
            Reload Page
          </Button>
        </Flex>
        <Footer />
      </ChakraProvider>
    );
  }

  return (
    <>
      <ChakraProvider theme={theme}>
        <Navbar isLoggedIn={true} />

        <Box pt={20} px={6} bg="gray.50" minH="calc(100vh - 128px)">
          {/* Header and Actions */}
          <Flex justify="space-between" align="center" mb={6}>
            <Heading size="xl" color="gray.800">
              Purchase Order Dashboard
            </Heading>

            <Button colorScheme="po" leftIcon={<FiPlus />} onClick={onOpen}>
              Create PO
            </Button>
          </Flex>

          {/* Quick Stats */}
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4} mb={6}>
            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>Total POs</StatLabel>
                  <StatNumber>{totalPOs}</StatNumber>
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
                  <StatLabel>Total Value</StatLabel>
                  <StatNumber>${totalValue.toLocaleString()}</StatNumber>
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
                  <StatLabel>Pending Approval</StatLabel>
                  <StatNumber>{pendingApproval}</StatNumber>
                  <StatHelpText>
                    {pendingApproval > 0 ? (
                      <HStack color="orange.500">
                        <Icon as={FiAlertTriangle} />
                        <Text>Action needed</Text>
                      </HStack>
                    ) : (
                      <HStack color="green.500">
                        <Icon as={FiCheckCircle} />
                        <Text>All clear</Text>
                      </HStack>
                    )}
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <Stat>
                  <StatLabel>Unpaid Amount</StatLabel>
                  <StatNumber color={unpaidValue > 0 ? "red.500" : "green.500"}>
                    ${unpaidValue.toLocaleString()}
                  </StatNumber>
                  <StatHelpText>
                    {unpaidValue > 0 ? (
                      <HStack color="red.500">
                        <Icon as={FiAlertTriangle} />
                        <Text>Payment pending</Text>
                      </HStack>
                    ) : (
                      <HStack color="green.500">
                        <Icon as={FiCheckCircle} />
                        <Text>All paid</Text>
                      </HStack>
                    )}
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </SimpleGrid>

          {/* Main Content */}
          <Card>
            <CardHeader bg="po.50" borderTopRadius="md">
              <Flex
                direction={{ base: "column", md: "row" }}
                justify="space-between"
                align="center"
              >
                <HStack>
                  <Icon as={FiShoppingCart} color="black" />
                  <Heading size="md" color="black">
                    Purchase Orders
                  </Heading>
                </HStack>

                <Flex gap={2} mt={{ base: 3, md: 0 }} wrap="wrap">
                  <InputGroup maxW="300px" size="sm" bg="white">
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FiSearch} color="gray.400" />
                    </InputLeftElement>
                    <Input
                      placeholder="Search POs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </InputGroup>
                  <Button
                    size="sm"
                    variant="outline"
                    leftIcon={<FiFilter />}
                    bg="white"
                  >
                    Advanced
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    leftIcon={<FiDownload />}
                    bg="white"
                  >
                    Export
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    leftIcon={<FiPrinter />}
                    bg="white"
                  >
                    Print
                  </Button>
                </Flex>
              </Flex>
            </CardHeader>

            <CardBody p={0}>
              <Tabs
                variant="enclosed"
                onChange={(index) => setActiveTab(index)}
              >
                <TabList>
                  <Tab>All POs</Tab>
                  <Tab>Drafts</Tab>
                  <Tab>Pending Approval</Tab>
                  <Tab>Ordered</Tab>
                  <Tab>Delivered</Tab>
                  <Tab>Unpaid</Tab>
                </TabList>

                <TabPanels>
                  {[0, 1, 2, 3, 4, 5].map((tabIndex) => (
                    <TabPanel key={tabIndex} p={0}>
                      <Table variant="striped" size="sm">
                        <Thead>
                          <Tr>
                            <Th>PO Number</Th>
                            <Th>Vendor</Th>
                            <Th>Items</Th>
                            <Th isNumeric>Amount</Th>
                            <Th>Due Date</Th>
                            <Th>Status</Th>
                            <Th>Payment</Th>
                            <Th>Assigned</Th>
                            <Th>Actions</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {filteredPOs.length > 0 ? (
                            filteredPOs.map((po) => (
                              <Tr key={po.id}>
                                <Td fontWeight="medium">
                                  <Link
                                    href={`/purchase-orders/${po.id}`}
                                    color="po.600"
                                  >
                                    {po.poNumber}
                                  </Link>
                                </Td>
                                <Td>
                                  <Text fontWeight="medium">
                                    {po.vendor.name}
                                  </Text>
                                  <Text fontSize="sm" color="gray.500">
                                    {po.vendor.contact}
                                  </Text>
                                </Td>
                                <Td>
                                  <AvatarGroup size="sm" max={3}>
                                    {po.items.map((item) => (
                                      <Avatar
                                        key={item.id}
                                        name={item.component}
                                        bg="po.100"
                                        color="po.700"
                                      />
                                    ))}
                                  </AvatarGroup>
                                  <Text fontSize="sm" mt={1}>
                                    {po.items.length} item
                                    {po.items.length !== 1 ? "s" : ""}
                                  </Text>
                                </Td>
                                <Td isNumeric fontWeight="medium">
                                  ${po.totalAmount.toLocaleString()}
                                </Td>
                                <Td>
                                  <Text>{po.dateDue}</Text>
                                  {new Date(po.dateDue) < new Date() &&
                                    po.status !== "Delivered" &&
                                    po.status !== "Paid" && (
                                      <Tag size="sm" colorScheme="red" mt={1}>
                                        Overdue
                                      </Tag>
                                    )}
                                </Td>
                                <Td>
                                  <Badge
                                    colorScheme={getStatusColor(po.status)}
                                    display="flex"
                                    alignItems="center"
                                    gap={1}
                                    px={2}
                                    py={1}
                                    borderRadius="full"
                                  >
                                    {getStatusIcon(po.status)}
                                    {po.status}
                                  </Badge>
                                </Td>
                                <Td>
                                  <Badge
                                    colorScheme={getPaymentStatusColor(
                                      po.paymentStatus
                                    )}
                                    px={2}
                                    py={1}
                                    borderRadius="md"
                                  >
                                    {po.paymentStatus}
                                  </Badge>
                                </Td>
                                <Td>
                                  <Text>{po.assignedTo}</Text>
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
                                      {po.status === "Draft" && (
                                        <MenuItem
                                          icon={<FiCheck />}
                                          onClick={() =>
                                            handleUpdatePOStatus(
                                              po.id,
                                              "Submitted"
                                            )
                                          }
                                        >
                                          Submit for Approval
                                        </MenuItem>
                                      )}
                                      {po.status === "Submitted" && (
                                        <MenuItem
                                          icon={<FiCheck />}
                                          onClick={() => {
                                            void handleUpdatePOStatus(
                                              po.id,
                                              "Approved"
                                            );
                                          }}
                                        >
                                          Approve
                                        </MenuItem>
                                      )}

                                      {po.status === "Approved" && (
                                        <MenuItem
                                          icon={<FiShoppingCart />}
                                          onClick={() =>
                                            handleUpdatePOStatus(
                                              po.id,
                                              "Ordered"
                                            )
                                          }
                                        >
                                          Mark as Ordered
                                        </MenuItem>
                                      )}
                                      {po.status === "Ordered" && (
                                        <MenuItem
                                          icon={<FiTruck />}
                                          onClick={() =>
                                            handleUpdatePOStatus(
                                              po.id,
                                              "Delivered"
                                            )
                                          }
                                        >
                                          Mark as Delivered
                                        </MenuItem>
                                      )}
                                      {po.status === "Delivered" && (
                                        <MenuItem
                                          icon={<FiDollarSign />}
                                          onClick={() =>
                                            handleUpdatePOStatus(po.id, "Paid")
                                          }
                                        >
                                          Mark as Paid
                                        </MenuItem>
                                      )}
                                      <MenuItem
                                        icon={<FiTrash2 />}
                                        color="red.500"
                                        onClick={() => handleDeletePO(po.id)}
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
                              <Td colSpan={9} textAlign="center" py={8}>
                                <Text color="gray.500">
                                  No purchase orders found
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
            </CardBody>

            <CardFooter>
              <Text fontSize="sm" color="gray.500">
                Showing {filteredPOs.length} of {purchaseOrders.length} purchase
                orders
              </Text>
            </CardFooter>
          </Card>

          {/* Recent Activity & Overdue POs */}
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} mt={6}>
            {/* Overdue POs */}
            <Card>
              <CardHeader bg="blue.50">
                <HStack>
                  <Icon as={FiAlertTriangle} color="blue.500" />
                  <Heading size="md">Overdue Purchase Orders</Heading>
                </HStack>
              </CardHeader>
              <CardBody>
                {overduePOs > 0 ? (
                  <Table size="sm">
                    <Thead>
                      <Tr>
                        <Th>PO Number</Th>
                        <Th>Vendor</Th>
                        <Th>Days Overdue</Th>
                        <Th>Action</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {purchaseOrders
                        .filter(
                          (po) =>
                            new Date(po.dateDue) < new Date() &&
                            po.status !== "Delivered" &&
                            po.status !== "Paid"
                        )
                        .map((po) => (
                          <Tr key={po.id}>
                            <Td fontWeight="medium">{po.poNumber}</Td>
                            <Td>{po.vendor.name}</Td>
                            <Td>
                              {Math.floor(
                                (new Date().getTime() -
                                  new Date(po.dateDue).getTime()) /
                                  (1000 * 60 * 60 * 24)
                              )}{" "}
                              days
                            </Td>
                            <Td>
                              <Button
                                size="sm"
                                colorScheme="red"
                                variant="outline"
                              >
                                Follow Up
                              </Button>
                            </Td>
                          </Tr>
                        ))}
                    </Tbody>
                  </Table>
                ) : (
                  <Text color="green.500" textAlign="center" py={4}>
                    <Icon as={FiCheckCircle} mr={2} />
                    No overdue purchase orders
                  </Text>
                )}
              </CardBody>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader bg="blue.50">
                <HStack>
                  <Icon as={FiClock} color="blue.500" />
                  <Heading size="md">Recent Activity</Heading>
                </HStack>
              </CardHeader>
              <CardBody>
                <VStack align="stretch" spacing={4}>
                  {/* These will still be hardcoded or fetched from AuditLog/ChatMessage */}
                  <Box>
                    <Text fontWeight="bold">Today</Text>
                    <Text fontSize="sm">• PO-2024-006 created by John Doe</Text>
                    <Text fontSize="sm">• PO-2024-003 marked as Ordered</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold">Yesterday</Text>
                    <Text fontSize="sm">
                      • PO-2024-002 partially paid ($300 of $600)
                    </Text>
                    <Text fontSize="sm">• PO-2024-004 approved by Finance</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold">This Week</Text>
                    <Text fontSize="sm">• 3 new POs created</Text>
                    <Text fontSize="sm">• 2 deliveries received</Text>
                  </Box>
                </VStack>
              </CardBody>
            </Card>
          </SimpleGrid>
        </Box>

        <Footer />

        {/* Create PO Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="2xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Create New Purchase Order</ModalHeader>
            <ModalCloseButton />
            <form onSubmit={handleCreatePO}>
              <ModalBody>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={4}>
                  <FormControl isRequired>
                    <FormLabel>Vendor</FormLabel>
                    <Select
                      name="supplierId" // Matches backend
                      value={formData.supplierId}
                      onChange={handleInputChange}
                      placeholder="Select vendor"
                    >
                      {suppliers.map((supplier) => (
                        <option key={supplier.id} value={supplier.id}>
                          {supplier.name} ({supplier.rating}★)
                        </option>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Status</FormLabel>
                    <Select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                    >
                      {/* Backend status options should be listed here */}
                      <option value="Draft">Draft</option>
                      <option value="Approved">Approved</option>
                      <option value="Ordered">Ordered</option>
                      <option value="Received">Received</option>
                      <option value="Cancelled">Cancelled</option>
                    </Select>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Due Date</FormLabel>
                    <Input
                      name="date_expected" // Matches backend
                      type="date"
                      value={formData.date_expected}
                      onChange={handleInputChange}
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Assigned To</FormLabel>
                    <Select
                      name="createdById" // Matches backend
                      value={formData.createdById}
                      onChange={handleInputChange}
                      placeholder="Select team member"
                    >
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.username}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl gridColumn={{ base: "span 1", md: "span 2" }}>
                    <FormLabel>Notes</FormLabel>
                    <Input
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Any additional notes for the PO"
                    />
                  </FormControl>
                </SimpleGrid>

                {/* You'll need to add a dynamic way to add PO items */}
                <Heading size="sm" mb={2}>
                  PO Items (Manual for now)
                </Heading>
                <Text fontSize="sm" color="gray.600" mb={4}>
                  For a complete solution, you'd implement a way to dynamically
                  add components to this PO. Currently, newly created POs will
                  not have associated items unless your backend
                  `createPurchaseOrder` endpoint supports nested creation of
                  `po_item` records.
                </Text>
              </ModalBody>
              <ModalFooter>
                <Button variant="ghost" mr={3} onClick={onClose}>
                  Cancel
                </Button>
                <Button colorScheme="po" type="submit">
                  Create PO
                </Button>
              </ModalFooter>
            </form>
          </ModalContent>
        </Modal>
      </ChakraProvider>
    </>
  );
}