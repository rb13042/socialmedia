import {
  Avatar,
  Box,
  Button,
  Flex,
  Portal,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { Link } from "react-router-dom";
import { useState } from "react";
import useShowToast from "../hooks/useShowToast";
import useFollowUnFollow from "../hooks/useFollowUnFollow";
const UserHeader = (user) => {
  const currentUser = useRecoilValue(userAtom);
  // const [following, setfollowing] = useState(
  //   user.user.followers.includes(currentUser?._id)
  // );
  //console.log(following);
  const toast = useToast();
  const showToast = useShowToast();
  // const [updating, setupdating] = useState(false);
  //console.log(user);
  //console.log(currentUser);
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
  const { handleFollowUnfollow, updating, following } = useFollowUnFollow(user);

  // const handleFollowUnfollow = async () => {
  //   if (!currentUser) {
  //     showToast("Error", "Please login to follow", "error");
  //     return;
  //   }
  //   if (updating) return;
  //   setupdating(true);
  //   try {
  //     const res = await fetch(`/api/users/follow/${user.user._id}`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });

  //     const data = await res.json();
  //     if (data.error) {
  //       showToast("Error", data.error, "error");
  //       return;
  //     }
  //     //console.log(data);
  //     if (following) {
  //       showToast("Success", `unfollowed ${user.user.username}`, "success");
  //       user.user.followers.pop();
  //     } else {
  //       showToast("Success", `followed ${user.user.username}`, "success");
  //       user.user.followers.push(currentUser._id);
  //     }
  //     setfollowing(!following);
  //   } catch (error) {
  //     showToast("Error", error, "error");
  //   } finally {
  //     setupdating(false);
  //   }
  // };
  return (
    <>
      <VStack gap={4} alignItems={"start"}>
        <Flex w={"full"} justifyContent={"space-between"}>
          <Box>
            <Text fontSize={"2xl"} fontWeight={"bold"}>
              {user.user.name}
            </Text>
            <Flex gap={2} alignItems={"center"}>
              <Text fontSize={"sm"}>{user.user.username}</Text>
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
            {user.user.profilePic && (
              <Avatar
                name={user.user.name}
                src={user.user.profilePic}
                size={{
                  base: "md",
                  md: "xl",
                }}
              />
            )}
            {!user.user.profilePic && (
              <Avatar
                name={user.user.name}
                src="https://bit.ly/broken-link"
                size={{
                  base: "md",
                  md: "xl",
                }}
              />
            )}
          </Box>
        </Flex>
        <Text>{user.user.bio}</Text>
        {currentUser._id == user.user._id && (
          <Link to="/update">
            <Button size={"sm"}>Update profile</Button>
          </Link>
        )}
        {currentUser._id != user.user._id && (
          <Button
            size={"sm"}
            onClick={handleFollowUnfollow}
            isLoading={updating}
          >
            {following ? "Unfollow" : "Follow"}
          </Button>
        )}
        <Flex w={"full"} justifyContent={"space-between"}>
          <Flex gap={2} alignItems={"center"}>
            <Text color={"gray.light"}>
              {user.user.followers.length} followers
            </Text>
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
