import { CHANGE_TITLE } from './constants';
import { IAction } from 'reducers/interfaces';
import { IChangeTitlePayload } from './reducers';

export const changeTitleAction = (payload: IChangeTitlePayload): IAction => ({
  type: CHANGE_TITLE,
  payload,
});
