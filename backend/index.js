const express=require('express');
const mongoose=require('mongoose');
const user=require('./routes/user')
const note=require('./routes/notes')
const cors = require('cors');
const cookieParser= require('cookie-parser')

const app=express();
app.use(express.json());
app.use(cookieParser());
mongoose.connect('mongodb://127.0.0.1:27017/myDB_Note_Taking_app')
app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}))
app.use('/user',user)
app.use('/notes',note)
app.get('/',(req,res)=>{
    res.send('Hello world')
})


app.listen('5000',()=>{
    console.log('Server is listening on port 5000')
})

