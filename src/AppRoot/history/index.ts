import { createBrowserHistory } from 'history';

const historyConf = (options: any) => createBrowserHistory(options);

const history = historyConf({
  basename: '', // 根据需要添加，默认为空串
});

export default history;
