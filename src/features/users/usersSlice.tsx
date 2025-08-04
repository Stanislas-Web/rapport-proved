import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import UsersService from '../../services/users/usersservice';
import { User } from '../../types/user';
import { Role } from '../../enums/role';

interface ValidationErrors {
  nom?: string;
  postnom?: string;
  prenom?: string;
  email?: string;
  phone?: string;
  direction?: string;
  service?: string;
  province?: string;
  sousDirection?: string;
  role?: string;
  fonction?: string;
  grade?: string;
  provinceAdministrative?: string;
  provinceEducationnelle?: string;
  chefLieuProved?: string;
  emailProfessionnel?: string;
  telephone?: string;
  directeurProvincial?: string;
  motDePasse?: string;
}

interface UsersState {
  user: User;
  loading: boolean;
  error: string | null;
  success: boolean;
  validationErrors: ValidationErrors;
}

const initialUserState: User = {
  id: "",
  motDePasse: "",
  provinceAdministrative: "",
  provinceEducationnelle: "",
  chefLieuProved: "",
  emailProfessionnel: "",
  telephone: "",
  statutOccupation: "Propriétaire",
  nombreTerritoires: 0,
  nombreSousDivisions: 0,
  directeurProvincial: "",
  isActive: true,
  // Champs optionnels pour compatibilité
  nom: "",
  postnom: "",
  prenom: "",
  photo: "",
  email: "",
  role: Role.Utilisateur,
  direction: "",
  service: "",
  phone: "",
  province: "",
  sousDirection: "",
  fileValue: null,
  visiblePhoto: false,
  fonction: "",
  grade: "",
  password: ""
};

const initialState: UsersState = {
  user: initialUserState,
  loading: false,
  error: null,
  success: false,
  validationErrors: {}
};

// Fonction de validation
const validateUser = (state: UsersState) => {
  const errors: ValidationErrors = {};
  
  // Validation pour les nouveaux champs PROVED
  if (!state.user.provinceAdministrative) errors.provinceAdministrative = "Province Administrative est requise";
  if (!state.user.provinceEducationnelle) errors.provinceEducationnelle = "Province Educationnelle est requise";
  if (!state.user.chefLieuProved) errors.chefLieuProved = "Chef Lieu PROVED est requis";
  if (!state.user.emailProfessionnel) errors.emailProfessionnel = "Email Professionnel est requis";
  if (!state.user.telephone) errors.telephone = "Téléphone est requis";
  if (!state.user.directeurProvincial) errors.directeurProvincial = "Directeur Provincial est requis";
  if (!state.user.motDePasse) errors.motDePasse = "Mot de passe est requis";
  
  // Validation pour les champs optionnels (compatibilité)
  if (state.user.nom && !state.user.nom) errors.nom = "Nom est requis";
  if (state.user.postnom && !state.user.postnom) errors.postnom = "Post-nom est requis";
  if (state.user.prenom && !state.user.prenom) errors.prenom = "Prénom est requis";
  if (state.user.direction && !state.user.direction) errors.direction = "Direction est requis";
  if (state.user.service && !state.user.service) errors.service = "Service est requis";
  if (state.user.province && !state.user.province) errors.province = "Province est requise";
  if (state.user.fonction && !state.user.fonction) errors.fonction = "Fonction est requise";
  if (state.user.grade && !state.user.grade) errors.grade = "Grade est requise";
  
  // Validation email avec format spécifique
  if (state.user.email && (!state.user.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.user.email))) {
    errors.email = "Email invalide";
  }
  
  // Validation téléphone avec format spécifique
  if (state.user.phone && (!state.user.phone || !/^\+\d{1,3}\d{4,14}$/.test(state.user.phone))) {
    errors.phone = "Téléphone invalide";
  }

  state.validationErrors = errors;
};

