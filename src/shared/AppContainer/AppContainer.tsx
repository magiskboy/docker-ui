import React from 'react';
import clsx from 'clsx';
import { useHistory } from 'react-router-dom';
import { useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { connect } from 'react-redux';
import { State } from 'reducers';
import { IMetaState } from 'reducers/meta';

import { isMobile } from 'helpers/commons';
import { menuItems } from './config';
import useStyles from './styles';
import dockerImage from 'assets/images/docker-logo-213x50.png';

interface AppContainerProps {
  meta: IMetaState;
}

const AppContainer: React.FC<AppContainerProps> = ({ children, meta }) => {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(!isMobile());
  const history = useHistory();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleOpen}
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            {meta.title}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <div className={classes.toolbar}>
          <div className={classes.logo}>
            <img src={dockerImage} />
          </div>
          <div className={classes.closeToolbar}>
            <IconButton>
              {theme.direction === 'rtl' ? (
                <ChevronRightIcon onClick={handleClose} />
              ) : (
                <ChevronLeftIcon onClick={handleClose} />
              )}
            </IconButton>
          </div>
        </div>
        <Divider />
        <List>
          {menuItems.map(
            (item: { text: string; icon?: React.ReactNode; path: string }) => (
              <ListItem
                button
                key={item.text}
                onClick={() => history.push(item.path)}
              >
                {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
                <ListItemText primary={item.text} />
              </ListItem>
            )
          )}
        </List>
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />
        {children}
      </main>
    </div>
  );
};

const mapStateToProps = (state: State) => ({
  meta: state.meta,
});

export default connect(mapStateToProps, {})(AppContainer);
