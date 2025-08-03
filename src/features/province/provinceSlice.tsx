import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import ProvinceService from '../../services/province/provinceservice';
import { Province } from '../../types/province';


const initialState: Province = {
  _id: "",
  idProvince: "",
  nom: "",
}

export const EcoleSlice = createSlice({
  name: 'ecole',
  initialState,
  reducers: {
    changeValueProvince: (state, action: PayloadAction<string>) => {
      state.idProvince = action.payload
    },

  },
})

export const getAllProvince = createAsyncThunk(
  "get all provinces",
  async ({ route }: { route: string}, thunkAPI) => {
    try {
      return await ProvinceService.getAllProvinces(route);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);



export const { changeValueProvince } = EcoleSlice.actions

export default EcoleSlice.reducer