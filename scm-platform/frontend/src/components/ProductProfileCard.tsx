import { AddIcon, Box, Button, Center, Heading, Icon, Stack } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import { FaBoxes, FaRulerCombined } from "react-icons/fa"; // Example icons
import { useColorModeValue } from "@chakra-ui/react";
import { Image } from "@chakra-ui/react";
import { Text } from "@chakra-ui/react";

// Define an interface for your Product data
interface Product {
  id: number;
  name: string;
  category: string;
  imageUrl: string;
  stock: number;
  description: string;
}

interface ProductProfileCardProps {
  product: Product;
}

function ProductProfileCard({ product }: ProductProfileCardProps) {
  const router = useRouter(); // If you want the button to navigate

  return (
    <Center py={6}>
      <Box
        maxW={"300px"} // Slightly wider maybe?
        w={"full"}
        bg={useColorModeValue("white", "gray.800")}
        boxShadow={"2xl"}
        rounded={"md"}
        overflow={"hidden"}
        cursor="pointer" // Make the whole card feel clickable
        transition="transform 0.2s ease-in-out"
        _hover={{
          transform: "translateY(-5px)",
          boxShadow: "lg",
        }}
        onClick={() => router.push(`/product/${product.id}`)} // Navigate on click
      >
        <Image
          h={"150px"} // Increased image height
          w={"full"}
          src={
            product.imageUrl ||
            "https://images.unsplash.com/photo-1579621970795-87f5a3a1_1a1?auto=format&fit=crop&w=300&q=60" // Fallback image
          }
          objectFit={"cover"}
          alt={`Image of ${product.name}`}
        />
        {/* Removed Avatar for product view */}
        <Box p={6}>
          <Stack spacing={1} align={"center"} mb={5}>
            <Heading fontSize={"xl"} fontWeight={500}>
              {product.name}
            </Heading>
            <Text color={"gray.500"} fontSize="sm">
              {product.category}
            </Text>
          </Stack>

          <Stack direction={"row"} justify={"center"} spacing={6} mb={6}>
            <Stack spacing={0} align={"center"}>
              <Text fontWeight={600}>{product.stock}</Text>
              <Text fontSize={"sm"} color={"gray.500"}>
                In Stock
              </Text>
            </Stack>
            <Stack spacing={0} align={"center"}>
              {/* Example: Add another stat or icon */}
              <Icon as={FaBoxes} w={5} h={5} color="gray.600" />
              <Text fontSize={"sm"} color={"gray.500"}>
                Components
              </Text>
            </Stack>
          </Stack>

          <Button
            w={"full"}
            mt={4} // Adjusted margin
            bg={useColorModeValue("cyan.400", "cyan.600")} // Changed color
            color={"white"}
            rounded={"md"}
            _hover={{
              transform: "translateY(-2px)",
              boxShadow: "lg",
              bg: useColorModeValue("cyan.500", "cyan.700"),
            }}
            onClick={(e) => {
              e.stopPropagation(); // Prevent card click if button is clicked
              router.push(`/product/${product.id}`);
            }}
          >
            View Details
          </Button>
        </Box>
      </Box>
    </Center>
  );
}
