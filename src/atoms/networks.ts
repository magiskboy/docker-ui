import { atomWithMutation, atomWithQuery } from 'jotai-tanstack-query';
import { NetworkApi, Configuration } from '../api/docker-engine'
import { API_URL } from '../constants';
import { handleAxiosError } from '../utils/errors';


const networkApi = new NetworkApi(new Configuration({
  basePath: API_URL,
}));

export const networksAtom = atomWithQuery(() => ({
  queryKey: ['networks'],
  queryFn: async () => {
    const res = await networkApi.networkList();
    return res.data;
  },
  refetchIntervalInBackground: true,
  refetchInterval: 5000,
}));

export const deleteNetworAtom = atomWithMutation(() => ({
  mutationKey: ['deleteNetwork'],
  mutationFn: async (id: string) => {
    const res = await networkApi.networkDelete({id});
    return res.data;
  },
  onError: (error: Error) => {
    handleAxiosError(error, 'Error deleting network');
  }
}));

