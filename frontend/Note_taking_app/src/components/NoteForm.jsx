import { useState, useRef } from 'react';
import JoditEditor from 'jodit-react';
import { StarIcon, MapPinIcon as PinnedIcon } from '@heroicons/react/24/outline';

const MarkdownEditor = ({ value, onChange }) => {
  const [activeTab, setActiveTab] = useState('write');
  const editor = useRef(null);

  const config = {
    readonly: false,
    toolbar: true,
    spellcheck: true,
    language: 'en',
    toolbarButtonSize: 'medium',
    toolbarAdaptive: false,
    showCharsCounter: false,
    showWordsCounter: false,
    showXPathInStatusbar: false,
    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,
    defaultActionOnPaste: 'insert_clear_html',
    buttons: [
      'bold', 'italic', 'underline', 'strikethrough', '|',
      'ul', 'ol', '|',
      'outdent', 'indent', '|',
      'font', 'fontsize', 'brush', 'paragraph', '|',
      'image', 'link', '|',
      'align', '|',
      'undo', 'redo', '|',
      'hr', 'eraser', 'fullsize'
    ],
    height: 200
  };

  return (
    <div className="border rounded-lg overflow-hidden mb-4 bg-white">
      <div className="flex border-b">
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'write' ? 'bg-gray-100 text-orange-500' : 'text-gray-600'}`}
          onClick={() => setActiveTab('write')}
        >
          Write
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'preview' ? 'bg-gray-100 text-orange-500' : 'text-gray-600'}`}
          onClick={() => setActiveTab('preview')}
        >
          Preview
        </button>
      </div>

      <div className="p-2 bg-white" data-color-mode="light">
        {activeTab === 'write' ? (
          <JoditEditor
            ref={editor}
            value={value}
            config={config}
            tabIndex={1}
            onBlur={newContent => onChange(newContent)}
            onChange={newContent => {}}
          />
        ) : (
          <div 
            className="prose max-w-none p-2 min-h-[200px] bg-white"
            dangerouslySetInnerHTML={{ __html: value || 'Nothing to preview' }}
          />
        )}
      </div>
    </div>
  );
};

const NoteForm = ({ 
  note, 
  onSave, 
  onCancel, 
  onFieldChange,
  isSaving 
}) => {
  return (
    <div className="bg-white rounded-xl w-full max-w-2xl p-6">
      <h2 className="text-xl font-bold mb-4">{note.id ? 'Edit Note' : 'Add New Note'}</h2>
      
      <input
        type="text"
        placeholder="Note title"
        value={note.title}
        onChange={(e) => onFieldChange('title', e.target.value)}
        className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
      />
      
      <MarkdownEditor
        value={note.content}
        onChange={(value) => onFieldChange('content', value)}
      />
      
      <div className="flex items-center space-x-4 mb-6">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={note.isFavorite}
            onChange={(e) => onFieldChange('isFavorite', e.target.checked)}
            className="mr-2"
          />
          <StarIcon className="w-5 h-5 text-yellow-500" />
          <span className="ml-1">Favorite</span>
        </label>
        
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={note.isPinned}
            onChange={(e) => onFieldChange('isPinned', e.target.checked)}
            className="mr-2"
          />
          <PinnedIcon className="w-5 h-5 text-orange-500" />
          <span className="ml-1">Pin to top</span>
        </label>
      </div>
      
      <div className="flex justify-end space-x-3">
        <button
          onClick={onCancel}
          className="px-4 py-2 border rounded-lg hover:bg-gray-100"
          disabled={isSaving}
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : (note.id ? 'Update Note' : 'Add Note')}
        </button>
      </div>
    </div>
  );
};

export default NoteForm;
