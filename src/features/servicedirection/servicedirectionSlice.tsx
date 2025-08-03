import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import ServiceDirectionService from '../../services/servicedirection/servicedirectionservice';





interface ServiceDirectionState {
  serviceDirection: [],
  serviceSousDirection: [],
  services:[],
  _id: string,
  idServiceDirection: string,
  nom: string,
  idDirection: string,
  idSousDirection: string
}

const initialState: ServiceDirectionState = {
  serviceDirection: [],
  serviceSousDirection: [],
  services:[],
  _id: "",
  idServiceDirection: "",
  nom: "",
  idDirection: "",
  idSousDirection: ""
};

export const ServiceDirectionSlice = createSlice({
  name: 'serviceDirection',
  initialState,
  reducers: {
    changeValueServiceDirection: (state, action: PayloadAction<string>) => {
      state.idServiceDirection = action.payload
    },
    setSliceServiceSousDirection: (state, action: PayloadAction<any>) => {
      state.serviceSousDirection = action.payload
    },
    setSliceServiceDirection: (state, action: PayloadAction<any>) => {
      state.serviceDirection = action.payload
    },
    setSliceService: (state, action: PayloadAction<any>) => {
      state.services = action.payload
    }

  },
})

export const getAllServiceDirections = createAsyncThunk(
  "get all services direction",
  async ({ route }: { route: string}, thunkAPI) => {
    try {
      return await ServiceDirectionService.getAllServiceDirections(route);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);



export const { changeValueServiceDirection, setSliceServiceDirection, setSliceServiceSousDirection, setSliceService } = ServiceDirectionSlice.actions

export default ServiceDirectionSlice.reducer