import { Button } from "@chakra-ui/react";
import React from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import { AiOutlineLogout } from "react-icons/ai";
import { selectedConversationAtom } from "../atoms/messagesAtom";
const LogoutButton = () => {
  const setuser = useSetRecoilState(userAtom);
  const showToast = useShowToast();
  const [selectedConversation, setselectedConversation] = useRecoilState(
    selectedConversationAtom
  );
  const handleLogout = async () => {
    try {
      //fetch
      const res = await fetch("/api/users/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      localStorage.removeItem("user-thread");
      setuser(null);
      //to default value
      setselectedConversation({
        _id: "",
        userId: "",
        username: "",
        userProfilePic: "",
      });
    } catch (error) {
      showToast("Error", error, "error");
    }
  };
  return (
    <Button size={"sm"} onClick={handleLogout}>
      <AiOutlineLogout size={20} />
    </Button>
  );
};

export default LogoutButton;
