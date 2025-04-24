import { useState, useEffect } from 'react';
import NotesSidebar from '../components/NotesSidebar';
import SearchBar from '../components/Searchbar';
import NoteList from '../components/NoteList';
import NoteForm from '../components/NoteForm';
import Confirmation from '../components/confirmation';
import Notification from '../components/notification';
import Navbar from '../components/navbar';

const NOTES_STORAGE_KEY = 'notes-app-data';

const NotesDashboard = () => {
  const [notes, setNotes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newNote, setNewNote] = useState({ 
    title: '', 
    content: '', 
    isFavorite: false, 
    isPinned: false 
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showSaveWarning, setShowSaveWarning] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    const savedNotes = localStorage.getItem(NOTES_STORAGE_KEY);
    if (savedNotes) {
      try {
        const parsedNotes = JSON.parse(savedNotes);
        setNotes(parsedNotes);
      } catch (error) {
        console.error('Failed to parse saved notes', error);
        addNotification('Failed to load saved notes', 'error');
      }
    }
    setIsInitialLoad(false);
  }, []);

  useEffect(() => {
    if (!isInitialLoad) {
      localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
    }
  }, [notes, isInitialLoad]);

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase());
    if (activeFilter === 'favorites') return matchesSearch && note.isFavorite;
    if (activeFilter === 'pinned') return matchesSearch && note.isPinned;
    return matchesSearch;
  }).sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    if (a.isFavorite && !b.isFavorite) return -1;
    if (!a.isFavorite && b.isFavorite) return 1;
    return new Date(b.date) - new Date(a.date);
  });

  const addNotification = (message, type = 'info') => {
    const id = Date.now();
    setNotifications([...notifications, { id, message, type }]);
    setTimeout(() => {
      setNotifications(notifications.filter(n => n.id !== id));
    }, 3000);
  };

  const handleAddNote = () => {
    const newNoteObj = {
      ...newNote,
      id: Date.now(),
      date: new Date().toISOString()
    };
    setNotes([...notes, newNoteObj]);
    setIsModalOpen(false);
    setNewNote({ title: '', content: '', isFavorite: false, isPinned: false });
    addNotification('Note added successfully!', 'success');
  };

  const handleUpdateNote = () => {
    setNotes(notes.map(note => 
      note.id === newNote.id ? newNote : note
    ));
    setIsModalOpen(false);
    setNewNote({ title: '', content: '', isFavorite: false, isPinned: false });
    addNotification('Note updated successfully!', 'success');
  };

  const handleFieldChange = (field, value) => {
    setNewNote({ ...newNote, [field]: value });
    setHasChanges(true);
  };

  const handleEditNote = (note) => {
    setNewNote({ ...note });
    setIsModalOpen(true);
    setHasChanges(false);
  };

  const handleCloseModal = () => {
    if (hasChanges) {
      setShowSaveWarning(true);
    } else {
      setIsModalOpen(false);
    }
  };

  const confirmDelete = () => {
    setNotes(notes.filter(note => note.id !== noteToDelete));
    setNoteToDelete(null);
    addNotification('Note deleted successfully!', 'success');
  };

  return (
    <>
      <Navbar/>
      <div className="flex h-screen bg-[#f9f6f2] overflow-hidden">
        <NotesSidebar
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          onAddNote={() => {
            setNewNote({ title: '', content: '', isFavorite: false, isPinned: false });
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
            {notes.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="text-gray-500 text-lg mb-4">
                  You haven't added any notes yet
                </div>
                <button
                  onClick={() => {
                    setNewNote({ title: '', content: '', isFavorite: false, isPinned: false });
                    setIsModalOpen(true);
                  }}
                  className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-400 transition"
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
                  setNotes(notes.map(note => 
                    note.id === id ? { ...note, isFavorite: !note.isFavorite } : note
                  ));
                }}
                onTogglePin={(id) => {
                  setNotes(notes.map(note => 
                    note.id === id ? { ...note, isPinned: !note.isPinned } : note
                  ));
                }}
              />
            )}
          </div>
        </div>
      
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <NoteForm
            note={newNote}
            onSave={newNote.id ? handleUpdateNote : handleAddNote}
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
    
      <div className="fixed top-4 right-4 z-50 w-80">
        {notifications.map(notification => (
          <Notification
            key={notification.id}
            message={notification.message}
            type={notification.type}
            onClose={() => setNotifications(notifications.filter(n => n.id !== notification.id))}
          />
        ))}
      </div>
    </div>
    </>
  );
};

export default NotesDashboard;