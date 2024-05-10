import {
  Avatar,
  AvatarBadge,
  Flex,
  Image,
  Stack,
  Text,
  WrapItem,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { BsCheck2All } from "react-icons/bs";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { selectedConversationAtom } from "../atoms/messagesAtom";
const Conversation = ({ conversation, isOnline }) => {
  const user = conversation.participants[0];
  const currentuser = useRecoilValue(userAtom);
  const lastMessage = conversation.lastMessage;
  const [selectedConversation, setselectedConversation] = useRecoilState(
    selectedConversationAtom
  );
  console.log(selectedConversation);
  const colorMode = useColorMode();
  return (
    <>
      <Flex
        gap={4}
        alignItems={"center"}
        p={"1"}
        _hover={{
          cursor: "pointer",
          bg: useColorModeValue("gray.100", "gray.700"),
          color: "white",
        }}
        borderRadius={"md"}
        onClick={() => {
          setselectedConversation({
            _id: conversation._id,
            userId: user._id,
            userProfilePic: user.profilePic,
            username: user.username,
            mock: conversation.mock,
          });
        }}
        bg={selectedConversation._id == conversation._id && "gray.400"}
      >
        <WrapItem>
          <Avatar
            size={{
              base: "xs",
              sm: "sm",
              md: "md",
            }}
            src={user?.profilePic}
          >
            {isOnline && <AvatarBadge boxSize={"1em"} bg={"green.500"} />}
          </Avatar>
        </WrapItem>
        <Stack direction={"column"} fontSize={"sm"}>
          <Text fontWeight={700} display={"flex"} alignItems={"center"}>
            {user?.username} <Image src="/verified.png" w={4} h={4} ml={1} />
          </Text>
          <Text fontSize={"xs"} display={"flex"} alignItems={"center"} gap={1}>
            {lastMessage.sender == currentuser._id ? (
              <BsCheck2All size={16} />
            ) : (
              ""
            )}
            {lastMessage.text.length > 18
              ? lastMessage.text.substring(0, 18) + "..."
              : lastMessage.text || "Image"}
          </Text>
        </Stack>
      </Flex>
    </>
  );
};

export default Conversation;