export const UsersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    validateInputs: (state) => {
      validateUser(state);
    },
    updateFile: (state, action: PayloadAction<File | null>) => {
      state.user.fileValue = action.payload;
    },
    updateVisibilityPhoto: (state, action: PayloadAction<boolean>) => {
      state.user.visiblePhoto = action.payload;
    },
    // Nouvelle méthode pour mettre à jour les champs d'utilisateur
    updateUserField: (state, action: PayloadAction<{ field: string; value: any }>) => {
      const { field, value } = action.payload;

      switch (field) {
        case 'fileValue':
          state.user.fileValue = value;
          break;
        case 'visiblePhoto':
          state.user.visiblePhoto = value;
          break;
        case 'id':
          state.user.id = value;
          break;
        case 'nom':
          state.user.nom = value;
          validateUser(state);
          break;
        case 'postnom':
          state.user.postnom = value;
          validateUser(state);
          break;
        case 'prenom':
          state.user.prenom = value;
          validateUser(state);
          break;
        case 'email':
          state.user.email = value;
          validateUser(state);
          break;
        case 'phone':
          state.user.phone = value;
          validateUser(state);
          break;
        case 'role':
          state.user.role = value;
          validateUser(state);
          break;
        case 'direction':
          state.user.direction = value;
          validateUser(state);
          break;
        case 'service':
          state.user.service = value;
          validateUser(state);
          break;
        case 'province':
          state.user.province = value;
          validateUser(state);
          break;
        case 'sousDirection':
          state.user.sousDirection = value;
          validateUser(state);
          break;
        case 'grade':
          state.user.grade = value;
          validateUser(state);
          break;
        case 'fonction':
          state.user.fonction = value;
          validateUser(state);
          break;
        default:
          console.warn(`Champ inconnu: ${field}`);
          break;
      }
    },
    resetUserState: () => initialState,
  },
});

export const loginUser = createAsyncThunk(
  "login users",
  async ({ route, data }: { route: string; data: object }, thunkAPI) => {
    try {
      return await UsersService.login(route, data);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const uploadPhotoUser = createAsyncThunk(
  "upload photo",
  async ({ route, file }: { route: string; file: File | null }, thunkAPI) => {
    try {
      return await UsersService.uploadImage(route, file);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const createUser = createAsyncThunk(
  "create users",
  async ({ route, data }: { route: string; data: User }, thunkAPI) => {
    try {
      // Validation côté client
      const errors: ValidationErrors = {};
      
      // Validation pour les champs PROVED requis
      if (!data.provinceAdministrative) errors.provinceAdministrative = "Province Administrative est requise";
      if (!data.provinceEducationnelle) errors.provinceEducationnelle = "Province Educationnelle est requise";
      if (!data.chefLieuProved) errors.chefLieuProved = "Chef Lieu PROVED est requis";
      if (!data.emailProfessionnel) errors.emailProfessionnel = "Email Professionnel est requis";
      if (!data.telephone) errors.telephone = "Téléphone est requis";
      if (!data.directeurProvincial) errors.directeurProvincial = "Directeur Provincial est requis";
      if (!data.motDePasse) errors.motDePasse = "Mot de passe est requis";
      
      // Validation pour les champs optionnels
      if (data.nom && !data.nom) errors.nom = "Nom est requis";
      if (data.email && (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))) {
        errors.email = "Email invalide";
      }
      
      if (Object.keys(errors).length > 0) {
        return thunkAPI.rejectWithValue(errors);
      }
      
      return await UsersService.createUser(route, data);
    } catch (error: any) {
      // Gestion des erreurs de validation de l'API
      if (error.response && error.response.data) {
        const apiErrors = error.response.data;
        console.log('🔍 API Validation Errors:', apiErrors);
        
        // Si l'API retourne des erreurs de validation, les utiliser
        if (typeof apiErrors === 'object' && Object.keys(apiErrors).length > 0) {
          return thunkAPI.rejectWithValue(apiErrors);
        }
      }
      
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getAllUser = createAsyncThunk(
  "get all users",
  async ({ route }: { route: string }, thunkAPI) => {
    try {
      return await UsersService.getAllUser(route);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const {
  validateInputs,
  updateUserField, // Nouvelle action
  updateVisibilityPhoto,
  resetUserState,
  updateFile
} = UsersSlice.actions;

export default UsersSlice.reducer;
