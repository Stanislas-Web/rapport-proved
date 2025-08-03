import {BaseService} from '../baseservice';


const getAllA1 = async (route: string) => {
  const response = await BaseService.get(route);
  return response;
}


const a1Service = {
  getAllA1
}

export default a1Service