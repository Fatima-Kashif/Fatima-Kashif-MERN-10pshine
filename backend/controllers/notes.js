const Notes=require('../models/notes');
const logger= require('../logger')

const createnote=async (req,res)=>{
    const{title, content, favourite,pinned}=req.body;
    if (!title){
        return res.status(400).json({error:true,msg:'Title is required'});
    }
    try{
        const note=new Notes({
            title,
            content,
            favourite:favourite || false,
            pinned:pinned || false,
            userId: req.userId
        });
        await note.save();
        logger.info({noteId: note._id, userId: req.userId}, 'Note created successfully');
        res.status(201).json({error:false,msg:"Note created successfully",note})
    }
    catch(err){
      logger.error({ err }, 'Note creation error');
      return res.status(500).json({error:`Server Error ${err}`})
    }

}

const getNotes = async (req, res) => {
    try {
      const notes = await Notes.find({ userId: req.userId })
        .sort({ createdOn: -1 });
      logger.info({userId: req.userId, noteCount: notes.length}, 'Notes fetched successfully');
      res.status(200).json({ message: "All Notes Fetched", data:notes });
    } catch (err) {
      logger.error({err},'Error fetching notes:');
      res.status(500).json({ error: true, msg: 'Server error' });
    }
  };
  
  const updateNote = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
  
    try {
      const note = await Notes.findOneAndUpdate(
        { _id: id, userId: req.userId },
        updates,
        { new: true, runValidators: true }
      );
  
      if (!note) {
        logger.warn({noteId: id, userId: req.userId}, 'Note not found for update');
        return res.status(404).json({ error: true, msg: 'Note not found' });
      }
      logger.info({noteId: id, userId: req.userId}, 'Note updated successfully');
      res.status(200).json({ error: false, msg: 'Note updated successfully', note });
    } catch (err) {
      logger.error({error: err, noteId: id, userId: req.userId}, 'Note update failed');
      res.status(500).json({ error: true, msg: 'Server error' });
    }
  };
  
  const deleteNote = async (req, res) => {
    const { id } = req.params;
  
    try {
      const note = await Notes.findOneAndDelete({ 
        _id: id, 
        userId: req.userId 
      });
  
      if (!note) {
        logger.warn({noteId: id, userId: req.userId}, 'Note not found for deletion');
        return res.status(404).json({ error: true, msg: 'Note not found' });
      }
      logger.info({noteId: id, userId: req.userId}, 'Note deleted successfully');
      res.status(200).json({ error: false, msg: 'Note deleted' });
    } catch (err) {
      logger.error({error: err, noteId: id, userId: req.userId}, 'Note deletion failed');
      res.status(500).json({ error: true, msg: 'Server error' });
    }
  };

module.exports={
    createnote,
    getNotes,
    deleteNote,
    updateNote,
    
}
