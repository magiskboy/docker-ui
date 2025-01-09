import React from 'react';
import { SystemInfo } from '../../../api/docker-engine';
import { OverviewObject, OverviewObjectProps } from '../../../components';

export const CPUOverview: React.FC<Props> = ({systemInfo}) => {
  const fieldConfigs: OverviewObjectProps<SystemInfo>['fieldConfigs'] = [
    {
      name: 'CpuCfsPeriod',
      label: 'Completely Fair Scheduler Period',
    },
    {
      name: 'CpuCfsQuota',
      label: 'Completely Fair Scheduler Quota',
    },
    {
      name: 'CPUShares',
      label: 'CPU Shares',
    },
    {
      name: 'CPUSet',
      label: 'CPU Set',
    },
    {
      name: 'NGoroutines',
      label: 'Number of Go Routines',
    },
    {
      name: 'NCPU',
      label: 'Number of logical CPUs',
    }
  ];

  return <OverviewObject data={systemInfo} fieldConfigs={fieldConfigs} labelSpan={12} collapsed showJson={false} />
}


interface Props {
  systemInfo: SystemInfo;
}
