const isPropsEqual = <T = Record<string, any>>(prevProps: T, nextProps: T) => {
  const prevKeys = Object.keys(prevProps || {});
  const nextKeys = Object.keys(nextProps || {});
  if (prevKeys.length !== nextKeys.length) return false;
  return nextKeys.every((value) => {
    if (value === 'children') {
      return true;
    }
    // @ts-ignore
    return Object.is(nextProps[value], prevProps[value]);
  });
};

export default isPropsEqual;
