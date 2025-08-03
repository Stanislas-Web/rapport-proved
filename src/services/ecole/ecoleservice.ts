import {BaseService} from '../baseservice';


const getAllEcoles = async (route: string) => {
  const response = await BaseService.get(route);
  return response;
}


const ecoleService = {
  getAllEcoles
}

export default ecoleService