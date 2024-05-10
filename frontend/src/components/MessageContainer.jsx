import {
  Avatar,
  Divider,
  Flex,
  Image,
  Skeleton,
  SkeletonCircle,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import Message from "./Message";
import MessageInput from "./MessageInput";
import useShowToast from "../hooks/useShowToast";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  conversationsAtom,
  selectedConversationAtom,
} from "../atoms/messagesAtom";
import userAtom from "../atoms/userAtom";
import { useSocket } from "../context/SocketContext";
import messageSound from "../assets/sounds/message.mp3";

const MessageContainer = () => {
  const showToast = useShowToast();
  const [selectedConversation, setselectedConversation] = useRecoilState(
    selectedConversationAtom
  );
  const [loadingmessages, setloadingmessages] = useState(true);
  const [messages, setmessages] = useState([]);
  const currentuser = useRecoilValue(userAtom);
  const { socket } = useSocket();
  const setconversations = useSetRecoilState(conversationsAtom);
  const messageEndRef = useRef();

  useEffect(() => {
    socket.on("newMessage", (message) => {
      console.log("send mssg");
      //render the messages only when they are part of that conversation else dont
      // const selconv = useRecoilValue(selectedConversationAtom);
      console.log(selectedConversation);

      if (!document.hasFocus()) {
        const sound = new Audio(messageSound);
        sound.play();
      }

      if (
        selectedConversation._id != "" &&
        message.conversationId == selectedConversation._id
      ) {
        setmessages((prev) => {
          return [...prev, message];
        });
      }

      setconversations((prev) => {
        console.log("i m in setconversations");
        const updatedconversations = prev.map((conversation) => {
          if (conversation._id == message.conversationId) {
            return {
              ...conversation,
              lastMessage: {
                text: message.text,
                sender: message.sender,
              },
            };
          }
          return conversation;
        });
        return updatedconversations;
      });
    });

    return () => socket.off("newMessage");
  }, [socket, selectedConversation._id, setconversations]);

  useEffect(() => {
    const lastMessageIsFromOtherUser =
      messages.length &&
      messages[messages.length - 1].sender != currentuser._id;
    if (lastMessageIsFromOtherUser) {
      socket.emit("markMessagesAsSeen", {
        conversationId: selectedConversation._id,
        userId: selectedConversation.userId,
      });
    }

    socket.on("messagesSeen", ({ conversationId }) => {
      if (conversationId == selectedConversation._id) {
        setmessages((prev) => {
          const updatedMessages = prev.map((message) => {
            if (!message.seen) {
              return { ...message, seen: true };
            }
            return message;
          });

          return updatedMessages;
        });
      }
    });
  }, [socket, currentuser._id, messages, selectedConversation]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const getMessages = async () => {
      setloadingmessages(true);
      setmessages([]);
      try {
        if (selectedConversation.mock) return;
        const res = await fetch(`/api/messages/${selectedConversation.userId}`);
        const data = await res.json();
        if (data.error) return showToast("Error", data.error, "error");
        setmessages(data);
      } catch (error) {
        showToast("Error", error, "error");
      } finally {
        setloadingmessages(false);
      }
    };
    getMessages();
  }, [showToast, selectedConversation.userId, selectedConversation.mock]);

  return (
    <>
      <Flex
        flex="70"
        bg={useColorModeValue("gray.200", "gray.dark")}
        borderRadius={"md"}
        flexDirection={"column"}
        p={1}
      >
        {/* {message header} */}
        <Flex w={"full"} h={12} alignItems={"center"} gap={2}>
          <Avatar src={selectedConversation.userProfilePic} size={"sm"} />
          <Text display={"flex"} alignItems={"center"}>
            {selectedConversation.username}
            <Image src="/verified.png" w={4} h={4} ml={1} />
          </Text>
        </Flex>
        <Divider />

        {/* messages */}
        <Flex
          flexDirection={"column"}
          gap={4}
          my={4}
          height={"400px"}
          overflowY={"auto"}
        >
          {loadingmessages &&
            [...Array(5)].map((_, i) => (
              <Flex
                key={i}
                gap={2}
                alignItems={"center"}
                p={1}
                borderRadius={"md"}
                alignSelf={i % 2 == 0 ? "flex-start" : "flex-end"}
              >
                {i % 2 == 0 && <SkeletonCircle size={7} />}
                <Flex flexDirection={"column"} gap={2}>
                  <Skeleton h={"8px"} w={"250px"} />
                  <Skeleton h={"8px"} w={"250px"} />
                  <Skeleton h={"8px"} w={"250px"} />

                  {i % 2 != 0 && <SkeletonCircle size={7} />}
                </Flex>
              </Flex>
            ))}

          {/* <Message ownMessage={true} />
          <Message ownMessage={false} />
          <Message ownMessage={false} />
          <Message ownMessage={true} />
          <Message ownMessage={true} /> */}
          {!loadingmessages &&
            messages.map((message) => (
              <Flex
                key={message._id}
                direction={"column"}
                ref={
                  messages.length - 1 == messages.indexOf(message)
                    ? messageEndRef
                    : null
                }
              >
                <Message
                  ownMessage={message.sender == currentuser._id}
                  message={message}
                />
              </Flex>
            ))}
        </Flex>
        <MessageInput setmessages={setmessages} />
      </Flex>
    </>
  );
};

export default MessageContainer;
