import { Dispatch } from 'redux';
import axios from 'axios';
import { SET_CONTAINERS_LIST } from './constants';
import { IGetListContainerParam } from 'interfaces/containers';

export const getListContainerAction = (params?: IGetListContainerParam) => {
  return (dispatch: Dispatch): void => {
    axios
      .get<IGetListContainerParam>('/containers/json', { params })
      .then((data) =>
        dispatch({ type: SET_CONTAINERS_LIST, payload: data.data })
      );
  };
};
