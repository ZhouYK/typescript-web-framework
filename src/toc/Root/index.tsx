import React, { ErrorInfo, ReactNode, } from 'react';
import { Router } from 'react-router';
import history from './history';

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
          {children}
      </Router>
    </ErrorCatch>
  );
};

export default Root;
