import React from 'react';
import { SystemInfo } from '../../../api/docker-engine';
import { Card, Flex, Statistic } from 'antd';
import styles from './image-overview.module.css';


export const ImageOverview: React.FC<Props> = ({systemInfo}) => {
  return (
    <Flex justify='center'>
      <Card bordered={false} className={styles['imgage-overview-item']}>
        <Statistic title="Images" value={systemInfo.Images} valueStyle={{color: 'black'}} />
      </Card>
    </Flex>
  )
}


interface Props {
  systemInfo: SystemInfo;
}
