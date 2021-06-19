import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

export default makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      height: '80vh',
      '& > * + *': {
        marginLeft: theme.spacing(2),
      },
    },
    circle: {
      margin: '0 auto',
      alignSelf: 'center',
    },
  })
);
