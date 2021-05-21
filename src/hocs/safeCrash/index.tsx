import React from 'react';
import Crash from '@src/components/Crash';
import { FrownOutlined } from '@ant-design/icons';

// 高阶函数组件不能自己去渲染TargetComponent，否则无法在自身逻辑里面捕获到错误
// 因为一旦自己去render TargetComponent了过后，TargetComponent报错就等于是高阶函数组件自己报错。而errorBoundary自己无法捕获自己的错误，只能冒泡到更高层去
const safeCrash = <P, _>(TargetComponent: React.ComponentType<P>, fallback?: (error: any) => any) => class SecurityCrash extends React.Component<P, any> {
  fallback = (error: any) => {
    if (fallback) {
      return fallback(error);
    }
    return (
      <section style={{ display: 'flex', alignItems: 'center', color: 'rgb(255, 84, 0)' }}>
        <FrownOutlined />
        <span style={{ marginLeft: '4px' }}>Oops! {TargetComponent.displayName || TargetComponent.name} crashed!</span>
      </section>
    );
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
