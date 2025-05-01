import { createSlice } from '@reduxjs/toolkit';
import { deleteNoteApi, getAllNotes, updateNoteApi } from './noteService';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { createNote } from './noteService';


const initialState = {
  notes: [],
  noteUpdated:false,
  noteAdded:false,
  noteEdit:false,
  noteEditDetails:null,
  noteFavorite:false,
  isEditing:false,
  noteDelete:false,
  loading: false,
    error: null,
};

export const getAllUserNotes = createAsyncThunk('notes/fetchNotes', async (_, thunkAPI) => {
  try {
    const data = await getAllNotes();
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const addUserNote = createAsyncThunk(
  'notes/addNote',
  async (noteToAdd, { rejectWithValue }) => {
    try {
      const data = await createNote(noteToAdd);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteUserNote = createAsyncThunk(
  'notes/deleteNote',
  async (noteId, { rejectWithValue }) => {
    try {
      const data = await deleteNoteApi(noteId);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const editUserNote = createAsyncThunk(
  'notes/editeNote',
  async (note, { rejectWithValue }) => {
    try {
      const data = await updateNoteApi(note._id,note);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    setNotes: (state, action) => {
      state.notes = action.payload;
    },
    setNoteToEdit:(state, action) => {
      state.noteEditDetails = action.payload;
    },
    isNoteEditing : (state, action) => {
      state.isEditing = true;
    },
    isNotNoteEditing : (state, action) => {
      state.isEditing =false;
    },
    resetNotes :(state, action) => {
      state.notes = action.payload;
    },
    resetAddNote :(state, action) => {
      state.noteAdded = false;  
      state.noteDelete =false ;
      state.noteEdit =false ;
      state.noteEditDetails = null;
state.is
    },
    addNote: (state, action) => {
      state.notes.push(action.payload);
    },
    updateNote: (state, action) => {
      const index = state.notes.findIndex(note => note.id === action.payload.id);
      if (index !== -1) {
        state.notes[index] = action.payload;
      }
    },
    deleteNote: (state, action) => {
      state.notes = state.notes.filter(note => note.id !== action.payload);
    },
  },
  extraReducers:(builder) => {
    builder
    .addCase(getAllUserNotes.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getAllUserNotes.fulfilled, (state, action) => {
      state.notes = action.payload.data;
      state.loading = false;
    })
    .addCase(getAllUserNotes.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
    })
    .addCase(addUserNote.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(addUserNote.fulfilled, (state, action) => {
      state.noteAdded = true;
      state.loading = false;
    })
    .addCase(addUserNote.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
      state.noteAdded = false;
    })
    .addCase(deleteUserNote.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(deleteUserNote.fulfilled, (state, action) => {
      state.noteDelete = true;
      state.loading = false;
    })
    .addCase(deleteUserNote.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
      state.noteEdit = false;
    })
    .addCase(editUserNote.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(editUserNote.fulfilled, (state, action) => {
      state.noteEdit = true;
      state.isEditing = false;
      state.loading = false;
    })
    .addCase(editUserNote.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
      state.noteEdit = false;
    })
    
    
    ;
  }
});

export const { setNotes, addNote, updateNote, isNoteEditing,
  isNotNoteEditing,deleteNote,resetAddNote,setNoteToEdit } = notesSlice.actions;

export default notesSlice.reducer;
