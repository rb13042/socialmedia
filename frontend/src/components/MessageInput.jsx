import {
  Flex,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { IoSendSharp } from "react-icons/io5";
import useShowToast from "../hooks/useShowToast";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  conversationsAtom,
  selectedConversationAtom,
} from "../atoms/messagesAtom";
import { BsFillImageFill } from "react-icons/bs";
import usePreviewimg from "../hooks/usePreviewimg";
const MessageInput = ({ setmessages }) => {
  const showToast = useShowToast();
  const [messagetext, setmessagetext] = useState("");
  const [selectedConversation, setselectedConversation] = useRecoilState(
    selectedConversationAtom
  );
  const [coversations, setconversations] = useRecoilState(conversationsAtom);
  const imageRef = useRef(null);
  const { onClose } = useDisclosure();
  const { handleImageChange, Imgurl, setImgurl } = usePreviewimg();
  const [issending, setissending] = useState(false);
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messagetext && !Imgurl) return;
    if (issending) return;

    setissending(true);

    try {
      const res = await fetch(`/api/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messagetext,
          recipientId: selectedConversation.userId,
          img: Imgurl,
        }),
      });

      const data = await res.json();
      setmessages((prev) => [...prev, data]);
      setconversations((prevConvs) => {
        const updatedconversations = prevConvs.map((con) => {
          if (con._id == selectedConversation._id) {
            return {
              ...con,
              lastMessage: { text: messagetext, sender: data.sender },
            };
          }
          return con;
        });
        return updatedconversations;
      });

      //for mock conversations
      if (selectedConversation.mock) {
        setselectedConversation((prev) => {
          return { ...prev, mock: false };
        });
        setconversations((prev) => {
          const updatedconversations = prev.map((con) => {
            if (con._id == selectedConversation._id) {
              return { ...con, mock: false, _id: data.conversationId };
            }
            return con;
          });
          return updatedconversations;
        });
        //for mock conversations
        setselectedConversation((prev) => {
          return { ...prev, _id: data.conversationId };
        });
      }

      setmessagetext("");
      setImgurl("");
      imageRef.current.value = null;
    } catch (error) {
      showToast("Error", error, "error");
    } finally {
      setissending(false);
    }
  };
  return (
    <>
      <Flex gap={2} alignItems={"center"}>
        <form onSubmit={handleSendMessage} style={{ flex: 95 }}>
          <InputGroup>
            <Input
              w={"full"}
              placeholder="Type a Message"
              onChange={(e) => setmessagetext(e.target.value)}
              value={messagetext}
            />

            <InputRightElement onClick={handleSendMessage} cursor={"pointer"}>
              <IoSendSharp color="green.500" />
            </InputRightElement>
          </InputGroup>
        </form>
        <Flex flex={5} cursor={"pointer"}>
          <BsFillImageFill size={20} onClick={() => imageRef.current.click()} />
          <Input
            type={"file"}
            hidden
            ref={imageRef}
            onChange={handleImageChange}
          />
        </Flex>
        <Modal
          isOpen={Imgurl}
          onClose={() => {
            setImgurl("");
            onClose();
            imageRef.current.value = null;
          }}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader></ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Flex mt={5} w={"full"}>
                <Image src={Imgurl} />
              </Flex>
              <Flex justifyContent={"flex-end"} my={2}>
                {!issending ? (
                  <IoSendSharp
                    size={24}
                    cursor={"pointer"}
                    onClick={handleSendMessage}
                  />
                ) : (
                  <Spinner size={"md"} />
                )}
              </Flex>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Flex>
    </>
  );
};

export default MessageInput;
