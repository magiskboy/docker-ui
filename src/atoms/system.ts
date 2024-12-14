import { Configuration, SystemApi } from '../api/docker-engine';
import { API_URL } from '../constants';


export const systemApi = new  SystemApi(new Configuration({
  basePath: API_URL,
}));

