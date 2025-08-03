import { BaseService } from '../baseservice';




const login = async (route: string, data: object) => {
  const response = await BaseService.login(route, data);
  return response;
}

const createUser = async (route: string, data: object) => {
  const response = await BaseService.post(route, data);
  return response;
}


const uploadImage = async (route: string, imageFile: File | null) => {
  const response = await BaseService.uploadImage(route, imageFile);
  return response;
}

const getAllUser = async (route: string) => {
  const response = await BaseService.get(route);
  return response;
}


const UsersService = {
  login,
  createUser,
  getAllUser,
  uploadImage
}

export default UsersService