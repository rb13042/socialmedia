import {
  Avatar,
  Box,
  Flex,
  Link,
  Portal,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
const UserHeader = () => {
  const toast = useToast();
  const copyurl = () => {
    // console.log(window);
    const currenturl = window.location.href;
    navigator.clipboard.writeText(currenturl).then(() => {
      toast({
        title: "URL copied",
        description: "you can now paste the url",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    });
  };
  return (
    <>
      <VStack gap={4} alignItems={"start"}>
        <Flex w={"full"} justifyContent={"space-between"}>
          <Box>
            <Text fontSize={"2xl"} fontWeight={"bold"}>
              Mark Zuckerberg
            </Text>
            <Flex gap={2} alignItems={"center"}>
              <Text fontSize={"sm"}>markzukerberg</Text>
              <Text
                fontSize={"xs"}
                bg={"gray.dark"}
                color={"gray.light"}
                p={1}
                borderRadius={"full"}
              >
                VibeVault.net
              </Text>
            </Flex>
          </Box>
          <Box>
            <Avatar
              name="Mark Zuckerberg"
              src="/zuck-avatar.png"
              size={{
                base: "md",
                md: "xl",
              }}
            />
          </Box>
        </Flex>
        <Text>Co-founder, executive chairman and ceo of meta</Text>
        <Flex w={"full"} justifyContent={"space-between"}>
          <Flex gap={2} alignItems={"center"}>
            <Text color={"gray.light"}>3.2K followers</Text>
            <Box w={1} h={1} bg={"gray.light"} borderRadius={"full"}></Box>
            <Link color={"gray.light"}>instagram.com</Link>
          </Flex>
          <Flex gap={2}>
            <Box>
              <BsInstagram size={24} cursor={"pointer"} />
            </Box>
            <Box>
              <Menu>
                <MenuButton>
                  <CgMoreO size={24} cursor={"pointer"} />
                </MenuButton>
                <Portal>
                  <MenuList bg={"gray.dark"}>
                    <MenuItem bg={"gray.dark"} onClick={copyurl}>
                      Copy URL
                    </MenuItem>
                  </MenuList>
                </Portal>
              </Menu>
            </Box>
          </Flex>
        </Flex>
        <Flex w={"full"}>
          <Flex
            flex={1}
            borderBottom={"1.5px solid white"}
            justifyContent={"center"}
            pb="3"
            cursor={"pointer"}
          >
            <Text fontWeight={"bold"}>VibeVault</Text>
          </Flex>
          <Flex
            flex={1}
            borderBottom={"1px solid gray"}
            justifyContent={"center"}
            color="gray.light"
            pb="3"
            cursor={"pointer"}
          >
            <Text fontWeight={"bold"}>Replies</Text>
          </Flex>
        </Flex>
      </VStack>
    </>
  );
};

export default UserHeader;
