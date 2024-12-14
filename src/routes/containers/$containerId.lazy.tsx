import { createLazyFileRoute } from '@tanstack/react-router'
import { Tabs, Typography, theme, Flex, Row, Col, Tag } from 'antd';
import React, { useEffect, useRef } from 'react';
import { ContainerInspectResponse } from '../../api/docker-engine';
import { useAtom } from 'jotai';
import { containerApi, focusedContainerAtom, focusedContainerIdOrNameAtom } from '../../atoms/containers';
import { formatBytes } from '../../utils';
import { headingAtom } from '../../atoms/common';
import ReactJson from 'react-json-view';
import { ContainerInteraction } from '../../components';


const { Text } = Typography;

function Page() {
  const {params: {containerId}} = Route.useMatch();
  const [{data: containerInspector} ] = useAtom(focusedContainerAtom);
  const [,setContainerInspectorId] = useAtom(focusedContainerIdOrNameAtom);
  const [,setHeading] = useAtom(headingAtom);

  useEffect(() => {
    setContainerInspectorId(containerId);
  }, [containerId, setContainerInspectorId, setHeading]);

  const activeTab = window.location.hash ? window.location.hash.slice(1) : 'overview';

  const handleChangeTab = (key: string) => {
    window.location.hash = key;
  }

  return (
    <>
      <Tabs activeKey={activeTab} onChange={handleChangeTab} style={{height: '100%'}} items={[
        {
          key: 'overview',
          label: 'Overview',
          children: containerInspector ? <OverviewTab data={containerInspector} /> : null,
        },
        {
          key: 'json',
          label: 'JSON',
          children: containerInspector ? <JSONTab data={containerInspector} /> : null,
        },
        {
          key: 'log',
          label: 'Log',
          children: containerInspector ? <LogTab data={containerInspector} /> : null,
        },
        {
          key: 'interaction',
          label: 'Interaction',
          children: containerInspector ? <InteractionTab data={containerInspector} /> : null,
        }
      ]} />
    </>
  )
}


const LABEL_SPAN = 3;


const OverviewTab: React.FC<{data: ContainerInspectResponse}> = ({data}) => {
  const {token: {marginSM, marginXS}} = theme.useToken();

  return (
    <Flex gap={marginSM} vertical>
      <Row>
        <Col span={LABEL_SPAN}><Text strong>Name</Text></Col>
        <Col span={12 - LABEL_SPAN}>{data.Name?.slice(1)}</Col>
      </Row>
      <Row>
        <Col span={LABEL_SPAN}><Text strong>Command</Text></Col>
        <Col span={12 - LABEL_SPAN}>{data.Config?.Cmd}</Col>
      </Row>
      <Row>
        <Col span={LABEL_SPAN}><Text strong>Args</Text></Col>
        <Col span={12 - LABEL_SPAN}>{data.Args?.join(' ')}</Col>
      </Row>
      <Row>
        <Col span={LABEL_SPAN}><Text strong>Status</Text></Col>
        <Col span={12 - LABEL_SPAN}>{data.State?.Status}</Col>
      </Row>
      <Row>
        <Col span={LABEL_SPAN}><Text strong>Hostname</Text></Col>
        <Col span={12 - LABEL_SPAN}>{data.Config?.Hostname}</Col>
      </Row>
      <Row>
        <Col span={LABEL_SPAN}><Text strong>Port bindings</Text></Col>
        <Col span={12 - LABEL_SPAN}>
          <Flex vertical gap={marginXS}>{
            Array.from(Object.entries(data.HostConfig?.PortBindings ?? {}).entries()).map(([, [containerPort, value]]) => (
              value ? <Tag key={`${containerPort}${value[0].HostPort}`} style={{width: 'fit-content'}}>{`${containerPort.split('/')[0]}:${value[0].HostPort}`}</Tag> : null
            ))
          }</Flex>
        </Col>
      </Row>
      <Row>
        <Col span={LABEL_SPAN}><Text strong>Working dir</Text></Col>
        <Col span={12 - LABEL_SPAN}>{data.Config?.WorkingDir || 'No set'}</Col>
      </Row>
      <Row>
        <Col span={LABEL_SPAN}><Text strong>Network mode</Text></Col>
        <Col span={12 - LABEL_SPAN}>{data.HostConfig?.NetworkMode}</Col>
      </Row>
      {data.Created && <Row>
        <Col span={LABEL_SPAN}><Text strong>Created</Text></Col>
        <Col span={12 - LABEL_SPAN}>{(new Date(data.Created).toLocaleString())}</Col>
      </Row>}
      <Row>
        <Col span={LABEL_SPAN}><Text strong>Environments</Text></Col>
        <Col span={12 - LABEL_SPAN}>
          <Flex vertical gap={marginXS}>
          {(data.Config?.Env ?? []).map(env => (
            <Tag key={env} style={{width: 'fit-content'}}>{env}</Tag>))}
          </Flex>
        </Col>
      </Row>
      <Row>
        <Col span={LABEL_SPAN}><Text strong>Memory</Text></Col>
        <Col span={12 - LABEL_SPAN}>{data.HostConfig?.Memory === 0 ? 'Unlimited' : formatBytes(data.HostConfig?.Memory ?? 0)}</Col>
      </Row>
      <Row>
        <Col span={LABEL_SPAN}><Text strong>CPU Quota</Text></Col>
        <Col span={12 - LABEL_SPAN}>{data.HostConfig?.CpuQuota === 0 ? 'Unlimited' : `${data.HostConfig?.CpuQuota} ms`}</Col>
      </Row>
    </Flex>
  )
}


const JSONTab: React.FC<{data: ContainerInspectResponse}> = ({data}) => {
  return (
    <ReactJson src={data} displayDataTypes={false} />
  )  
}


const LogTab:React.FC<{data: ContainerInspectResponse}> = ({data}) => {
  const ref = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (!data.Name) return;

    containerApi.containerLogs({ 
      id: data.Name.slice(1), 
      follow: true, 
      stdout: true, 
      stderr: true,
      timestamps: false,
    }, {
      onDownloadProgress: (event) => {
        const text = event.event?.target.responseText;
        if (ref.current) {
          ref.current.innerHTML = text;
        }
      }
    });
  }, [data.Name]);

  return (
    <div style={{height: '100%' }}>
      <pre ref={ref} style={{ fontFamily: 'Courier' }}></pre>
    </div>
  )
}

const InteractionTab: React.FC<{data: ContainerInspectResponse}> = ({data}) => {
  return (
    <>
      <ContainerInteraction name={data.Name!.slice(1)} />
    </>
  )
}


export const Route = createLazyFileRoute('/containers/$containerId')({
  component: Page,
});
