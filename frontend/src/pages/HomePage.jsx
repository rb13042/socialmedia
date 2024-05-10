import React, { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { Box, Flex, Spinner } from "@chakra-ui/react";
import Post from "../components/Post";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";
import SuggestedUsers from "../components/SuggestedUsers";

const HomePage = () => {
  const showToast = useShowToast();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [loading, setloading] = useState(true);
  //setPosts([]);
  useEffect(() => {
    const getFeedPost = async () => {
      setloading(true);
      setPosts([]);
      try {
        const res = await fetch("/api/posts/feed");
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        console.log(data);
        setPosts(data);
      } catch (error) {
        showToast("Error", error, "error");
      } finally {
        setloading(false);
      }
    };
    getFeedPost();
  }, [showToast, setPosts]);
  return (
    <>
      <Flex gap={"10"} alignItems={"flex-start"}>
        <Box flex={70}>
          {loading && (
            <Flex justify="center" align="center" h="100vh">
              <Spinner size={"xl"} />
            </Flex>
          )}

          {!loading && posts.length == 0 && (
            <Flex justify="center" align="center" h="100vh">
              Follow some Users to see their posts
            </Flex>
          )}
          {posts.map((post) => (
            <Post key={post._id} post={post} postedBy={post.postedBy} />
          ))}
        </Box>
        <Box
          flex={30}
          display={{
            base: "none",
            md: "block",
          }}
        >
          <SuggestedUsers />
        </Box>
      </Flex>
    </>
  );
};

export default HomePage;
