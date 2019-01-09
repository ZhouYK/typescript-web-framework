/**
 * Created by ink on 2018/4/9.
 */

import React, { Fragment, ReactElement, StatelessComponent } from 'react';
import DevTools from '../../tools/devTools/index';
import { store } from '../../store';

const DT = DevTools();

const Content: StatelessComponent<{ children: ReactElement<any> }> = (props) => {
  return (
    <Fragment>
      {props.children}
      <DT store={store} />
    </Fragment>
  );
};
Content.displayName = 'LocalRoot';
export default Content;
