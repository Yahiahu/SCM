import {
  Box,
  Flex,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Grid,
  GridItem,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Icon,
  Progress,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useColorModeValue,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Avatar,
  Divider,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Spinner,
} from "@chakra-ui/react";
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

const SupplyChainDashboard = () => {
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const highlightColor = useColorModeValue("blue.500", "blue.300");

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
    <><Navbar isLoggedIn={true} /><><Box p={4} maxW="container.xl" mx="auto">
      {/* Header */}
      <Flex justify="space-between" align="center" mb={8}>
      </Flex>

      {/* Search and Filters */}
      <Flex mb={8} gap={4} flexWrap="wrap" pt ={6}>
        <InputGroup flex="1" minW="300px">
          <InputLeftElement pointerEvents="none">
            <FaSearch color="gray.300" />
          </InputLeftElement>
          <Input placeholder="Search inventory, shipments..." />
        </InputGroup>
        <Select
          placeholder="All Locations"
          width="200px"
          icon={<FaMapMarkerAlt />}
        >
          <option>Warehouse 1</option>
          <option>Warehouse 2</option>
          <option>Factory A</option>
        </Select>
        <Select placeholder="All Status" width="200px" icon={<FaFilter />}>
          <option>In Stock</option>
          <option>Low Stock</option>
          <option>Out of Stock</option>
        </Select>
      </Flex>

      {/* Key Metrics */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4} mb={8}>
        <Card bg={cardBg} border="1px" borderColor={borderColor}>
          <CardBody>
            <Stat>
              <StatLabel>Total Inventory</StatLabel>
              <StatNumber>1,248 items</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                12% from last month
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg={cardBg} border="1px" borderColor={borderColor}>
          <CardBody>
            <Stat>
              <StatLabel>Active Shipments</StatLabel>
              <StatNumber>17</StatNumber>
              <StatHelpText>
                <StatArrow type="decrease" />3 delayed
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg={cardBg} border="1px" borderColor={borderColor}>
          <CardBody>
            <Stat>
              <StatLabel>Order Accuracy</StatLabel>
              <StatNumber>98.7%</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                1.2% improvement
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg={cardBg} border="1px" borderColor={borderColor}>
          <CardBody>
            <Stat>
              <StatLabel>Warehouse Capacity</StatLabel>
              <StatNumber>78%</StatNumber>
              <Progress value={78} size="sm" colorScheme="blue" mt={2} />
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Main Content */}
      <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={6}>
        {/* Left Column */}
        <GridItem>
          {/* Inventory Overview */}
          <Card bg={cardBg} border="1px" borderColor={borderColor} mb={6}>
            <CardHeader>
              <Flex align="center">
                <Icon as={MdInventory} mr={2} color={highlightColor} />
                <Heading size="md">Inventory Overview</Heading>
              </Flex>
            </CardHeader>
            <CardBody>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>SKU</Th>
                    <Th>Item</Th>
                    <Th isNumeric>Qty</Th>
                    <Th>Location</Th>
                    <Th>Status</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {inventoryItems.map((item) => (
                    <Tr key={item.id}>
                      <Td>{item.id}</Td>
                      <Td>{item.name}</Td>
                      <Td isNumeric>{item.quantity}</Td>
                      <Td>{item.location}</Td>
                      <Td>
                        <Badge
                          colorScheme={item.status === "In Stock"
                            ? "green"
                            : item.status === "Low Stock"
                              ? "yellow"
                              : "red"}
                        >
                          {item.status}
                        </Badge>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </CardBody>
            <CardFooter>
              <Button size="sm" variant="ghost" rightIcon={<FaArrowRight />}>
                View All Inventory
              </Button>
            </CardFooter>
          </Card>

          {/* Shipment Tracking */}
          <Card bg={cardBg} border="1px" borderColor={borderColor}>
            <CardHeader>
              <Flex align="center">
                <Icon as={FaTruck} mr={2} color={highlightColor} />
                <Heading size="md">Shipment Tracking</Heading>
              </Flex>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                {shipments.map((shipment) => (
                  <Card key={shipment.id} variant="outline">
                    <CardBody>
                      <Flex justify="space-between" flexWrap="wrap">
                        <Box>
                          <Text fontWeight="bold">{shipment.id}</Text>
                          <Text fontSize="sm" color="gray.500">
                            {shipment.origin} → {shipment.destination}
                          </Text>
                        </Box>
                        <Box>
                          <Badge
                            colorScheme={shipment.status === "Delivered"
                              ? "green"
                              : shipment.status === "Delayed"
                                ? "red"
                                : "blue"}
                          >
                            {shipment.status}
                          </Badge>
                          <Text fontSize="sm">
                            <Icon as={FaCalendarAlt} mr={1} />
                            ETA: {shipment.eta}
                          </Text>
                        </Box>
                      </Flex>
                      <Progress
                        value={shipment.status === "Delivered"
                          ? 100
                          : shipment.status === "Delayed"
                            ? 60
                            : 80}
                        size="sm"
                        colorScheme={shipment.status === "Delivered"
                          ? "green"
                          : shipment.status === "Delayed"
                            ? "red"
                            : "blue"}
                        mt={2} />
                    </CardBody>
                  </Card>
                ))}
              </VStack>
            </CardBody>
            <CardFooter>
              <Button size="sm" variant="ghost" rightIcon={<FaArrowRight />}>
                View All Shipments
              </Button>
            </CardFooter>
          </Card>
        </GridItem>

        {/* Right Column */}
        <GridItem>
          {/* Supply Chain Map */}
          <Card bg={cardBg} border="1px" borderColor={borderColor} mb={6}>
            <CardHeader>
              <Flex align="center">
                <Icon as={FaMapMarkerAlt} mr={2} color={highlightColor} />
                <Heading size="md">Network Map</Heading>
              </Flex>
            </CardHeader>
            <CardBody>
              <Box
                bg="gray.100"
                h="200px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                borderRadius="md"
              >
                <VStack>
                  <Spinner size="xl" />
                  <Text>Loading network visualization</Text>
                </VStack>
              </Box>
              <VStack spacing={3} mt={4} align="stretch">
                <HStack>
                  <Icon as={GiFactory} color="orange.500" />
                  <Text>2 Active Factories</Text>
                </HStack>
                <HStack>
                  <Icon as={FaWarehouse} color="blue.500" />
                  <Text>3 Warehouses</Text>
                </HStack>
                <HStack>
                  <Icon as={FaTruck} color="green.500" />
                  <Text>17 In-Transit Shipments</Text>
                </HStack>
              </VStack>
            </CardBody>
          </Card>

          {/* Recent Activity */}
          <Card bg={cardBg} border="1px" borderColor={borderColor}>
            <CardHeader>
              <Flex align="center">
                <Icon as={FaExchangeAlt} mr={2} color={highlightColor} />
                <Heading size="md">Recent Activity</Heading>
              </Flex>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <Box>
                  <Text fontWeight="bold">Inventory Update</Text>
                  <Text fontSize="sm" color="gray.500">
                    SKU-1002 quantity updated to 89
                  </Text>
                  <Text fontSize="xs">2 hours ago</Text>
                </Box>
                <Divider />
                <Box>
                  <Text fontWeight="bold">Shipment Delayed</Text>
                  <Text fontSize="sm" color="gray.500">
                    SH-1002 delayed by 2 days
                  </Text>
                  <Text fontSize="xs">5 hours ago</Text>
                </Box>
                <Divider />
                <Box>
                  <Text fontWeight="bold">New Order</Text>
                  <Text fontSize="sm" color="gray.500">
                    Order #45678 placed for Retail Store
                  </Text>
                  <Text fontSize="xs">1 day ago</Text>
                </Box>
              </VStack>
            </CardBody>
            <CardFooter>
              <Button size="sm" variant="ghost" rightIcon={<FaArrowRight />}>
                View All Activity
              </Button>
            </CardFooter>
          </Card>

          {/* Security Alerts */}
          <Card bg={cardBg} border="1px" borderColor={borderColor} mt={6}>
            <CardHeader>
              <Flex align="center">
                <Icon as={MdOutlineSecurity} mr={2} color="red.500" />
                <Heading size="md">Security Alerts</Heading>
              </Flex>
            </CardHeader>
            <CardBody>
              <Text fontSize="sm">
                <Badge colorScheme="green" mr={2}>
                  Secure
                </Badge>
                All systems operating normally
              </Text>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
    </Box><Footer /></></>

  );
};

export default SupplyChainDashboard;
