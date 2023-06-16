import React, { FC, ReactElement } from 'react';

interface Props {
  children: ReactElement;
}

interface TextProps {
  text: string;
  n: number;
}
export const Text: FC<TextProps> = (props) => {
  return (
    <span>{props.text}</span>
  );
};

const Test: FC<Props> = (props) => {
  return (
    // 并不会引起二次 rerender
    React.cloneElement(props.children, {
      ...props.children.props,
      text: '哈哈哈',
    })
  );
};

export default Test;
