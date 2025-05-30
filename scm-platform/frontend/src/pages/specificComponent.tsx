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
  Users as UsersIcon,
  Eye,
  CreditCard,
} from "lucide-react";
import Sidebar from "../components/sidebar";
import Navbar from "../components/navbar";
import FixedNavbar from "../components/fixedNavbar";
import Footer from "../components/footer";
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
  Spinner,
  useToast,
} from "@chakra-ui/react";

// API service functions
import {
  fetchMonthlyStock,
  fetchProductDemand,
  fetchShippingInfo,
  fetchPurchaseOrders,
  fetchWarehouseInventory,
} from "../services/api";

// Types matching your backend
import {
  MonthlyStock as BackendMonthlyStock,
  ProductDemand as BackendProductDemand,
  ShippingInfo as BackendShippingInfo,
  PurchaseOrder as BackendPurchaseOrder,
  WarehouseInventory as BackendWarehouseInventory,
} from "../../../backend/src/interfaces/index";

// Custom theme
const customTheme = extendTheme({
  ...theme,
  colors: {
    ...theme.colors,
    primary: {
      50: "#f0f9ff",
      100: "#e0f2fe",
      500: "#3b82f6",
      600: "#2563eb",
    },
    success: {
      50: "#f0fdf4",
      100: "#dcfce7",
      500: "#22c55e",
      600: "#16a34a",
    },
    warning: {
      50: "#fffbeb",
      100: "#fef3c7",
      500: "#f59e0b",
      600: "#d97706",
    },
    danger: {
      50: "#fef2f2",
      100: "#fee2e2",
      500: "#ef4444",
      600: "#dc2626",
    },
  },
});

// UI data interfaces
interface DashboardMetric {
  title: string;
  value: string;
  change: string;
  changeColor: string;
  extra: string;
}

interface SalesData {
  month: string;
  revenue: number;
  cost: number;
}

interface SupportData {
  day: string;
  tickets: number;
}

interface TrendData {
  month: string;
  forecast: number;
  actual: number;
}

interface ShippingOrder {
  id: string;
  customer: string;
  status: string;
  date: string;
}

