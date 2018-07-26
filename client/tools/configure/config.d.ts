import { Reducer, Store, StoreEnhancer } from 'redux';

export type ConfigStore = (reducers: Reducer<{}>, initialState: {}, enhancer: StoreEnhancer<{}>) => Store<{}>;