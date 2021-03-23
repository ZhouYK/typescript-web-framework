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
const InputTextArea: FC<Props> = (props: PropsWithChildren<Props>) => {
  const { placeholder, useTextHeight, ...rest } = props;
  const textareaRef = useRef<any>();
  const placeholderRef = useRef<HTMLDivElement>();
  const [hidePlaceholder, updateHidePlaceholder] = useState(true);
  const textareaDom = useRef<{dom: any}>({ dom: null });
  const timer = useRef<NodeJS.Timer>();
  const mutationObserver = useRef<MutationObserver>();
  const calcHeightRef = useRef<Function>();

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
    // @ts-ignore
    const MutationObserver = window.MutationObserver || window.webkitMutationObserver || window.MozMutationObserver;
    if (MutationObserver && !mutationObserver.current && textareaDom.current.dom) {
      mutationObserver.current = new MutationObserver((mutation: MutationRecord[]) => {
        if (mutation instanceof Array) {
          const tm = mutation.find((m) => m.target === textareaDom.current.dom);
          if (tm && tm.type === 'attributes' && tm.attributeName === 'style') {
            clearTimeout(timer.current);
            calcHeightRef.current();
          }
        }
      });
      mutationObserver.current.observe(textareaDom.current.dom, {
        childList: false,
        subtree: false,
        attributes: true,
      });
    }
    return () => {
      if (mutationObserver.current) {
        mutationObserver.current.disconnect();
        mutationObserver.current = null;
      }
    };
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

InputTextArea.defaultProps = {
  useTextHeight: false,
};

export default InputTextArea;
