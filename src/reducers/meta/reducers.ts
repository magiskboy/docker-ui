import { IAction } from '../interfaces';
import { CHANGE_TITLE } from './constants';

export interface IMetaState {
  title: string;
}

const initialMetaState: IMetaState = {
  title: 'Docker UI',
};

export interface IChangeTitlePayload {
  title: string;
}

const changeTitle = (state: IMetaState, payload: IChangeTitlePayload) => {
  return {
    ...state,
    title: payload.title,
  };
};

export const meta = (
  state: IMetaState = initialMetaState,
  action: IAction
): IMetaState => {
  const { type, payload } = action;
  switch (type) {
    case CHANGE_TITLE:
      return changeTitle(state, payload as IChangeTitlePayload);
    default:
      return state;
  }
};
