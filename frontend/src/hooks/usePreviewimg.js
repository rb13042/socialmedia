import { useState } from "react";
import useShowToast from "./useShowToast";


const usePreviewimg = () => {

   const [Imgurl,setImgurl] = useState(null);
   const showToast = useShowToast();
   const handleImageChange = (e)=>{
    
    const file = e.target.files[0];
    console.log(file);
    if(file && file.type.startsWith("image/")){
      const reader  = new FileReader();

      reader.onloadend = ()=>{
        //console.log(reader.result);
        setImgurl(reader.result);
        //console.log(Imgurl);
      }

      reader.readAsDataURL(file);
    }
    else
    {
        showToast("invalid file type","please select an image file","error");
        console.log("invalid file type");
        setImgurl((prev)=>{
          console.log(prev);
          return prev;
        }
         
      );
    }
      setImgurl((prev)=>{
          console.log(prev);
          return prev;
        }
      );
   }


  return {handleImageChange,Imgurl,setImgurl};
    
  
};

export default usePreviewimg;