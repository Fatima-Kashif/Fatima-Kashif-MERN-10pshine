require('dotenv').config();
const {  matchPass } = require('../helpers/passEncryption');
const User=require('../models/user')
const jwt=require('jsonwebtoken')
const logger=require('../logger')

const createtoken =(id)=>{
    return jwt.sign({ userId: id },
        process.env.JWT_SECRET,
          { expiresIn: '1h' });
    }

const usersignup= async (req,res)=>{
    const{name, email, password}=req.body;
    try{
        const existingUser=await User.findOne({email});
        if (existingUser){
            logger.warn({email}, 'Duplicate registration attempt');
            return res.status(400).json({msg:'This email has already been registered'})
        }
       const user= await User.create({
            name,email,password
        });
        const token=createtoken(user._id);
        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            maxAge: 3600000 
        });
        logger.info({userId: user._id}, 'User registered successfully');
        return res.status(201).json({msg:'Your account is successfully created',user})
    }
    catch(err){
        logger.error({error: err}, 'User registration failed');
        return res.status(500).json({error:`Server Error ${err}`})
    }
}

const userlogin=async (req,res)=>{
    const{email, password}=req.body;
    try{
        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user){
        logger.warn({email}, 'Login attempt with non-existent email');
         return res.status(400).json({ msg: "Invalid credentials" });
        }
        const passMatch = await matchPass(user.password,password)
       
        if(passMatch){
            const token=createtoken(user._id);
            res.cookie('token', token, {
                httpOnly: false,
                secure: false,
                sameSite: 'lax',
                maxAge: 3600000,
                domain:"localhost"
            });
            logger.info({userId: user._id}, 'User logged in successfully');
            return res.status(201).json({msg:'Welcome to your account',token,user: {
                name: user.name
              }
            });
        }
        else{
            logger.warn({userId: user._id}, 'Failed login attempt - incorrect password');
            return res.status(400).json({msg:'Invalid email or password'})
        }

    }
    catch(err){
        logger.error({error: err}, 'Login process failed');
        return res.status(500).json({error:`Server error ${err}`})
    }
    
}

const userlogout = async (req, res) => {
    try {
      res.clearCookie("token", {
        httpOnly: false,
        secure: false,
        sameSite: "lax",
        domain: "localhost", 
      });
      logger.info({userId: req.userId}, 'User logged out successfully');
      return res.status(200).json({ msg: "Logged out successfully" });
    } catch (err) {
      logger.error({error: err, userId: req.userId}, 'Logout failed');
      return res.status(500).json({ error: "Logout failed. Please try again." });
    }
  };


module.exports={
    usersignup,
    userlogin,
    userlogout,
}