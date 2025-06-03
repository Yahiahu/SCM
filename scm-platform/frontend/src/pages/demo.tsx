import * as React from "react";
import {
  FaWarehouse,
  FaTruck,
  FaBoxOpen,
  FaChartLine,
  FaSearch,
  FaFilter,
  FaBell,
  FaUserCircle,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaExchangeAlt,
  FaArrowRight,
} from "react-icons/fa";
import { GiFactory } from "react-icons/gi";
import { MdInventory, MdOutlineSecurity } from "react-icons/md";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import {
  Card,
  Flex,
  Text,
  Badge,
  Progress,
  Table,
  Select,
  Button,
  Avatar,
  Box,
  Heading,
  Separator,
} from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";

const SupplyChainDashboard = () => {
  // Sample data
  const inventoryItems = [
    {
      id: "SKU-1001",
      name: "Widget A",
      quantity: 245,
      location: "WH-1-A12",
      status: "In Stock",
    },
    {
      id: "SKU-1002",
      name: "Gadget B",
      quantity: 89,
      location: "WH-2-B05",
      status: "Low Stock",
    },
    {
      id: "SKU-1003",
      name: "Component C",
      quantity: 532,
      location: "WH-1-C22",
      status: "In Stock",
    },
    {
      id: "SKU-1004",
      name: "Part D",
      quantity: 0,
      location: "WH-3-D14",
      status: "Out of Stock",
    },
  ];

  const shipments = [
    {
      id: "SH-1001",
      origin: "Factory A",
      destination: "Warehouse 1",
      status: "In Transit",
      eta: "2023-06-15",
    },
    {
      id: "SH-1002",
      origin: "Supplier B",
      destination: "Factory A",
      status: "Delayed",
      eta: "2023-06-18",
    },
    {
      id: "SH-1003",
      origin: "Warehouse 2",
      destination: "Retail Store",
      status: "Delivered",
      eta: "2023-06-10",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar isLoggedIn={true} />

      <main className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8 flex flex-wrap items-center gap-4 pt-6">
          <div className="relative flex-1 min-w-[300px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Search inventory, shipments..."
            />
          </div>

          <Select.Root defaultValue="all">
            <Select.Trigger className="w-[200px]" variant="soft">
              <FaMapMarkerAlt className="inline mr-2" />
            </Select.Trigger>
            <Select.Content>
              <Select.Group>
                <Select.Label>Locations</Select.Label>
                <Select.Item value="all">All Locations</Select.Item>
                <Select.Item value="wh1">Warehouse 1</Select.Item>
                <Select.Item value="wh2">Warehouse 2</Select.Item>
                <Select.Item value="factory">Factory A</Select.Item>
              </Select.Group>
            </Select.Content>
          </Select.Root>

          <Select.Root defaultValue="all">
            <Select.Trigger className="w-[200px]" variant="soft">
              <FaFilter className="inline mr-2" />
            </Select.Trigger>
            <Select.Content>
              <Select.Group>
                <Select.Label>Status</Select.Label>
                <Select.Item value="all">All Status</Select.Item>
                <Select.Item value="in-stock">In Stock</Select.Item>
                <Select.Item value="low-stock">Low Stock</Select.Item>
                <Select.Item value="out-of-stock">Out of Stock</Select.Item>
              </Select.Group>
            </Select.Content>
          </Select.Root>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <Flex direction="column" gap="2">
              <Text size="2" color="gray">
                Total Inventory
              </Text>
              <Text size="6" weight="bold">
                1,248 items
              </Text>
              <Flex align="center" gap="2">
                <Text size="2" color="green">
                  ↑ 12%
                </Text>
                <Text size="2" color="gray">
                  from last month
                </Text>
              </Flex>
            </Flex>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <Flex direction="column" gap="2">
              <Text size="2" color="gray">
                Active Shipments
              </Text>
              <Text size="6" weight="bold">
                17
              </Text>
              <Flex align="center" gap="2">
                <Text size="2" color="red">
                  ↓ 3 delayed
                </Text>
              </Flex>
            </Flex>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <Flex direction="column" gap="2">
              <Text size="2" color="gray">
                Order Accuracy
              </Text>
              <Text size="6" weight="bold">
                98.7%
              </Text>
              <Flex align="center" gap="2">
                <Text size="2" color="green">
                  ↑ 1.2%
                </Text>
                <Text size="2" color="gray">
                  improvement
                </Text>
              </Flex>
            </Flex>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <Flex direction="column" gap="2">
              <Text size="2" color="gray">
                Warehouse Capacity
              </Text>
              <Text size="6" weight="bold">
                78%
              </Text>
              <Progress value={78} className="mt-2 h-2" />
            </Flex>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Inventory Overview */}
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <Flex direction="column" gap="4">
                <Flex align="center" gap="2">
                  <MdInventory className="text-blue-600 text-xl" />
                  <Heading size="5">Inventory Overview</Heading>
                </Flex>

                <Box className="overflow-x-auto">
                  <Table.Root>
                    <Table.Header>
                      <Table.Row>
                        <Table.ColumnHeaderCell>SKU</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Item</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Qty</Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>
                          Location
                        </Table.ColumnHeaderCell>
                        <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {inventoryItems.map((item) => (
                        <Table.Row key={item.id} className="hover:bg-gray-50">
                          <Table.RowHeaderCell>{item.id}</Table.RowHeaderCell>
                          <Table.Cell>{item.name}</Table.Cell>
                          <Table.Cell>{item.quantity}</Table.Cell>
                          <Table.Cell>{item.location}</Table.Cell>
                          <Table.Cell>
                            <Badge
                              color={
                                item.status === "In Stock"
                                  ? "green"
                                  : item.status === "Low Stock"
                                  ? "yellow"
                                  : "red"
                              }
                            >
                              {item.status}
                            </Badge>
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table.Root>
                </Box>

                <Flex justify="end">
                  <Button variant="soft">
                    View All Inventory <FaArrowRight className="ml-2" />
                  </Button>
                </Flex>
              </Flex>
            </Card>

            {/* Shipment Tracking */}
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <Flex direction="column" gap="4">
                <Flex align="center" gap="2">
                  <FaTruck className="text-blue-600 text-xl" />
                  <Heading size="5">Shipment Tracking</Heading>
                </Flex>

                <Flex direction="column" gap="3">
                  {shipments.map((shipment) => (
                    <Card key={shipment.id} variant="surface">
                      <Flex direction="column" gap="2">
                        <Flex justify="between" wrap="wrap" gap="2">
                          <Flex direction="column">
                            <Text weight="bold">{shipment.id}</Text>
                            <Text size="2" color="gray">
                              {shipment.origin} → {shipment.destination}
                            </Text>
                          </Flex>
                          <Flex direction="column" align="end" gap="1">
                            <Badge
                              color={
                                shipment.status === "Delivered"
                                  ? "green"
                                  : shipment.status === "Delayed"
                                  ? "red"
                                  : "blue"
                              }
                            >
                              {shipment.status}
                            </Badge>
                            <Text size="2">
                              <FaCalendarAlt className="inline mr-1" />
                              ETA: {shipment.eta}
                            </Text>
                          </Flex>
                        </Flex>
    
                        <Progress
                          value={
                            shipment.status === "Delivered"
                              ? 100
                              : shipment.status === "Delayed"
                              ? 60
                              : 80
                          }
                          className={`
    h-2 
    ${shipment.status === "Delivered" ? "bg-green-200" : ""}
    ${shipment.status === "Delayed" ? "bg-red-200" : ""}
    ${shipment.status === "In Transit" ? "bg-blue-200" : ""}
  `}
                          color={
                            shipment.status === "Delivered"
                              ? "green"
                              : shipment.status === "Delayed"
                              ? "red"
                              : "blue"
                          }
                        />
                      </Flex>
                    </Card>
                  ))}
                </Flex>

                <Flex justify="end">
                  <Button variant="soft">
                    View All Shipments <FaArrowRight className="ml-2" />
                  </Button>
                </Flex>
              </Flex>
            </Card>
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            {/* Supply Chain Map */}
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <Flex direction="column" gap="4">
                <Flex align="center" gap="2">
                  <FaMapMarkerAlt className="text-blue-600 text-xl" />
                  <Heading size="5">Network Map</Heading>
                </Flex>

                <div className="bg-gray-100 h-48 rounded-lg flex items-center justify-center">
                  <Flex direction="column" align="center" gap="2">
                    <div className="animate-spin">
                      <svg
                        className="w-8 h-8 text-blue-500"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    </div>
                    <Text color="gray">Loading network visualization</Text>
                  </Flex>
                </div>

                <Flex direction="column" gap="3">
                  <Flex align="center" gap="2">
                    <GiFactory className="text-orange-500 text-xl" />
                    <Text>2 Active Factories</Text>
                  </Flex>
                  <Flex align="center" gap="2">
                    <FaWarehouse className="text-blue-500 text-xl" />
                    <Text>3 Warehouses</Text>
                  </Flex>
                  <Flex align="center" gap="2">
                    <FaTruck className="text-green-500 text-xl" />
                    <Text>17 In-Transit Shipments</Text>
                  </Flex>
                </Flex>
              </Flex>
            </Card>

            {/* Recent Activity */}
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <Flex direction="column" gap="4">
                <Flex align="center" gap="2">
                  <FaExchangeAlt className="text-blue-600 text-xl" />
                  <Heading size="5">Recent Activity</Heading>
                </Flex>

                <Flex direction="column" gap="3">
                  <Flex direction="column" gap="1">
                    <Text weight="bold">Inventory Update</Text>
                    <Text size="2" color="gray">
                      SKU-1002 quantity updated to 89
                    </Text>
                    <Text size="1" color="gray">
                      2 hours ago
                    </Text>
                  </Flex>

                  <Separator size="4" />

                  <Flex direction="column" gap="1">
                    <Text weight="bold">Shipment Delayed</Text>
                    <Text size="2" color="gray">
                      SH-1002 delayed by 2 days
                    </Text>
                    <Text size="1" color="gray">
                      5 hours ago
                    </Text>
                  </Flex>

                  <Separator size="4" />

                  <Flex direction="column" gap="1">
                    <Text weight="bold">New Order</Text>
                    <Text size="2" color="gray">
                      Order #45678 placed for Retail Store
                    </Text>
                    <Text size="1" color="gray">
                      1 day ago
                    </Text>
                  </Flex>
                </Flex>

                <Flex justify="end">
                  <Button variant="soft">
                    View All Activity <FaArrowRight className="ml-2" />
                  </Button>
                </Flex>
              </Flex>
            </Card>

            {/* Security Alerts */}
            <Card className="shadow-sm hover:shadow-md transition-shadow bg-gradient-to-r from-red-50 to-white">
              <Flex direction="column" gap="4">
                <Flex align="center" gap="2">
                  <MdOutlineSecurity className="text-red-500 text-xl" />
                  <Heading size="5">Security Alerts</Heading>
                </Flex>

                <Text size="2">
                  <Badge color="green" className="mr-2">
                    Secure
                  </Badge>
                  All systems operating normally
                </Text>
              </Flex>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SupplyChainDashboard;
