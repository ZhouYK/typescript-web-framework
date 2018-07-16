import React from 'react';
import './index.less';

interface LoadConfig {
  text: string
}
const Loading = (config: LoadConfig = { text: '加载中' }) => (
  <div className="loader-container">
    {config.text}
  </div>
);

export default Loading;
