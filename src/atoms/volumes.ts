import { atomWithQuery, atomWithMutation } from 'jotai-tanstack-query';
import { VolumeApi, Configuration } from '../api/docker-engine';
import { API_URL } from '../constants';
import { handleAxiosError} from '../utils/errors';


const volumeApi = new VolumeApi(new Configuration({
  basePath: API_URL,
}));

export const volumesAtom = atomWithQuery(() => ({
  queryKey: ['volumes'],
  queryFn: async () => {
    const response = await volumeApi.volumeList();
    return response.data;
  },
}));

export const deleteVolumeAtom = atomWithMutation(() => ({
  mutationKey: ['deleteVolume'],
  mutationFn: async (name: string) => {
    await volumeApi.volumeDelete({ name });
  },
  onError: (error: Error) => handleAxiosError(error, 'Error deleting volume'),
}));

