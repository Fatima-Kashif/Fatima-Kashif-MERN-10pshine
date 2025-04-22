const bcrypt=require('bcrypt') 

const matchPass = async(dbPass,enteredPass)=>{
    const isMatch = await bcrypt.compare( enteredPass,dbPass);
    return isMatch
}

module.exports={matchPass}