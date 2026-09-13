import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  theme: 'light', // Force light/white luxury theme
  sidebarOpen: false,
  searchModalOpen: false,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    setSearchModalOpen: (state, action) => {
      state.searchModalOpen = action.payload;
    },
  },
});

export const { toggleSidebar, setSidebarOpen, setSearchModalOpen } = uiSlice.actions;
export default uiSlice.reducer;
