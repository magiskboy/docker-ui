import {
  AccountTree,
  Storage,
  Dns,
  Image,
  List,
  Lock,
  Settings,
  Extension,
  Computer,
  Cloud,
  Code,
  Folder,
} from '@material-ui/icons';

import { PATH } from 'constants/routes';
type MenuItem = {
  text: string;
  icon?: React.ReactNode;
  path: string;
};

export const menuItems: MenuItem[] = [
  {
    text: 'Containers',
    icon: <Folder />,
    path: PATH.CONTAINERS,
  },
  {
    text: 'Images',
    icon: <Image />,
    path: PATH.IMAGES,
  },
  {
    text: 'Networks',
    icon: <Dns />,
    path: PATH.NETWORKS,
  },
  {
    text: 'Volumes',
    icon: <Storage />,
    path: PATH.VOLUMES,
  },
  {
    text: 'Exec',
    icon: <Code />,
    path: PATH.EXEC,
  },
  {
    text: 'Swarm',
    icon: <AccountTree />,
    path: PATH.SWARMS,
  },
  {
    text: 'Nodes',
    icon: <Computer />,
    path: PATH.NODES,
  },
  {
    text: 'Services',
    icon: <Cloud />,
    path: PATH.SERVICES,
  },
  {
    text: 'Tasks',
    icon: <List />,
    path: PATH.TASKS,
  },
  {
    text: 'Secrets',
    icon: <Lock />,
    path: PATH.SECRETS,
  },
  {
    text: 'Configs',
    icon: <Settings />,
    path: PATH.CONFIGS,
  },
  {
    text: 'Plugins',
    icon: <Extension />,
    path: PATH.PLUGINS,
  },
];
