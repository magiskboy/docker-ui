import Image from 'pages/Image/Image';
import Container from 'pages/Container/Container';
import Volume from 'pages/Volume/Volume';
import Task from 'pages/Task/Task';
import Config from 'pages/Config/Config';
import Exec from 'pages/Exec/Exec';
import Swarm from 'pages/Swarm/Swarm';
import Node from 'pages/Node/Node';
import Secret from 'pages/Secret/Secret';
import Service from 'pages/Service/Service';
import Plugin from 'pages/Plugin/Plugin';
import Network from 'pages/Network/Network';
import { PATH } from 'constants/routes';

export default [
  [PATH.IMAGES, Image],
  [PATH.EXEC, Exec],
  [PATH.NODES, Node],
  [PATH.TASKS, Task],
  [PATH.SWARMS, Swarm],
  [PATH.CONFIGS, Config],
  [PATH.PLUGINS, Plugin],
  [PATH.CONTAINERS, Container],
  [PATH.VOLUMES, Volume],
  [PATH.SERVICES, Service],
  [PATH.SECRETS, Secret],
  [PATH.NETWORKS, Network],
];
