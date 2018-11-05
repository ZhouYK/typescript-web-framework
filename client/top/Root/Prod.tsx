/**
 * Created by ink on 2018/4/9.
 */
import React, { ComponentClass, StatelessComponent } from 'react';

const Content: StatelessComponent<{component: ComponentClass}> = (props) => {
  const { component: CustomerContent } = props;
  return <CustomerContent />;
};
Content.displayName = 'ProdRoot';

export default Content;
