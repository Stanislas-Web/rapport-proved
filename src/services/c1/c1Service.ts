import {BaseService} from '../baseservice';


const getAllC1 = async (route: string) => {
  const response = await BaseService.get(route);
  return response;
}


const c1Service = {
  getAllC1
}

export default c1Service