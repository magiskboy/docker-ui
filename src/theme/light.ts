import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  spacing: (size: number) => {
    return size * 8;
  },
});

export default theme;
