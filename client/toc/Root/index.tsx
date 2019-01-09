import React, { ComponentType, ErrorInfo, ReactElement, ReactNode, } from 'react';
import { Router } from 'react-router';
import history from './history';

let RootComponent: ComponentType<{children: ReactElement<any>}>;
if (process.env.NODE_ENV === 'development') {
  RootComponent = require('./Local').default;
} else {
  RootComponent = require('./Prod').default;
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
  [index: string]: any;
}
const Root = (props: RootProps) => {
  const { children } = props;
  return (
    <ErrorCatch>
      <Router history={history}>
        <RootComponent>
          {children}
        </RootComponent>
      </Router>
    </ErrorCatch>
  );
};

export default Root;
