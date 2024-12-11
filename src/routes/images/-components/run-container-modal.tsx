import { Modal, Form, Select, Input, Flex, Button, theme } from 'antd';
import { useAtom } from 'jotai';
import { IoIosRemoveCircleOutline, IoIosAddCircleOutline } from "react-icons/io";
import { imageApi, imagesAtom } from '../../../atoms/images';
import { useCallback, useEffect, useState } from 'react';
import { ImageInspect } from '../../../api/docker-engine';


export const RunContainerModal: React.FC<Props> = ({ image, open, onRun, onCancel }) => {
  const [{ data: images }] = useAtom(imagesAtom);
  const [selectedImage, setSelectedImage] = useState<ImageInspect>();
  const [options, setOptions] = useState<Omit<RunContainerOptions, 'image'>>(() => ({
    name: '',
    ports: [],
    volumes: [],
    environments: [],
  }));

  const onChangeImage = useCallback((name: string) => {
    if (!name) return;
    imageApi.imageInspect({ name }).then(response => {
      setSelectedImage(response.data);
    });
  }, []);

  useEffect(() => {
    if (!image) return;
    onChangeImage(image);
  }, [image, onChangeImage]);

  useEffect(() => {
    const exposedPort = selectedImage?.Config?.ExposedPorts;
    setOptions({
      ...options,
      ports: exposedPort ?
        Object.keys(exposedPort)
          .map(key => key.split('/')[0])
          .map((key) => ({ host: key, container: key, id: Date.now().toString() + key })) : []
    });

  }, [selectedImage]);  // eslint-disable-line

  const onAddEnvironmentVariable = (item: EnvironmentVariable) => {
    setOptions({ ...options, environments: [...options.environments, item] });
  }

  const onRemoveEnvironmentVariable = (item: EnvironmentVariable) => {
    setOptions({ ...options, environments: options.environments.filter((env) => env.id !== item.id) });
  }

  const onChangeEnvironmentVariable = (item: EnvironmentVariable) => {
    setOptions({ ...options, environments: options.environments.map((env) => env.id === item.id ? item : env) });
  }

  const onAddPortMapping = (item: PortMapping) => {
    setOptions({ ...options, ports: [...options.ports, item] });
  }

  const onRemovePortMapping = (item: PortMapping) => {
    setOptions({ ...options, ports: options.ports.filter((port) => port.id !== item.id) });
  }

  const onChangePortMapping = (item: PortMapping) => {
    setOptions({ ...options, ports: options.ports.map((port) => port.id === item.id ? item : port) });
  }

  const onOk = () => {
    if (!selectedImage) {
      throw new Error('Image is required');
    }

    onRun?.({
      ...options,
      image: selectedImage,
    });
  }

  return (
    <Modal
      title="Run Container Options"
      centered
      open={open}
      width={400}
      onOk={onOk}
      okText="Run"
      onCancel={onCancel}
      closeIcon={false}
    >
      <Form layout='vertical'>
        <Form.Item label="Name">
          <Input type='text' value={options.name} onChange={(e) => setOptions({ ...options, name: e.target.value })} />
        </Form.Item>
        <Form.Item label="Image">
          <Select
            options={images?.map((image) => ({ label: image.RepoTags[0], value: image.RepoTags[0] }))}
            value={selectedImage?.RepoTags?.[0]}
            onChange={onChangeImage}
          />
        </Form.Item>
        <Form.Item label='Ports'>
          <PortsMapping
            items={options.ports}
            onAdd={onAddPortMapping}
            onRemove={onRemovePortMapping}
            onChange={onChangePortMapping}
          />
        </Form.Item>
        <Form.Item label='Environment variables' name='environments'>
          <EnvironmentVariablesInput
            items={options.environments}
            onAdd={onAddEnvironmentVariable}
            onRemove={onRemoveEnvironmentVariable}
            onChange={onChangeEnvironmentVariable}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

interface Props {
  image?: string;
  open?: boolean;
  onRun?: (options: RunContainerOptions) => void;
  onCancel?: () => void;
}

interface EnvironmentVariable {
  id: string;
  variable: string;
  value: string;
}

export interface RunContainerOptions {
  name: string
  image: ImageInspect;
  ports: PortMapping[];
  volumes: { host: string, container: string }[];
  environments: EnvironmentVariable[];
}

interface EnvirontmentVariablesInputProps {
  items?: EnvironmentVariable[];
  onAdd?: (item: EnvironmentVariable) => void
  onRemove?: (item: EnvironmentVariable) => void;
  onChange?: (item: EnvironmentVariable) => void;
}

const EnvironmentVariablesInput: React.FC<EnvirontmentVariablesInputProps> = ({
  items = [],
  onAdd,
  onRemove,
  onChange,
}) => {
  const { token: { marginXS } } = theme.useToken();
  return (
    <Flex vertical gap={marginXS}>
      <Flex vertical gap={marginXS}>
        {items.map(item => (
          <Flex key={item.id} gap={marginXS}>
            <Input value={item.variable} placeholder='Variable' onChange={(e) => onChange?.({ ...item, variable: e.target.value })} />
            <Input value={item.value} placeholder='Value' onChange={(e) => onChange?.({ ...item, value: e.target.value })} />
            <IoIosRemoveCircleOutline onClick={() => onRemove?.(item)} size={32} />
          </Flex>
        ))}
      </Flex>
      <Button icon={<IoIosAddCircleOutline size={18} />}
        onClick={() => onAdd?.({ variable: '', value: '', id: Date.now().toString() })}
        style={{ width: '100%' }}
      />
    </Flex>
  )
}

const PortsMapping: React.FC<PortsMappingProps> = ({ items, onAdd, onRemove, onChange }) => {
  const { token: { marginXS } } = theme.useToken();
  return (
    <Flex vertical gap={marginXS}>
      <Flex vertical gap={marginXS}>
        {items.map(item => (
          <Flex key={item.id} gap={marginXS}>
            <Input 
              type='number' 
              min={1}
              max={65535}
              value={item.host} 
              placeholder='Host' 
              onChange={(e) => onChange?.({ ...item, host: e.target.value })} 
            />
            <Input 
              type='number' 
              min={1}
              max={65535}
              value={item.container} 
              placeholder='Container' 
              onChange={(e) => onChange?.({ ...item, container: e.target.value })} 
            />
            <IoIosRemoveCircleOutline onClick={() => onRemove?.(item)} size={32} />
          </Flex>
        ))}
      </Flex>
      <Button icon={<IoIosAddCircleOutline size={18} />}
        onClick={() => onAdd?.({ host: '', container: '', id: Date.now().toString() })}
        style={{ width: '100%' }}
      />
    </Flex>
  )
}

interface PortMapping {
  id: string;
  host: string;
  container: string;
}

interface PortsMappingProps {
  items: PortMapping[];
  onAdd?: (item: PortMapping) => void;
  onRemove?: (item: PortMapping) => void;
  onChange?: (item: PortMapping) => void;
}

