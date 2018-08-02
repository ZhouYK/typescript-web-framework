import { ComponentClass, StatelessComponent } from "react";
import { LoadingComponentProps } from 'react-loadable';
import { Reducer, Store, StoreEnhancer } from 'redux';

export type Loader<LP> = StatelessComponent<LP> | ComponentClass<LP>;

export interface LoaderProps extends LoadingComponentProps{
}

export type ConfigStore = (reducers: Reducer<{}>, initialState: {}, enhancer: StoreEnhancer<{}>) => Store<{}>;
