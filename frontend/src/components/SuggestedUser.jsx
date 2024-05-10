import { Avatar, Box, Button, Flex, Text } from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom";
import useFollowUnFollow from "../hooks/useFollowUnFollow";
import useShowToast from "../hooks/useShowToast";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { useState } from "react";

const SuggestedUser = ({ user }) => {
  //const { handleFollowUnfollow, updating, following } = useFollowUnFollow(user);

  const currentUser = useRecoilValue(userAtom);
  console.log(user);
  console.log(currentUser);
  const [following, setfollowing] = useState(
    user.followers.includes(currentUser?._id)
  );
  const [updating, setupdating] = useState(false);
  const showToast = useShowToast();

  const handleFollowUnfollow = async () => {
    if (!currentUser) {
      showToast("Error", "Please login to follow", "error");
      return;
    }
    if (updating) return;
    setupdating(true);
    try {
      const res = await fetch(`/api/users/follow/${user._id}`, {
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
      //console.log(data);
      if (following) {
        showToast("Success", `unfollowed ${user.username}`, "success");
        user.followers.pop();
      } else {
        showToast("Success", `followed ${user.username}`, "success");
        user.followers.push(currentUser._id);
      }
      setfollowing(!following);
    } catch (error) {
      showToast("Error", error, "error");
    } finally {
      setupdating(false);
    }
  };

  return (
    <Flex gap={2} justifyContent={"space-between"} alignItems={"center"}>
      <Flex gap={2} as={Link} to={`/${user.username}`}>
        <Avatar src={user.profilePic} />
        <Box>
          <Text fontSize={"sm"} fontWeight={"bold"}>
            {user.username}
          </Text>
          <Text color={"gray.light"} fontSize={"sm"}>
            {user.name}
          </Text>
        </Box>
      </Flex>
      <Button
        size={"sm"}
        color={following ? "black" : "white"}
        bg={following ? "white" : "blue.400"}
        onClick={handleFollowUnfollow}
        isLoading={updating}
        _hover={{
          color: following ? "black" : "white",
          opacity: ".8",
        }}
      >
        {following ? "Unfollow" : "follow"}
      </Button>
    </Flex>
  );
};

export default SuggestedUser;
