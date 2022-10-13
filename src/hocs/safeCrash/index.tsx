import React from 'react';
import Crash from '@/components/Crash';
import Placeholder from '@/components/Placeholder';

const defaultFallback = () => <Placeholder text='Oops, something went wrong o(╥﹏╥)o !' />;
const safeCrash = <P, _>(TargetComponent: React.ComponentType<P>, fallback?: (error: any) => any) => class SecurityCrash extends React.Component<P, any> {
  fallback = (error: any) => {
    if (fallback) {
      return fallback(error);
    }
    return defaultFallback();
  }

  render() {
    return (
        <Crash fallback={this.fallback}>
          <TargetComponent {...this.props} />
        </Crash>
    );
  }
};

export default safeCrash;
