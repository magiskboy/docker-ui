import { atomWithMutation, atomWithQuery } from 'jotai-tanstack-query';
import { atom } from 'jotai';
import { NetworkApi, Configuration } from '../api/docker-engine'
import { API_URL } from '../constants';
import { handleAxiosError } from '../utils/errors';


const networkApi = new NetworkApi(new Configuration({
  basePath: API_URL,
}));

export const networkInspectorIdAtom = atom('');

export const networkInspectorAtom = atomWithQuery((get) => ({
  queryKey: ['networkInspector', get(networkInspectorIdAtom)],
  queryFn: async ({ queryKey: [, id]}) => {
    const res = await networkApi.networkInspect({id: id as string});
    return res.data;
  }
}))

export const networksAtom = atomWithQuery(() => ({
  queryKey: ['networks'],
  queryFn: async () => {
    const res = await networkApi.networkList();
    return res.data;
  },
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

