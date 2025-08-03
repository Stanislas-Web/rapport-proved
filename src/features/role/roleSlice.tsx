import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Role } from '../../types/role';


const initialState: Role = {
  nom: "",
}

export const RoleSlice = createSlice({
  name: 'role',
  initialState,
  reducers: {
    changeValueRole: (state, action: PayloadAction<string>) => {
      state.nom = action.payload
    },

  },
})





export const { changeValueRole } = RoleSlice.actions

export default RoleSlice.reducer