import NoteCard from './NoteCard';


const NoteList = ({ notes, onEdit, onDelete, onToggleFavorite, onTogglePin }) => {
 

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {notes && notes.length > 0 ? (
        notes.map(note => (
          <NoteCard
            key={note.id}
            note={note}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleFavorite={onToggleFavorite}
            onTogglePin={onTogglePin}
          />
        ))
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[60vh] w-290 px-4">
          <div className="text-center max-w-md mx-auto">
            <div className="text-gray-500 text-lg mb-4">
              You haven't added any notes yet
            </div>
            <button
              onClick={() => {
                onEdit({ title: '', content: '', isFavorite: false, isPinned: false });
              }}
              className="px-6 py-3 sm:px-8 sm:py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-500 transition-colors duration-200 text-base sm:text-lg w-full sm:w-auto"
            >
              Create Your First Note
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoteList;