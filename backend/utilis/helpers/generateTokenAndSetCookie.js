import jwt from 'jsonwebtoken';
const generateTokensAndSetCookies = (userId,res)=>{

  const token = jwt.sign({userId},process.env.JWT_SECRET,{
    expiresIn: '15d',
  });

  res.cookie("jwt",token,{
    httpOnly:true, //makes it more secure since cannot be accessed by the browser
    maxAge: 1000 * 60 * 60 * 24 * 15, //15 days (in milliseconds)
    sameSite:"strict", //to protect from CSRF attacks
  });
  return token;
}

export default generateTokensAndSetCookies;