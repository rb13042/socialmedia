import { Avatar, Box, Flex, Image, Skeleton, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { selectedConversationAtom } from "../atoms/messagesAtom";
import { BsCheck2All } from "react-icons/bs";

const Message = ({ ownMessage, message }) => {
  const currentuser = useRecoilValue(userAtom);
  const [selectedConversation, setselectedConversation] = useRecoilState(
    selectedConversationAtom
  );
  const [imgloaded, setimgloaded] = useState(false);
  return (
    <>
      {ownMessage ? (
        <Flex gap={2} alignSelf={"flex-end"}>
          {message.text && (
            <Flex bg={"gray.400"} maxW={"350px"} p={1} borderRadius={"md"}>
              <Text color={"white"}>{message.text}</Text>
              <Box
                alignSelf={"flex-end"}
                ml={1}
                color={message.seen ? "blue.800" : ""}
                fontWeight={"bold"}
              >
                <BsCheck2All />
              </Box>
            </Flex>
          )}
          {message.img && !imgloaded && (
            <Flex mt={5} w={"200px"}>
              <Image
                src={message.img}
                hidden
                onLoad={() => setimgloaded(true)}
                alt="Message image"
                borderRadius={4}
              />

              <Skeleton w={"200px"} h={"200px"} />
            </Flex>
          )}

          {message.img && imgloaded && (
            <Flex mt={5} w={"200px"}>
              <Image src={message.img} alt="Message image" borderRadius={4} />
              <Box
                alignSelf={"flex-end"}
                ml={1}
                color={message.seen ? "blue.400" : ""}
                fontWeight={"bold"}
              >
                <BsCheck2All />
              </Box>
            </Flex>
          )}

          <Avatar src={currentuser.profilePic} h={7} w={7} />
        </Flex>
      ) : (
        <Flex gap={2} alignSelf={"flex-start"}>
          <Avatar src={selectedConversation.userProfilePic} h={7} w={7} />
          {message.text && (
            <Text
              maxW={"350px"}
              bg={"green.400"}
              p={1}
              borderRadius={"md"}
              m={1}
            >
              {message.text}
            </Text>
          )}
          {message.img && !imgloaded && (
            <Flex mt={5} w={"200px"}>
              <Image
                src={message.img}
                hidden
                onLoad={() => setimgloaded(true)}
                alt="Message image"
                borderRadius={4}
              />

              <Skeleton w={"200px"} h={"200px"} />
            </Flex>
          )}

          {message.img && imgloaded && (
            <Flex mt={5} w={"200px"}>
              <Image src={message.img} alt="Message image" borderRadius={4} />
            </Flex>
          )}
        </Flex>
      )}
    </>
  );
};

export default Message;
