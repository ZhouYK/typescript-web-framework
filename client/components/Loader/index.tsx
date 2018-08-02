import React from 'react';
import { Loader, LoaderProps } from 'index';
import './index.less';

const Loading: Loader<LoaderProps> = () => (
  <div className="loader-container">
    加载中...
  </div>
);

export default Loading;
