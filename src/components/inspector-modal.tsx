import { Modal } from 'antd';
import { InspectorViewer } from './inspector-viewer';

interface Props {
  title: string;
  content: object;
  onClose?: () => void;
  open: boolean;
}

export const InspectorModal: React.FC<Props> = ({ title, content, onClose, open }) => {
  const onOk = () => {
    onClose?.();
  }

  const onCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(content, null, 2));
  }

  return (
    <>
      <Modal
        title={title}
        centered
        open={open}
        width={800}
        okText="Close"
        onOk={onOk}
        onCancel={onCopy}
        cancelText="Copy JSON"
        closeIcon={false}
      >
        <InspectorViewer 
          fetcher={() => Promise.resolve(content)}
          style={{ height: 'calc(100vh - 200px)', overflow: 'scroll' }}
        />
      </Modal>
    </>
  )
}
