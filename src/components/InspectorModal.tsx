import { Modal } from 'antd';

interface Props {
  title: string;
  content: string;
  onClose?: () => void;
  open: boolean;
}

export const InspectorModal: React.FC<Props> = ({ title, content, onClose, open }) => {
  const onOk = () => {
    onClose?.();
  }

  const onCopy = () => {
    navigator.clipboard.writeText(content);
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
        <pre style={{ overflow: 'scroll', height: '600px' }}>{content}</pre>
      </Modal>
    </>
  )
}
