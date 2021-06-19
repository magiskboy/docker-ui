import React, { useEffect, useState } from 'react';
import { useDispatch, connect } from 'react-redux';
import { Loading } from 'shared';
import { State } from 'reducers';
import { getListContainerAction, IContainerState } from 'reducers/containers';
import { changeTitleAction } from 'reducers/meta';
import ReactJson from 'react-json-view';

interface ContainerProps {
  container: IContainerState;
}

const Container: React.FC<ContainerProps> = ({ container }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(changeTitleAction({ title: 'Container' }));
    const fetchListContainer = async () => {
      setLoading(true);
      await dispatch(getListContainerAction());
      setLoading(false);
    };
    fetchListContainer();
  }, [dispatch]);
  return (
    <Loading loading={loading}>
      <ReactJson src={container} />
    </Loading>
  );
};

const mapStateToProps = (state: State) => ({
  container: state.container,
});

export default connect(mapStateToProps, {})(Container);
