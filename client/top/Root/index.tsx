import { ConnectedRouter } from 'react-router-redux';
import { Provider } from 'react-redux';
import React, { ComponentClass, ErrorInfo, ReactNode, StatelessComponent } from 'react';
import { Store } from 'redux';
import { History } from 'history';

let RealContent: StatelessComponent<{component: ComponentClass}>;
if (process.env.NODE_ENV === 'development') {
  RealContent = require('./Local').default;
} else {
  RealContent = require('./Prod').default;
}
interface EcProps {
  children: ReactNode;
}
class ErrorCatch extends React.Component<EcProps> {
  componentDidCatch(err: Error, msg: ErrorInfo) {
    console.log(err, msg);
  }

  render() {
    return this.props.children;
  }
}
interface RootProps {
  store: Store<Object>;
  history: History;
  component: ComponentClass;
}
const Root = (props: RootProps) => {
  const { store, history, component } = props;
  return (
    <ErrorCatch>
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <RealContent component={component} />
        </ConnectedRouter>
      </Provider>
    </ErrorCatch>
  );
};

export default Root;
