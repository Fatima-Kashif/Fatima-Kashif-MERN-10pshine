const Notes=require('../models/notes');

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
        res.status(201).json({error:false,msg:"Note created successfully",notes:note})
    }
    catch(err){
        console.error('Note creation error:', err);
        return res.status(500).json({error:`Server Error ${err}`})
    }

}

const getNotes = async (req, res) => {
    try {
      const notes = await Notes.find({ userId: req.userId })
        .sort({ createdOn: -1 });
      res.status(200).json({ message: "All Notes Fetched", data:notes });
    } catch (err) {
      console.error('Error fetching notes:', err);
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
        return res.status(404).json({ error: true, msg: 'Note not found' });
      }
  
      res.status(200).json({ error: false, msg: 'Note updated successfully', note });
    } catch (err) {
      console.error('Update error:', err);
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
        return res.status(404).json({ error: true, msg: 'Note not found' });
      }
  
      res.status(200).json({ error: false, msg: 'Note deleted' });
    } catch (err) {
      console.error('Delete error:', err);
      res.status(500).json({ error: true, msg: 'Server error' });
    }
  };

module.exports={
    createnote,
    getNotes,
    deleteNote,
    updateNote,
    
}
