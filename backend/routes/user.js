const express=require('express');
const app=express();
app.use(express.json());
const router=express.Router()
const {usersignup, userlogin,userlogout}= require('../controllers/user')

router.post('/signup',usersignup);
router.post('/signin',userlogin);
router.post('/logout',userlogout);



module.exports=router;