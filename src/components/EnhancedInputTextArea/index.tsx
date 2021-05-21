import React, {
  FC, PropsWithChildren, useCallback, useEffect, useLayoutEffect, useRef, useState,
} from 'react';
import ReactDom from 'react-dom';
import { TextAreaProps } from 'antd/es/input';
import { Input } from 'antd';
import classNames from 'classnames';
import { getSafe } from '@src/tools/util';
import style from './style.less';

// 目前不能传autoSize，因为要做placeholder的高度适配。二者有冲突
interface Props extends TextAreaProps {
  placeholder?: any;
  useTextHeight?: boolean;
}
// 这里antd里面textarea最小高度是32，需要做限制;
const minHeight = 32;
// 使用该组件时需要注意容器组件的背景色
const EnhancedInputTextArea: FC<Props> = (props: PropsWithChildren<Props>) => {
  const { placeholder, useTextHeight, ...rest } = props;
  const textareaRef = useRef<any>();
  const placeholderRef = useRef<HTMLDivElement>();
  const [hidePlaceholder, updateHidePlaceholder] = useState(true);
  const textareaDom = useRef<{dom: any}>({ dom: null });
  const timer = useRef<NodeJS.Timer>();
  const calcHeightRef = useRef<(times: any) => void>();

  const calcHeight = useCallback((times = 10) => {
    if (!rest.value) {
      if (!textareaDom.current.dom) {
        textareaDom.current.dom = ReactDom.findDOMNode(textareaRef.current);
      }
      if (!useTextHeight && textareaDom.current.dom && placeholderRef.current) {
        let textHeight = getSafe(textareaDom, 'current.dom.offsetHeight');
        let placeHeight = getSafe(placeholderRef, 'current.offsetHeight');
        if (placeHeight < minHeight) {
          placeHeight = minHeight;
        }
        if (textHeight < minHeight) {
          textHeight = minHeight;
        }
        // 外部textarea的值为空才会调用这个
        if (textHeight < placeHeight || textHeight > placeHeight) {
          let count = 0;
          const fn = () => {
            if (count >= times) return;
            count += 1;
            textareaDom.current.dom.style.cssText = `height: ${placeHeight}px!important`;
            timer.current = setTimeout(fn, 16);
          };
          fn();
        }
      }
    }
  }, [rest.value, useTextHeight]);

  calcHeightRef.current = calcHeight;
  const displacePlaceholder = useCallback((value: any) => {
    updateHidePlaceholder(value);
    calcHeight();
  }, [calcHeight]);

  const onChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (rest.onChange) {
      rest.onChange(event);
    }
  }, [rest]);

  useLayoutEffect(() => {
    displacePlaceholder(rest.value);
  }, [rest.value]);

  useEffect(() => {
    const resizeHandler = () => {
      clearTimeout(timer.current);
      calcHeightRef.current();
    };
    window.addEventListener('resize', resizeHandler, {
      passive: true,
    });
    return () => window.removeEventListener('resize', resizeHandler);
  }, []);

  return (
    <section className={classNames(style.textarea, {
      'data-edits': hidePlaceholder,
    })}>
      <Input.TextArea ref={textareaRef} {...rest} onChange={onChange} />
      <section ref={placeholderRef} className='fake-placeholder'>
        { placeholder }
      </section>
    </section>
  );
};

EnhancedInputTextArea.defaultProps = {
  useTextHeight: false,
};

export default EnhancedInputTextArea;
