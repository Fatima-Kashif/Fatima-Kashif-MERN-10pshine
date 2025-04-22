const mongoose=require('mongoose')
const bcrypt=require('bcrypt') 
const Userschema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique: true,
    },
    password:{
        type:String,
        required:true,
    }
    
},
 {timestamps:true}
);

Userschema.pre('save',async function(next){
    const salt=await bcrypt.genSalt();
    this.password=await bcrypt.hash(this.password,salt);  
    next();
})
const User=mongoose.model('user',Userschema);
module.exports=User;