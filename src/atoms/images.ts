import { atomWithMutation, atomWithQuery } from 'jotai-tanstack-query';
import _ from 'lodash';
import { ImageApi, Configuration } from '../api/docker-engine';
import { API_URL } from '../constants';
import { containersAtom } from './containers';
import { handleAxiosError } from '../utils/errors';
import { atom } from 'jotai';


export const imageApi = new ImageApi(new Configuration({
  basePath: API_URL,
}));

export const imageInspectorNameAtom = atom('');

export const imagesAtom = atomWithQuery((get) => ({
  queryKey: ['images'],
  queryFn: async () => {
    const res = await imageApi.imageList();
    const { data: containers, error } = get(containersAtom);

    if (error) {
      return res.data;
    }

    const images = res.data;
    const containersByImages = _.groupBy(containers ?? [], 'ImageID');
    for (let i = 0; i < images.length; i++) {
      if (images[i].Id in containersByImages) {
        images[i].Containers = containersByImages[images[i].Id].length;
      }
    }

    return res.data;
  },
  refetchIntervalInBackground: true,
  refetchInterval: 5000,
}));

export const imageInspectorAtom = atomWithQuery((get) => ({
  queryKey: ['imageInspector', get(imageInspectorNameAtom)],
  queryFn: async ({ queryKey: [,name]}) => {
    const res = await imageApi.imageInspect({ name: name as string });
    return res.data;
  },
}));

export const deleteImagesAtoms = atomWithMutation(() => ({
  mutationKey: ['deleteImage'],
  mutationFn: async (ids: string[]) => {
    await Promise.all(ids.map(async (id) => imageApi.imageDelete({ name: id})));
  },
  onError: (error: Error) => {
    handleAxiosError(error, 'Error deleting image');
  }
}))
