import { Flex, Button, Popconfirm, theme, notification } from 'antd';
import { AiOutlineDelete } from 'react-icons/ai'
import { BsFiletypeJson } from "react-icons/bs";
import { IoPlayOutline } from "react-icons/io5";
import { useAtom } from 'jotai';
import { 
  focusedImageIdOrNameAtom,
  focusedImageAtom,
  deleteImagesAtoms,
} from '../../../atoms/images';
import { createContainerAtom, startContainerAtom } from '../../../atoms/containers';
import React, { useState } from 'react';
import { InspectorModal } from '../../../components'
import { RunContainerModal, RunContainerOptions } from '../-components/run-container-modal'


export const ImageToolbar: React.FC<Props> = ({ 
  image, 
  showDelete = true, 
  showInspector = true, 
  showRunContainer = true, 
}) => {
  const { token: {marginXS}} = theme.useToken();
  const [imageInspectorName, setImageInspectorName] = useAtom(
    focusedImageIdOrNameAtom,
  )
  const [{mutate: createContainer}] = useAtom(createContainerAtom);
  const [isOpenInspector, setIsOpenInspector] = useState(false);
  const [{ data: imageInspector }] = useAtom(focusedImageAtom)
  const [{mutate: startContainer}] = useAtom(startContainerAtom);

  const [{ mutate: deleteImages }] = useAtom(deleteImagesAtoms)
  const [imageToRun, setImageToRun] = useState('');

  const onStartContainerFromImage = (options: RunContainerOptions) => {
    createContainer(options, {
      onSuccess: (data) => {
        if (data.Warnings.length > 0) {
          notification.warning({
            message: 'Warning',
            description: data.Warnings.join('\n'),
          });
        }
        else {
          notification.success({
            message: 'Success',
            description: `Started container ${data.Id}`,
          });
        }

        startContainer(data.Id);
        setImageToRun('');
      }
    });

  }

  return (
    <>
      <Flex gap={marginXS}>
      {showInspector && <Button
          icon={<BsFiletypeJson />}
          onClick={() => {
            setImageInspectorName(image.Id);
            setIsOpenInspector(true);
          }}
        />}

        {showRunContainer && <Button 
          icon={<IoPlayOutline />} 
          onClick={() => {
            setImageToRun(image.RepoTags[0]);
          }}
        />}

        {showDelete && <Popconfirm 
          title="Are you sure you want to delete this image?" 
          disabled={image.Containers > 0} 
          onConfirm={() => deleteImages([image.Id])}
        >
          <Button icon={<AiOutlineDelete />} />
        </Popconfirm>}
      </Flex>
      <InspectorModal
        title={imageInspectorName}
        content={imageInspector!}
        onClose={() => setIsOpenInspector(false)}
        open={isOpenInspector}
      />
      <RunContainerModal
        image={imageToRun}
        open={!!imageToRun}
        onCancel={() => setImageToRun('')}
        onRun={onStartContainerFromImage}
      />
    </>
  )
}


interface Props {
  image: {
    Id: string;
    RepoTags: string[]
    Containers: number
  };
  showInspector?: boolean;
  showRunContainer?: boolean;
  showDelete?: boolean;
}

