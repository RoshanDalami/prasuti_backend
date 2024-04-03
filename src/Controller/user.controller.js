import User from "../Model/user.model.js";
import bcryptjs from 'bcryptjs'
import { ApiResponse } from '../utils/ApiResponse.js'
import jwt from 'jsonwebtoken'
//register user
export async function RegisterUser(req,res){
    try {
        const { username, email, contactNo, password, confirmPassword } =
           req.body;
          
            console.log(username, email, contactNo, password, confirmPassword)
        if (password !== confirmPassword) {
            return res.status(400).json(new ApiResponse(400,null,"Password doesn't match"))
        }
        
    
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(401).json(new ApiResponse(401,null,"Email already exist"))
          
        }
        const hashedPassword = await bcryptjs.hash(password, 10);
        const newUser = new User({
            username:username,
            email:email.trim(),
            contactNo:contactNo,
            password: hashedPassword,
            confirmPassword: null,
          });
          await newUser.save();
          return res.status(201).json(new ApiResponse(200,newUser,"User Created Successfully",true))
          
      } catch (error) {
        console.log(error)
        return res.status(500).json(new ApiResponse(500,null,"Internal Server Error"))
      }
}
export async function LoginUser(req,res){
    try {
        const { email, password } = req.body;
    
        const user = await User.findOne({ email });
    
        if (!user) {
          return res.status(401).json({
            message: "User does not exists",
          });
        }
    
        const isPasswordMatched = await bcryptjs.compare(password, user.password);
        if (!isPasswordMatched) {
          return res.status(401).json({
            message: "Invalid Email or password ",
          });
        } else {
            //Sign user with jwt
            const userWOPassword = await User.findById(user._id).select("-password");
        const accessToken = await jwt.sign({
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
                mobile: user.mobile
            },
        },
        process.env.ACCESS_TOKEN,
        {expiresIn: '1d',},
        );
          return res.status(200).json(new ApiResponse(200, {token: accessToken, user: userWOPassword}, "Login Successfull"));
        }
      } catch (err) {
        console.log(err);
      }
}