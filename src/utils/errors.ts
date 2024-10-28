import { AxiosError } from 'axios';
import { notification } from 'antd';


export function handleAxiosError(error: Error | AxiosError, title?: string) {
  if (error instanceof AxiosError) {
    notification.error({
      message: title ?? 'Error',
      description: error?.response?.data.message ?? 'Unknown error',
    })
    return
  }

  notification.error({
    message: title ?? 'Error',
    description: error.message,
  });
}
