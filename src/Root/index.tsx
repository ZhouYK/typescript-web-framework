import React, { ErrorInfo, ReactElement, ReactNode } from 'react';
import { Router } from 'react-router-dom';
import sentry from '@src/tools/sentry';
import history from './history';

interface EcProps {
    children: ReactNode;
}

class ErrorCatch extends React.Component<EcProps> {
    public componentDidCatch(err: Error, msg: ErrorInfo): void {
        sentry.reportErrorBoundary(err, msg, this);
    }

    public render(): ReactNode {
        return this.props.children;
    }
}
interface RootProps {
    [index: string]: any;
}
const Root = (props: RootProps): ReactElement => {
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
