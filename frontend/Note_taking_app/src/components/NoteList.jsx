import NoteCard from './NoteCard';

const NoteList = ({ notes, onEdit, onDelete, onToggleFavorite, onTogglePin }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {notes.map(note => (
        <NoteCard
          key={note.id}
          note={note}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleFavorite={onToggleFavorite}
          onTogglePin={onTogglePin}
        />
      ))}
    </div>
  );
};

export default NoteList;