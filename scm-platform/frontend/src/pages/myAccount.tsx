"use client";

import {
  Box,
  Flex,
  Heading,
  Avatar,
  Text,
  VStack,
  HStack,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  FormControl,
  FormLabel,
  Input,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useToast,
  Badge,
  Divider,
  Icon,
  Select,
} from "@chakra-ui/react";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiEdit2,
  FiLock,
  FiSave,
  FiX,
  FiShield,
  FiTruck,
  FiHome,
} from "react-icons/fi";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

// Custom theme with blue color scheme (same as shipping page)
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
  },
});

interface UserData {
  id: number;
  username: string;
  email: string;
  phone: string;
  role: string;
  organization: {
    id: number;
    name: string;
    type: string;
  };
}

export default function MyAccountPage() {
  const router = useRouter();
  const toast = useToast();
  const [user, setUser] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Mock user data fetch
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800));

        const mockUser: UserData = {
          id: 1,
          username: "supplychain_pro",
          email: "user@supplychain.com",
          phone: "+1 (555) 123-4567",
          role: "Supply Chain Manager",
          organization: {
            id: 101,
            name: "Global Logistics Inc.",
            type: "Logistics Provider",
          },
        };

        setUser(mockUser);
        setFormData({
          email: mockUser.email,
          phone: mockUser.phone || "",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load user data",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [toast]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveChanges = () => {
    // In a real app, this would call an API to update the user
    if (user) {
      setUser({
        ...user,
        email: formData.email,
        phone: formData.phone,
      });
      toast({
        title: "Profile updated",
        description: "Your changes have been saved",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    if (user) {
      setFormData({
        email: user.email,
        phone: user.phone || "",
      });
    }
    setIsEditing(false);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "red";
      case "supply chain manager":
        return "blue";
      case "logistics coordinator":
        return "green";
      case "warehouse operator":
        return "orange";
      default:
        return "gray";
    }
  };

  return (
    <ChakraProvider theme={theme}>
      <Box minHeight="100vh" display="flex" flexDirection="column">
        <Navbar isLoggedIn={true} />

        <Box flex="1" pt={20} px={6} bg="gray.50">
          <Flex direction="column" gap={6} maxW="1200px" mx="auto">
            {/* Header */}
            <Flex justify="space-between" align="center">
              <Heading size="xl" color="gray.800">
                My Account
              </Heading>
              <Button
                leftIcon={<FiEdit2 />}
                colorScheme="brand"
                onClick={handleEditToggle}
              >
                {isEditing ? "Cancel Editing" : "Edit Profile"}
              </Button>
            </Flex>

            {/* Main Content */}
            <Flex direction={{ base: "column", lg: "row" }} gap={6}>
              {/* Left Column - Profile Info */}
              <Box flex={1}>
                <Card boxShadow="sm">
                  <CardHeader>
                    <Heading size="md">Profile Information</Heading>
                  </CardHeader>
                  <CardBody>
                    {isLoading ? (
                      <VStack spacing={4} align="stretch">
                        {[...Array(5)].map((_, i) => (
                          <Box key={i}>
                            <Box h="20px" w="100px" bg="gray.200" mb={2} />
                            <Box h="40px" bg="gray.100" borderRadius="md" />
                          </Box>
                        ))}
                      </VStack>
                    ) : user ? (
                      <VStack spacing={4} align="stretch">
                        <Flex align="center" gap={4}>
                          <Avatar
                            size="xl"
                            name={user.username}
                            bg="brand.500"
                            color="white"
                            icon={<FiUser />}
                          />
                          <Box>
                            <Heading size="md">{user.username}</Heading>
                            <Badge
                              colorScheme={getRoleBadgeColor(user.role)}
                              mt={1}
                              px={2}
                              py={1}
                              borderRadius="full"
                            >
                              {user.role}
                            </Badge>
                          </Box>
                        </Flex>

                        <Divider my={2} />

                        <FormControl>
                          <FormLabel>Email</FormLabel>
                          {isEditing ? (
                            <Input
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                            
                            />
                          ) : (
                            <HStack>
                              <Icon as={FiMail} color="gray.500" />
                              <Text>{user.email}</Text>
                            </HStack>
                          )}
                        </FormControl>

                        <FormControl>
                          <FormLabel>Phone</FormLabel>
                          {isEditing ? (
                            <Input
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                            />
                          ) : (
                            <HStack>
                              <Icon as={FiPhone} color="gray.500" />
                              <Text>{user.phone || "Not provided"}</Text>
                            </HStack>
                          )}
                        </FormControl>

                        {isEditing && (
                          <HStack justify="flex-end" mt={4}>
                            <Button
                              variant="outline"
                              leftIcon={<FiX />}
                              onClick={handleCancelEdit}
                            >
                              Cancel
                            </Button>
                            <Button
                              colorScheme="brand"
                              leftIcon={<FiSave />}
                              onClick={handleSaveChanges}
                            >
                              Save Changes
                            </Button>
                          </HStack>
                        )}
                      </VStack>
                    ) : (
                      <Text>No user data available</Text>
                    )}
                  </CardBody>
                </Card>

                {/* Organization Card */}
                {user && (
                  <Card boxShadow="sm" mt={6}>
                    <CardHeader>
                      <Heading size="md">Organization</Heading>
                    </CardHeader>
                    <CardBody>
                      <VStack spacing={4} align="stretch">
                        <HStack>
                          <Icon as={FiHome} color="brand.500" boxSize={5} />
                          <Text fontWeight="medium">
                            {user.organization.name}
                          </Text>
                        </HStack>
                        <HStack>
                          <Icon as={FiTruck} color="brand.500" boxSize={5} />
                          <Text>{user.organization.type}</Text>
                        </HStack>
                        <Button
                          variant="outline"
                          colorScheme="brand"
                          mt={2}
                          onClick={() =>
                            router.push(`/organization/${user.organization.id}`)
                          }
                        >
                          View Organization Details
                        </Button>
                      </VStack>
                    </CardBody>
                  </Card>
                )}
              </Box>

              {/* Right Column - Security & Preferences */}
              <Box flex={1}>
                <Card boxShadow="sm">
                  <CardHeader>
                    <Heading size="md">Security</Heading>
                  </CardHeader>
                  <CardBody>
                    <VStack spacing={4} align="stretch">
                      <HStack justify="space-between">
                        <HStack>
                          <Icon as={FiLock} color="brand.500" />
                          <Text>Password</Text>
                        </HStack>
                        <Button
                          variant="outline"
                          colorScheme="brand"
                          onClick={onOpen}
                        >
                          Change Password
                        </Button>
                      </HStack>

                      <HStack justify="space-between">
                        <HStack>
                          <Icon as={FiShield} color="brand.500" />
                          <Text>Two-Factor Authentication</Text>
                        </HStack>
                        <Badge colorScheme="orange">Not Enabled</Badge>
                      </HStack>
                    </VStack>
                  </CardBody>
                </Card>

                {/* Preferences Card */}
                <Card boxShadow="sm" mt={6}>
                  <CardHeader>
                    <Heading size="md">Preferences</Heading>
                  </CardHeader>
                  <CardBody>
                    <VStack spacing={4} align="stretch">
                      <FormControl>
                        <FormLabel>Default Dashboard View</FormLabel>
                        <Select>
                          <option value="shipping">Shipping Dashboard</option>
                          <option value="inventory">Inventory Overview</option>
                          <option value="analytics">
                            Supply Chain Analytics
                          </option>
                        </Select>
                      </FormControl>

                      <FormControl>
                        <FormLabel>Notification Preferences</FormLabel>
                        <Select>
                          <option value="all">All Notifications</option>
                          <option value="important">
                            Only Important Updates
                          </option>
                          <option value="none">No Notifications</option>
                        </Select>
                      </FormControl>

                      <Button
                        colorScheme="brand"
                        mt={4}
                        onClick={() =>
                          toast({
                            title: "Preferences Saved",
                            status: "success",
                            duration: 3000,
                            isClosable: true,
                          })
                        }
                      >
                        Save Preferences
                      </Button>
                    </VStack>
                  </CardBody>
                </Card>

                {/* Account Actions Card */}
                <Card boxShadow="sm" mt={6}>
                  <CardHeader>
                    <Heading size="md">Account Actions</Heading>
                  </CardHeader>
                  <CardBody>
                    <VStack spacing={4} align="stretch">
                      <Button variant="outline" colorScheme="red">
                        Deactivate Account
                      </Button>
                      <Text fontSize="sm" color="gray.500">
                        Deactivating your account will remove your access but
                        preserve your data for 30 days.
                      </Text>
                    </VStack>
                  </CardBody>
                </Card>
              </Box>
            </Flex>
          </Flex>
        </Box>

        <Footer />

        {/* Change Password Modal */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Change Password</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Current Password</FormLabel>
                  <Input type="password" placeholder="Enter current password" />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>New Password</FormLabel>
                  <Input type="password" placeholder="Enter new password" />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Confirm New Password</FormLabel>
                  <Input type="password" placeholder="Confirm new password" />
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="brand">Update Password</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </ChakraProvider>
  );
}
