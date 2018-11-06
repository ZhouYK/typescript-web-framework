import { ConnectedRouter } from 'react-router-redux';
import React, { ComponentType, ErrorInfo, ReactNode, }  from 'react';
import { store, history } from '../../store';

let RealContent: ComponentType<{component: ComponentType}>;
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
  component: ComponentType;
}
const Root = (props: RootProps) => {
  const { component } = props;
  return (
    <ErrorCatch>
      <ConnectedRouter store={store} history={history}>
        <RealContent component={component} />
      </ConnectedRouter>
    </ErrorCatch>
  );
};

export default Root;
