const registeredMap = new Map<string, Set<Callback>>();

interface Callback {
  (...args: any[]): void;
}

export const subscribe = (key: string, callback: Callback) => {
  if (!registeredMap.has(key)) {
    registeredMap.set(key, new Set<Callback>([callback]));
  } else {
    const calls = registeredMap.get(key);
    calls.add(callback);
  }
};

export const publish = (key: string, data?: any) => {
  if (registeredMap.has(key)) {
    const calls = registeredMap.get(key);
    calls.forEach((fn: Callback) => {
      fn(data);
    });
  }
};

export const unsubscribe = (key: string, callback: Callback) => {
  if (registeredMap.has(key)) {
    const calls = registeredMap.get(key);
    calls.delete(callback);
    if (calls.size === 0) {
      registeredMap.delete(key);
    }
  }
};
