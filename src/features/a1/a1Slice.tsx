import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import a1service from '../../services/a1/a1Service';

interface a1State {
  a1s: any[];
  loading: boolean;
}

const initialState: a1State = {
  a1s: [],
  loading: false,
};

export const fetchAllA1s = createAsyncThunk(
  'a1/fetchAllA1s',
  async ({ route }: { route: string }, thunkAPI) => {
    try {
      return await a1service.getAllA1(route);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const a1slice = createSlice({
  name: 'a1',
  initialState,
  reducers: {
    setA1store: (state, action: PayloadAction<any[]>) => {
      state.a1s = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllA1s.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllA1s.fulfilled, (state, action) => {
        state.a1s = action.payload.data; // Assuming response has a `data` field
        state.loading = false;
      })
      .addCase(fetchAllA1s.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setA1store } = a1slice.actions;

export default a1slice.reducer;