export default function ModernInventoryDashboard() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState<DashboardMetric[]>([]);
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [supportData, setSupportData] = useState<SupportData[]>([]);
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [shippingOrders, setShippingOrders] = useState<ShippingOrder[]>([]);

  const { data: session, status } = useSession();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const toast = useToast();

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
  const sidebarWidth = "180px";

  // Load data from backend
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        // Fetch all necessary data
        const [
          monthlyStock,
          productDemand,
          shippingInfo,
          purchaseOrders,
          warehouseInventory,
        ] = await Promise.all([
          fetchMonthlyStock(),
          fetchProductDemand(),
          fetchShippingInfo(),
          fetchPurchaseOrders(),
          fetchWarehouseInventory(),
        ]);

        // Process data for dashboard metrics
        const totalInventoryValue = warehouseInventory.reduce(
          (sum: number, item: BackendWarehouseInventory) => {
            // Assuming each component has a unit price (you'll need to adjust this)
            const unitPrice =
              item.component?.supplierQuote?.price_per_unit || 10;
            return sum + item.current_qty * unitPrice;
          },
          0
        );

        const totalIncoming = warehouseInventory.reduce(
          (sum: number, item: BackendWarehouseInventory) =>
            sum + item.incoming_qty,
          0
        );

        const totalOutgoing = warehouseInventory.reduce(
          (sum: number, item: BackendWarehouseInventory) =>
            sum + item.outgoing_qty,
          0
        );

        const delayedShipments = shippingInfo.filter(
          (shipment: BackendShippingInfo) => shipment.status === "Delayed"
        ).length;

        // Set dashboard metrics
        setMetrics([
          {
            title: "Total Inventory Value",
            value: `$${totalInventoryValue.toLocaleString()}`,
            change: "12.5%",
            changeColor: "blue.500",
            extra: `$${(totalInventoryValue * 0.125).toLocaleString()}`,
          },
          {
            title: "Incoming Stock",
            value: totalIncoming.toLocaleString(),
            change: "8.2%",
            changeColor: "blue.500",
            extra: "units",
          },
          {
            title: "Outgoing Orders",
            value: totalOutgoing.toLocaleString(),
            change: "5.7%",
            changeColor: "orange.400",
            extra: "units",
          },
          {
            title: "Delayed Shipments",
            value: delayedShipments.toString(),
            change: delayedShipments > 0 ? "3.4%" : "0%",
            changeColor: delayedShipments > 0 ? "orange.400" : "blue.500",
            extra: "needs attention",
          },
        ]);

        // Process monthly stock data for sales charts
        const processedSalesData = monthlyStock.map(
          (stock: BackendMonthlyStock) => ({
            month: new Date(0, stock.month - 1).toLocaleString("default", {
              month: "short",
            }),
            revenue: stock.percent_occupied * 1000, // Example scaling
            cost: stock.percent_occupied * 800, // Example scaling
          })
        );

        setSalesData(processedSalesData);

        // Process product demand for support tickets (example)
        const processedSupportData = productDemand
          .slice(0, 7)
          .map((demand: BackendProductDemand, index: number) => ({
            day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index],
            tickets: demand.qty / 10, // Example scaling
          }));

        setSupportData(processedSupportData);

        // Process trend data (forecast vs actual)
        const processedTrendData = productDemand
          .filter(
            (demand: BackendProductDemand) => demand.is_forecast === false
          )
          .map((demand: BackendProductDemand) => {
            const forecast = productDemand.find(
              (d: BackendProductDemand) =>
                d.productId === demand.productId &&
                d.month === demand.month &&
                d.year === demand.year &&
                d.is_forecast === true
            );
            return {
              month: new Date(demand.year, demand.month - 1).toLocaleString(
                "default",
                { month: "short" }
              ),
              forecast: forecast?.qty || 0,
              actual: demand.qty,
            };
          });

        setTrendData(processedTrendData.slice(0, 12));

        // Process shipping orders from purchase orders
        const processedShippingOrders = purchaseOrders
          .slice(0, 3)
          .map((po: BackendPurchaseOrder) => ({
            id: `#${po.id.toString().padStart(3, "0")}`,
            customer: po.supplier?.name || "Unknown Supplier",
            status: po.status === "Received" ? "Delivered" : po.status,
            date: new Date(po.date_created).toISOString().split("T")[0],
          }));

        setShippingOrders(processedShippingOrders);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (isClient && (session || localStorage.getItem("user"))) {
      loadData();
    }
  }, [isClient, session]);

  if (!isClient || status === "loading") {
    return null;
  }

  const isLoggedIn =
    !!session ||
    (typeof window !== "undefined" && !!localStorage.getItem("user"));

  return (
    <ChakraProvider theme={customTheme}>
      <Box display="flex" minH="100vh">
        <Sidebar visible={sidebarVisible} setVisible={setSidebarVisible} />

        <Box
          flex="1"
          ml={sidebarVisible ? "180px" : "0"}
          transition="margin-left 0.3s ease"
        >
          <FixedNavbar isLoggedIn={isLoggedIn} />
          <Box p={6} pt={20}>
            {/* Search and Filter Bar */}
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

            {isLoading ? (
              <Flex justify="center" align="center" minH="200px">
                <Spinner size="xl" />
              </Flex>
            ) : (
              <>
                {/* Metrics Cards */}
                <SimpleGrid
                  columns={{ base: 1, md: 2, lg: 4 }}
                  spacing={6}
                  mb={6}
                >
                  {metrics.map((item, i) => (
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

                {/* Charts Row 1 */}
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
                        <XAxis
                          dataKey="month"
                          axisLine={false}
                          tickLine={false}
                        />
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
                        Inventory Value
                      </Heading>
                    </Flex>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={salesData.slice(-6)}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis
                          dataKey="month"
                          axisLine={false}
                          tickLine={false}
                        />
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

                {/* Charts Row 2 */}
                <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={6} mt={10}>
                  {/* Shipping Orders Table - 2/3 width */}
                  <Box gridColumn={{ lg: "span 2" }}>
                    <Heading size="md" mb={4}>
                      Recent Shipments
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
                            <Th>Supplier</Th>
                            <Th>Status</Th>
                            <Th>Date</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {shippingOrders.map((order) => (
                            <Tr key={order.id}>
                              <Td>{order.id}</Td>
                              <Td>{order.customer}</Td>
                              <Td>{order.status}</Td>
                              <Td>{order.date}</Td>
                            </Tr>
                          ))}
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
                      Inventory Movement
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

                {/* Charts Row 3 */}
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
                        Demand Forecast vs Actual
                      </Heading>
                      <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                        {trendData.reduce((sum, item) => sum + item.actual, 0)}
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
                          className="text-sm text-gray.600"
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          className="text-sm text-gray.600"
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
                        <Area
                          type="monotone"
                          dataKey="forecast"
                          stroke="#82ca9d"
                          fill="#82ca9d"
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
                      Inventory Utilization
                    </Heading>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis
                          dataKey="month"
                          axisLine={false}
                          tickLine={false}
                          className="text-sm text-gray.600"
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          className="text-sm text-gray.600"
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
                        <Bar
                          dataKey="cost"
                          fill="#3b82f6"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </SimpleGrid>
              </>
            )}
          </Box>
        </Box>
      </Box>

      <Footer />
    </ChakraProvider>
  );
}
