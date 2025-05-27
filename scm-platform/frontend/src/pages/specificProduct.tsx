import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart,
  // PieChart, // Not used in this example, can be removed if not needed
} from "recharts";
import {
  Package,
  TrendingUp,
  ShoppingCart,
  AlertCircle,
  Search,
  Bell,
  User,
  Menu,
  Home,
  Archive,
  FileText,
  Users as UsersIcon, // Renamed to avoid conflict with 'User'
  Eye,
  CreditCard,
} from "lucide-react";
import Sidebar from "../components/sidebar"; // Assuming Sidebar is well-designed
import Navbar from "../components/navbar"; // Assuming Sidebar is well-designed
import FixedNavbar from "../components/fixedNavbar"; // Assuming Sidebar is well-designed
import Footer from "../components/footer"; // Assuming Sidebar is well-designed
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Grid,
  GridItem,
  Heading,
  Text,
  VStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  ChakraProvider,
  extendTheme,
  theme,
  SimpleGrid,
  Flex,
} from "@chakra-ui/react";

const salesData = [
  { month: "Jan", revenue: 4200, cost: 3800 },
  { month: "Feb", revenue: 3100, cost: 2900 },
  { month: "Mar", revenue: 4800, cost: 4200 },
  { month: "Apr", revenue: 3900, cost: 3500 },
  { month: "May", revenue: 5200, cost: 4600 },
  { month: "Jun", revenue: 4700, cost: 4100 },
  { month: "Jul", revenue: 5800, cost: 5200 },
  { month: "Aug", revenue: 6200, cost: 5500 },
  { month: "Sep", revenue: 5900, cost: 5300 },
  { month: "Oct", revenue: 6800, cost: 6100 },
  { month: "Nov", revenue: 7200, cost: 6400 },
  { month: "Dec", revenue: 6900, cost: 6200 },
];

const supportData = [
  { day: "Mon", tickets: 20 },
  { day: "Tue", tickets: 35 },
  { day: "Wed", tickets: 25 },
  { day: "Thu", tickets: 40 },
  { day: "Fri", tickets: 30 },
  { day: "Sat", tickets: 15 },
  { day: "Sun", tickets: 10 },
];

const trendData = [
  { month: "Jan", forecast: 85, actual: 88 },
  { month: "Feb", forecast: 78, actual: 82 },
  { month: "Mar", forecast: 92, actual: 89 },
  { month: "Apr", forecast: 88, actual: 91 },
  { month: "May", forecast: 95, actual: 93 },
  { month: "Jun", forecast: 89, actual: 87 },
  { month: "Jul", forecast: 96, actual: 98 },
  { month: "Aug", forecast: 91, actual: 94 },
  { month: "Sep", forecast: 87, actual: 85 },
  { month: "Oct", forecast: 93, actual: 96 },
  { month: "Nov", forecast: 89, actual: 92 },
  { month: "Dec", forecast: 94, actual: 91 },
];

