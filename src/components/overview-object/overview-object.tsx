import React from 'react';
import { Flex, Row, Col, Typography, Tag, theme, Splitter } from 'antd';
import _ from 'lodash';
import { JsonViewer } from '../json-viewer';
import styles from './overview-object.module.css';

const { Text } = Typography;


const rowWidth = 24;


export const OverviewObject = <T,>({data, fieldConfigs, labelSpan = 8, collapsed = false}: OverviewObjectProps<T>) => {
  const {token: {marginSM, marginXS }} = theme.useToken();
  return (
    <Splitter>
      <Splitter.Panel className={styles['left-side']} defaultSize="60%">
        <Flex gap={marginSM} vertical>
          {
            fieldConfigs.map(field => {
              const value = field.getValue ? field.getValue(data) : _.get(data, field.name);
              const label = (field.label ?? field.name).toString();
              const key = field.name.toString();
              const { verticalList = true } = field;

              let valueNode = null;

              if (field.render) {
                valueNode = field.render(value, data);
              }

              else if (_.isEmpty(value)) {
                  valueNode = "Not set";
              }

              else if (Array.isArray(value)) {
                  valueNode = (
                    <Flex vertical={verticalList} gap={verticalList ? marginXS : 0}>
                    {(value ?? []).map(item => (
                      <Tag key={item} style={{width: 'fit-content'}}>{item}</Tag>))}
                    </Flex>
                  )
              }

              else {
                valueNode = String(value);
              }

              return (
                <Row key={key}>
                  <Col span={labelSpan}><Text strong>{label}</Text></Col>
                  <Col span={rowWidth-labelSpan}>{valueNode}</Col>
                </Row>
              )
            })
          }
        </Flex>
      </Splitter.Panel>
      <Splitter.Panel className={styles['right-side']}>
        <JsonViewer fetcher={() => Promise.resolve(data as object)} style={{whiteSpace: 'nowrap'}} collapsed={collapsed} />
      </Splitter.Panel>
    </Splitter>
  )
}


interface FieldConfig<T> {
  name: keyof T | string;
  label?: string;
  getValue?: (data: T) => unknown;
  render?: (attrValue: T[keyof T], data: T) => React.ReactNode;
  verticalList?: boolean,
}


export interface OverviewObjectProps<T> {
  data: T;
  fieldConfigs: FieldConfig<T>[];
  labelSpan?: number;
  collapsed?: boolean;
}

