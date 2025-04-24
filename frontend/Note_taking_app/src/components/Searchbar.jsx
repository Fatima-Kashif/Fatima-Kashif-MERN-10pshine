import { MagnifyingGlassIcon as SearchIcon } from '@heroicons/react/24/outline';

const SearchBar = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="mb-6 relative">
      <SearchIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
      <input
        type="text"
        placeholder="Search notes by title..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
      />
    </div>
  );
};

export default SearchBar;