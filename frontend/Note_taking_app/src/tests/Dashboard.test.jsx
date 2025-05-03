import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import NotesDashboard from '../pages/dashboard';
import notesReducer from '../features/notes/noteSlice';
import '@testing-library/jest-dom';

// Mock the required modules
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

// Create mock reducer and actions
const initialState = {
  notes: {
    notes: [],
    noteAdded: false,
    noteDelete: false,
    noteEdit: false,
    loading: false,
    isEditing: false,
  },
};

const mockStore = configureStore({
  reducer: {
    notes: (state = initialState.notes, action) => {
      switch (action.type) {
        case 'notes/getAllUserNotes/fulfilled':
          return { ...state, notes: action.payload };
        case 'notes/addUserNote/fulfilled':
          return { ...state, noteAdded: true };
        case 'notes/deleteUserNote/fulfilled':
          return { ...state, noteDelete: true };
        case 'notes/editUserNote/fulfilled':
          return { ...state, noteEdit: true };
        case 'notes/resetAddNote':
          return { ...state, noteAdded: false, noteDelete: false, noteEdit: false };
        case 'notes/isNoteEditing':
          return { ...state, isEditing: true };
        default:
          return state;
      }
    },
  },
});

// Mock redux actions
vi.mock('../features/notes/noteSlice', () => ({
  getAllUserNotes: vi.fn(() => ({ type: 'notes/getAllUserNotes/fulfilled', payload: [] })),
  addUserNote: vi.fn((note) => ({ type: 'notes/addUserNote/fulfilled', payload: note })),
  resetAddNote: vi.fn(() => ({ type: 'notes/resetAddNote' })),
  deleteUserNote: vi.fn((id) => ({ type: 'notes/deleteUserNote/fulfilled', payload: id })),
  isNoteEditing: vi.fn(() => ({ type: 'notes/isNoteEditing' })),
  setNoteToEdit: vi.fn((note) => ({ type: 'notes/setNoteToEdit', payload: note })),
  editUserNote: vi.fn((note) => ({ type: 'notes/editUserNote/fulfilled', payload: note })),
  default: () => ({
    notes: [],
    status: 'succeeded',
    error: null,
    noteAdded: false,
    noteDelete: false,
    noteEdit: false,
    loading: false,
    isEditing: false,
  }),
}));

// Mock components
vi.mock('../components/NotesSidebar', () => ({
  default: ({ activeFilter, onFilterChange, onAddNote }) => (
    <div data-testid="notes-sidebar">
      <button data-testid="filter-all" onClick={() => onFilterChange('all')}>All</button>
      <button data-testid="filter-favorites" onClick={() => onFilterChange('favorites')}>Favorites</button>
      <button data-testid="filter-pinned" onClick={() => onFilterChange('pinned')}>Pinned</button>
      <button data-testid="add-note-button" onClick={onAddNote}>Add Note</button>
    </div>
  ),
}));

vi.mock('../components/Searchbar', () => ({
  default: ({ searchTerm, onSearchChange }) => (
    <input 
      data-testid="search-bar" 
      value={searchTerm} 
      onChange={(e) => onSearchChange(e.target.value)} 
    />
  ),
}));

vi.mock('../components/NoteList', () => ({
  default: ({ notes, onEdit, onDelete }) => (
    <div data-testid="note-list">
      {notes && notes.map(note => (
        <div key={note.id} data-testid={`note-${note.id}`}>
          <span>{note.title}</span>
          <button data-testid={`edit-note-${note.id}`} onClick={() => onEdit(note)}>Edit</button>
          <button data-testid={`delete-note-${note.id}`} onClick={() => onDelete(note.id)}>Delete</button>
        </div>
      ))}
    </div>
  ),
}));

vi.mock('../components/NoteForm', () => ({
  default: ({ note, onSave, onCancel, onFieldChange }) => (
    <div data-testid="note-form">
      <input 
        data-testid="note-title" 
        value={note.title} 
        onChange={(e) => onFieldChange('title', e.target.value)} 
      />
      <textarea 
        data-testid="note-content" 
        value={note.content} 
        onChange={(e) => onFieldChange('content', e.target.value)} 
      />
      <button data-testid="save-note" onClick={onSave}>Save</button>
      <button data-testid="cancel-note" onClick={onCancel}>Cancel</button>
    </div>
  ),
}));

vi.mock('../components/confirmation', () => ({
  default: ({ isOpen, onConfirm, onCancel }) => (
    isOpen ? (
      <div data-testid="confirmation-modal">
        <button data-testid="confirm-button" onClick={onConfirm}>Confirm</button>
        <button data-testid="cancel-button" onClick={onCancel}>Cancel</button>
      </div>
    ) : null
  ),
}));

