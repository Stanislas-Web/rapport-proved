import { configureStore } from '@reduxjs/toolkit'
import usersReducer from "../features/users/usersSlice";
import provincesReducer from "../features/province/provinceSlice";
import servicedirectionReducer from '../features/servicedirection/servicedirectionSlice';
import directionReducer from '../features/directions/directionSlice';
import roleReducer from '../features/role/roleSlice';
import sousDirectionReducer from '../features/sousdirection/sousDirectionSlice';
import ecoleReducer from "../features/ecole/ecoleSlice";
import a1Reducer from "../features/a1/a1Slice";
import c1Reducer from "../features/c1/c1Slice";
import c3Reducer from "../features/c3/c3Slice";

export const store = configureStore({
  reducer: {
    users: usersReducer,
    provinces: provincesReducer,
    direction: directionReducer,
    services: servicedirectionReducer,
    roles: roleReducer,
    sousDirections: sousDirectionReducer,
    ecoles: ecoleReducer,
    a1s: a1Reducer,
    c1s: c1Reducer,
    c3s: c3Reducer
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch