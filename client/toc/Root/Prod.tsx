/**
 * Created by ink on 2018/4/9.
 */
import { ReactElement, StatelessComponent } from 'react';

const Content: StatelessComponent<{children: ReactElement<any>}> = (props) => {
  const { children } = props;
  return children;
};
Content.displayName = 'ProdRoot';

export default Content;
