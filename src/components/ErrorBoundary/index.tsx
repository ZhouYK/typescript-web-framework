import React, { Component } from 'react';

interface Props {}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    console.error(error);
    return { hasError: true };
  }

  componentDidCatch(error: any, info: any) {
    console.error(error, info);
  }

  render() {
    if (this.state.hasError) {
      return <div style={{ color: 'red', minHeight: 22, width: '100%', background: '#ffb3ba' }} />;
    }
    return this.props.children;
  }
}
