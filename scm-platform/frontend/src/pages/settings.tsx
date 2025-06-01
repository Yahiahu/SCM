"use client";

import {
  Box,
  Flex,
  Heading,
  VStack,
  HStack,
  Card,
  CardHeader,
  CardBody,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  Divider,
  Icon,
  Select,
  Switch,
  Text,
  Badge,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  FiSettings,
  FiBell,
  FiClock,
  FiCalendar,
  FiGlobe,
  FiDatabase,
  FiLayers,
} from "react-icons/fi";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { useState } from "react";

export default function SettingsPage() {
  const toast = useToast();
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    timezone: "UTC",
    dateFormat: "MM/DD/YYYY",
    language: "en-US",
    dataRefreshRate: 30,
    enableAnalytics: true,
  });

  // Using the same blue color scheme from your account page
  const brandColor = "#03a9f4";
  const brandHoverColor = "#0288d1";
  const cardBg = useColorModeValue("white", "gray.800");
  const bodyBg = useColorModeValue("gray.50", "gray.900");

  const handleSettingChange = (field: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const saveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box minHeight="100vh" display="flex" flexDirection="column" bg={bodyBg}>
      <Navbar isLoggedIn={true} />

      <Box flex="1" pt={20} px={6} bg={bodyBg}>
        <Flex direction="column" gap={6} maxW="1200px" mx="auto">
          {/* Header */}
          <Flex align="center" gap={4}>
            <Icon as={FiSettings} boxSize={8} color={brandColor} />
            <Heading size="xl" color={useColorModeValue("gray.800", "white")}>
              Settings
            </Heading>
          </Flex>

          {/* Main Content */}
          <Flex direction={{ base: "column", lg: "row" }} gap={6}>
            {/* Left Column - General Settings */}
            <Box flex={1}>
              <Card bg={cardBg} boxShadow="sm">
                <CardHeader>
                  <Heading size="md">General Settings</Heading>
                </CardHeader>
                <CardBody>
                  <VStack spacing={6} align="stretch">
                    <FormControl>
                      <FormLabel>Language</FormLabel>
                      <HStack>
                        <Icon as={FiGlobe} color="gray.500" />
                        <Select
                          value={settings.language}
                          onChange={(e) =>
                            handleSettingChange("language", e.target.value)
                          }
                        >
                          <option value="en-US">English (US)</option>
                          <option value="es-ES">Spanish</option>
                          <option value="fr-FR">French</option>
                          <option value="de-DE">German</option>
                        </Select>
                      </HStack>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Timezone</FormLabel>
                      <HStack>
                        <Icon as={FiClock} color="gray.500" />
                        <Select
                          value={settings.timezone}
                          onChange={(e) =>
                            handleSettingChange("timezone", e.target.value)
                          }
                        >
                          <option value="UTC">UTC</option>
                          <option value="EST">Eastern Time (EST)</option>
                          <option value="PST">Pacific Time (PST)</option>
                          <option value="CET">
                            Central European Time (CET)
                          </option>
                        </Select>
                      </HStack>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Date Format</FormLabel>
                      <HStack>
                        <Icon as={FiCalendar} color="gray.500" />
                        <Select
                          value={settings.dateFormat}
                          onChange={(e) =>
                            handleSettingChange("dateFormat", e.target.value)
                          }
                        >
                          <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                          <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                          <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                        </Select>
                      </HStack>
                    </FormControl>

                    <FormControl display="flex" alignItems="center">
                      <HStack>
                        <Icon as={FiLayers} color="gray.500" />
                        <Box>
                          <FormLabel mb="0">Dark Mode</FormLabel>
                          <Text fontSize="sm" color="gray.500">
                            Switch between light and dark theme
                          </Text>
                        </Box>
                      </HStack>
                      <Switch
                        isChecked={settings.darkMode}
                        onChange={(e) =>
                          handleSettingChange("darkMode", e.target.checked)
                        }
                        colorScheme="blue"
                        ml="auto"
                      />
                    </FormControl>
                  </VStack>
                </CardBody>
              </Card>

              {/* Data Settings Card */}
              <Card bg={cardBg} boxShadow="sm" mt={6}>
                <CardHeader>
                  <Heading size="md">Data & Refresh</Heading>
                </CardHeader>
                <CardBody>
                  <VStack spacing={6} align="stretch">
                    <FormControl>
                      <FormLabel>Data Refresh Rate (seconds)</FormLabel>
                      <HStack>
                        <Icon as={FiDatabase} color="gray.500" />
                        <Select
                          value={settings.dataRefreshRate}
                          onChange={(e) =>
                            handleSettingChange(
                              "dataRefreshRate",
                              parseInt(e.target.value)
                            )
                          }
                        >
                          <option value="15">15 seconds</option>
                          <option value="30">30 seconds</option>
                          <option value="60">1 minute</option>
                          <option value="300">5 minutes</option>
                        </Select>
                      </HStack>
                    </FormControl>

                    <FormControl display="flex" alignItems="center">
                      <HStack>
                        <Icon as={FiLayers} color="gray.500" />
                        <Box>
                          <FormLabel mb="0">Enable Analytics</FormLabel>
                          <Text fontSize="sm" color="gray.500">
                            Share usage data to help improve the platform
                          </Text>
                        </Box>
                      </HStack>
                      <Switch
                        isChecked={settings.enableAnalytics}
                        onChange={(e) =>
                          handleSettingChange(
                            "enableAnalytics",
                            e.target.checked
                          )
                        }
                        colorScheme="blue"
                        ml="auto"
                      />
                    </FormControl>
                  </VStack>
                </CardBody>
              </Card>
            </Box>

            {/* Right Column - Notification Settings */}
            <Box flex={1}>
              <Card bg={cardBg} boxShadow="sm">
                <CardHeader>
                  <Heading size="md">Notification Preferences</Heading>
                </CardHeader>
                <CardBody>
                  <VStack spacing={6} align="stretch">
                    <FormControl display="flex" alignItems="center">
                      <HStack>
                        <Icon as={FiBell} color="gray.500" />
                        <Box>
                          <FormLabel mb="0">Enable Notifications</FormLabel>
                          <Text fontSize="sm" color="gray.500">
                            Receive system and alert notifications
                          </Text>
                        </Box>
                      </HStack>
                      <Switch
                        isChecked={settings.notifications}
                        onChange={(e) =>
                          handleSettingChange("notifications", e.target.checked)
                        }
                        colorScheme="blue"
                        ml="auto"
                      />
                    </FormControl>

                    {settings.notifications && (
                      <>
                        <Divider />

                        <FormControl>
                          <FormLabel>Email Notifications</FormLabel>
                          <Select>
                            <option value="all">All notifications</option>
                            <option value="important">
                              Only important alerts
                            </option>
                            <option value="none">No email notifications</option>
                          </Select>
                        </FormControl>

                        <FormControl>
                          <FormLabel>In-App Notifications</FormLabel>
                          <Select>
                            <option value="all">All notifications</option>
                            <option value="important">
                              Only important alerts
                            </option>
                          </Select>
                        </FormControl>

                        <FormControl>
                          <FormLabel>Mobile Push Notifications</FormLabel>
                          <Select>
                            <option value="important">
                              Only important alerts
                            </option>
                            <option value="critical">
                              Only critical alerts
                            </option>
                            <option value="none">No push notifications</option>
                          </Select>
                        </FormControl>
                      </>
                    )}
                  </VStack>
                </CardBody>
              </Card>

              {/* System Status Card */}
              <Card bg={cardBg} boxShadow="sm" mt={6}>
                <CardHeader>
                  <Heading size="md">System Status</Heading>
                </CardHeader>
                <CardBody>
                  <VStack spacing={4} align="stretch">
                    <HStack justify="space-between">
                      <Text>API Status</Text>
                      <Badge colorScheme="green" px={2} py={1}>
                        Operational
                      </Badge>
                    </HStack>
                    <HStack justify="space-between">
                      <Text>Database Status</Text>
                      <Badge colorScheme="green" px={2} py={1}>
                        Connected
                      </Badge>
                    </HStack>
                    <HStack justify="space-between">
                      <Text>Last Sync</Text>
                      <Text>2 minutes ago</Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text>Version</Text>
                      <Text>v2.4.1</Text>
                    </HStack>
                  </VStack>
                </CardBody>
              </Card>

              {/* Save Button */}
              <Button
                bg={brandColor}
                color="white"
                _hover={{ bg: brandHoverColor }}
                size="lg"
                width="full"
                mt={6}
                onClick={saveSettings}
              >
                Save All Settings
              </Button>
            </Box>
          </Flex>
        </Flex>
      </Box>

      <Footer />
    </Box>
  );
}
