const bcrypt=require('bcrypt') 

const encryptPass=async (password)=>{
 const salt=await bcrypt.genSalt();
const encryptedPassword=await bcrypt.hash(password,salt);
    return encryptedPassword
} 

const matchPass = async(dbPass,enteredPass)=>{
    const isMatch = await bcrypt.compare( enteredPass,dbPass);
    return isMatch
}

module.exports={matchPass}