import React from 'react';
import { render } from 'react-dom';
import Root from './Root';
import App from './App';

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
render(
    <Root>
        <App />
    </Root>,
    document.getElementById('bd'),
);
