import React, { useState } from 'react'
import useShowToast from './useShowToast';
import { useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';

const useFollowUnFollow = (user) => {
    const currentUser = useRecoilValue(userAtom);
    console.log(user);
    console.log(currentUser);
    const [following,setfollowing] = useState(user.user.followers.includes(currentUser?._id));
    const [updating,setupdating] = useState(false);
    const showToast = useShowToast();
    



    const handleFollowUnfollow = async () => {
    if (!currentUser) {
      showToast("Error", "Please login to follow", "error");
      return;
    }
    if (updating) return;
    setupdating(true);
    try {
      const res = await fetch(`/api/users/follow/${user.user._id}`, {
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
        showToast("Success", `unfollowed ${user.user.username}`, "success");
        user.user.followers.pop();
      } else {
        showToast("Success", `followed ${user.user.username}`, "success");
        user.user.followers.push(currentUser._id);
      }
      setfollowing(!following);
    } catch (error) {
      showToast("Error", error, "error");
    } finally {
      setupdating(false);
    }
  };
  
   


  return {handleFollowUnfollow,updating,following};
}

export default useFollowUnFollow;