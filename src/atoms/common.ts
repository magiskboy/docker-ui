import { atom } from 'jotai';
import { WebSocketController } from '../libs/websocket-controller';
import { API_URL } from '../constants';

export const headingAtom = atom<string>('');

export const webSocketController = atom<WebSocketController>(
  new WebSocketController('ws://' + URL.parse(API_URL)?.host, (event) => {
    console.log(event);
  }),
);

