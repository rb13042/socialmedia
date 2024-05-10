import { SearchIcon } from "@chakra-ui/icons";
import useShowToast from "../hooks/useShowToast";
import {
  Box,
  Button,
  Flex,
  Input,
  Skeleton,
  SkeletonCircle,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import Conversation from "../components/Conversation";
import { GiConversation } from "react-icons/gi";
import MessageContainer from "../components/MessageContainer";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  conversationsAtom,
  selectedConversationAtom,
} from "../atoms/messagesAtom";
import userAtom from "../atoms/userAtom";
import { useSocket } from "../context/SocketContext";
const ChatPage = () => {
  const showToast = useShowToast();
  const [loadingconversations, setloadingconversations] = useState(true);
  const [conversations, setconversations] = useRecoilState(conversationsAtom);
  const [selectedConversation, setselectedConversation] = useRecoilState(
    selectedConversationAtom
  );
  const user = useRecoilValue(userAtom);
  const { socket, onlineUsers } = useSocket();

  useEffect(() => {
    const getConversation = async () => {
      try {
        const res = await fetch("/api/messages/conversations");
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        console.log(data);
        setconversations(data);
      } catch (error) {
        showToast("Error", error, "error");
      } finally {
        setloadingconversations(false);
      }
    };
    getConversation();
  }, [showToast, setconversations, user]);

  const [searchtext, setsearchtext] = useState("");
  const [searchinguser, setsearchinguser] = useState(false);

  const handleConversationSearch = async (e) => {
    e.preventDefault();
    setsearchinguser(true);
    try {
      const res = await fetch(`/api/users/profile/${searchtext}`);
      const searchedUser = await res.json();
      if (searchedUser.error) {
        showToast("Error", searchedUser.error, "error");
        return;
      }

      //message themselves
      if (searchedUser._id == user._id) {
        showToast("Error", "You can't message yourself", "error");
        return;
      }

      //if user is already in conversation with the searched user
      if (
        conversations.find(
          (conversation) => conversation.participants[0]._id == searchedUser._id
        )
      ) {
        setselectedConversation({
          _id: conversations.find(
            (con) => con.participants[0]._id == searchedUser._id
          )._id,
          userId: searchedUser._id,
          userProfilePic: searchedUser.profilePic,
          username: searchedUser.username,
        });
        return;
      }

      const mockconversation = {
        mock: true,
        lastMessage: {
          text: "",
          sender: "",
        },
        _id: Date.now(),
        participants: [
          {
            _id: searchedUser._id,
            username: searchedUser.username,
            profilePic: searchedUser.profilePic,
          },
        ],
      };

      setconversations((prev) => [...prev, mockconversation]);
    } catch (error) {
      showToast("Error", error, "error");
    } finally {
      setsearchinguser(false);
    }
  };
  return (
    <>
      <Box
        position={"absolute"}
        left={"50%"}
        w={{
          base: "100%",

          md: "80%",
          lg: "750px",
        }}
        p={4}
        transform={"translateX(-50%)"}
        border={"1px solid violet"}
      >
        <Flex
          gap={4}
          flexDirection={{
            base: "column",
            md: "row",
          }}
          maxW={{
            sm: "400px",
            md: "full",
          }}
          mx={"auto"}
        >
          <Flex
            flex={30}
            gap={2}
            flexDirection={"column"}
            maxW={{
              sm: "250px",
              md: "full",
            }}
            mx={"auto"}
          >
            <Text
              fontWeight={700}
              color={useColorModeValue("gray.600", "gray.400")}
            >
              Your Conversations
            </Text>
            <form onSubmit={handleConversationSearch}>
              <Flex alignItems={"center"} gap={2}>
                <Input
                  placeholder="Seacrch for a user"
                  onChange={(e) => setsearchtext(e.target.value)}
                  value={searchtext}
                />
                <Button
                  size={"sm"}
                  onClick={handleConversationSearch}
                  isLoading={searchinguser}
                >
                  <SearchIcon />
                </Button>
              </Flex>
            </form>
            {loadingconversations &&
              [0, 1, 2, 3, 4].map((_, i) => (
                <Flex
                  key={i}
                  gap={4}
                  alignItems={"center"}
                  p={"1"}
                  borderRadius={"md"}
                >
                  <Box>
                    <SkeletonCircle size={10} />
                  </Box>
                  <Flex w={"full"} flexDirection={"column"} gap={3}>
                    <Skeleton h={"10px"} w={"80px"} />
                    <Skeleton h={"8px"} w={"90%"} />
                    <Skeleton />
                  </Flex>
                </Flex>
              ))}

            {!loadingconversations &&
              conversations.map((conversation) => (
                <Conversation
                  key={conversation._id}
                  conversation={conversation}
                  isOnline={onlineUsers.includes(
                    conversation.participants[0]?._id
                  )}
                />
              ))}
          </Flex>
          {!selectedConversation._id && (
            <Flex
              flex={70}
              borderRadius={"md"}
              p={2}
              flexDirection={"column"}
              alignItems={"center"}
              justifyContent={"center"}
              height={"400px"}
            >
              <GiConversation size={100} />
              <Text fontSize={20}>
                Select a conversation to start messaging
              </Text>
            </Flex>
          )}

          {selectedConversation._id && <MessageContainer />}
        </Flex>
      </Box>
    </>
  );
};

export default ChatPage;
