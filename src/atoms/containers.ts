import { atomWithMutation, atomWithQuery} from 'jotai-tanstack-query';
import { ContainerApi, Configuration } from '../api/docker-engine';
import { API_URL } from '../constants';
import { handleAxiosError } from '../utils/errors';
import { atom } from 'jotai';
import { RunContainerOptions } from '../routes/images/-components/run-container-modal';

export const containerApi = new ContainerApi(new Configuration({
  basePath: API_URL,
}));

export const focusedContainerIdOrNameAtom = atom('');

export const focusedContainerAtom = atomWithQuery((get) => ({
  queryKey: ['focusedContainerAtom', get(focusedContainerIdOrNameAtom)],
  queryFn: async ({ queryKey: [, id]}) => {
    if (!id) {
      return null;
    }
    const response = await containerApi.containerInspect({ id: id as string });
    return response.data;
  }
}));

export const containersAtom = atomWithQuery(() => ({
  queryKey: ['containers'],
  queryFn: async () => {
    const res = await containerApi.containerList({all: true});
    return res.data;
  },
  refetchIntervalInBackground: true,
  refetchInterval: 5000,
}));

export const stopContainerAtom = atomWithMutation((get) => ({
  mutationKey: ['stopContainers'],
  mutationFn: async (id: string) => {
    const { refetch: refetchContainers } = get(containersAtom);
    await containerApi.containerStop({ id }); 
    refetchContainers();
  },
  onError: (error: Error) => {
    handleAxiosError(error, 'Error stopping container');
  }
}));

export const restartContainerAtom = atomWithMutation((get) => ({
  mutationKey: ['restartContainers'],
  mutationFn: async (id: string) => {
    const { refetch: refetchContainers } = get(containersAtom);
    await containerApi.containerRestart({ id }); 
    refetchContainers();
  },
  onError: (error: Error) => {
    handleAxiosError(error, 'Error restarting container');
  } 
}));

export const startContainerAtom = atomWithMutation((get) => ({
  mutationKey: ['startContainers'],
  mutationFn: async (id: string) => {
    const { refetch: refetchContainers } = get(containersAtom);
    await containerApi.containerStart({ id }); 
    refetchContainers();
  },
  onError: (error: Error) => {
    handleAxiosError(error, 'Error starting container');
  }
}));

export const deleteContainerAtom = atomWithMutation((get) => ({
  mutationKey: ['deleteContainer'],
  mutationFn: async (id: string) => {
    const { refetch: refetchContainers } = get(containersAtom);
    await containerApi.containerDelete({ id }); 
    refetchContainers();
  },
  onError: (error: Error) => {
    handleAxiosError(error, 'Error deleting container');
  }
}));

export const createContainerAtom = atomWithMutation(() => ({
  mutationKey: ['createContainer'],
  mutationFn: async (options: RunContainerOptions) => {
    const envParams = options.environments.map((env) => `${env.variable}=${env.value}`);
    const portBindings = options.ports.reduce((acc, item) => ({
      ...acc,
      [`${item.container}/tcp`]: [{ HostPort: item.host, HostIp: '127.0.0.1' }]
    }), {})
    const response = await containerApi.containerCreate({
      name: options.name.trim(),
      body: {
        Image: options.image.RepoTags![0],
        Env: envParams,
        HostConfig: {
          PortBindings: portBindings
        }
      }
    });
    return response.data;
  },
  onError: (error: Error) => {
    handleAxiosError(error, 'Error creating container');
  }
}));

