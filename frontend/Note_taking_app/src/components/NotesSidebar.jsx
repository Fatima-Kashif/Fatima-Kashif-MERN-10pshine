import { PlusIcon as AddIcon, StarIcon, MapPinIcon as PinnedIcon } from '@heroicons/react/24/outline';

const NotesSidebar = ({ 
  activeFilter, 
  onFilterChange, 
  onAddNote 
}) => {
  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">A clear mind starts with a written thought.</h1>
      
      <button 
        onClick={onAddNote}
        className="flex items-center w-full p-3 mb-4 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition"
      >
        <AddIcon className="w-5 h-5 mr-2" />
        Add Note
      </button>
      
      <div className="space-y-2">
        <button 
          onClick={() => onFilterChange('all')}
          className={`w-full text-left p-2 rounded ${activeFilter === 'all' ? 'bg-orange-100 text-orange-600' : 'hover:bg-gray-100'}`}
        >
          All Notes
        </button>
        <button 
          onClick={() => onFilterChange('favorites')}
          className={`w-full text-left p-2 rounded flex items-center ${activeFilter === 'favorites' ? 'bg-orange-100 text-orange-600' : 'hover:bg-gray-100'}`}
        >
          <StarIcon className="w-4 h-4 mr-2" />
          Favorites
        </button>
        <button 
          onClick={() => onFilterChange('pinned')}
          className={`w-full text-left p-2 rounded flex items-center ${activeFilter === 'pinned' ? 'bg-orange-100 text-orange-600' : 'hover:bg-gray-100'}`}
        >
          <PinnedIcon className="w-4 h-4 mr-2" />
          Pinned
        </button>
      </div>
    </div>
  );
};

export default NotesSidebar;