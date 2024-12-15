import React from 'react';
import { Statistic, Card, Flex } from 'antd';
import { SystemInfo } from '../../../api/docker-engine';
import styles from './container-overview.module.css';

export const ContainerOverview: React.FC<Props> = ({systemInfo}) => {
  return (
    <Flex gap={16}>
      <Card bordered={false} className={styles['container-overview-item']}>
        <Statistic title="Containers" value={systemInfo.Containers} valueStyle={{color: 'black'}} />
      </Card>
      <Card bordered={false} className={styles['container-overview-item']}>
        <Statistic title="Running" value={systemInfo.ContainersRunning} valueStyle={{color: 'green'}} />
      </Card>
      <Card bordered={false} className={styles['container-overview-item']}>
        <Statistic title="Paused" value={systemInfo.ContainersPaused} />
      </Card>
      <Card bordered={false} className={styles['container-overview-item']}>
        <Statistic title="Stopped" value={systemInfo.ContainersStopped} />
      </Card>
    </Flex>
  )
}


interface Props {
  systemInfo: SystemInfo;
}
