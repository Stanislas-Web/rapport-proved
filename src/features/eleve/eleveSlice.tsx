import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import EcoleService from '../../services/ecole/ecoleservice';
import { Ecole } from '../../types/ecole';

interface EcoleState {
  ecoles: Ecole[];
  loading: boolean;
}

const initialState: EcoleState = {
  ecoles: [],
  loading: false,
};

export const fetchAllEcoles = createAsyncThunk(
  'ecole/fetchAllEcoles',
  async ({ route }: { route: string }, thunkAPI) => {
    try {
      return await EcoleService.getAllEcoles(route);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const EcoleSlice = createSlice({
  name: 'ecole',
  initialState,
  reducers: {
    setEcoleStore: (state, action: PayloadAction<Ecole[]>) => {
      state.ecoles = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllEcoles.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllEcoles.fulfilled, (state, action) => {
        state.ecoles = action.payload.data; // Assuming response has a `data` field
        state.loading = false;
      })
      .addCase(fetchAllEcoles.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setEcoleStore } = EcoleSlice.actions;

export default EcoleSlice.reducer;
