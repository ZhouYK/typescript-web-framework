import React, { ComponentClass } from 'react';
import Loadable from 'react-loadable';

const loadingComponent = (Loading: ComponentClass) => (props: {}) => <Loading {...props} />;

export default (prefix: string, Loading: ComponentClass) => (path: string) => Loadable({
  loader: () => import(`../../pages/${prefix}${path}`),
  loading: loadingComponent(Loading),
  timeout: 10000,
});
