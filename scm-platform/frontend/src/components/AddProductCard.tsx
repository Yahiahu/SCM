import { AddIcon } from "@chakra-ui/icons";
import { Box, Center, Icon, VStack } from "@chakra-ui/react"; // Make sure Icon and VStack are imported
import { useRouter } from "next/router";
import { useColorModeValue } from "@chakra-ui/react";
import { Image } from "@chakra-ui/react";
import { Text } from "@chakra-ui/react";

function AddProductCard() {
  const router = useRouter();

  return (
    <Center py={6}>
      <Box
        maxW={"300px"}
        w={"full"}
        h={"368px"} // Match the approximate height of the ProductProfileCard
        bg={useColorModeValue("gray.50", "gray.700")}
        boxShadow={"lg"}
        rounded={"md"}
        overflow={"hidden"}
        border={`2px dashed ${useColorModeValue("gray.300", "gray.600")}`}
        display="flex"
        alignItems="center"
        justifyContent="center"
        cursor="pointer"
        transition="all 0.2s ease-in-out"
        _hover={{
          boxShadow: "xl",
          borderColor: "cyan.400",
          bg: useColorModeValue("gray.100", "gray.600"),
        }}
        onClick={() => router.push("/product/new")} // Or trigger a modal
      >
        <VStack spacing={4}>
          <Icon as={AddIcon} w={10} h={10} color="gray.400" />
          <Text color="gray.500" fontWeight="medium">
            Add New Product
          </Text>
        </VStack>
      </Box>
    </Center>
  );
}
