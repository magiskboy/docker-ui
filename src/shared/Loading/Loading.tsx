import React from 'react';
import { CircularProgress } from '@material-ui/core';
import useStyles from './styles';

interface LoadingProps {
  loading: boolean;
}

const Loading: React.FC<LoadingProps> = ({ children, loading }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      {loading ? <CircularProgress className={classes.circle} /> : children}
    </div>
  );
};

export default Loading;
