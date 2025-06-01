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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Avatar,
  Tag,
  Divider,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  useBreakpointValue,
} from "@chakra-ui/react";
import {
  FiSearch,
  FiFilter,
  FiPlus,
  FiDownload,
  FiPrinter,
  FiEdit2,
  FiMoreVertical,
  FiArrowRight,
  FiAlertTriangle,
  FiCheckCircle,
  FiClock,
  FiGlobe,
  FiPhone,
  FiMail,
  FiDollarSign,
  FiTruck,
  FiStar,
  FiCalendar,
  FiTrash2,
} from "react-icons/fi";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import * as Papa from "papaparse";

// Custom theme with blue color scheme (same as components page)
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

interface Supplier {
  id: string;
  name: string;
  contact_email: string;
  phone: string;
  location: string;
  rating: number;
  historical_ontime_rate: number;
  avg_unit_cost: number;
  last_response_time: number; // in hours
  preferred: boolean;
  status: "Active" | "Inactive" | "On Hold";
  components_supplied?: number;
  last_order_date?: string;
}

export default function SuppliersPage() {
  const router = useRouter();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [isLoading, setIsLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useBreakpointValue({ base: true, lg: false });

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    contact_email: "",
    phone: "",
    location: "",
    rating: 4,
    preferred: false,
  });

  // Fetch suppliers from API
  useEffect(() => {
    const fetchSuppliers = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/supplier");
        if (!response.ok) {
          throw new Error("Failed to load suppliers");
        }
        const data = await response.json();

        // Enhance suppliers with additional UI fields
        const enhancedSuppliers = data.map((supplier: any) => ({
          ...supplier,
          status: supplier.preferred ? "Active" : "Inactive",
          components_supplied: Math.floor(Math.random() * 50) + 5, // Mock data
          last_order_date: new Date(
            Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
          )
            .toISOString()
            .split("T")[0], // Mock date
        }));

        setSuppliers(enhancedSuppliers);
        setFilteredSuppliers(enhancedSuppliers);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load suppliers",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuppliers();
  }, [toast]);

  // Filter and sort suppliers
  useEffect(() => {
    let result = [...suppliers];

    // Filter by search term
    if (searchTerm) {
      result = result.filter(
        (supplier) =>
          supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          supplier.contact_email
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          supplier.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "ontime")
        return b.historical_ontime_rate - a.historical_ontime_rate;
      if (sortBy === "status") return a.status.localeCompare(b.status);
      if (sortBy === "last_order") {
        return (
          new Date(b.last_order_date || 0).getTime() -
          new Date(a.last_order_date || 0).getTime()
        );
      }
      return 0;
    });

    setFilteredSuppliers(result);
  }, [searchTerm, sortBy, suppliers]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/supplier", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to add supplier");
      }

      const newSupplier = await response.json();

      // Enhance the new supplier with UI fields
      const enhancedSupplier = {
        ...newSupplier,
        status: newSupplier.preferred ? "Active" : "Inactive",
        components_supplied: 0, // New supplier starts with 0 components
        last_order_date: "Never",
      };

      setSuppliers((prev) => [...prev, enhancedSupplier]);
      setFormData({
        name: "",
        contact_email: "",
        phone: "",
        location: "",
        rating: 4,
        preferred: false,
      });
      onClose();

      toast({
        title: "Success",
        description: "Supplier added successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add supplier",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSupplier) return;

    try {
      const response = await fetch(`/api/supplier/${editingSupplier.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...editingSupplier,
          preferred: editingSupplier.preferred,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update supplier");
      }

      const updatedSupplier = await response.json();

      setSuppliers((prev) =>
        prev.map((supplier) =>
          supplier.id === updatedSupplier.id
            ? {
                ...updatedSupplier,
                status: updatedSupplier.preferred ? "Active" : "Inactive",
                components_supplied: supplier.components_supplied,
                last_order_date: supplier.last_order_date,
              }
            : supplier
        )
      );

      setIsEditModalOpen(false);
      setEditingSupplier(null);

      toast({
        title: "Success",
        description: "Supplier updated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update supplier",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/supplier/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete supplier");
      }

      setSuppliers((prev) => prev.filter((supplier) => supplier.id !== id));

      toast({
        title: "Success",
        description: "Supplier deleted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete supplier",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setIsEditModalOpen(true);
  };

  const handleViewDetails = (supplierId: string) => {
    router.push(`/suppliers/${supplierId}`);
  };

  const handleCreatePO = () => {
    router.push("/purchaseOrder");
  };

  const handleShippingUpdates = () => {
    router.push("/shipping");
  };

  const exportToCSV = () => {
    const csvData = filteredSuppliers.map((supplier) => ({
      Name: supplier.name,
      Email: supplier.contact_email,
      Phone: supplier.phone,
      Location: supplier.location,
      Rating: supplier.rating,
      "On-Time Rate": supplier.historical_ontime_rate,
      "Avg Unit Cost": supplier.avg_unit_cost,
      "Last Response Time": supplier.last_response_time,
      Status: supplier.status,
      "Components Supplied": supplier.components_supplied,
      "Last Order Date": supplier.last_order_date,
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "suppliers.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  const generatePerformanceReport = () => {
    const reportData = {
      totalSuppliers: suppliers.length,
      preferredSuppliers: suppliers.filter((s) => s.preferred).length,
      avgRating: (
        suppliers.reduce((sum, s) => sum + s.rating, 0) / suppliers.length
      ).toFixed(1),
      avgOnTimeRate: (
        (suppliers.reduce((sum, s) => sum + s.historical_ontime_rate, 0) /
          suppliers.length) *
        100
      ).toFixed(1),
      avgResponseTime: (
        suppliers.reduce((sum, s) => sum + s.last_response_time, 0) /
        suppliers.length
      ).toFixed(1),
      suppliers: filteredSuppliers.map((supplier) => ({
        name: supplier.name,
        rating: supplier.rating,
        onTimeRate: supplier.historical_ontime_rate,
        status: supplier.status,
      })),
    };

    const reportContent = `
      Supplier Performance Report
      ==========================
      
      Summary:
      - Total Suppliers: ${reportData.totalSuppliers}
      - Preferred Suppliers: ${reportData.preferredSuppliers}
      - Average Rating: ${reportData.avgRating}/5
      - Average On-Time Rate: ${reportData.avgOnTimeRate}%
      - Average Response Time: ${reportData.avgResponseTime} hours
      
      Supplier Details:
      ${reportData.suppliers
        .map(
          (supplier) => `
      ${supplier.name}
      - Rating: ${supplier.rating}/5
      - On-Time Rate: ${(supplier.onTimeRate * 100).toFixed(1)}%
      - Status: ${supplier.status}
      `
        )
        .join("\n")}
    `;

    const blob = new Blob([reportContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "supplier_performance_report.txt");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportSuppliers = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      complete: (results: { data: any[]; }) => {
        const importedSuppliers = results.data.map((row: any) => ({
          name: row.Name || row.name || "",
          contact_email: row.Email || row.email || "",
          phone: row.Phone || row.phone || "",
          location: row.Location || row.location || "",
          rating: parseFloat(row.Rating || row.rating || "4"),
          historical_ontime_rate: parseFloat(
            row["On-Time Rate"] || row.ontime_rate || "0.9"
          ),
          avg_unit_cost: parseFloat(
            row["Avg Unit Cost"] || row.avg_cost || "10.0"
          ),
          last_response_time: parseFloat(
            row["Last Response Time"] || row.response_time || "24"
          ),
          preferred: row.Preferred
            ? row.Preferred.toLowerCase() === "true"
            : false,
        }));

        // Validate and submit each supplier
        importedSuppliers.forEach(async (supplier: any) => {
          try {
            const response = await fetch("/api/supplier", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(supplier),
            });

            if (!response.ok) {
              throw new Error("Failed to import supplier");
            }

            const newSupplier = await response.json();

            setSuppliers((prev) => [
              ...prev,
              {
                ...newSupplier,
                status: newSupplier.preferred ? "Active" : "Inactive",
                components_supplied: 0,
                last_order_date: "Never",
              },
            ]);
          } catch (error) {
            console.error("Error importing supplier:", error);
          }
        });

        toast({
          title: "Import Successful",
          description: `${importedSuppliers.length} suppliers imported`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      },
      error: () => {
        toast({
          title: "Import Error",
          description: "Failed to parse CSV file",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      },
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "green";
      case "Inactive":
        return "gray";
      case "On Hold":
        return "orange";
      default:
        return "gray";
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "green";
    if (rating >= 3.5) return "blue";
    if (rating >= 2.5) return "orange";
    return "red";
  };

  // Calculate metrics for the stats boxes
  const totalSuppliers = suppliers.length;
  const preferredSuppliers = suppliers.filter((s) => s.preferred).length;
  const avgRating =
    suppliers.length > 0
      ? (
          suppliers.reduce((sum, s) => sum + s.rating, 0) / suppliers.length
        ).toFixed(1)
      : "0.0";
  const avgOnTimeRate =
    suppliers.length > 0
      ? (
          (suppliers.reduce((sum, s) => sum + s.historical_ontime_rate, 0) /
            suppliers.length) *
          100
        ).toFixed(1)
      : "0.0";
  const avgResponseTime =
    suppliers.length > 0
      ? (
          suppliers.reduce((sum, s) => sum + s.last_response_time, 0) /
          suppliers.length
        ).toFixed(1)
      : "0.0";

  return (
    <ChakraProvider theme={theme}>
      <Box minHeight="100vh" display="flex" flexDirection="column">
        <Navbar isLoggedIn={true} />

        <Box flex="1" pt={20} px={6} bg="gray.50">
          <Flex direction="column" gap={6}>
            {/* Supplier Metrics at the top */}
            <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} gap={4}>
              <Card boxShadow="sm" bg="white">
                <CardBody>
                  <Stat>
                    <StatLabel>Total Suppliers</StatLabel>
                    <StatNumber>{totalSuppliers}</StatNumber>
                    <StatHelpText>
                      <StatArrow type="increase" />
                      5% from last month
                    </StatHelpText>
                  </Stat>
                </CardBody>
              </Card>

              <Card boxShadow="sm" bg="white">
                <CardBody>
                  <Stat>
                    <StatLabel>Preferred</StatLabel>
                    <StatNumber>{preferredSuppliers}</StatNumber>
                    <StatHelpText>
                      <StatArrow type="increase" />
                      12% from last month
                    </StatHelpText>
                  </Stat>
                </CardBody>
              </Card>

              <Card boxShadow="sm" bg="white">
                <CardBody>
                  <Stat>
                    <StatLabel>Avg. Rating</StatLabel>
                    <StatNumber>{avgRating}</StatNumber>
                    <StatHelpText>
                      <StatArrow type="decrease" />
                      2% from last month
                    </StatHelpText>
                  </Stat>
                </CardBody>
              </Card>

              <Card boxShadow="sm" bg="white">
                <CardBody>
                  <Stat>
                    <StatLabel>Avg. On-Time Rate</StatLabel>
                    <StatNumber>{avgOnTimeRate}%</StatNumber>
                    <StatHelpText>
                      <StatArrow type="increase" />
                      3% from last month
                    </StatHelpText>
                  </Stat>
                </CardBody>
              </Card>
            </SimpleGrid>

            <Flex direction={{ base: "column", lg: "row" }} gap={6}>
              {/* Main Content Area */}
              <Box flex={3} overflowX="auto">
                <Flex justify="space-between" align="center" mb={6}>
                  <Heading size="xl" color="gray.800">
                    Supplier Management
                  </Heading>

                  <Button
                    colorScheme="brand"
                    leftIcon={<FiPlus />}
                    onClick={onOpen}
                  >
                    Add Supplier
                  </Button>
                </Flex>

                {/* Search and Filter Bar */}
                <Card mb={6} boxShadow="sm">
                  <CardBody>
                    <Flex gap={4} flexWrap="wrap">
                      <HStack flex={1} minW="300px">
                        <Icon as={FiSearch} color="gray.500" />
                        <Input
                          placeholder="Search suppliers..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </HStack>

                      <HStack>
                        <Icon as={FiFilter} color="gray.500" />
                        <Select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          minW="180px"
                        >
                          <option value="name">Sort by Name</option>
                          <option value="rating">Sort by Rating</option>
                          <option value="ontime">Sort by On-Time Rate</option>
                          <option value="status">Sort by Status</option>
                          <option value="last_order">Sort by Last Order</option>
                        </Select>
                      </HStack>

                      <Button
                        leftIcon={<FiDownload />}
                        variant="outline"
                        onClick={exportToCSV}
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

                {/* Suppliers Table */}
                <Card boxShadow="sm">
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
                            <Th>Supplier</Th>
                            <Th>Contact</Th>
                            {!isMobile && (
                              <>
                                <Th>Location</Th>
                                <Th>Rating</Th>
                                <Th>On-Time Rate</Th>
                                <Th>Status</Th>
                                <Th>Last Order</Th>
                              </>
                            )}
                            <Th>Actions</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {filteredSuppliers.map((supplier) => (
                            <Tr key={supplier.id}>
                              <Td>
                                <Flex align="center" gap={3}>
                                  <Avatar name={supplier.name} size="sm" />
                                  <Box>
                                    <Text fontWeight="medium">
                                      {supplier.name}
                                    </Text>
                                    <Text fontSize="sm" color="gray.600">
                                      {supplier.components_supplied} components
                                    </Text>
                                  </Box>
                                  {supplier.preferred && (
                                    <Tag colorScheme="blue" size="sm">
                                      Preferred
                                    </Tag>
                                  )}
                                </Flex>
                              </Td>
                              <Td>
                                <VStack align="flex-start" spacing={0}>
                                  <HStack>
                                    <Icon
                                      as={FiMail}
                                      color="gray.500"
                                      size="14px"
                                    />
                                    <Text fontSize="sm">
                                      {supplier.contact_email}
                                    </Text>
                                  </HStack>
                                  <HStack>
                                    <Icon
                                      as={FiPhone}
                                      color="gray.500"
                                      size="14px"
                                    />
                                    <Text fontSize="sm">{supplier.phone}</Text>
                                  </HStack>
                                </VStack>
                              </Td>
                              {!isMobile && (
                                <>
                                  <Td>
                                    <HStack>
                                      <Icon
                                        as={FiGlobe}
                                        color="gray.500"
                                        size="14px"
                                      />
                                      <Text>{supplier.location}</Text>
                                    </HStack>
                                  </Td>
                                  <Td>
                                    <Badge
                                      colorScheme={getRatingColor(
                                        supplier.rating
                                      )}
                                      display="flex"
                                      alignItems="center"
                                      gap={1}
                                      px={2}
                                      py={1}
                                      borderRadius="full"
                                    >
                                      <Icon as={FiStar} />
                                      {supplier.rating.toFixed(1)}
                                    </Badge>
                                  </Td>
                                  <Td>
                                    <Flex align="center" gap={2}>
                                      <Progress
                                        value={
                                          supplier.historical_ontime_rate * 100
                                        }
                                        max={100}
                                        size="sm"
                                        colorScheme={
                                          supplier.historical_ontime_rate > 0.9
                                            ? "green"
                                            : supplier.historical_ontime_rate >
                                              0.8
                                            ? "orange"
                                            : "red"
                                        }
                                        flex="1"
                                        borderRadius="full"
                                      />
                                      <Text
                                        fontSize="sm"
                                        minW="50px"
                                        textAlign="right"
                                      >
                                        {(
                                          supplier.historical_ontime_rate * 100
                                        ).toFixed(0)}
                                        %
                                      </Text>
                                    </Flex>
                                  </Td>
                                  <Td>
                                    <Badge
                                      colorScheme={getStatusColor(
                                        supplier.status
                                      )}
                                      px={2}
                                      py={1}
                                      borderRadius="full"
                                    >
                                      {supplier.status}
                                    </Badge>
                                  </Td>
                                  <Td>
                                    <HStack>
                                      <Icon
                                        as={FiCalendar}
                                        color="gray.500"
                                        size="14px"
                                      />
                                      <Text fontSize="sm">
                                        {supplier.last_order_date || "Never"}
                                      </Text>
                                    </HStack>
                                  </Td>
                                </>
                              )}
                              <Td>
                                <Menu>
                                  <MenuButton
                                    as={IconButton}
                                    aria-label="Actions"
                                    icon={<FiMoreVertical />}
                                    variant="ghost"
                                  />
                                  <MenuList>
                                    <MenuItem
                                      icon={<FiEdit2 />}
                                      onClick={() => handleEdit(supplier)}
                                    >
                                      Edit
                                    </MenuItem>
                                    <MenuItem
                                      icon={<FiTrash2 />}
                                      color="red.500"
                                      onClick={() => handleDelete(supplier.id)}
                                    >
                                      Delete
                                    </MenuItem>
                                    <MenuItem
                                      icon={<FiArrowRight />}
                                      onClick={() =>
                                        handleViewDetails(supplier.id)
                                      }
                                    >
                                      View Details
                                    </MenuItem>
                                    <MenuItem
                                      icon={<FiDollarSign />}
                                      onClick={handleCreatePO}
                                    >
                                      Create PO
                                    </MenuItem>
                                  </MenuList>
                                </Menu>
                              </Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>

                      {filteredSuppliers.length === 0 && !isLoading && (
                        <CardBody>
                          <Text textAlign="center" py={8} color="gray.500">
                            No suppliers found. Try adjusting your search.
                          </Text>
                        </CardBody>
                      )}
                    </>
                  )}
                </Card>
              </Box>

              {/* Sidebar */}
              <Box flex={1} minW="300px">
                <Card boxShadow="sm">
                  <CardHeader>
                    <Heading size="md">Supplier Performance</Heading>
                  </CardHeader>
                  <CardBody>
                    <VStack align="stretch" spacing={4}>
                      <Box>
                        <Text fontSize="sm" color="gray.600" mb={2}>
                          Avg. On-Time Rate
                        </Text>
                        <Progress
                          value={parseFloat(avgOnTimeRate)}
                          max={100}
                          size="sm"
                          colorScheme="green"
                          borderRadius="full"
                        />
                      </Box>

                      <Box>
                        <Text fontSize="sm" color="gray.600" mb={2}>
                          Avg. Response Time
                        </Text>
                        <Progress
                          value={100 - (parseFloat(avgResponseTime) / 72) * 100}
                          max={100}
                          size="sm"
                          colorScheme="blue"
                          borderRadius="full"
                        />
                        <Text fontSize="sm" mt={1} textAlign="right">
                          {avgResponseTime} hours
                        </Text>
                      </Box>
                    </VStack>
                  </CardBody>
                  <CardFooter>
                    <Button
                      colorScheme="brand"
                      w="full"
                      onClick={generatePerformanceReport}
                    >
                      Supplier Performance Report
                    </Button>
                  </CardFooter>
                </Card>

                <Card boxShadow="sm" mt={6}>
                  <CardHeader>
                    <Heading size="md">Quick Actions</Heading>
                  </CardHeader>
                  <CardBody>
                    <VStack align="stretch" spacing={3}>
                      <Button
                        leftIcon={<FiPlus />}
                        variant="outline"
                        onClick={onOpen}
                      >
                        Add Supplier
                      </Button>
                      <Button
                        leftIcon={<FiDollarSign />}
                        variant="outline"
                        onClick={handleCreatePO}
                      >
                        Create Purchase Order
                      </Button>
                      <Button
                        leftIcon={<FiDownload />}
                        variant="outline"
                        onClick={handleImportSuppliers}
                      >
                        Import Supplier List
                      </Button>
                      <Button
                        leftIcon={<FiTruck />}
                        variant="outline"
                        onClick={handleShippingUpdates}
                      >
                        View Shipping Updates
                      </Button>
                    </VStack>
                  </CardBody>
                </Card>
              </Box>
            </Flex>
          </Flex>
        </Box>

        <Footer />
      </Box>

      {/* Add Supplier Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Supplier</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit}>
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Supplier Name</FormLabel>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Alpha Components"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Contact Email</FormLabel>
                  <Input
                    name="contact_email"
                    type="email"
                    value={formData.contact_email}
                    onChange={handleInputChange}
                    placeholder="e.g., contact@supplier.com"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Phone Number</FormLabel>
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="e.g., +1 (555) 123-4567"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Location</FormLabel>
                  <Input
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g., Shenzhen, China"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Initial Rating</FormLabel>
                  <Select
                    name="rating"
                    value={formData.rating}
                    onChange={handleInputChange}
                  >
                    <option value={5}>5 - Excellent</option>
                    <option value={4}>4 - Good</option>
                    <option value={3}>3 - Average</option>
                    <option value={2}>2 - Below Average</option>
                    <option value={1}>1 - Poor</option>
                  </Select>
                </FormControl>

                <FormControl display="flex" alignItems="center">
                  <FormLabel mb="0">Preferred Supplier?</FormLabel>
                  <input
                    type="checkbox"
                    name="preferred"
                    checked={formData.preferred}
                    onChange={handleInputChange}
                  />
                </FormControl>
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="brand" type="submit">
                Add Supplier
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      {/* Edit Supplier Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        size="lg"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Supplier</ModalHeader>
          <ModalCloseButton />
          {editingSupplier && (
            <form onSubmit={handleEditSubmit}>
              <ModalBody>
                <VStack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Supplier Name</FormLabel>
                    <Input
                      name="name"
                      value={editingSupplier.name}
                      onChange={(e) =>
                        setEditingSupplier({
                          ...editingSupplier,
                          name: e.target.value,
                        })
                      }
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Contact Email</FormLabel>
                    <Input
                      name="contact_email"
                      type="email"
                      value={editingSupplier.contact_email}
                      onChange={(e) =>
                        setEditingSupplier({
                          ...editingSupplier,
                          contact_email: e.target.value,
                        })
                      }
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Phone Number</FormLabel>
                    <Input
                      name="phone"
                      value={editingSupplier.phone}
                      onChange={(e) =>
                        setEditingSupplier({
                          ...editingSupplier,
                          phone: e.target.value,
                        })
                      }
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Location</FormLabel>
                    <Input
                      name="location"
                      value={editingSupplier.location}
                      onChange={(e) =>
                        setEditingSupplier({
                          ...editingSupplier,
                          location: e.target.value,
                        })
                      }
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Rating</FormLabel>
                    <Select
                      name="rating"
                      value={editingSupplier.rating}
                      onChange={(e) =>
                        setEditingSupplier({
                          ...editingSupplier,
                          rating: parseFloat(e.target.value),
                        })
                      }
                    >
                      <option value={5}>5 - Excellent</option>
                      <option value={4}>4 - Good</option>
                      <option value={3}>3 - Average</option>
                      <option value={2}>2 - Below Average</option>
                      <option value={1}>1 - Poor</option>
                    </Select>
                  </FormControl>

                  <FormControl display="flex" alignItems="center">
                    <FormLabel mb="0">Preferred Supplier?</FormLabel>
                    <input
                      type="checkbox"
                      name="preferred"
                      checked={editingSupplier.preferred}
                      onChange={(e) =>
                        setEditingSupplier({
                          ...editingSupplier,
                          preferred: e.target.checked,
                        })
                      }
                    />
                  </FormControl>
                </VStack>
              </ModalBody>

              <ModalFooter>
                <Button
                  variant="ghost"
                  mr={3}
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button colorScheme="brand" type="submit">
                  Save Changes
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>

      {/* Hidden file input for import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".csv,.xlsx,.xls"
        style={{ display: "none" }}
      />
    </ChakraProvider>
  );
}
