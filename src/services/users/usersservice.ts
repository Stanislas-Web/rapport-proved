import { BaseService } from '../baseservice';




const login = async (route: string, data: object) => {
  const response = await BaseService.login(route, data);
  return response;
}

const createUser = async (route: string, data: object) => {
  console.log('🔍 UsersService.createUser - Route:', route);
  console.log('🔍 UsersService.createUser - Data:', data);
  console.log('🔍 UsersService.createUser - Token:', localStorage.getItem('token'));
  
  try {
    const response = await BaseService.post(route, data);
    console.log('🔍 UsersService.createUser - Réponse:', response);
    return response;
  } catch (error: any) {
    console.error('🔍 UsersService.createUser - Erreur complète:', error);
    console.error('🔍 UsersService.createUser - Message d\'erreur:', error.message);
    console.error('🔍 UsersService.createUser - Status:', error.response?.status);
    console.error('🔍 UsersService.createUser - Data d\'erreur:', error.response?.data);
    console.error('🔍 UsersService.createUser - Headers:', error.response?.headers);
    throw error;
  }
}


const uploadImage = async (route: string, imageFile: File | null) => {
  const response = await BaseService.uploadImage(route, imageFile);
  return response;
}

const getAllUser = async (route: string) => {
  console.log('🔍 UsersService.getAllUser - Route:', route);
  console.log('🔍 UsersService.getAllUser - Token:', localStorage.getItem('token'));
  
  try {
    const response = await BaseService.get(route);
    console.log('🔍 UsersService.getAllUser - Réponse complète:', response);
    
    // Gérer la nouvelle structure de réponse avec message, count et data
    if (response && response.data) {
      console.log('🔍 UsersService.getAllUser - Nombre d\'utilisateurs:', response.count);
      console.log('🔍 UsersService.getAllUser - Message:', response.message);
      return response.data; // Retourner seulement le tableau data
    }
    
    return response;
  } catch (error) {
    console.error('🔍 UsersService.getAllUser - Erreur:', error);
    throw error;
  }
}

const updateUser = async (id: string, data: object) => {
  console.log('🔍 UsersService.updateUser - ID:', id);
  console.log('🔍 UsersService.updateUser - Data:', data);
  console.log('🔍 UsersService.updateUser - Token:', localStorage.getItem('token'));
  
  try {
    // Utiliser le bon endpoint pour la modification du profil
    const response = await BaseService.put(`identification-proved/${id}`, data);
    console.log('🔍 UsersService.updateUser - Réponse:', response);
    return response;
  } catch (error: any) {
    console.error('🔍 UsersService.updateUser - Erreur complète:', error);
    console.error('🔍 UsersService.updateUser - Message d\'erreur:', error.message);
    console.error('🔍 UsersService.updateUser - Status:', error.response?.status);
    console.error('🔍 UsersService.updateUser - Data d\'erreur:', error.response?.data);
    throw error;
  }
}


const UsersService = {
  login,
  createUser,
  getAllUser,
  uploadImage,
  updateUser
}

export default UsersService