const express=require('express');
const mongoose=require('mongoose');
const user=require('./routes/user')
const note=require('./routes/notes')
const cors = require('cors');
const cookieParser= require('cookie-parser')
const logger=require('./logger')
const app=express();
app.use(express.json());
app.use(cookieParser());
mongoose.connect('mongodb://127.0.0.1:27017/myDB_Note_Taking_app')
.then(() => logger.info('MongoDB connected successfully'))
.catch(err => logger.error('MongoDB connection error:', err));
app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}))
app.use('/user',user)
app.use('/notes',note)



app.listen('5000',()=>{
    logger.info('Server is listening on port 5000');
})

module.exports=app;