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
import { useState } from "react";

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

interface Vendor {
  id: string;
  name: string;
  contact: string;
  rating: number;
}

interface POItem {
  id: string;
  component: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface PurchaseOrder {
  id: string;
  poNumber: string;
  vendor: Vendor;
  items: POItem[];
  totalAmount: number;
  dateCreated: string;
  dateDue: string;
  status:
    | "Draft"
    | "Submitted"
    | "Approved"
    | "Ordered"
    | "Delivered"
    | "Paid"
    | "Cancelled";
  paymentStatus: "Unpaid" | "Partially Paid" | "Fully Paid";
  assignedTo: string;
  notes: string;
}

export default function PurchaseOrderDashboard() {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([
    {
      id: "PO001",
      poNumber: "PO-2024-001",
      vendor: {
        id: "V001",
        name: "ElectroParts Inc.",
        contact: "vendor@electroparts.com",
        rating: 4.5,
      },
      items: [
        {
          id: "1",
          component: "Capacitor A",
          quantity: 100,
          unitPrice: 2.5,
          total: 250,
        },
        {
          id: "2",
          component: "Resistor B",
          quantity: 500,
          unitPrice: 0.5,
          total: 250,
        },
      ],
      totalAmount: 500,
      dateCreated: "2024-05-01",
      dateDue: "2024-05-15",
      status: "Paid",
      paymentStatus: "Fully Paid",
      assignedTo: "John Doe",
      notes: "Urgent order for production",
    },
    {
      id: "PO002",
      poNumber: "PO-2024-002",
      vendor: {
        id: "V002",
        name: "MechSupplies Co.",
        contact: "sales@mechsupplies.com",
        rating: 4.2,
      },
      items: [
        {
          id: "1",
          component: "Gear X",
          quantity: 50,
          unitPrice: 12.0,
          total: 600,
        },
      ],
      totalAmount: 600,
      dateCreated: "2024-05-10",
      dateDue: "2024-05-25",
      status: "Delivered",
      paymentStatus: "Partially Paid",
      assignedTo: "Jane Smith",
      notes: "Standard order",
    },
    {
      id: "PO003",
      poNumber: "PO-2024-003",
      vendor: {
        id: "V003",
        name: "Hardware World",
        contact: "orders@hardwareworld.com",
        rating: 3.8,
      },
      items: [
        {
          id: "1",
          component: "Screw Set",
          quantity: 1000,
          unitPrice: 0.2,
          total: 200,
        },
        {
          id: "2",
          component: "Bolt Set",
          quantity: 500,
          unitPrice: 0.3,
          total: 150,
        },
      ],
      totalAmount: 350,
      dateCreated: "2024-05-15",
      dateDue: "2024-05-30",
      status: "Ordered",
      paymentStatus: "Unpaid",
      assignedTo: "Mike Johnson",
      notes: "For warehouse maintenance",
    },
    {
      id: "PO004",
      poNumber: "PO-2024-004",
      vendor: {
        id: "V004",
        name: "ChipMasters",
        contact: "sales@chipmasters.com",
        rating: 4.7,
      },
      items: [
        {
          id: "1",
          component: "Microcontroller",
          quantity: 25,
          unitPrice: 8.0,
          total: 200,
        },
      ],
      totalAmount: 200,
      dateCreated: "2024-05-18",
      dateDue: "2024-06-05",
      status: "Approved",
      paymentStatus: "Unpaid",
      assignedTo: "Sarah Williams",
      notes: "R&D project components",
    },
    {
      id: "PO005",
      poNumber: "PO-2024-005",
      vendor: {
        id: "V001",
        name: "ElectroParts Inc.",
        contact: "vendor@electroparts.com",
        rating: 4.5,
      },
      items: [
        {
          id: "1",
          component: "Transistor Set",
          quantity: 200,
          unitPrice: 1.5,
          total: 300,
        },
      ],
      totalAmount: 300,
      dateCreated: "2024-05-20",
      dateDue: "2024-06-10",
      status: "Draft",
      paymentStatus: "Unpaid",
      assignedTo: "John Doe",
      notes: "Pending approval from finance",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Form state
  const [formData, setFormData] = useState({
    vendor: "",
    items: [] as POItem[],
    dateDue: "",
    assignedTo: "",
    notes: "",
    status: "Draft" as const,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `PO${Math.random()
      .toString(36)
      .substring(2, 6)
      .toUpperCase()}`;
    const poNumber = `PO-2024-${(purchaseOrders.length + 1)
      .toString()
      .padStart(3, "0")}`;

    const vendor = vendors.find((v) => v.id === formData.vendor) || vendors[0];

    const newPO: PurchaseOrder = {
      id: newId,
      poNumber,
      vendor,
      items: formData.items,
      totalAmount: formData.items.reduce((sum, item) => sum + item.total, 0),
      dateCreated: new Date().toISOString().split("T")[0],
      dateDue: formData.dateDue,
      status: formData.status,
      paymentStatus: "Unpaid",
      assignedTo: formData.assignedTo,
      notes: formData.notes,
    };

    setPurchaseOrders((prev) => [...prev, newPO]);
    setFormData({
      vendor: "",
      items: [],
      dateDue: "",
      assignedTo: "",
      notes: "",
      status: "Draft",
    });
    onClose();

    toast({
      title: "PO Created",
      description: `Purchase Order ${poNumber} has been created`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const deletePO = (id: string) => {
    setPurchaseOrders((prev) => prev.filter((po) => po.id !== id));
    toast({
      title: "PO Deleted",
      description: "The purchase order has been removed",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  const updatePOStatus = (id: string, newStatus: PurchaseOrder["status"]) => {
    setPurchaseOrders((prev) =>
      prev.map((po) => (po.id === id ? { ...po, status: newStatus } : po))
    );
    toast({
      title: "Status Updated",
      description: `PO status changed to ${newStatus}`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
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

  // Mock vendors
  const vendors: Vendor[] = [
    {
      id: "V001",
      name: "ElectroParts Inc.",
      contact: "vendor@electroparts.com",
      rating: 4.5,
    },
    {
      id: "V002",
      name: "MechSupplies Co.",
      contact: "sales@mechsupplies.com",
      rating: 4.2,
    },
    {
      id: "V003",
      name: "Hardware World",
      contact: "orders@hardwareworld.com",
      rating: 3.8,
    },
    {
      id: "V004",
      name: "ChipMasters",
      contact: "sales@chipmasters.com",
      rating: 4.7,
    },
  ];

  // Mock team members
  const teamMembers = [
    "John Doe",
    "Jane Smith",
    "Mike Johnson",
    "Sarah Williams",
  ];

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

  return (
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
          <CardHeader bg="po.500" borderTopRadius="md">
            <Flex
              direction={{ base: "column", md: "row" }}
              justify="space-between"
              align="center"
            >
              <HStack>
                <Icon as={FiShoppingCart} color="white" />
                <Heading size="md" color="white">
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
            <Tabs variant="enclosed" onChange={(index) => setActiveTab(index)}>
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
                                    <MenuItem icon={<FiEdit2 />}>Edit</MenuItem>
                                    {po.status === "Draft" && (
                                      <MenuItem
                                        icon={<FiCheck />}
                                        onClick={() =>
                                          updatePOStatus(po.id, "Submitted")
                                        }
                                      >
                                        Submit for Approval
                                      </MenuItem>
                                    )}
                                    {po.status === "Submitted" && (
                                      <MenuItem
                                        icon={<FiCheck />}
                                        onClick={() =>
                                          updatePOStatus(po.id, "Approved")
                                        }
                                      >
                                        Approve
                                      </MenuItem>
                                    )}
                                    {po.status === "Approved" && (
                                      <MenuItem
                                        icon={<FiShoppingCart />}
                                        onClick={() =>
                                          updatePOStatus(po.id, "Ordered")
                                        }
                                      >
                                        Mark as Ordered
                                      </MenuItem>
                                    )}
                                    {po.status === "Ordered" && (
                                      <MenuItem
                                        icon={<FiTruck />}
                                        onClick={() =>
                                          updatePOStatus(po.id, "Delivered")
                                        }
                                      >
                                        Mark as Delivered
                                      </MenuItem>
                                    )}
                                    {po.status === "Delivered" && (
                                      <MenuItem
                                        icon={<FiDollarSign />}
                                        onClick={() =>
                                          updatePOStatus(po.id, "Paid")
                                        }
                                      >
                                        Mark as Paid
                                      </MenuItem>
                                    )}
                                    <MenuItem
                                      icon={<FiTrash2 />}
                                      color="red.500"
                                      onClick={() => deletePO(po.id)}
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
            <CardHeader bg="red.50">
              <HStack>
                <Icon as={FiAlertTriangle} color="red.500" />
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
          <form onSubmit={handleSubmit}>
            <ModalBody>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={4}>
                <FormControl isRequired>
                  <FormLabel>Vendor</FormLabel>
                  <Select
                    name="vendor"
                    value={formData.vendor}
                    onChange={handleInputChange}
                    placeholder="Select vendor"
                  >
                    {vendors.map((vendor) => (
                      <option key={vendor.id} value={vendor.id}>
                        {vendor.name} ({vendor.rating}★)
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
                    <option value="Draft">Draft</option>
                    <option value="Submitted">Submitted</option>
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Due Date</FormLabel>
                  <Input
                    name="dateDue"
                    type="date"
                    value={formData.dateDue}
                    onChange={handleInputChange}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Assigned To</FormLabel>
                  <Select
                    name="assignedTo"
                    value={formData.assignedTo}
                    onChange={handleInputChange}
                    placeholder="Select team member"
                  >
                    {teamMembers.map((member) => (
                      <option key={member} value={member}>
                        {member}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </SimpleGrid>

              <FormControl>
                <FormLabel>Notes</FormLabel>
                <Input
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Any special instructions..."
                />
              </FormControl>

              <Heading size="sm" mt={6} mb={3}>
                Items
              </Heading>
              <Text color="gray.500" mb={4}>
                You'll be able to add items after creating the PO
              </Text>
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="po" type="submit">
                Create Purchase Order
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </ChakraProvider>
  );
}
