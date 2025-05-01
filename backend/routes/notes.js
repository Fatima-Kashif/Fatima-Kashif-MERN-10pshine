const express=require('express');
const router=express.Router()
const {createnote,
       getNotes,
       updateNote,
       deleteNote}= require('../controllers/notes');
const  auth  = require('../helpers/auth');

router.post('/createnote', auth,createnote); 

router.get('/getnotes', auth, getNotes);


router.put('/updatenote/:id', auth, updateNote);


router.delete('/deletenote/:id', auth, deleteNote);


module.exports=router;