export default function ModernInventoryDashboard() {
  const [activeTab, setActiveTab] = useState("Dashboard"); // This state doesn't seem to be used for tabs
  const [sidebarOpen, setSidebarOpen] = useState(true); // This state also doesn't seem to be used for sidebar visibility. Assuming Sidebar component handles its own state or accepts a prop.

  const { data: session, status } = useSession();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (status === "loading" || !isClient) return;

    const isLoggedIn = !!session || localStorage.getItem("user");

    if (!isLoggedIn) {
      router.push("/login");
    }
  }, [session, status, isClient, router]);

  const [sidebarVisible, setSidebarVisible] = useState(false);
  const sidebarWidth = "180px"; // Must match the width in Sidebar.js

  if (!isClient || status === "loading") {
    return null; // prevents mismatch between SSR and client render
  }

  const isLoggedIn =
    !!session ||
    (typeof window !== "undefined" && !!localStorage.getItem("user"));

  return (
    <ChakraProvider theme={theme}>
      <Box display="flex" minH="100vh">
        <Sidebar visible={sidebarVisible} setVisible={setSidebarVisible} />

        <Box
          flex="1"
          ml={sidebarVisible ? "180px" : "0"}
          transition="margin-left 0.3s ease"
        >
          <FixedNavbar isLoggedIn={isLoggedIn} />
          <Box p={6} pt={20}>
            <Box
              width="100%"
              bg="rgba(255, 249, 255, 1)"
              backdropFilter="saturate(180%) blur(10px)"
              boxShadow="md"
              border="1px solid"
              borderColor="gray.200"
              borderRadius="md"
              p={4}
              mb={6}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              {/* Search Input */}
              <Box display="flex" alignItems="center" gap={2}>
                <Search size={18} />
                <Text fontWeight="medium">Search</Text>
                <input
                  type="text"
                  placeholder="Type here..."
                  style={{
                    padding: "6px 12px",
                    borderRadius: "6px",
                    border: "1px solid #CBD5E0",
                    outline: "none",
                  }}
                />
              </Box>

              {/* Filter Dropdown */}
              <select
                style={{
                  padding: "6px 12px",
                  borderRadius: "6px",
                  border: "1px solid #CBD5E0",
                }}
              >
                <option value="">Filter</option>
                <option value="latest">Latest</option>
                <option value="oldest">Oldest</option>
                <option value="quantity">Quantity</option>
              </select>
            </Box>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={6}>
              {[
                {
                  title: "Total Page Views",
                  value: "4,42,236",
                  change: "36.3%",
                  changeColor: "blue.500",
                  extra: "$5,000",
                },
                {
                  title: "Total Users",
                  value: "78,250",
                  change: "70.5%",
                  changeColor: "blue.500",
                  extra: "$8,000",
                },
                {
                  title: "Total Orders",
                  value: "18,800",
                  change: "27.4%",
                  changeColor: "orange.400",
                  extra: "1,943",
                },
                {
                  title: "Total Sales",
                  value: "35,078",
                  change: "27.4%",
                  changeColor: "orange.400",
                  extra: "20,395",
                },
              ].map((item, i) => (
                <Box
                  key={i}
                  p={6}
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="md"
                  bg="white"
                  boxShadow="sm"
                >
                  <Text fontSize="sm" color="gray.500" mb={1}>
                    {item.title}
                  </Text>
                  <Flex align="center" gap={2} mb={2}>
                    <Text fontSize="2xl" fontWeight="bold">
                      {item.value}
                    </Text>
                    <Box
                      fontSize="sm"
                      fontWeight="medium"
                      color={item.changeColor}
                      bg={`${item.changeColor}20`}
                      px={2}
                      py={0.5}
                      borderRadius="md"
                    >
                      ↑ {item.change}
                    </Box>
                  </Flex>
                  <Text fontSize="sm" color="gray.500">
                    You made an extra{" "}
                    <Text as="span" fontWeight="semibold">
                      {item.extra}
                    </Text>{" "}
                    this year
                  </Text>
                </Box>
              ))}
            </SimpleGrid>

            <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={6} mb={8}>
              {/* Line Chart - 2/3 width */}
              <Box
                gridColumn={{ lg: "span 2" }}
                bg="white"
                p={6}
                rounded="xl"
                shadow="md"
                border="1px solid"
                borderColor="gray.200"
              >
                <Flex justify="space-between" mb={6}>
                  <Flex gap={6} fontSize="sm">
                    <Flex align="center">
                      <Box
                        w="3"
                        h="3"
                        bg="blue.500"
                        borderRadius="full"
                        mr={2}
                      />
                      <Text color="gray.600">Revenue</Text>
                    </Flex>
                    <Flex align="center">
                      <Box
                        w="3"
                        h="3"
                        bg="blue.300"
                        borderRadius="full"
                        mr={2}
                      />
                      <Text color="gray.600">Cost</Text>
                    </Flex>
                  </Flex>
                </Flex>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "0.5rem",
                        borderColor: "#e0e0e0",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="cost"
                      stroke="#93c5fd"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>

              {/* Bar Chart - 1/3 width */}
              <Box
                bg="white"
                p={6}
                rounded="xl"
                shadow="md"
                border="1px solid"
                borderColor="gray.200"
              >
                <Flex justify="space-between" mb={6}>
                  <Heading size="md" color="gray.800">
                    Income
                  </Heading>
                </Flex>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={salesData.slice(-6)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "0.5rem",
                        borderColor: "#e0e0e0",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Bar
                      dataKey="revenue"
                      fill="#10b981"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </SimpleGrid>

            <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={6} mt={10}>
              {/* Shipping Orders Table - 2/3 width */}
              <Box gridColumn={{ lg: "span 2" }}>
                <Heading size="md" mb={4}>
                  Shipping Orders
                </Heading>
                <Box
                  border="1px solid"
                  borderColor="gray.300"
                  p={4}
                  borderRadius="md"
                  bg="white"
                  boxShadow="sm"
                >
                  <Table variant="simple" size="md">
                    <Thead>
                      <Tr>
                        <Th>Order ID</Th>
                        <Th>Customer</Th>
                        <Th>Status</Th>
                        <Th>Date</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Tr>
                        <Td>#A123</Td>
                        <Td>Company A</Td>
                        <Td>Shipped</Td>
                        <Td>2025-05-18</Td>
                      </Tr>
                      <Tr>
                        <Td>#B456</Td>
                        <Td>Company B</Td>
                        <Td>Processing</Td>
                        <Td>2025-05-17</Td>
                      </Tr>
                      <Tr>
                        <Td>#C789</Td>
                        <Td>Company C</Td>
                        <Td>Pending</Td>
                        <Td>2025-05-16</Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </Box>
              </Box>

              {/* Support Tickets Chart - 1/3 width */}
              <Box
                bg="white"
                p={6}
                rounded="xl"
                shadow="md"
                border="1px solid"
                borderColor="gray.200"
              >
                <Heading size="md" mb={6} color="gray.800">
                  Support Tickets
                </Heading>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={supportData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis
                      dataKey="day"
                      axisLine={false}
                      tickLine={false}
                      className="text-sm text-gray-600"
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      className="text-sm text-gray-600"
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "0.5rem",
                        borderColor: "#e0e0e0",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      }}
                      labelStyle={{ color: "#4b5563" }}
                      itemStyle={{ color: "#1f2937" }}
                    />
                    <Bar
                      dataKey="tickets"
                      fill="#8b5cf6"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </SimpleGrid>

            {/* line2 */}
            <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={6} mt={10}>
              {/* User Activity Chart – 2/3 width */}
              <Box
                gridColumn={{ lg: "span 2" }}
                bg="white"
                p={6}
                rounded="xl"
                shadow="md"
                border="1px solid"
                borderColor="gray.200"
              >
                <Flex justify="space-between" mb={6}>
                  <Heading size="md" color="gray.800">
                    User Activity
                  </Heading>
                  <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                    1,234
                  </Text>
                </Flex>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart
                    data={trendData}
                    margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      className="text-sm text-gray-600"
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      className="text-sm text-gray-600"
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "0.5rem",
                        borderColor: "#e0e0e0",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      }}
                      labelStyle={{ color: "#4b5563" }}
                      itemStyle={{ color: "#1f2937" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="actual"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>

              {/* Sales Report Chart – 1/3 width */}
              <Box
                bg="white"
                p={6}
                rounded="xl"
                shadow="md"
                border="1px solid"
                borderColor="gray.200"
              >
                <Heading size="md" color="gray.800" mb={6}>
                  Sales Report
                </Heading>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      className="text-sm text-gray-600"
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      className="text-sm text-gray-600"
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "0.5rem",
                        borderColor: "#e0e0e0",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      }}
                      labelStyle={{ color: "#4b5563" }}
                      itemStyle={{ color: "#1f2937" }}
                    />
                    <Bar
                      dataKey="revenue"
                      fill="#f59e0b"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar dataKey="cost" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </SimpleGrid>
          </Box>
        </Box>
      </Box>

      <Footer />
    </ChakraProvider>
  );
}
