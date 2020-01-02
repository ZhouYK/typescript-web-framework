import React from 'react';
import { RouteComponentProps, withRouter } from 'dva/router';
import { queryToObject, objectToQuery } from '../../../utils/util';

interface Query {
  [index: string]: any;
}

export interface UrlInspectorProps extends RouteComponentProps {
  objectToQuery: (obj: Query) => string;
  query: Query;
  pureQuery: Query;
}

interface UrlInspectorReceivedProps extends UrlInspectorProps {
  [key: string]: any;
}

interface UrlInspectorState {
  query: Query;
  pureQuery: Query;
  cachedState?: CachedState;
}

interface Location {
  search?: string;
  pathname?: string;
}
interface CachedState {
  location: Location;
}

/**
 * 调用了withRouter注入location、history和match属性
 * 另外还会注入query和objectToQuery属性
 *
 * @param initialQuery
 * initialQuery 会用于didMount时兜底的初始参数，需要体现出页面需要的全量的查询变量，体现页面所需query的真实情况：需要哪些数据以及这些数据的类型
 * 注入的query属性会根据initialQuery中的类型进行数据转换
 */
const urlInspector = (initialQuery: Query) => (TargetComponent: React.ComponentType<any>) => {
  class UrlInspector extends React.Component<UrlInspectorReceivedProps, UrlInspectorState> {
    public state = {
      query: { ...initialQuery },
      objectToQuery,
      pureQuery: { ...initialQuery },
      cachedState: { location: {} },
    };

    static getDerivedStateFromProps(props: UrlInspectorReceivedProps, state: UrlInspectorState) {
      const { location: { search, pathname } = { search: '', pathname: '' } } = props;
      const { cachedState } = state;
      if (cachedState.location.pathname !== pathname || cachedState.location.search !== search) {
        return {
          // 这里采用覆盖上一个query每一个属性的方式，而不是全量覆盖query的方式
          // 因为这里需要体现页面所需的query的属性的情况，方便页面里面从query里面取值
          query: { ...state.query, ...queryToObject(search, initialQuery) },
          // pureQuery 是当前 url 的对应的参数，和 query 不同的是，不受上次的参数影响
          // 如果不存在任何参数取值为 initialQuery
          pureQuery: { ...queryToObject(search, initialQuery) },
          cachedState: {
            location: {
              pathname,
              search,
            },
          },
        };
      }
      return null;
    }

    render() {
      return <TargetComponent {...this.props} {...this.state} />;
    }
  }

  return withRouter(UrlInspector);
};

export default urlInspector;
