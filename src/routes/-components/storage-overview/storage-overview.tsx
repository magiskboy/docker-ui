import React from 'react';
import { SystemInfo } from '../../../api/docker-engine';
import { OverviewObject, OverviewObjectProps } from '../../../components';


export const StorageOverview: React.FC<Props> = ({systemInfo}) => {
  const fieldConfigs: OverviewObjectProps<SystemInfo>['fieldConfigs'] = [
    {
      name: 'Storage Driver',
      getValue: d => d.Driver,
    },
    {
      name: 'Volume drivers',
      getValue: d => d.Plugins?.Volume,
      verticalList: false,
    },
    {
      name: 'DockerRootDir',
      label: 'Docker root dir',
    }
  ];

  return <OverviewObject fieldConfigs={fieldConfigs} data={systemInfo} />
};


interface Props {
  systemInfo: SystemInfo;
}
