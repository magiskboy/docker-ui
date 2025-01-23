import React from 'react';
import { SystemInfo } from '../../../api/docker-engine';
import { JsonViewer, OverviewObject, OverviewObjectProps } from '../../../components';
import { Tag, Modal } from 'antd';
import styles from './runtime-overview.module.css';


export const RuntimeOverview: React.FC<Props> = ({systemInfo}) => {
  const [modal, contextHolder] = Modal.useModal();
  const fieldConfigs: OverviewObjectProps<SystemInfo>['fieldConfigs'] = [
    {
      name: 'OperatingSystem',
      label: 'OS',
    },
    {
      name: 'OSType',
      label: 'OS type',
    },
    {
      name: 'Architecture',
    },
    {
      name: 'KernelVersion',
      label: 'Kernel version',
    },
    {
      name: 'PidsLimit',
      label: 'Pids limit',
    },
    {
      name: 'NFd',
      label: 'Number of file descriptors',
    },
    {
      name: 'CgroupDriver',
      label: 'Cgroup driver',
    },
    {
      name: 'CgroupVersion',
      label: 'Cgroup version',
    },
    {
      name: 'NEventsListener',
      label: 'Number of events listener',
    },
    {
      name: 'Isolation',
      getValue: d => d.Isolation || 'process',
    },
    {
      name: 'CDISpecDirs',
    },
    {
      name: 'Runtimes',
      render: (_, data) => {
        const runtimes = data.Runtimes;
        const defaultRuntime = data.DefaultRuntime;

        return (
          <>
            {
              Object.entries(runtimes || {}).map(([name, value]) => {
                const spec = {
                  specification: JSON.parse(value.status?.['org.opencontainers.runtime-spec.features'] ?? ''),
                  path: value.path,
                  args: value.runtimeArgs,
                };

                return (
                  <Tag 
                    className={styles.runtime__runtimes__item}
                    key={name}  
                    color={name === defaultRuntime ? 'green' : 'default'}
                    onClick={() => {
                      modal.info({
                        title: name,
                        content: (
                            <JsonViewer 
                              fetcher={() => Promise.resolve(spec)} 
                              style={{height: 'calc(100vh - 200px)', overflow: 'scroll'}} 
                            />
                        ),
                        width: '60%',
                        centered: true,
                      });
                    }}
                  >{name}</Tag>
                )
              })
            }
          </>
        );
      }
    }
  ];

  return (
    <>
      <OverviewObject fieldConfigs={fieldConfigs} data={systemInfo} labelSpan={12} collapsed showJson={false} />
      {contextHolder}
    </>
  );
}


interface Props {
  systemInfo: SystemInfo;
}

