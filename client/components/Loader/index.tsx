import React, { ComponentType } from 'react';
import './index.less';
import LoadingComponentProps = LoadableExport.LoadingComponentProps;

const Loading: ComponentType<LoadingComponentProps> = () => (
  <div className="loader-container">
    加载中...
  </div>
);

export default Loading;
