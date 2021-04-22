import localforage from 'localforage';
/**
 * 背景：业务中通常会有实时同步用户输入的场景，比如草稿、多人协作、远程演示等
 * 实时同步输入功能很独立，也有一定难度，在业务功能里属于有亮点的功能。固单独做抽象封装，提升开发效率。
 */

enum Status {
  success = 0, // 更新远端成功
  failed = -1, // 更新远端失败
  deprecated = 1, // 数据应删除
  unknown= -2, // 数据是初始状态
}
/**
 * 同步数据的结构
 */
interface SyncData<T = any> {
  version: number; // 数据版本：用于标识数据的优先级，版本越大，优先级越高。由前端操作。比如约定每次提交版本自增1
  id: string; // 数据唯一标识：用于标识数据的唯一性。用来增强程序的健壮能力的。每次传入数据的id都应该不一样
  status: Status; // 数据状态
  payload: T; // 提交的数据实体
}

interface InitReturnType {
  input: (d: SyncData) => Promise<any>;
  output: () => SyncData[];
  detach: () => void;
}
interface RtSyncReturnType {
  (key: string, pushRequest: (data: SyncData) => Promise<SyncData>): Promise<InitReturnType>;
}

const rt_sync = (namespace: string): RtSyncReturnType => {
  const forage = localforage.createInstance({
    name: namespace,
  });

  let timeTaskedTimer: NodeJS.Timer;
  let isDetached = false;

  // pushRequest应该返回一个带有状态的data数据，用来更新存储中数据的version 和 status
  // pushRequest只能返回resolve状态
  return async (key: string, pushRequest: (data: SyncData) => Promise<SyncData>) => {
    const localQueue: SyncData[] = (await forage.getItem(key)) || [];
    // 外部传入数据
    // 刚传入数据的status应该为unknown
    const input = async <T>(d: SyncData<T>) => {
      const data = { ...d };
      const last = localQueue[localQueue.length - 1];
      if (last && last.version >= data.version) {
        // 比如：服务端数据重置了，而本地还有之前的数据
        // 或者在两台电脑都做了输入，一个电脑断网了，输入了很多，本地版本很高，但未能推送到远端
        // 另一台电脑输入没那么多，本地版本比断网的电脑版本低，并推送到了远端
        // 当断网的电脑重新连接上网时，此时拉取到的远端版本比本地低
        console.warn('请注意：传入数据的版本小于本地最新版本');
        return;
      }
      // 如果版本和id都存在于本地数据中，则认为此次提交无效
      for (let i = 0; i < localQueue.length; i += 1) {
        const d = localQueue[i];
        if (d.id === data.id && d.version === data.version) {
          console.warn('请注意：传入数据的version和id都已存在于本地');
          return;
        }
      }
      localQueue.push(data);
      await forage.setItem(key, localQueue);

      const newData = await pushRequest({ ...data });
      data.version = newData.version;
      data.status = newData.status;

      const index = localQueue.indexOf(data);
      if (data.status === Status.deprecated) {
        localQueue.splice(index, 1);
      }
      await forage.setItem(key, localQueue);
    };

    const detach = () => {
      isDetached = true;
      clearTimeout(timeTaskedTimer);
    };

    const output = () => [...localQueue];

    const timedTask = async () => {
      if (('onLine' in window.navigator && !window.navigator.onLine) || !localQueue || localQueue.length === 0) {
        return;
      }
      // 只重试队列最右端的状态为failed的数据
      const last = localQueue[localQueue.length - 1];
      if (last.status === Status.failed) {
        const data = await pushRequest({ ...last });
        last.version = data.version;
        last.status = data.status;
        const index = localQueue.indexOf(last);
        if (data.status === Status.deprecated) {
          localQueue.splice(index, 1);
        }
        await forage.setItem(key, localQueue);
      }

      if (isDetached) {
        return;
      }
      timeTaskedTimer = setTimeout(() => {
        timedTask();
      }, 1000);
    };
    timedTask();
    return {
      input,
      detach,
      output,
    };
  };
};

export default rt_sync;
