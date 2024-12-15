import { atom } from 'jotai';
import { Configuration, SystemApi, EventMessage } from '../api/docker-engine';
import { API_URL } from '../constants';
import { atomWithQuery } from 'jotai-tanstack-query';


export const systemApi = new  SystemApi(new Configuration({
  basePath: API_URL,
}));

export const eventFiltersAtom = atom();

export const eventsAtom = atom(async function*(): AsyncGenerator<Event> {
  const res = await fetch(`${API_URL}/events`, {
    method: 'GET',
  });

  if (!res.ok) return;
  if (res.body === null) return;

  const stream = res.body.pipeThrough(new TextDecoderStream());

  for await (const value of stream) {
    try {
      yield JSON.parse(value);
    } catch {
      ;
    }
  }
});

export interface Event extends EventMessage {
  id: string;
}

export const systemAtom = atomWithQuery(() => ({
  queryKey: ['system'],
  queryFn: async () => {
    const res = await systemApi.systemInfo();
    return res.data;
  },
  refetchInterval: 5000,
}));

