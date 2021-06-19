import { SET_CONTAINERS_LIST } from './constants';
import { IAction } from '../interfaces';
import { IGetListContainerResponse } from 'interfaces/containers';

export interface IContainerState {
  list: IGetListContainerResponse;
}

const initialContainerState = {
  list: [],
};

const setListContainers = (
  state: IContainerState,
  containers: IGetListContainerResponse
) => {
  return {
    ...state,
    list: containers,
  };
};

export const container = (
  state: IContainerState = initialContainerState,
  action: IAction
): IContainerState => {
  const { type, payload } = action;
  switch (type) {
    case SET_CONTAINERS_LIST:
      return setListContainers(state, payload as IGetListContainerResponse);
    default:
      return state;
  }
};
