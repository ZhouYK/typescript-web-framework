import React, { useEffect, useState, ReactType } from 'react';
import { isFunction } from 'lodash';

export interface EmitDataPropsInterface<D = any, AD = D> {
  getData?: (data: AD) => void;
  params?: any;
}

export interface EmitDataWrappedComponentPropsInterface<D = any> {
  data?: D;
}

interface DataAdapterInterface<D = any, AD = D> {
  (data: D): AD;
}

type ReturnComponentType<P, D, AD> = ReactType<EmitDataPropsInterface<D, AD> & P>;

const defaultDataAdapter = <D, AD>(data: D) => {
  return (data as any) as AD;
};

/**
 * P: 返回组件的props
 * D: 原始数据类型
 * AD: dataAdapter转换后的数据类型
 */
function emitData<P = {}, D = any, AD = D>(dataAdapter: DataAdapterInterface<D, AD> = defaultDataAdapter) {
  // 数据由高阶组件提供
  function emitDataComponent(WrappedComponent: ReactType): ReturnComponentType<P, D, AD>;
  // 数据由emitData调用方提供并由api提供data，提供初始data
  function emitDataComponent(WrappedComponent: ReactType, api: () => Promise<D>): ReturnComponentType<P, D, AD>;
  // 数据由emitData调用方提供并直接提供data
  function emitDataComponent(WrappedComponent: ReactType, initData: D): ReturnComponentType<P, D, AD>;
  // 数据由emitData调用方提供并由api提供data
  function emitDataComponent(WrappedComponent: ReactType, api: () => Promise<D>, initData: D): ReactType<P>;
  function emitDataComponent(
    WrappedComponent: ReactType,
    apiOrInitData?: ((params?: any) => Promise<D>) | D,
    initData?: D,
  ): ReactType<P> {
    if (arguments.length === 1) {
      return function EmitData(props: P & EmitDataPropsInterface<D, AD> & EmitDataWrappedComponentPropsInterface<D>) {
        const { getData, data, ...restProps } = props;

        useEffect(() => {
          if (getData) {
            getData(dataAdapter(data));
          }
        }, [data]);

        return <WrappedComponent data={dataAdapter(data)} {...restProps} />;
      };
    }

    if (arguments.length === 2 && !isFunction(apiOrInitData)) {
      return function EmitData(props: P & EmitDataPropsInterface<D, AD>) {
        const { getData, ...restProps } = props;

        useEffect(() => {
          if (getData) {
            getData(dataAdapter(apiOrInitData));
          }
        }, []);

        return <WrappedComponent data={dataAdapter(apiOrInitData)} {...restProps} />;
      };
    }

    return function EmitData(props: P & EmitDataPropsInterface<D, AD>) {
      const { getData, params, ...restProps } = props;
      const [data, setData] = useState<D>(initData);

      useEffect(() => {
        if (isFunction(apiOrInitData)) {
          apiOrInitData(params).then(data => {
            if (getData) {
              getData(dataAdapter(data));
            }

            setData(data);
          });
        }
      }, []);

      return <WrappedComponent data={dataAdapter(data)} originData={data} {...restProps} />;
    };
  }

  return emitDataComponent;
}

export default emitData;
