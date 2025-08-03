import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import DirectionService from '../../services/direction/directionservice';




interface DirectionState {
  directions: [],
  cacheDirections: [],
  _id: string,
  idDirection: string,
  nom: string,
  idProvince: string,
  loading: boolean;
  roleDirection: string;
}

const initialState: DirectionState = {
  directions: [],
  cacheDirections: [],
  loading: false,
  _id: "",
  idDirection: "",
  nom: "",
  idProvince: "",
  roleDirection:""
};

export const DirectionSlice = createSlice({
  name: 'direction',
  initialState,
  reducers: {
    changeValueDirection: (state, action: PayloadAction<string>) => {
      state.idDirection = action.payload
    },

    setSliceDirection: (state, action: PayloadAction<any>) => {
      state.directions = action.payload
    },
    setCacheDirection: (state, action: PayloadAction<any>) => {
      state.cacheDirections = action.payload
    },
    setRole: (state, action: PayloadAction<string>) => {
      state.roleDirection = action.payload
    },

  },
})

export const getAllDirection = createAsyncThunk(
  "get all directions",
  async ({ route }: { route: string }, thunkAPI) => {
    try {
      return await DirectionService.getAllDirections(route);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);



export const { changeValueDirection, setSliceDirection, setRole, setCacheDirection } = DirectionSlice.actions

export default DirectionSlice.reducer