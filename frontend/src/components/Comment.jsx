import React, { useState } from "react";
import { Avatar, Divider, Flex, Text } from "@chakra-ui/react";
import { BsThreeDots } from "react-icons/bs";
import Actions from "./Actions";
const Comment = ({ comments, createdAt, likes, username, userAvatar }) => {
  const [liked, setliked] = useState(false);
  return (
    <>
      <Flex gap={4} py={2} my={2} w={"full"}>
        <Avatar src={userAvatar} size={"sm"}></Avatar>
        <Flex gap={1} w={"full"} flexDirection={"column"}>
          <Flex
            w={"full"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Text fontSize={"sm"} fontWeight={"bold"}>
              {username}
            </Text>
            <Flex gap={2} alignItems={"center"}>
              <Text fontSize={"sm"} color={"gray.light"}>
                {createdAt}
              </Text>
              <BsThreeDots></BsThreeDots>
            </Flex>
          </Flex>
          <Text>{comments}</Text>
          <Actions liked={liked} setliked={setliked} />
          <Text fontSize={"sm"} color={"gray.light"}>
            {likes + (liked ? 1 : 0)} likes
          </Text>
          <Divider />
        </Flex>
      </Flex>
    </>
  );
};

export default Comment;
