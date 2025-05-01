import { StarIcon, MapPinIcon as PinnedIcon } from '@heroicons/react/24/outline';

const NoteCard = ({ note, onEdit, onDelete, onToggleFavorite, onTogglePin }) => {
  return (
    <div className={`bg-white rounded-xl shadow-md overflow-hidden border ${note.pinned ? 'border-orange-400' : 'border-gray-200'}`}>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg">{note.title}</h3>
          <div className="flex space-x-2">
            <button onClick={() => onTogglePin(note.id)} className="p-1">
              <PinnedIcon className={`w-5 h-5 ${note.pinned ? 'text-orange-500 fill-orange-500' : 'text-gray-400'}`} />
            </button>
            <button onClick={() => onToggleFavorite(note.id)} className="p-1">
              <StarIcon className={`w-5 h-5 ${note.favourite ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'}`} />
            </button>
          </div>
        </div>
        <div className="text-gray-500 text-sm mb-3">
          {new Date(note.createdAt).toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'short', 
            day: 'numeric' 
          })}
        </div>
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: note.content }} />
        <div className="mt-4 flex justify-end space-x-2">
          <button 
            onClick={() => onEdit(note)}
            className="text-sm text-blue-500 hover:text-blue-700"
          >
            Edit
          </button>
          <button 
            onClick={() =>
            {
              onDelete(note._id)
            }
              }
            className="text-sm text-red-500 hover:text-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;