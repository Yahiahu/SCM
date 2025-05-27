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
} from "@chakra-ui/react";
import { DownloadIcon,  } from "@chakra-ui/icons";
import { useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { FiSend } from "react-icons/fi"; 

const theme = extendTheme({});

export default function MessageBoardPage() {
  const messages = [
    { from: "other", text: "Hi, are we still on for the review today?" },
    { from: "me", text: "Yes, let's go over the design files." },
    { from: "other", text: "Great! I've uploaded the latest version." },
    { from: "me", text: "Thanks! I'll download it and check." },
  ];

  const sidebarChats = [
    "Project Kickoff",
    "Weekly Sync",
    "Design Review",
    "QA Follow-up",
    "Budget Planning",
    "Team Standup",
  ];

  const fileList = [
    { name: "Design_v2.pdf" },
    { name: "Meeting_Notes.docx" },
    { name: "Budget.xlsx" },
  ];

  return (
    <ChakraProvider theme={theme}>
      <Navbar isLoggedIn={false} />
      <Flex height="90vh" p={4} gap={4}>
        {/* Sidebar - Chat Threads */}
        <Box
          width="20%"
          borderRight="1px solid"
          borderColor="gray.200"
          overflowY="auto"
          p={2}
        >
          <VStack align="start" spacing={4}>
            {sidebarChats.map((chat, i) => (
              <Box key={i} p={2} borderRadius="md" _hover={{ bg: "gray.100" }}>
                <Text>{chat}</Text>
              </Box>
            ))}
          </VStack>
        </Box>

        {/* Main Chat Box */}
        <Flex
          flexDir="column"
          flex={1}
          border="1px solid"
          borderColor="gray.300"
          borderRadius="md"
          p={3}
        >
          <VStack spacing={4} align="stretch" flex={1} overflowY="auto">
            {messages.map((msg, index) => (
              <Flex
                key={index}
                justify={msg.from === "me" ? "flex-end" : "flex-start"}
              >
                <Box
                  bg={msg.from === "me" ? "blue.100" : "gray.100"}
                  borderRadius="lg"
                  p={3}
                  maxW="60%"
                >
                  <Text>{msg.text}</Text>
                </Box>
              </Flex>
            ))}
          </VStack>
          <HStack mt={4}>
            <Input placeholder="Type your message..." />
            <IconButton
              aria-label="Send"
              icon={<FiSend />}
              colorScheme="blue"
            />
          </HStack>
        </Flex>

        {/* Right Panel - Files */}
        <Box width="20%" borderLeft="1px solid" borderColor="gray.200" p={2}>
          <Text fontWeight="bold" mb={2}>
            Shared Files
          </Text>
          <Table size="sm" variant="simple">
            <Thead>
              <Tr>
                <Th>File Name</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {fileList.map((file, i) => (
                <Tr key={i}>
                  <Td>{file.name}</Td>
                  <Td textAlign="right">
                    <IconButton
                      size="sm"
                      icon={<DownloadIcon />}
                      aria-label={`Download ${file.name}`}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Flex>
      <Footer />
    </ChakraProvider>
  );
}
