import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import c1service from '../../services/c1/c1Service';

interface c1State {
  c1s: any[];
  loading: boolean;
}

const initialState: c1State = {
  c1s: [],
  loading: false,
};

export const fetchAllC1s = createAsyncThunk(
  'a1/fetchAllc1s',
  async ({ route }: { route: string }, thunkAPI) => {
    try {
      return await c1service.getAllC1(route);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const c1slice = createSlice({
  name: 'c1',
  initialState,
  reducers: {
    setC1store: (state, action: PayloadAction<any[]>) => {
      state.c1s = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllC1s.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllC1s.fulfilled, (state, action) => {
        state.c1s = action.payload.data; // Assuming response has a `data` field
        state.loading = false;
      })
      .addCase(fetchAllC1s.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setC1store } = c1slice.actions;

export default c1slice.reducer;
