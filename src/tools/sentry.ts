import { ErrorInfo, ReactInstance } from 'react';

const sentry = {
  reportErrorBoundary(error: Error, message: ErrorInfo, context: ReactInstance): void {
    console.error(error, message, context);
  },
  reportError(error: Error | string): void {
    console.error(error);
  },

};

export default sentry;
