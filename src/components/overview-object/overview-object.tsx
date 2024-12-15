import React from 'react';
import { Flex, Row, Col, Typography, Tag, theme } from 'antd';
import _ from 'lodash';

const { Text } = Typography;


export const OverviewObject = <T,>({data, fieldConfigs, labelSpan = 3}: OverviewObjectProps<T>) => {
  const {token: {marginSM, marginXS }} = theme.useToken();
  return (
    <Flex gap={marginSM} vertical>
      {
        fieldConfigs.map(field => {
          const value = field.getValue ? field.getValue(data) : _.get(data, field.name);
          const label = (field.label ?? field.name).toString();
          const key = field.name.toString();
          const { verticalList = true } = field;

          if (field.render) {
            return field.render(value, data);
          }

          if (value === undefined) {
            return (
              <Row key={key}>
                <Col span={labelSpan}><Text strong>{label}</Text></Col>
                <Col span={12 - labelSpan}>Not set</Col>
              </Row>
            )
          }

          if (Array.isArray(value)) {
            return (
              <Row key={key}>
                <Col span={labelSpan}><Text strong>{label}</Text></Col>
                <Col span={12 - labelSpan}>
                  <Flex vertical={verticalList} gap={verticalList ? marginXS : 0}>
                  {(value ?? []).map(item => (
                    <Tag key={item} style={{width: 'fit-content'}}>{item}</Tag>))}
                  </Flex>
                </Col>
              </Row>
            )
          }

          return (
            <Row key={key}>
              <Col span={labelSpan}><Text strong>{label}</Text></Col>
              <Col span={12 - labelSpan}>{String(value)}</Col>
            </Row>
          )
        })
      }
    </Flex>
  )
}


interface FieldConfig<T> {
  name: keyof T | string;
  label?: string;
  getValue?: (data: T) => unknown;
  render?: (attrValue: T[keyof T], data: T) => React.ReactNode;
  verticalList?: boolean,
}


export interface OverviewObjectProps<T extends any> {
  data: T;
  fieldConfigs: FieldConfig<T>[];
  labelSpan?: number;
}

