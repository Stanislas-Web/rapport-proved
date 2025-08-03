import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import c3service from '../../services/c3/c3Service';

interface c3State {
  c3s: any[];
  loading: boolean;
}

const initialState: c3State = {
  c3s: [],
  loading: false,
};

export const fetchAllC3s = createAsyncThunk(
  'a3/fetchAllc3s',
  async ({ route }: { route: string }, thunkAPI) => {
    try {
      return await c3service.getAllC3(route);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const c3slice = createSlice({
  name: 'c3',
  initialState,
  reducers: {
    setC3store: (state, action: PayloadAction<any[]>) => {
      state.c3s = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllC3s.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllC3s.fulfilled, (state, action) => {
        state.c3s = action.payload.data; // Assuming response has a `data` field
        state.loading = false;
      })
      .addCase(fetchAllC3s.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setC3store } = c3slice.actions;

export default c3slice.reducer;
