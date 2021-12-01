import { Femo } from '@src/pages/Demo/Femo/interface';

const getList = (query: Femo.Query): Promise<Femo.ListApiResult> => new Promise((resolve) => {
  setTimeout(() => {
    resolve({
      total: 1,
      content: [1],
      query,
    });
  }, 2000);
});

export default {
  getList,
};
