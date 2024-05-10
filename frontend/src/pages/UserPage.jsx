import { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import Post from "../components/Post";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import { Flex, Spinner } from "@chakra-ui/react";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";
const UserPage = () => {
  const [user, setUser] = useState();
  const { username } = useParams();
  const showToast = useShowToast();
  const [posts, setposts] = useRecoilState(postsAtom);
  const [fetchingposts, setfetchingposts] = useState(true);
  const [loading, setloading] = useState(true);
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/users/profile/${username}`);
        const data = await res.json();
        //console.log(data);
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setUser(data);
      } catch (error) {
        showToast("Error", error, "error");
      } finally {
        setloading(false);
      }
    };

    const getPosts = async () => {
      setfetchingposts(true);
      try {
        const res = await fetch(`/api/posts/user/${username}`);
        const data = await res.json();
        console.log(data);
        setposts(data);
      } catch (error) {
        showToast("Error", error, "error");
        setposts([]);
      } finally {
        setfetchingposts(false);
      }
    };

    getUser();
    getPosts();
  }, [username, showToast, setposts]);

  if (!user && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }

  if (!user && !loading) {
    return <h1>User not found</h1>;
  }

  if (!user) return null;
  return (
    <>
      <UserHeader user={user} />
      {!fetchingposts && posts.length == 0 && <h1>User has no posts</h1>}
      {fetchingposts && (
        <Flex justifyContent={"center"} my={12}>
          <Spinner size={"xl"} />
        </Flex>
      )}

      {posts.map((post) => (
        <Post key={post._id} post={post} postedBy={post.postedBy} />
      ))}
    </>
  );
};
export default UserPage;
