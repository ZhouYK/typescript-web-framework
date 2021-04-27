import localforage from 'localforage';
/**
 * 背景：业务中通常会有实时同步用户输入的场景，比如草稿、多人协作、远程演示等
 * 实时同步输入功能很独立，也有一定难度，在业务功能里属于有亮点的功能。固单独做抽象封装，提升开发效率。
 */

export enum Code {
  failed = -1,
  success = 0,
  versionIsLow = -100,
}
/**
 * 同步数据的结构
 */
export interface SyncData<T = any> {
  version: number; // 数据版本：用于标识数据的优先级，版本越大，优先级越高。由前端操作。比如约定每次提交版本自增1
  id: string; // 数据唯一标识：用于标识数据的唯一性。用来增强程序的健壮能力的。每次传入数据的id都应该不一样
  code?: Code; // 服务端数据状态
  payload: T; // 提交的数据实体
}

export const increaseVersion = (version: number) => version + 1;

interface InitReturnType {
  input: (d: SyncData) => Promise<any>;
  output: () => Promise<SyncData[]>;
  detach: () => void;
}
interface RtSyncReturnType {
  (key: string, pushRequest: (data: SyncData) => Promise<SyncData>, updateState: (data: SyncData) => void): InitReturnType;
}

const rt_sync = (namespace: string): RtSyncReturnType => {
  const forage = localforage.createInstance({
    name: namespace,
  });

  let timeTaskedTimer: NodeJS.Timer;
  let isDetached = false;

  // pushRequest应该返回一个带有状态的data数据，用来更新存储中数据的version 和 status
  // pushRequest只能返回resolve状态
  return (key: string, pushRequest: (data: SyncData) => Promise<SyncData>, updateState: (data: SyncData) => void) => {
    // localQueue的原则是version递增的
    let localQueue: SyncData[] = null;

    const inputLocal = async <T>(d: SyncData<T>) => {
      if (!localQueue) {
        localQueue = (await forage.getItem(key)) || [];
      }
      const data = { ...d };
      const last = localQueue[localQueue.length - 1];
      if (last && last.version !== d.version) {
        // 这里需要保证遵守localQueue中version的递增原则
        // todo 当用户选择了低版本时应该如何处理？
        return Promise.reject({
          local: last,
          current: d,
        });
      }
      let flag = false;
      // 如果版本和id都存在于本地数据中，则认为此次提交无效
      for (let i = 0; i < localQueue.length; i += 1) {
        const d = localQueue[i];
        if (d.id === data.id && d.version === data.version) {
          flag = true;
          console.warn('请注意：传入数据的version和id都已存在于本地');
        }
      }
      if (flag) {
        return last;
      }
      localQueue.push(data);
      await forage.setItem(key, localQueue);
      return data;
    };
    // 外部传入数据
    // 刚传入数据的status应该为unknown
    const input = async <T>(d: SyncData<T>) => {
      if (!localQueue) {
        localQueue = (await forage.getItem(key)) || [];
      }
      const data = { ...d };
      localQueue.push(data);
      await forage.setItem(key, localQueue);

      const newData = await pushRequest({ ...data });
      // 需要判断newData.status和newData.code
      // 当服务端返回更新失败，是因为本地版本低于服务端版本时
      // 需要做用户提示
      if (newData.code === Code.versionIsLow) {
        // 当前失败的数据位于本地队列的最右，则对用户进行提示
        const last = localQueue[localQueue.length - 1];
        if (last.id === data.id) {
          console.log('服务端有新数据，是否覆盖本地？');
          const yes = false;
          let newLast = null;
          if (yes) {
            newLast = { ...newData, code: Code.success };
            // 将变更通知到外部状态
            localQueue[localQueue.length - 1] = newLast;
            updateState({ ...newLast });
          } else {
            // 本地更新服务端
            // 需要将本地最新的重新提交
            newLast = {
              payload: data.payload,
              id: data.id,
              version: increaseVersion(newData.version),
            };
            await input(newLast);
            return;
          }
        }
      } else if (newData.code === Code.failed) {
        // 失败的如果不是在队列最右边，则没有保存的意义
        const index = localQueue.indexOf(data);
        if (index < localQueue.length - 1) {
          localQueue.splice(index, 1);
        }
      } else if (newData.code === Code.success) {
        data.version = newData.version;
        data.code = newData.code;
      }
      await forage.setItem(key, localQueue);
    };

    const detach = () => {
      isDetached = true;
      clearTimeout(timeTaskedTimer);
    };

    const output = async () => {
      if (!localQueue) {
        localQueue = (await forage.getItem(key)) || [];
      }
      return [...localQueue];
    };

    const timedTask = async () => {
      if (!localQueue) {
        localQueue = (await forage.getItem(key)) || [];
      }
      if (('onLine' in window.navigator && !window.navigator.onLine) || !localQueue || localQueue.length === 0) {
        return;
      }
      // 只重试队列最右端的状态为failed的数据
      const last = localQueue[localQueue.length - 1];
      if (last.code === Code.failed) {
        await input({ version: last.version, id: last.id, payload: last.payload });
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
      inputLocal, // 初始时调用
      detach,
      output,
    };
  };
};

export default rt_sync;
