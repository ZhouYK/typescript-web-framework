import rt_sync, { Code, SyncData } from '@src/tools/real_time_sync/index';
import { post } from '@src/tools/request';

const interviewSync = rt_sync('interview');

const pushToServer = (data: SyncData) => {
  // 这里草稿接口的数据的结构可能和传入data不一样
  const draftData = { ...data };
  return post('草稿接口', draftData).then((res) => {
    const newData = { ...data, code: Code.success };
    newData.version = res.data.version;
    return newData;
  }).catch((err) => {
    // 失败这里应该区分原因
    // 要求后端将服务端的草稿返回来，包括版本和id
    // 比如: 因为本地版本比服务端版本低
    const errorData = { ...data, code: err.code || Code.failed };
    if (errorData.code === Code.versionIsLow) {
      errorData.version = err.data.version;
      errorData.payload = err.data.payload;
    }
    return errorData;
  });
};

const updateState = (data: SyncData) => { console.log('更新外部状态数据', data); };

const pusher = interviewSync('面试id', pushToServer, updateState);
let version = 0;
const onChange = (value: any) => {
  version += 1;
  pusher.input({
    payload: value,
    version,
    id: '前端生成的唯一id',
  });
};
