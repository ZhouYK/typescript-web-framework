import React from 'react';
import { render } from 'react-dom';
import Root from './toc/Root';
import App from './toc/App';

if (window.Promise && !window.Promise.prototype.finally) {
  window.Promise.prototype.finally = function (fn: () => void) {
    return this.then(() => {
      fn();
      return this;
    }, () => {
      fn();
      return Promise.reject(this);
    })
  }
}
render(
  <Root>
    <App />
  </Root>,
  document.getElementById('bd'),
);