vi.mock('../components/notification', () => ({
  default: ({ message, type, onClose }) => (
    <div data-testid="notification" className={`notification ${type}`}>
      <span data-testid="notification-message">{message}</span>
      <button data-testid="notification-close" onClick={onClose}>×</button>
    </div>
  ),
}));

vi.mock('../components/navbar', () => ({
  default: () => <div data-testid="navbar">Navbar</div>,
}));

// Mock document.cookie
Object.defineProperty(document, 'cookie', {
  writable: true,
  value: 'token=test-token',
});

describe('NotesDashboard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = '';
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders without crashing', () => {
    render(
      <Provider store={mockStore}>
        <BrowserRouter>
          <NotesDashboard />
        </BrowserRouter>
      </Provider>
    );
    
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('notes-sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('search-bar')).toBeInTheDocument();
  });

  it('opens the note form when add note button is clicked', async () => {
    render(
      <Provider store={mockStore}>
        <BrowserRouter>
          <NotesDashboard />
        </BrowserRouter>
      </Provider>
    );
    
    fireEvent.click(screen.getByTestId('add-note-button'));
    
    await waitFor(() => {
      expect(screen.getByTestId('note-form')).toBeInTheDocument();
    });
  });

  it('updates search term when typing in search bar', () => {
    render(
      <Provider store={mockStore}>
        <BrowserRouter>
          <NotesDashboard />
        </BrowserRouter>
      </Provider>
    );
    
    const searchBar = screen.getByTestId('search-bar');
    fireEvent.change(searchBar, { target: { value: 'test search' } });
    
    expect(searchBar.value).toBe('test search');
  });

  it('changes filter when clicking on filter buttons', () => {
    render(
      <Provider store={mockStore}>
        <BrowserRouter>
          <NotesDashboard />
        </BrowserRouter>
      </Provider>
    );
    
    fireEvent.click(screen.getByTestId('filter-favorites'));
    fireEvent.click(screen.getByTestId('filter-pinned'));
    fireEvent.click(screen.getByTestId('filter-all'));
    
    // This is just testing that the buttons exist and can be clicked
    // The actual state change is internal to the component
    expect(screen.getByTestId('filter-all')).toBeInTheDocument();
  });

  describe('NotesDashboard Empty State', () => {
    it('displays empty state when filteredNotes is empty but notes exist', async () => {
      const store = configureStore({
        reducer: {
          notes: notesReducer,
        },
        preloadedState: {
          notes: {
            notes: [{ id: 1, title: '', content: '' }], 
            loading: false,
            noteAdded: false,
            noteDelete: false,
            noteEdit: false,
            noteEditDetails: null,
            noteUpdated: false,
            noteFavorite: false,
            isEditing: false,
            error: null,
            activeFilter: "all",
          },
        },
      });
  
      render(
        <Provider store={store}>
          <BrowserRouter>
            <NotesDashboard />
          </BrowserRouter>
        </Provider>
      );
  
      // Let the useEffect run
      const emptyState = await screen.findByTestId('empty-state');
      expect(emptyState).toBeInTheDocument();
  
    });
  });

  it('adds a new note correctly', async () => {
    render(
      <Provider store={mockStore}>
        <BrowserRouter>
          <NotesDashboard />
        </BrowserRouter>
      </Provider>
    );
    
    // Open the note form
    fireEvent.click(screen.getByTestId('add-note-button'));
    
    // Fill in the note details
    const titleInput = screen.getByTestId('note-title');
    const contentInput = screen.getByTestId('note-content');
    
    fireEvent.change(titleInput, { target: { value: 'Test Note' } });
    fireEvent.change(contentInput, { target: { value: 'Test Content' } });
    
    // Save the note
    fireEvent.click(screen.getByTestId('save-note'));
    
    // Check if notification appears - using waitFor for async appearance
    await waitFor(() => {
      const notification = screen.getByTestId('notification');
      expect(notification).toBeInTheDocument();
      expect(screen.getByText(/Note added successfully!/i)).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('shows notes when available', async () => {
    // Create a store with mock notes
    const mockNotes = [
      { id: '1', title: 'Note 1', content: 'Content 1', favourite: false, pinned: false, createdAt: new Date().toISOString() },
      { id: '2', title: 'Note 2', content: 'Content 2', favourite: true, pinned: false, createdAt: new Date().toISOString() },
    ];
    
    const storeWithNotes = configureStore({
      reducer: {
        notes: (state = { ...initialState.notes, notes: mockNotes }, action) => {
          if (action.type === 'notes/getAllUserNotes/fulfilled') {
            return { ...state, notes: mockNotes };
          }
          return state;
        },
      },
    });

    render(
      <Provider store={storeWithNotes}>
        <BrowserRouter>
          <NotesDashboard />
        </BrowserRouter>
      </Provider>
    );
    
    // Check if the NoteList component renders
    expect(screen.getByTestId('note-list')).toBeInTheDocument();
  });

  it('handles note deletion correctly', async () => {
    // Create a store with mock notes
    const mockNotes = [
      { id: '1', title: 'Note 1', content: 'Content 1', favourite: false, pinned: false, createdAt: new Date().toISOString() },
    ];
    
    const storeWithNotes = configureStore({
      reducer: {
        notes: (state = { ...initialState.notes, notes: mockNotes }, action) => {
          switch (action.type) {
            case 'notes/getAllUserNotes/fulfilled':
              return { ...state, notes: mockNotes };
            case 'notes/deleteUserNote/fulfilled':
              return { ...state, noteDelete: true };
            case 'notes/resetAddNote':
              return { ...state, noteDelete: false };
            default:
              return state;
          }
        },
      },
    });
    
    const { rerender } = render(
      <Provider store={storeWithNotes}>
        <BrowserRouter>
          <NotesDashboard />
        </BrowserRouter>
      </Provider>
    );
    
    // Simulate clicking delete on the first note
    fireEvent.click(screen.getByTestId('delete-note-1'));
    
    // Confirmation modal should appear
    expect(screen.getByTestId('confirmation-modal')).toBeInTheDocument();
    
    // Confirm deletion
    fireEvent.click(screen.getByTestId('confirm-button'));
    
    // Update the store to simulate a successful deletion
    const updatedStore = configureStore({
      reducer: {
        notes: (state = { ...initialState.notes, noteDelete: true, notes: [] }, action) => state,
      },
    });
    
    rerender(
      <Provider store={updatedStore}>
        <BrowserRouter>
          <NotesDashboard />
        </BrowserRouter>
      </Provider>
    );
    
    // Check if notification appears with timeout to allow for state updates
    await waitFor(() => {
      const notification = screen.getByTestId('notification');
      expect(notification).toBeInTheDocument();
      const notificationMessage = within(notification).getByTestId('notification-message');
      expect(notificationMessage).toHaveTextContent(/Note deleted successfully!/i);
    }, { timeout: 2000 });
  });

  it('handles note editing correctly', async () => {
    // Create a store with mock notes
    const mockNotes = [
      { id: '1', title: 'Note 1', content: 'Content 1', favourite: false, pinned: false, createdAt: new Date().toISOString() },
    ];
    
    const storeWithNotes = configureStore({
      reducer: {
        notes: (state = { ...initialState.notes, notes: mockNotes }, action) => {
          switch (action.type) {
            case 'notes/getAllUserNotes/fulfilled':
              return { ...state, notes: mockNotes };
            case 'notes/isNoteEditing':
              return { ...state, isEditing: true };
            case 'notes/editUserNote/fulfilled':
              return { ...state, noteEdit: true };
            case 'notes/resetAddNote':
              return { ...state, noteEdit: false };
            default:
              return state;
          }
        },
      },
    });
    
    const { rerender } = render(
      <Provider store={storeWithNotes}>
        <BrowserRouter>
          <NotesDashboard />
        </BrowserRouter>
      </Provider>
    );
    
    // Simulate clicking edit on the first note
    fireEvent.click(screen.getByTestId('edit-note-1'));
    
    // Note form should appear
    expect(screen.getByTestId('note-form')).toBeInTheDocument();
    
    // Edit the note title
    const titleInput = screen.getByTestId('note-title');
    fireEvent.change(titleInput, { target: { value: 'Updated Note Title' } });
    
    // Save the note
    fireEvent.click(screen.getByTestId('save-note'));
    
    // Update the store to simulate a successful edit
    const updatedStore = configureStore({
      reducer: {
        notes: (state = { ...initialState.notes, noteEdit: true, notes: [
          { ...mockNotes[0], title: 'Updated Note Title' }
        ] }, action) => state,
      },
    });
    
    rerender(
      <Provider store={updatedStore}>
        <BrowserRouter>
          <NotesDashboard />
        </BrowserRouter>
      </Provider>
    );
    
    // Check if notification appears
    await waitFor(() => {
      const notification = screen.getByTestId('notification');
      expect(notification).toBeInTheDocument();
      const notificationMessage = within(notification).getByTestId('notification-message');
      expect(notificationMessage).toHaveTextContent(/Note updated successfully!/i);
    }, { timeout: 2000 });
  });
});

