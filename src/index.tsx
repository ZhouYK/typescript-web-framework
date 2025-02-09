// import { render } from 'react-dom';
import { createRoot } from 'react-dom/client';
import { ConfigProvider } from '@arco-design/web-react';
import zh from '@arco-design/web-react/lib/locale/zh-CN';
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

window.addEventListener('unhandledrejection', (event) => {
  event.preventDefault();
  console.warn(`unhandled promise rejection: ${event.reason}`);
});

const container = document.getElementById('bd');
const root = createRoot(container);
root.render(
  <AppRoot>
    <ConfigProvider locale={zh}>
      <App />
    </ConfigProvider>
  </AppRoot>,
);
