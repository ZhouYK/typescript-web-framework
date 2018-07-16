import storeFactory, { historyConf } from '../tools/storeConf/forBrowser';
export const history = historyConf({
    basename: '',
});
const defaultReducers = {
    router: () => ({}),
};
const store = storeFactory(defaultReducers, history);
export default store;
//# sourceMappingURL=index.jsx.map