import React from 'react';
import { IoTerminalOutline, IoPlayOutline, IoLogoBuffer } from 'react-icons/io5';
import { AiOutlineDelete } from 'react-icons/ai';
import { FaRegCircleStop } from 'react-icons/fa6';
import { deleteContainerAtom, startContainerAtom, stopContainerAtom } from '../../../atoms/containers';
import { useAtomValue } from 'jotai';
import { useNavigate } from '@tanstack/react-router';
import {
  Button,
  Popconfirm,
  Flex,
  theme,
} from 'antd';

export const ContainerToolbar: React.FC<Props> = ({ container, showLog = true, showShell = true, afterDelete, }) => {
  const { token: {paddingXS}} = theme.useToken();

  const { mutate: deleteContainer } = useAtomValue(deleteContainerAtom);
  const { mutate: stopContainer } = useAtomValue(stopContainerAtom);
  const { mutate: startContainer } = useAtomValue(startContainerAtom);
  const navigate = useNavigate();

  return (
        <Flex gap={paddingXS}>
        {showShell && <Button 
            onClick={() => {
              navigate({
                to: '/containers/$name',
                params: {name: container.name },
                hash: 'shell',
              });
            }} 
            icon={<IoTerminalOutline />} 
            disabled={container.state !== 'running'}
          />}

          {container.state === 'running' ? 
            <Popconfirm
              title="Are you sure you want to stop this container?"
              onConfirm={() => stopContainer(container.id!)}
            >
              <Button icon={<FaRegCircleStop />} />
            </Popconfirm>
            : <Button icon={<IoPlayOutline />} onClick={() => startContainer(container.id!)} />
          }

          <Popconfirm
            title="Are you sure you want to delete this container?"
            onConfirm={() => {
              deleteContainer(container.id!, {
                onSuccess: () => {
                  afterDelete?.();
                }
              });
            }}
          >
            <Button icon={<AiOutlineDelete />} disabled={container.state === 'running'} />
          </Popconfirm>

          {showLog && <Button icon={<IoLogoBuffer 
            onClick={() => navigate({
              to: '/containers/$name', 
              params: {name: container.name}, 
              hash: 'log',
            })} />} />}
        </Flex>
  )
}


interface Props {
  container: {
    id: string;
    name: string;
    ports: string[];
    state: string;
  },
  showLog?: boolean
  showShell?: boolean;
  afterDelete?: () => void;
}
