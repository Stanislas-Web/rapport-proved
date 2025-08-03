import {BaseService} from '../baseservice';





const getAllProvinces = async (route: string) => {
  const response = await BaseService.get(route);
  return response;
}


const provinceService = {
  getAllProvinces
}

export default provinceService