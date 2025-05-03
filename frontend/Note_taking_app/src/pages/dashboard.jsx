import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import NotesSidebar from '../components/NotesSidebar';
import SearchBar from '../components/Searchbar';
import NoteList from '../components/NoteList';
import NoteForm from '../components/NoteForm';
import Confirmation from '../components/confirmation';
import Notification from '../components/notification';
import Navbar from '../components/navbar';
import { getAllUserNotes, addUserNote, resetAddNote, deleteUserNote,isNoteEditing, setNoteToEdit, editUserNote } from '../features/notes/noteSlice';
import { useNavigate } from 'react-router-dom';


const NotesDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {notes,noteAdded,noteDelete,noteEdit,loading,isEditing} = useSelector((state) => state.notes);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newNote, setNewNote] = useState({ 
    title: '', 
    content: '', 
    favourite: false, 
    pinned: false 
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showSaveWarning, setShowSaveWarning] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [filteredNotes, setFilteredNotes] = useState([]);  


  useEffect(() =>{
    const token = document.cookie
  const match = token.match(/token=([^;]+)/);
    if (!match){
      navigate('/signin')
    }

  },[])

   useEffect(() => { 
  dispatch(getAllUserNotes());
  if (noteAdded || noteDelete || noteEdit) {
    dispatch(resetAddNote());
  }
    },[noteAdded,noteDelete,noteEdit])

    useEffect(() => {
      if (noteDelete){
        addNotification('Note deleted successfully!', 'success');
        setNoteToDelete(null);
        dispatch(resetAddNote())
      }
    },[noteDelete])
    
    useEffect(()=>{
      if(noteEdit){
        addNotification('Note updated successfully!', 'success');
        setIsModalOpen(false);
        setNewNote({ title: '', content: '', favourite: false, pinned: false });
        dispatch(resetAddNote())
      }
        
},[noteEdit])


useEffect(()=>{
  const filterHere = notes &&  notes.length > 0 && notes
       .filter(note => {
         const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase());
         if (activeFilter === 'favorites') return matchesSearch && note.favourite;
         if (activeFilter === 'pinned') return matchesSearch && note.pinned;
         return matchesSearch;
       })
       .sort((a, b) => {
         if (a.pinned && !b.pinned) return -1;
         if (!a.pinned && b.pinned) return 1;
         if (a.favourite && !b.favourite) return -1;
         if (!a.favourite && b.favourite) return 1;
         return new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date);
       })
       setFilteredNotes(filterHere)
},[activeFilter,searchTerm,notes])

    


   useEffect(()=>{
      if (notes && notes.length > 0 && activeFilter === "all") {
     
         setFilteredNotes(notes);
      }
    },[notes])
   


  const addNotification = (message, type = 'info') => {
    setNotifications(prev => prev.filter(n => n.message !== message));
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeNotification(id);
    }, 3000);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleAddNote = async () => {
    if (!newNote.title.trim()) {
      addNotification('Title is required!', 'error');
      return;
    }

    try {
      dispatch(addUserNote(newNote))
      addNotification('Note added successfully!', 'success');
      setIsModalOpen(false);
      setNewNote({ title: '', content: '', favourite: false, pinned: false });
    } catch (error) {
      addNotification('Failed to add note', 'error');
    }
  };

  const handleUpdateNote = async () => {
    if (!newNote.title.trim()) {
      addNotification('Title is required!', 'error');
      return;
    }

    try {
      dispatch(editUserNote(newNote))
    } catch (error) {
      addNotification('Failed to update note', 'error');
    }
  };

  const handleFieldChange = (field, value) => {
    setNewNote({ ...newNote, [field]: value });
    setHasChanges(true);
  };

  const handleEditNote = (note) => {
    setNewNote({ ...note });
    setIsModalOpen(true);
    setHasChanges(false);
    dispatch(isNoteEditing())
    dispatch(setNoteToEdit(note))

  };

  const handleCloseModal = () => {
    if (hasChanges) {
      setShowSaveWarning(true);
    } else {
      setIsModalOpen(false);
      setNewNote({ title: '', content: '', favourite: false, pinned: false });
    }
  };

  const confirmDelete = async () => {
    try {
      dispatch(deleteUserNote(noteToDelete))
    } catch (error) {
      addNotification('Failed to delete note', 'error');
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex h-screen bg-[#f9f6f2] overflow-hidden">
        <NotesSidebar
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          onAddNote={() => {
            setNewNote({ title: '', content: '', favourite: false, pinned: false });
            setIsModalOpen(true);
            setHasChanges(false);
          }}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-4">
            <SearchBar 
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />
          </div>

          <div className="flex-1 overflow-y-auto px-4 pb-4">
  {loading ? (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
    </div>
  ) : (
    <div data-testid="empty-state"> 

    
    {filteredNotes.length === 0 ? (
      <div className="flex flex-col items-center justify-center h-full" >
        <div className="text-gray-500 text-lg mb-4" data-testid="empty-message">
          You haven't added any notes yet
        </div>
        <button
          onClick={() => {
            setNewNote({ title: '', content: '', favourite: false, pinned: false });
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-400 transition"
          data-testid="create-first-note"
        >
          Create Your First Note
        </button>
      </div>

    ) : (
      <NoteList
        notes={filteredNotes}
        onEdit={handleEditNote}
        onDelete={setNoteToDelete}
        onToggleFavorite={(id) => {
          const note = notes.find(n => n.id === id);
          if (note) {
            const updatedNote = { ...note, favourite: !note.favourite };
            setNewNote(updatedNote);
          }
        }}
        onTogglePin={(id) => {
          const note = notes.find(n => n.id === id);
          if (note) {
            const updatedNote = { ...note, pinned: !note.pinned };
            setNewNote(updatedNote);
          }
        }}
      />
    )}
    </div>
  )}
</div>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <NoteForm
              note={newNote}
              onSave={isEditing? handleUpdateNote : handleAddNote}
              onCancel={handleCloseModal}
              onFieldChange={handleFieldChange}
            />
          </div>
        )}

        <Confirmation
          isOpen={!!noteToDelete}
          title="Delete Note"
          message="Are you sure you want to delete this note? This action cannot be undone."
          onConfirm={confirmDelete}
          onCancel={() => setNoteToDelete(null)}
          confirmText="Delete"
          confirmColor="red"
        />

        <Confirmation
          isOpen={showSaveWarning}
          title="Unsaved Changes"
          message="You have unsaved changes. Are you sure you want to close?"
          onConfirm={() => {
            setIsModalOpen(false);
            setShowSaveWarning(false);
            setHasChanges(false);
          }}
          onCancel={() => setShowSaveWarning(false)}
          confirmText="Close Anyway"
          confirmColor="orange"
        />

        <div className="fixed top-4 right-4 z-50 w-80" data-testid="notifications-container">
          {notifications.map(notification => (
            <Notification
              key={notification.id}
              message={notification.message}
              type={notification.type}
              onClose={() => removeNotification(notification.id)}
              data-testid={`notification-${notification.type}`}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default NotesDashboard;