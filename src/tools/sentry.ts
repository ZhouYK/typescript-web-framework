import {ErrorInfo, ReactInstance} from 'react';

const sentry = {
  reportErrorBoundary(error: Error, message: ErrorInfo, context: ReactInstance): void {
    console.log(error, message, context);
  },
};

export default sentry;
