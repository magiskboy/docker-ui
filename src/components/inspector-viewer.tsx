import React, { useEffect, useState } from 'react';
import ReactJson, { ReactJsonViewProps } from 'react-json-view';


export const InspectorViewer: React.FC<Props> = ({ fetcher, ...rest }) => {
  const [data, setData] = useState<object>({});

  useEffect(() => {
    fetcher().then(result => {
      setData(result);
    })
  }, [fetcher, setData]);

  return (
    <>
      <ReactJson 
        {...rest}
        src={data}
        displayDataTypes={false}
      />
    </>
  )
}

interface Props extends Omit<ReactJsonViewProps, 'src'> {
  fetcher: () => Promise<object>;
}
