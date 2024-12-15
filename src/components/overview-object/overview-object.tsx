import React from 'react';
import { Flex, Row, Col, Typography, Tag, theme } from 'antd';

const { Text } = Typography;


export const OverviewObject: React.FC<OverviewObjectProps> = ({data, fieldConfigs, labelSpan = 3}) => {
  const {token: {marginSM, marginXS }} = theme.useToken();

  return (
    <Flex gap={marginSM} vertical>
      {
        fieldConfigs.map(field => {
          const value = field.getValue ? field.getValue(data) : data[field.name];
          const { verticalList = true } = field;

          if (field.render) {
            return field.render(value, data);
          }

          if (value === undefined) {
            return (
              <Row key={field.name}>
                <Col span={labelSpan}><Text strong>{field.label ?? field.name}</Text></Col>
                <Col span={12 - labelSpan}>Not set</Col>
              </Row>
            )
          }

          if (Array.isArray(value)) {
            return (
              <Row key={field.name}>
                <Col span={labelSpan}><Text strong>{field.label ?? field.name}</Text></Col>
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
            <Row key={field.name}>
              <Col span={labelSpan}><Text strong>{field.label ?? field.name}</Text></Col>
              <Col span={12 - labelSpan}>{String(value)}</Col>
            </Row>
          )
        })
      }
    </Flex>
  )
}


interface FieldConfig<T> {
  name: string;
  label?: string;
  getValue?: (data: T) => unknown;
  render?: (value: unknown, data: T) => React.ReactNode;
  verticalList?: boolean,
}


export interface OverviewObjectProps<T = object> {
  data: T;
  fieldConfigs: FieldConfig<T>[];
  labelSpan?: number;
}

