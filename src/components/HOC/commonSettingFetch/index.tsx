import React, { ReactType, useEffect, useState, forwardRef, Ref } from 'react';
import { commonSetting, CommonSetting, commonSettingCache } from '../../../api/common';
import { CommonSettingType } from '../../../constants/common';

export interface WrappedComponentPropsInterface<T = any> {
  data: T;
}

const getDefaultData = (options: CommonSettingType[]): CommonSetting => {
  const data: CommonSetting = {};

  for (const key of options) {
    data[key] = commonSettingCache[key] || ([] as any);
  }

  return data;
};

/**
 * P: 返回的组件的props
 */
function commonSettingFetch<P = {}>(options: CommonSettingType[]) {
  return (WrappedComponent: ReactType) =>
    forwardRef<HTMLElement, P>(function CommonSettingFetch(props, ref: Ref<HTMLElement>) {
      const [data, setData] = useState<CommonSetting>(getDefaultData(options));

      useEffect(() => {
        commonSetting(options).then(res => {
          setData(res);
        });
      }, []);

      return <WrappedComponent data={data} {...props} ref={ref} />;
    });
}

export default commonSettingFetch;
