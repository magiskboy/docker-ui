import React from 'react';
import { Flex, Row, Col, Typography, Tag, theme } from 'antd';

const { Text } = Typography;

const LABEL_SPAN = 3;

export const OverviewObject: React.FC<OverviewObjectProps> = ({data, fieldConfigs}) => {
  const {token: {marginSM, marginXS}} = theme.useToken();

  return (
    <Flex gap={marginSM} vertical>
      {
        fieldConfigs.map(field => {
          const value = field.getValue ? field.getValue(data) : data[field.name];

          if (field.render) {
            return field.render(value);
          }

          if (!value) {
            return (
              <Row key={field.name}>
                <Col span={LABEL_SPAN}><Text strong>{field.label ?? field.name}</Text></Col>
                <Col span={12 - LABEL_SPAN}>Not set</Col>
              </Row>
            )
          }

          if (Array.isArray(value)) {
            return (
              <Row key={field.name}>
                <Col span={LABEL_SPAN}><Text strong>{field.label ?? field.name}</Text></Col>
                <Col span={12 - LABEL_SPAN}>
                  <Flex vertical gap={marginXS}>
                  {(value ?? []).map(item => (
                    <Tag key={item} style={{width: 'fit-content'}}>{item}</Tag>))}
                  </Flex>
                </Col>
              </Row>
            )
          }

          return (
            <Row key={field.name}>
              <Col span={LABEL_SPAN}><Text strong>{field.name ?? field.label}</Text></Col>
              <Col span={12 - LABEL_SPAN}>{value}</Col>
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
  render?: (value: unknown) => React.ReactNode;
}


export interface OverviewObjectProps<T> {
  data: T;
  fieldConfigs: FieldConfig<T>[];
}

