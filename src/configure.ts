import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import { notification } from 'antd';


dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

notification.config({
  placement: 'bottomRight',
  duration: 3
})
