// import { render } from 'react-dom';
import { createRoot } from 'react-dom/client';
import { ConfigProvider } from 'antd';
import zh from 'antd/lib/locale/zh_CN';
import AppRoot from './AppRoot';
import App from './App';
import './global.less';

if (window.Promise && !window.Promise.prototype.finally) {
  window.Promise.prototype.finally = function (fn: () => void): Promise<any> {
    return this.then((data: any): Promise<any> => {
      fn();
      return Promise.resolve(data);
    }, (err: any): Promise<any> => {
      fn();
      return Promise.reject(err);
    });
  };
}

const container = document.getElementById('bd');
const root = createRoot(container);
root.render(
  <AppRoot>
    <ConfigProvider locale={zh}>
      <App />
    </ConfigProvider>
  </AppRoot>,
);
