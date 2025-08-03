import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import DirectionService from '../../services/direction/directionservice';




interface SousDirectionState {
  sousDirections: [],
  cacheSousDirections: [],
  _id: String,
  idDirection: String,
  nom: String,
  idSousDirection: String,
  visible: boolean,
  loading: boolean
}

const initialState: SousDirectionState = {
  loading: false,
  sousDirections: [],
  cacheSousDirections: [],
  _id: "",
  idDirection: "",
  nom: "",
  idSousDirection: "",
  visible: false
};

export const SousDirectionSice = createSlice({
  name: 'sousdirection',
  initialState,
  reducers: {
    changeValueSousDirection: (state, action: PayloadAction<string>) => {
      state.idSousDirection = action.payload
    },
    changeVisibility: (state, action: PayloadAction<boolean>) => {
      state.visible = action.payload
    },
    setSliceSousDirection: (state, action: PayloadAction<any>) => {
      state.sousDirections = action.payload
    },
    setCacheSousDirection: (state, action: PayloadAction<any>) => {
      state.cacheSousDirections = action.payload
    }

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



export const { changeVisibility, changeValueSousDirection, setSliceSousDirection, setCacheSousDirection } = SousDirectionSice.actions

export default SousDirectionSice.reducer