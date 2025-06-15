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
  Select,
  FormControl,
  FormLabel,
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
  FiPlus,
} from "react-icons/fi";
import { useState, useEffect, useRef } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

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
  id: number;
  message_body: string;
  timestamp: string;
  sender: {
    id: number;
    username: string;
    email: string;
  };
  receiver: {
    id: number;
    username: string;
    email: string;
  };
  poId?: number;
  attachments?: Attachment[];
  status?: "sent" | "delivered" | "read";
}

interface Attachment {
  id: number;
  file_url: string;
  file_type: string;
  name?: string;
  size?: string;
}

interface ChatThread {
  id: number;
  title: string;
  poId: number;
  createdBy: {
    id: number;
    username: string;
  };
  createdAt: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
}

export default function MessageBoardPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeThread, setActiveThread] = useState<number | null>(null);
  const [chatThreads, setChatThreads] = useState<ChatThread[]>([]);
  const [fileList, setFileList] = useState<Attachment[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/poconversationthread`);;
        if (!response.ok)
          throw new Error("Failed to load conversation threads");
        const threads = await response.json();

        // Enhance threads with last message info
        const enhancedThreads = await Promise.all(
          threads.map(async (thread: ChatThread) => {
            const messagesResponse = await fetch(
              `/api/chatmessage?threadId=${thread.id}`
            );
            const messagesData = messagesResponse.ok
              ? await messagesResponse.json()
              : [];

            return {
              ...thread,
              lastMessage: messagesData[0]?.message_body || "No messages yet",
              lastMessageTime: messagesData[0]?.timestamp || thread.createdAt,
              unreadCount: 0, // You'd track unread status in a real app
            };
          })
        );

        setChatThreads(enhancedThreads);
        if (enhancedThreads.length > 0) {
          setActiveThread(enhancedThreads[0].id);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load conversation threads",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchThreads();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      if (activeThread) {
        setIsLoading(true);
        try {
          const response = await fetch(
            `/api/chatmessage?threadId=${activeThread}`
          );
          if (!response.ok) throw new Error("Failed to load messages");

          const messagesData = await response.json();
          const enhancedMessages = messagesData.map((msg: Message) => ({
            ...msg,
            status: "read", // Default status
            attachments: msg.attachments || [],
          }));

          setMessages(enhancedMessages);

          // Fetch attachments for this thread
          const attachmentsResponse = await fetch(
            `/api/message_attachment?threadId=${activeThread}`
          );
          if (attachmentsResponse.ok) {
            setFileList(await attachmentsResponse.json());
          }
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to load messages",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchMessages();
  }, [activeThread]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (inputMessage.trim() === "" && !selectedFile) return;

    try {
      // Create new message
      const newMessage = {
        threadId: activeThread,
        message_body: inputMessage,
        senderId: 1, // Current user ID - should come from auth context
        receiverId: 2, // Would be dynamic in a real app
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chatmessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMessage),
      });

      if (!response.ok) throw new Error("Failed to send message");

      const createdMessage = await response.json();

      // Handle file upload if present
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("messageId", createdMessage.id.toString());

        const uploadResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/message_attachment`, {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) throw new Error("Failed to upload attachment");
        const attachment = await uploadResponse.json();
        createdMessage.attachments = [attachment];
      }

      setMessages([
        ...messages,
        {
          ...createdMessage,
          status: "sent",
          sender: { id: 1, username: "You", email: "" }, // Mock sender
          receiver: { id: 2, username: "Receiver", email: "" }, // Mock receiver
        },
      ]);

      setInputMessage("");
      setSelectedFile(null);

      toast({
        title: "Success",
        description: "Message sent",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to send message",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getStatusIcon = (status?: string) => {
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

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) return <Icon as={FiImage} />;
    if (fileType.startsWith("video/")) return <Icon as={FiVideo} />;
    return <Icon as={FiFile} />;
  };

  const getFileNameFromUrl = (url: string) => {
    return url.split("/").pop() || "file";
  };

  return (
    <ChakraProvider theme={theme}>
      <Navbar isLoggedIn={true} />
      <Flex height="calc(100vh - 128px)" pt={20} px={4} gap={4} bg="gray.50">
        {/* Sidebar - Conversation Threads */}
        <Card width="300px" overflow="hidden">
          <CardHeader bg="blue.50" color="black">
            <Flex justify="space-between" align="center">
              <Heading size="md">PO Conversations</Heading>
              <Button
                size="sm"
                leftIcon={<FiPlus />}
                variant="ghost"
                color="black"
                bg = "blue.100"
                onClick={onOpen}
              >
                New Thread
              </Button>
            </Flex>
            <InputGroup mt={3} size="sm">
              <Input
                placeholder="Search conversations..."
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
                onClick={() => setActiveThread(thread.id)}
                _hover={{ bg: "gray.50" }}
              >
                <Flex justify="space-between" align="center">
                  <Box>
                    <Text fontWeight="medium">{thread.title}</Text>
                    <Text
                      fontSize="sm"
                      color="gray.500"
                      isTruncated
                      maxW="180px"
                    >
                      {thread.lastMessage || "No messages yet"}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      PO #{thread.poId} • {formatDate(thread.createdAt)}
                    </Text>
                  </Box>
                  {thread.unreadCount && thread.unreadCount > 0 ? (
                    <Badge colorScheme="red" borderRadius="full" px={2}>
                      {thread.unreadCount}
                    </Badge>
                  ) : null}
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
                        chatThreads.find((t) => t.id === activeThread)?.title ||
                        ""
                      }
                      size="sm"
                      bg="brand.500"
                    />
                    <Box>
                      <Text fontWeight="medium">
                        {chatThreads.find((t) => t.id === activeThread)?.title}
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        PO #
                        {chatThreads.find((t) => t.id === activeThread)?.poId}
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
                        <MenuItem icon={<FiUser />}>View PO Details</MenuItem>
                        <MenuItem icon={<FiBell />}>
                          Mute Notifications
                        </MenuItem>
                        <MenuItem icon={<FiTrash2 />} color="red.500">
                          Delete Thread
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
                        align={
                          msg.sender.username === "You"
                            ? "flex-end"
                            : "flex-start"
                        }
                      >
                        <HStack spacing={2} align="flex-end" maxW="80%">
                          {msg.sender.username !== "You" && (
                            <Avatar
                              name={msg.sender.username}
                              size="xs"
                              src={`https://i.pravatar.cc/150?u=${msg.sender.id}`}
                            />
                          )}
                          <Box
                            bg={
                              msg.sender.username === "You"
                                ? "brand.100"
                                : "gray.100"
                            }
                            borderRadius="lg"
                            p={3}
                            position="relative"
                          >
                            {msg.sender.username !== "You" && (
                              <Text fontWeight="medium" fontSize="sm" mb={1}>
                                {msg.sender.username}
                              </Text>
                            )}
                            <Text>{msg.message_body}</Text>
                            {msg.attachments?.map((attachment) => (
                              <Card
                                key={attachment.id}
                                mt={2}
                                variant="outline"
                              >
                                <CardBody p={2}>
                                  <HStack>
                                    {getFileIcon(attachment.file_type)}
                                    <Box>
                                      <Text fontSize="sm">
                                        {getFileNameFromUrl(
                                          attachment.file_url
                                        )}
                                      </Text>
                                      <Text fontSize="xs" color="gray.500">
                                        {attachment.size || "Unknown size"}
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
                                    onClick={() =>
                                      window.open(attachment.file_url, "_blank")
                                    }
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
                              {msg.sender.username === "You" &&
                                getStatusIcon(msg.status)}
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
                          {getFileIcon(selectedFile.type)}
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

        {/* Right Panel - Shared Files */}
        <Card width="300px" overflow="hidden">
          <CardHeader
            bg="blue.50"
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
                          {getFileIcon(file.file_type)}
                          <Text fontSize="sm">
                            {getFileNameFromUrl(file.file_url)}
                          </Text>
                        </HStack>
                      </Td>
                      <Td isNumeric fontSize="sm" color="gray.500">
                        {file.size || "N/A"}
                      </Td>
                      <Td isNumeric>
                        <IconButton
                          size="xs"
                          icon={<FiDownload />}
                          aria-label={`Download ${getFileNameFromUrl(
                            file.file_url
                          )}`}
                          variant="ghost"
                          onClick={() => window.open(file.file_url, "_blank")}
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

      {/* New Thread Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Start New Conversation</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Purchase Order</FormLabel>
                <Select placeholder="Select PO">
                  {/* In a real app, you'd fetch POs from your API */}
                  <option value="1">PO #1 - Alpha Components</option>
                  <option value="2">PO #2 - Beta Electronics</option>
                  <option value="3">PO #3 - Gamma Mechanical</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Conversation Title</FormLabel>
                <Input placeholder="e.g., Shipping Delay Discussion" />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="brand"
              onClick={() => {
                toast({
                  title: "Conversation Created",
                  status: "success",
                  duration: 3000,
                  isClosable: true,
                });
                onClose();
              }}
            >
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Footer />
    </ChakraProvider>
  );
}
