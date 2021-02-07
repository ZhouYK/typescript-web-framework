const registeredMap = new Map();

interface Callback {
  (...args: any[]): void;
}

export const subscribe = (key: string, callback: Callback) => {
  if (!registeredMap.has(key)) {
    registeredMap.set(key, [callback]);
  } else {
    const calls = registeredMap.get(key);
    calls.push(callback);
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
    const result = calls.filter((fn: Callback) => fn !== callback);
    registeredMap.set(key, result);
  }
};
