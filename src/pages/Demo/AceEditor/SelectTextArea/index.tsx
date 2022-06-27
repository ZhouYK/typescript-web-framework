import classnames from 'classnames';
import { useDerivedModel, useDerivedState } from 'femo';
import React, {
  ChangeEvent, FC, useRef, useState,
} from 'react';
import ReactDOM from 'react-dom';
import { Button, Input } from 'antd';
import style from './style.less';

interface Props {
  editable?: boolean;
  value?: string;
  onChange?: (v: string) => void;
}

interface SelectedPosition {
  start: number;
  end: number;
  regex?: string;
}

interface ButtonPosition {
  left: number;
  top: number;
  text?: string;
}

const genDisableStyle = (target: string) => `<span class="select-text-is-disabled">${target}</span>`;

const SelectTextArea: FC<Props> = (props) => {
  const { value, onChange } = props;
  const selectAreaWrapperDomRef = useRef<HTMLDivElement>(null);
  const [btnPosition, updateBP] = useState<ButtonPosition>();

  const [innerValue, innerValueModel] = useDerivedModel(value, props, (ns, _ps, s) => {
    if ('value' in ns) {
      return ns.value;
    }
    return s;
  });

  const innerOnChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) {
      onChange(e.target.value);
    } else {
      innerValueModel(e.target.value);
    }
  };
  // selectedPosition 需要升序
  const [selectedPosition] = useState<SelectedPosition[]>([]);
  const [htmlStr] = useDerivedState(() => {
    const l = innerValue?.length ?? 0;
    if (!l) return '';
    const spl = selectedPosition.length;
    let result = innerValue;
    let increaseSize = 0;
    for (let i = 0; i < l; i += 1) {
      for (let j = 0; j < spl; j += 1) {
        const { start, end } = selectedPosition[j];
        const tmpStart = start + increaseSize;
        const tmpEnd = end + increaseSize;
        const preStr = result.substring(0, tmpStart);
        const target = result.substring(tmpStart, tmpEnd + 1);
        const suffixStr = result.substring(tmpEnd + 1);
        const finalTarget = genDisableStyle(target);
        increaseSize += finalTarget.length - target.length;
        result = `${preStr}${finalTarget}${suffixStr}`;
      }
    }
    return result;
  }, [innerValue, selectedPosition]);

  // const getDomOffset = (dom: HTMLElement) => {
  //   const { x, y } = dom.getBoundingClientRect();
  //   return {
  //     x, y,
  //   };
  // };

  const onMouseUp = (evt: React.MouseEvent<HTMLElement, MouseEvent>) => {
    const { clientX, clientY } = evt;
    // const { x, y } = getDomOffset(selectAreaWrapperDomRef.current);
    // const relativeX = clientX - x;
    // const relativeY = clientY - y + 14; // 为了露出文字
    const relativeX = clientX;
    const relativeY = clientY + 14; // 为了露出文字
    setTimeout(() => {
      const selObj = window.getSelection();
      const selectedText = selObj.toString();
      if (!selectedText) {
        updateBP(null);
      } else {
        updateBP({
          left: relativeX,
          top: relativeY,
          text: selectedText,
        });
      }
    }, 0);
  };

  const genTranslate = (bp: ButtonPosition) => {
    if (!bp) return {};
    return {
      transform: `translate3D(${bp.left}px, ${bp.top}px, 0)`,
    };
  };

  const btnPortal = ReactDOM.createPortal(
    <section style={genTranslate(btnPosition)} className={ classnames(style.genRegexWrap, {
      hide: !btnPosition,
    }) }>
      <section className='selected-content'>
        <span className='content-name'>所选值（Value）</span>
        <span className='content-value'>{btnPosition?.text}</span>
      </section>
      <section className='btn-wrap'>
        <Button size='small' type='primary'>生成正则</Button>
      </section>
    </section>,
    document.body,
  );

  return (
    <section className={style.sample}>
      <section ref={selectAreaWrapperDomRef} className='select-area-wrapper'>
        <section className='select-area' onMouseUp={onMouseUp} dangerouslySetInnerHTML={{ __html: htmlStr }} />
        {btnPortal}
      </section>
      <section>
        <Input.TextArea value={value} onChange={innerOnChange} />
      </section>
    </section>
  );
};

export default SelectTextArea;
