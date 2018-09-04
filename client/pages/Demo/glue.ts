import axios from 'axios';
import { gluer, GluerReturn } from 'glue-redux';

export interface Fnc<T> {
  (p: any): T;
}

interface ThunkAction<T> {
  (p: any): Fnc<T>;
}

interface Demo {
  person: GluerReturn;
  asyncGetPerson: Fnc<Promise<any>> | ThunkAction<Promise<any>>;
}

const person = gluer((state = { title: '默认值' }, ac: any) => {
  if (ac) {
    return { ...state, ...ac.data };
  }
  return state;
});

const demo: Demo = {
  person,
  asyncGetPerson: (info: {} = {}) => () => axios({
    url: './mapping.json',
    method: 'get',
    transformRequest: [data => JSON.stringify(data)],
    transformResponse: [(data) => {
      return data;
    }],
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/json',
    },
    params: {
      ...info,
    },
    responseType: 'json',
    timeout: 10000,
  }).then(() => demo.person(info)),
};
// 如果该glue被嵌套复用了，则应该返回一个gule creator
// demo = () => createGlue(demoStructure);
export default demo;
