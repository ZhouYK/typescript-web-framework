import React, { FC } from 'react';
import ReactDOM from 'react-dom';

interface Props {
  container: Element;
}

const Container: FC<Props> = (props) => {
  const { container, children } = props;

  return (
    <>
      { container ? ReactDOM.createPortal('加载中...', container) : null }
      { children }
    </>
  );
};

export default Container;
