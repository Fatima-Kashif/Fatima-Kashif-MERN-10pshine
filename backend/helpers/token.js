const jwt=require('jsonwebtoken')
const createToken = ()=>{
      return jwt.sign({ userId: id },
            process.env.JWT_SECRET,
              { expiresIn: '1h' });
}
const decryptToken = (req,res,next)=>{
    const token = req.headers.authorization.split(' ')[1];
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId
    res.userId = userId
    next()
return
    }
    catch(err){
        console.log(err)
        if (err.message === "jwt expired")
        {
            return res.status(403).send({msg:"Please login again"})
        }
    }
}
module.exports ={
    createToken,
    decryptToken
}