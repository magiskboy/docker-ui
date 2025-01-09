import { atom } from 'jotai';
import { atomWithQuery, atomWithMutation } from 'jotai-tanstack-query';
import { VolumeApi, Configuration } from '../api/docker-engine';
import { API_URL } from '../constants';
import { handleAxiosError} from '../utils/errors';
import _ from 'lodash';


const volumeApi = new VolumeApi(new Configuration({
  basePath: API_URL,
}));

export const focusedVolumeNameAtom = atom('');

export const focusedVolumeAtom = atomWithQuery((get) => ({
  queryKey: ['volumeInspector', get(focusedVolumeNameAtom)],
  queryFn: async () => {
    const response = await volumeApi.volumeInspect({ name: get(focusedVolumeNameAtom) });
    return response.data;
  },
}))

export const volumesAtom = atomWithQuery(() => ({
  queryKey: ['volumes'],
  queryFn: async () => {
    const response = await volumeApi.volumeList();
    const volumes = response.data.Volumes;
    return _.sortBy(volumes, 'Name');
  },
}));

export const deleteVolumeAtom = atomWithMutation(() => ({
  mutationKey: ['deleteVolume'],
  mutationFn: async (name: string) => {
    await volumeApi.volumeDelete({ name });
  },
  onError: (error: Error) => handleAxiosError(error, 'Error deleting volume'),
}));

