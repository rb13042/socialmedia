import {
  Avatar,
  Flex,
  Image,
  Text,
  Box,
  Divider,
  Button,
  Spinner,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { formatDistanceToNow } from "date-fns";
import Actions from "../components/Actions";
import { useEffect, useState } from "react";
import Comment from "../components/Comment";
import useShowToast from "../hooks/useShowToast";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import postsAtom from "../atoms/postsAtom";
const PostPage = () => {
  const showToast = useShowToast();
  const { pid } = useParams();

  const [posts, setposts] = useRecoilState(postsAtom);
  const currentuser = useRecoilValue(userAtom);
  const navigate = useNavigate();
  const currentpost = posts[0];
  useEffect(() => {
    const getPost = async () => {
      try {
        const res = await fetch("/api/posts/" + pid);
        const data = await res.json();
        if (data.error) return showToast("Error", data.error, "error");
        setposts([data]);
        //console.log(data);
      } catch (error) {
        showToast("Error", error, "error");
      }
    };
    getPost();
  }, [pid, showToast, setposts]);

  const handledeletepost = async (e) => {
    try {
      e.preventDefault();
      if (!window.confirm("Are you sure you want to delete this post?")) return;
      const res = await fetch(`/api/posts/${currentpost._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (data.error) return showToast("Error", data.error, "error");
      showToast("Success", "Deleted Successfully", "success");
      navigate(`/${user.username}`);
    } catch (error) {
      showToast("Error", error, "error");
    }
  };
  const { loading, user } = useGetUserProfile();
  console.log(user);
  if (!user && loading) {
    return (
      <Flex justifyContent={"center"} alignItems={"center"} vh={100}>
        <Spinner size={"xl"}></Spinner>
      </Flex>
    );
  }

  if (!currentpost) return;
  console.log(currentpost);
  return (
    <>
      <Flex>
        <Flex w={"full"} alignItems={"center"} gap={3}>
          <Avatar src={user?.profilePic} size={"md"} name={user?.name} />
          <Flex>
            <Text fontSize={"sm"} fontWeight={"bold"}>
              {user?.username}
            </Text>
            <Image src="/verified.png" w="4" h={4} ml={4} />
          </Flex>
        </Flex>
        <Flex gap={4} alignItems={"center"}>
          <Text fontSize={"sm"} color="gray.light">
            {formatDistanceToNow(new Date(currentpost.createdAt))} ago
          </Text>
          {currentuser?._id == user._id && (
            <DeleteIcon
              size={20}
              onClick={handledeletepost}
              cursor={"pointer"}
            />
          )}
        </Flex>
      </Flex>

      <Text my={3}>{currentpost.text}</Text>
      <Box
        borderRadius={6}
        overflow={"hidden"}
        border={"1px solid"}
        borderColor={"gray.light"}
      >
        <Image src={currentpost.img} w={"full"} />
      </Box>
      <Flex gap={3} my={3}>
        {<Actions post={currentpost} postedBy={user?._id}></Actions>}
      </Flex>

      <Divider my={4} />
      <Flex justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text fontSize={"2xl"}>👋</Text>
          <Text color={"gray.light"}>Get the app to like , reply ans post</Text>
        </Flex>
        <Button>Get</Button>
      </Flex>
      <Divider my={4} />
      {currentpost.replies.map((reply) => (
        <Comment key={reply.id} reply={reply} />
      ))}
    </>
  );
};
export default PostPage;
