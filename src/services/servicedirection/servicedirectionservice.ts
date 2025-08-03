import {BaseService} from '../baseservice';


const getAllServiceDirections = async (route: string) => {
  const response = await BaseService.get(route);
  return response;
}


const servicedirectionService = {
  getAllServiceDirections
}

export default servicedirectionService