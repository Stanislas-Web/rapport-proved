import {BaseService} from '../baseservice';





const getAllDirections = async (route: string) => {
  const response = await BaseService.get(route);
  return response;
}


const directionService = {
  getAllDirections
}

export default directionService