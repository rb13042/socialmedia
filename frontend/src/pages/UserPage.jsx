import UserHeader from "../components/UserHeader";
import UserPost from "../components/UserPost";

const UserPage = () => {
  return (
    <>
      <UserHeader />
      <UserPost
        likes={100}
        replies={455}
        postImg="/post1.png"
        postTitle="this is my first post"
      />
      <UserPost
        likes={100}
        replies={455}
        postImg="/post2.png"
        postTitle="this is an awsome tutorial"
      />
      <UserPost
        likes={100}
        replies={455}
        postImg="/post3.png"
        postTitle="this man is incredible"
      />
      <UserPost likes={100} replies={455} postTitle="this man is incredible" />
    </>
  );
};
export default UserPage;
