import {BaseService} from '../baseservice';





const getAllSousDirections = async (route: string) => {
  const response = await BaseService.get(route);
  return response;
}


const sousdirectionService = {
  getAllSousDirections
}

export default sousdirectionService