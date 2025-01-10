import { AutoComplete, Typography, Flex, theme } from "antd";
import React, { useState } from "react";
import { imageApi } from "../../atoms/images";
import _ from 'lodash';
import { ImageSearchResponseItem } from "../../api/docker-engine";


interface Props {
  limit?: number;
}


export const SearchImage: React.FC<Props> = ({ limit = 10 }) => {
  const [resultList, setResultList] = useState<ImageSearchResponseItem[]>([]);
  const {token: {marginXXS, marginXS}} = theme.useToken();

  const onSearch = _.debounce((value: string) => {
    imageApi.imageSearch({ limit, term: value }).then(res => {
      setResultList(_.sortBy(res.data, ['star_count', 'is_official']).reverse());
    });
  }, 200);


  return (
    <>
      <AutoComplete 
        optionRender={item => {
          const image = resultList.find(result => result.name === item.data.label);

          return image ? (
            <Flex vertical gap={marginXXS} style={{marginBottom: marginXS}}>
              <Typography.Text strong>{image.name}</Typography.Text>
              <Typography.Text>Stars: {image.star_count}</Typography.Text>
              <Typography.Text>Description: {image.description}</Typography.Text>
            </Flex>
          ) : null
        }}  
        style={{ width: '80%' }}
        showSearch
        onSearch={onSearch}
        options={resultList.map(item => ({
          label: item.name,
          value: item.name
        }))}
        placeholder="Search image..."
      />
    </>
  )
}
