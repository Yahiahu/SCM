"use client";

import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  Avatar,
  Input,
  IconButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  ChakraProvider,
  extendTheme,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Badge,
  Divider,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useToast,
  Spinner,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Tooltip,
  Image,
  InputGroup,
  InputRightElement,
  Icon,
  Heading,
} from "@chakra-ui/react";
import {
  FiSend,
  FiDownload,
  FiPaperclip,
  FiMoreVertical,
  FiSearch,
  FiUser,
  FiUsers,
  FiFile,
  FiImage,
  FiVideo,
  FiMessageSquare,
  FiBell,
  FiCheck,
  FiClock,
  FiTrash2,
  FiUpload,
} from "react-icons/fi";
import { useState, useEffect, useRef } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

// Custom theme with blue color scheme
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

interface Message {
  id: string;
  from: string;
  text: string;
  timestamp: Date;
  status: "sent" | "delivered" | "read";
  attachments?: Attachment[];
}

interface Attachment {
  id: string;
  type: "file" | "image" | "video";
  name: string;
  url: string;
  size?: string;
}

interface ChatThread {
  id: string;
  name: string;
  participants: string[];
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  isGroup: boolean;
}

export default function MessageBoardPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeThread, setActiveThread] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock data for chat threads
  const [chatThreads, setChatThreads] = useState<ChatThread[]>([
    {
      id: "1",
      name: "Project Kickoff",
      participants: ["Alice", "Bob", "You"],
      lastMessage: "Let's schedule our next meeting",
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 5),
      unreadCount: 2,
      isGroup: true,
    },
    {
      id: "2",
      name: "Design Review",
      participants: ["Design Team"],
      lastMessage: "I've shared the latest mockups",
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 30),
      unreadCount: 0,
      isGroup: true,
    },
    {
      id: "3",
      name: "Alice",
      participants: ["Alice"],
      lastMessage: "Thanks for the feedback!",
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2),
      unreadCount: 0,
      isGroup: false,
    },
    {
      id: "4",
      name: "Weekly Sync",
      participants: ["Team"],
      lastMessage: "Action items updated",
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24),
      unreadCount: 5,
      isGroup: true,
    },
    {
      id: "5",
      name: "Bob",
      participants: ["Bob"],
      lastMessage: "Can you review the PR?",
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 48),
      unreadCount: 0,
      isGroup: false,
    },
  ]);

  // Mock data for shared files
  const [fileList, setFileList] = useState<Attachment[]>([
    {
      id: "1",
      type: "file",
      name: "Design_v2.pdf",
      url: "#",
      size: "2.4 MB",
    },
    {
      id: "2",
      type: "image",
      name: "Screenshot.png",
      url: "#",
      size: "1.2 MB",
    },
    {
      id: "3",
      type: "file",
      name: "Meeting_Notes.docx",
      url: "#",
      size: "0.5 MB",
    },
    {
      id: "4",
      type: "video",
      name: "Demo.mp4",
      url: "#",
      size: "15.8 MB",
    },
  ]);

  // Load messages for active thread
  useEffect(() => {
    if (activeThread) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        const mockMessages: Message[] = [
          {
            id: "1",
            from: "Alice",
            text: "Hi, are we still on for the review today?",
            timestamp: new Date(Date.now() - 1000 * 60 * 30),
            status: "read",
          },
          {
            id: "2",
            from: "You",
            text: "Yes, let's go over the design files.",
            timestamp: new Date(Date.now() - 1000 * 60 * 25),
            status: "read",
          },
          {
            id: "3",
            from: "Alice",
            text: "Great! I've uploaded the latest version.",
            timestamp: new Date(Date.now() - 1000 * 60 * 20),
            status: "read",
            attachments: [
              {
                id: "a1",
                type: "file",
                name: "Design_v3.sketch",
                url: "#",
                size: "8.2 MB",
              },
            ],
          },
          {
            id: "4",
            from: "You",
            text: "Thanks! I'll download it and check.",
            timestamp: new Date(Date.now() - 1000 * 60 * 15),
            status: "read",
          },
          {
            id: "5",
            from: "Alice",
            text: "Let me know if you have any feedback.",
            timestamp: new Date(Date.now() - 1000 * 60 * 10),
            status: "read",
          },
        ];
        setMessages(mockMessages);
        setIsLoading(false);
      }, 500);
    }
  }, [activeThread]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (inputMessage.trim() === "" && !selectedFile) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      from: "You",
      text: inputMessage,
      timestamp: new Date(),
      status: "sent",
      ...(selectedFile && {
        attachments: [
          {
            id: Date.now().toString(),
            type: selectedFile.type.startsWith("image")
              ? "image"
              : selectedFile.type.startsWith("video")
              ? "video"
              : "file",
            name: selectedFile.name,
            url: URL.createObjectURL(selectedFile),
            size: `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`,
          },
        ],
      }),
    };

    setMessages([...messages, newMessage]);
    setInputMessage("");
    setSelectedFile(null);

    // Simulate reply
    setTimeout(() => {
      const replyMessage: Message = {
        id: (Date.now() + 1).toString(),
        from: activeThread?.startsWith("Project") ? "Bob" : "Alice",
        text: "Thanks for your message! I'll get back to you soon.",
        timestamp: new Date(),
        status: "delivered",
      };
      setMessages((prev) => [...prev, replyMessage]);
    }, 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sent":
        return <Icon as={FiCheck} color="gray.500" size="12px" />;
      case "delivered":
        return <Icon as={FiCheck} color="gray.500" size="12px" />;
      case "read":
        return <Icon as={FiCheck} color="blue.500" size="12px" />;
      default:
        return null;
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "image":
        return <Icon as={FiImage} />;
      case "video":
        return <Icon as={FiVideo} />;
      default:
        return <Icon as={FiFile} />;
    }
  };

  return (
    <ChakraProvider theme={theme}>
      <Navbar isLoggedIn={true} />
      <Flex height="calc(100vh - 128px)" pt = {20} px={4} gap={4} bg="gray.50">
        {/* Sidebar - Chat Threads */}
        <Card width="300px" overflow="hidden">
          <CardHeader bg="brand.500" color="white">
            <Flex justify="space-between" align="center">
              <Heading size="md">Messages</Heading>
              <Button
                size="sm"
                leftIcon={<FiUsers />}
                variant="ghost"
                color="white"
              >
                New Chat
              </Button>
            </Flex>
            <InputGroup mt={3} size="sm">
              <Input
                placeholder="Search messages..."
                bg="white"
                color="gray.800"
              />
              <InputRightElement>
                <Icon as={FiSearch} color="gray.500" />
              </InputRightElement>
            </InputGroup>
          </CardHeader>
          <CardBody p={0} overflowY="auto">
            {chatThreads.map((thread) => (
              <Box
                key={thread.id}
                p={3}
                borderBottom="1px solid"
                borderColor="gray.100"
                bg={activeThread === thread.id ? "brand.50" : "white"}
                cursor="pointer"
                onClick={() => {
                  setActiveThread(thread.id);
                  // Mark as read
                  setChatThreads((prev) =>
                    prev.map((t) =>
                      t.id === thread.id ? { ...t, unreadCount: 0 } : t
                    )
                  );
                }}
                _hover={{ bg: "gray.50" }}
              >
                <Flex justify="space-between" align="center">
                  <HStack>
                    <Avatar
                      name={
                        thread.isGroup ? thread.name : thread.participants[0]
                      }
                      size="sm"
                      bg="brand.500"
                    />
                    <Box>
                      <Text fontWeight="medium">{thread.name}</Text>
                      <Text
                        fontSize="sm"
                        color="gray.500"
                        isTruncated
                        maxW="180px"
                      >
                        {thread.lastMessage}
                      </Text>
                    </Box>
                  </HStack>
                  <VStack align="flex-end" spacing={0}>
                    <Text fontSize="xs" color="gray.500">
                      {formatTime(thread.lastMessageTime)}
                    </Text>
                    {thread.unreadCount > 0 && (
                      <Badge
                        colorScheme="red"
                        borderRadius="full"
                        px={2}
                        py={0.5}
                      >
                        {thread.unreadCount}
                      </Badge>
                    )}
                  </VStack>
                </Flex>
              </Box>
            ))}
          </CardBody>
        </Card>

        {/* Main Chat Area */}
        <Card flex={1} display="flex" flexDirection="column">
          {activeThread ? (
            <>
              <CardHeader
                bg="gray.50"
                borderBottom="1px solid"
                borderColor="gray.200"
              >
                <Flex justify="space-between" align="center">
                  <HStack>
                    <Avatar
                      name={
                        chatThreads.find((t) => t.id === activeThread)?.name ||
                        ""
                      }
                      size="sm"
                    />
                    <Box>
                      <Text fontWeight="medium">
                        {chatThreads.find((t) => t.id === activeThread)?.name}
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        {chatThreads.find((t) => t.id === activeThread)?.isGroup
                          ? `${
                              chatThreads.find((t) => t.id === activeThread)
                                ?.participants.length
                            } participants`
                          : "Online"}
                      </Text>
                    </Box>
                  </HStack>
                  <HStack>
                    <Tooltip label="Search conversation">
                      <IconButton
                        aria-label="Search"
                        icon={<FiSearch />}
                        variant="ghost"
                        size="sm"
                      />
                    </Tooltip>
                    <Menu>
                      <MenuButton
                        as={IconButton}
                        aria-label="Options"
                        icon={<FiMoreVertical />}
                        variant="ghost"
                        size="sm"
                      />
                      <MenuList>
                        <MenuItem icon={<FiUser />}>View Profile</MenuItem>
                        <MenuItem icon={<FiBell />}>
                          Mute Notifications
                        </MenuItem>
                        <MenuItem icon={<FiUsers />}>Add Participants</MenuItem>
                        <MenuItem icon={<FiTrash2 />} color="red.500">
                          Delete Chat
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </HStack>
                </Flex>
              </CardHeader>
              <CardBody p={4} overflowY="auto" flex={1}>
                {isLoading ? (
                  <Flex justify="center" align="center" height="100%">
                    <Spinner size="xl" color="brand.500" />
                  </Flex>
                ) : (
                  <VStack spacing={4} align="stretch">
                    {messages.map((msg) => (
                      <Flex
                        key={msg.id}
                        direction="column"
                        align={msg.from === "You" ? "flex-end" : "flex-start"}
                      >
                        <HStack spacing={2} align="flex-end" maxW="80%">
                          {msg.from !== "You" && (
                            <Avatar
                              name={msg.from}
                              size="xs"
                              src={
                                msg.from === "Alice" ? "/alice.jpg" : "/bob.jpg"
                              }
                            />
                          )}
                          <Box
                            bg={msg.from === "You" ? "brand.100" : "gray.100"}
                            borderRadius="lg"
                            p={3}
                            position="relative"
                          >
                            {msg.from !== "You" && (
                              <Text fontWeight="medium" fontSize="sm" mb={1}>
                                {msg.from}
                              </Text>
                            )}
                            <Text>{msg.text}</Text>
                            {msg.attachments?.map((attachment) => (
                              <Card
                                key={attachment.id}
                                mt={2}
                                variant="outline"
                              >
                                <CardBody p={2}>
                                  <HStack>
                                    {getFileIcon(attachment.type)}
                                    <Box>
                                      <Text fontSize="sm">
                                        {attachment.name}
                                      </Text>
                                      <Text fontSize="xs" color="gray.500">
                                        {attachment.size}
                                      </Text>
                                    </Box>
                                  </HStack>
                                </CardBody>
                                <CardFooter p={0}>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    leftIcon={<FiDownload />}
                                    width="100%"
                                  >
                                    Download
                                  </Button>
                                </CardFooter>
                              </Card>
                            ))}
                            <HStack
                              spacing={1}
                              position="absolute"
                              bottom={-4}
                              right={2}
                            >
                              <Text fontSize="xs" color="gray.500">
                                {formatTime(msg.timestamp)}
                              </Text>
                              {msg.from === "You" && getStatusIcon(msg.status)}
                            </HStack>
                          </Box>
                        </HStack>
                      </Flex>
                    ))}
                    <div ref={messagesEndRef} />
                  </VStack>
                )}
              </CardBody>
              <CardFooter
                borderTop="1px solid"
                borderColor="gray.200"
                pt={3}
                pb={2}
              >
                <VStack width="100%" spacing={2}>
                  {selectedFile && (
                    <Card variant="outline" width="100%" p={2}>
                      <Flex justify="space-between" align="center">
                        <HStack>
                          {getFileIcon(
                            selectedFile.type.startsWith("image")
                              ? "image"
                              : selectedFile.type.startsWith("video")
                              ? "video"
                              : "file"
                          )}
                          <Text fontSize="sm" isTruncated maxW="200px">
                            {selectedFile.name}
                          </Text>
                        </HStack>
                        <IconButton
                          aria-label="Remove file"
                          icon={<FiTrash2 />}
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedFile(null)}
                        />
                      </Flex>
                    </Card>
                  )}
                  <HStack width="100%">
                    <Input
                      placeholder="Type your message..."
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleSendMessage()
                      }
                    />
                    <input
                      type="file"
                      id="file-upload"
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                    />
                    <Tooltip label="Attach file">
                      <label htmlFor="file-upload">
                        <IconButton
                          aria-label="Attach file"
                          icon={<FiPaperclip />}
                          variant="ghost"
                          as="span"
                          cursor="pointer"
                        />
                      </label>
                    </Tooltip>
                    <IconButton
                      aria-label="Send message"
                      icon={<FiSend />}
                      colorScheme="brand"
                      onClick={handleSendMessage}
                      isDisabled={!inputMessage && !selectedFile}
                    />
                  </HStack>
                </VStack>
              </CardFooter>
            </>
          ) : (
            <Flex
              direction="column"
              justify="center"
              align="center"
              height="100%"
              color="gray.500"
            >
              <Icon as={FiMessageSquare} boxSize={10} mb={4} />
              <Text fontSize="lg">
                Select a conversation to start messaging
              </Text>
            </Flex>
          )}
        </Card>

        {/* Right Panel - Files and Details */}
        <Card width="300px" overflow="hidden">
          <CardHeader
            bg="gray.50"
            borderBottom="1px solid"
            borderColor="gray.200"
          >
            <Heading size="md">Shared Files</Heading>
          </CardHeader>
          <CardBody p={0} overflowY="auto">
            {fileList.length > 0 ? (
              <Table size="sm" variant="simple">
                <Thead>
                  <Tr>
                    <Th>File</Th>
                    <Th isNumeric>Size</Th>
                    <Th></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {fileList.map((file) => (
                    <Tr key={file.id} _hover={{ bg: "gray.50" }}>
                      <Td>
                        <HStack>
                          {getFileIcon(file.type)}
                          <Text fontSize="sm">{file.name}</Text>
                        </HStack>
                      </Td>
                      <Td isNumeric fontSize="sm" color="gray.500">
                        {file.size}
                      </Td>
                      <Td isNumeric>
                        <IconButton
                          size="xs"
                          icon={<FiDownload />}
                          aria-label={`Download ${file.name}`}
                          variant="ghost"
                        />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            ) : (
              <Text p={4} color="gray.500" textAlign="center">
                No files shared yet
              </Text>
            )}
          </CardBody>
          <CardFooter borderTop="1px solid" borderColor="gray.200">
            <Button
              size="sm"
              variant="outline"
              leftIcon={<FiUpload />}
              width="100%"
              onClick={onOpen}
            >
              Upload File
            </Button>
          </CardFooter>
        </Card>
      </Flex>

      {/* File Upload Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Upload File</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Box
                border="2px dashed"
                borderColor="gray.300"
                borderRadius="md"
                p={8}
                textAlign="center"
                width="100%"
              >
                <input
                  type="file"
                  id="modal-file-upload"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setSelectedFile(e.target.files[0]);
                      onClose();
                    }
                  }}
                />
                <label htmlFor="modal-file-upload">
                  <VStack spacing={2} cursor="pointer">
                    <Icon as={FiUpload} boxSize={8} color="gray.500" />
                    <Text>Click to browse or drag and drop</Text>
                    <Text fontSize="sm" color="gray.500">
                      Max file size: 25MB
                    </Text>
                  </VStack>
                </label>
              </Box>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Footer />
    </ChakraProvider>
  );
}
