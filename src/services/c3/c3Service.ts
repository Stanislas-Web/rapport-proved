import {BaseService} from '../baseservice';


const getAllC3 = async (route: string) => {
  const response = await BaseService.get(route);
  return response;
}


const c3Service = {
  getAllC3
}

export default c3Service