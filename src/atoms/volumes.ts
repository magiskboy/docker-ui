import { atom } from 'jotai';
import { atomWithQuery, atomWithMutation } from 'jotai-tanstack-query';
import { VolumeApi, Configuration } from '../api/docker-engine';
import { API_URL } from '../constants';
import { handleAxiosError} from '../utils/errors';


const volumeApi = new VolumeApi(new Configuration({
  basePath: API_URL,
}));

export const volumeInspectorNameAtom = atom('');

export const volumeInspectorAtom = atomWithQuery((get) => ({
  queryKey: ['volumeInspector', get(volumeInspectorNameAtom)],
  queryFn: async () => {
    const response = await volumeApi.volumeInspect({ name: get(volumeInspectorNameAtom) });
    return response.data;
  },
}))

export const volumesAtom = atomWithQuery(() => ({
  queryKey: ['volumes'],
  queryFn: async () => {
    const response = await volumeApi.volumeList();
    return response.data.Volumes;
  },
}));

export const deleteVolumeAtom = atomWithMutation(() => ({
  mutationKey: ['deleteVolume'],
  mutationFn: async (name: string) => {
    await volumeApi.volumeDelete({ name });
  },
  onError: (error: Error) => handleAxiosError(error, 'Error deleting volume'),
}));

