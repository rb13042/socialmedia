import { Box, Flex, Skeleton, SkeletonCircle, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import SuggestedUser from "./SuggestedUser";
import useShowToast from "../hooks/useShowToast";

const SuggestedUsers = () => {
  const [loading, setloading] = useState(true);
  const [SuggestedUsers, setSuggestedUsers] = useState([]);

  const showToast = useShowToast();

  useEffect(() => {
    const getSuggestedUsers = async () => {
      setloading(true);
      try {
        const res = await fetch(`/api/users/suggested`);
        const data = await res.json();
        if (data.error) return showToast("Error", data.error, "error");

        console.log(data);
        setSuggestedUsers(data);
      } catch (error) {
        showToast("Error", error, "error");
      } finally {
        setloading(false);
      }
    };

    getSuggestedUsers();
  }, [showToast]);

  return (
    <>
      <Text mb={4} fontWeight={"bold"}>
        Suggested Users
      </Text>
      <Flex direction={"column"} gap={4}>
        {!loading &&
          SuggestedUsers.map((user) => (
            <SuggestedUser key={user._id} user={user} />
          ))}
        {loading &&
          [0, 1, 2, 3, 4].map((_, idx) => (
            <Flex
              key={idx}
              gap={2}
              alignItems={"center"}
              p={"1"}
              borderRadius={"md"}
            >
              <Box>
                <SkeletonCircle size={"10"} />
              </Box>
              <Flex w={"full"} flexDirection={"column"} gap={2}>
                <Skeleton h={"8px"} w={"80px"} />
                <Skeleton h={"8px"} w={"80px"} />
              </Flex>
              <Flex>
                <Skeleton h={"20px"} w={"60px"} />
              </Flex>
            </Flex>
          ))}
      </Flex>
    </>
  );
};

export default SuggestedUsers;
