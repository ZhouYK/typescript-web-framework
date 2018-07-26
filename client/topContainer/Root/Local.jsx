/**
 * Created by ink on 2018/4/9.
 */
import React, { Fragment } from 'react';
import DevTools from '../../tools/devTools/index';
const Content = (props) => {
    const { component: CustomerContent } = props;
    return (<Fragment>
      <CustomerContent />
      <DevTools />
    </Fragment>);
};
Content.displayName = 'LocalRoot';
export default Content;
//# sourceMappingURL=Local.jsx.map