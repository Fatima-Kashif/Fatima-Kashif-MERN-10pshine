require('dotenv').config();
const { encryptPass, matchPass } = require('../helpers/passEncryption');
const User=require('../models/user')
const jwt=require('jsonwebtoken')

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
        return res.status(201).json({msg:'Your account is successfully created',user})
    }
    catch(err){
        return res.status(500).json({error:`Server Error ${err}`})
    }
}

const userlogin=async (req,res)=>{
    const{email, password}=req.body;
    try{
        const allUsers = await User.find()
        const user=await User.findOne({email})
        const passMatch = await matchPass(user.password,password)
       
        if(passMatch){
            const token=createtoken(user._id);
            res.cookie('token', token, {
                httpOnly: true,
                secure: false,
                sameSite: 'strict',
                maxAge: 3600000 
            });
            return res.status(201).json({msg:'Welcome to your account',token})
        }
        else{
            return res.status(400).json({msg:'Invalid email or password'})
        }

    }
    catch(err){
        return res.status(500).json({error:`Server error ${err}`})
    }
    
}
module.exports={
    usersignup,
    userlogin,
}