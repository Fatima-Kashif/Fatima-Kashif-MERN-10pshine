const mongoose=require('mongoose');
const Noteschema=new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
      },
      content: {
        type: String,
        required: [true, 'Content is required'],
        unique: true,
        maxlength: [10000, 'Content too long']
      },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
    favourite:{
        type:Boolean,
        default:false
    },
    pinned:{
        type:Boolean,
        default:false
    },
    
},
{
    timestamps: true 
  }
 
);

Noteschema.index({ userId: 1, createdOn: -1 });
const Notes=mongoose.model('Notes',Noteschema);
module.exports=Notes;
