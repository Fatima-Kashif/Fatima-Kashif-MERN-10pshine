import {configureStore} from '@reduxjs/toolkit';
import notesreducer from '../features/notes/noteSlice'
import userreducer from '../features/user/userSlice'


const store = configureStore({
  reducer: {
    notes: notesreducer,
    user:userreducer
  },
});

export default store;
