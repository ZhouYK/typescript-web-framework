import axios from 'axios';
import { createGlue, gluePair } from 'glue-redux';

let demo: {
  person: (info: {}) => {type: string, data: any},
  asyncGetPerson: (info: {}) => Promise<any>,
};
const personActionCreator = (data: any) => data;
const personReducer = (state = { title: '默认值' }, ac: any) => {
  if (ac) {
    return { ...state, ...ac.data };
  }
  return state;
};
const asyncGetPerson = (info: {} = {}) => () => axios({
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
}).then(() => demo.person(info));

const demoStructure = {
  person: gluePair(personActionCreator, personReducer),
  asyncGetPerson,
};
demo = createGlue(demoStructure);
// 如果该glue被嵌套复用了，则应该返回一个gule creator
// demo = () => createGlue(demoStructure);
export default demo;
