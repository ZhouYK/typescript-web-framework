import type { ReactElement, ReactNode } from 'react';
import React, { isValidElement } from 'react';

import type { TooltipProps } from '@arco-design/web-react';
import { Tooltip } from '@arco-design/web-react';
import { IconQuestionCircle } from '@arco-design/web-react/icon';
import classNames from 'classnames';
import type {
  FieldState,
  SupportedArcoFormItemProps,
} from '../../../interface';

const opt = Object.prototype.toString;

export function isArray(obj: any): obj is any[] {
  return opt.call(obj) === '[object Array]';
}

export function isObject(obj: any): obj is { [key: string]: any } {
  return opt.call(obj) === '[object Object]';
}

interface FormItemLabelProps
  extends Pick<SupportedArcoFormItemProps, 'requiredSymbol' | 'required'>,
    Pick<FieldState, 'rules' | 'label'> {
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  showColon: boolean | ReactNode;
  prefix: string;
  htmlFor?: string;
  tooltip?: ReactNode;
}

// 标签
const FormItemLabel: React.FC<FormItemLabelProps> = ({
  htmlFor,
  showColon,
  label,
  requiredSymbol,
  required,
  rules,
  prefix,
  tooltip,
}) => {
  const isRequiredRule = isArray(rules) && rules.some((rule) => rule?.required);
  const symbolPosition = isObject(requiredSymbol)
    ? requiredSymbol.position
    : 'start';

  const symbolNode = (required || isRequiredRule) && !!requiredSymbol && (
    <strong className={`${prefix}-form-item-symbol`}>
      <svg fill="currentColor" viewBox="0 0 1024 1024" width="1em" height="1em">
        <path d="M583.338667 17.066667c18.773333 0 34.133333 15.36 34.133333 34.133333v349.013333l313.344-101.888a34.133333 34.133333 0 0 1 43.008 22.016l42.154667 129.706667a34.133333 34.133333 0 0 1-21.845334 43.178667l-315.733333 102.4 208.896 287.744a34.133333 34.133333 0 0 1-7.509333 47.786666l-110.421334 80.213334a34.133333 34.133333 0 0 1-47.786666-7.509334L505.685333 706.218667 288.426667 1005.226667a34.133333 34.133333 0 0 1-47.786667 7.509333l-110.421333-80.213333a34.133333 34.133333 0 0 1-7.509334-47.786667l214.186667-295.253333L29.013333 489.813333a34.133333 34.133333 0 0 1-22.016-43.008l42.154667-129.877333a34.133333 34.133333 0 0 1 43.008-22.016l320.512 104.106667L412.672 51.2c0-18.773333 15.36-34.133333 34.133333-34.133333h136.533334z" />
      </svg>
    </strong>
  );

  const renderTooltip = () => {
    if (!tooltip) {
      return null;
    }
    const tooltipIconClassName = `${prefix}-form-item-tooltip`;
    let tooltipProps: TooltipProps = {};
    let tooltipIcon = <IconQuestionCircle className={tooltipIconClassName} />;
    if (!isObject(tooltip) || isValidElement(tooltip)) {
      tooltipProps = {
        content: tooltip,
      };
    } else {
      const { icon, ...rest } = tooltip as TooltipProps & {
        icon?: ReactElement;
      };
      tooltipProps = rest;
      if (icon) {
        tooltipIcon = isValidElement(icon)
          ? React.cloneElement(icon as ReactElement, {
            className: classNames(
              tooltipIconClassName,
              (icon as ReactElement).props.className,
            ),
          })
          : icon;
      }
    }
    return <Tooltip {...tooltipProps}>{tooltipIcon}</Tooltip>;
  };

  return label ? (
    <label htmlFor={htmlFor}>
      {symbolPosition !== 'end' && symbolNode} {label}
      {renderTooltip()}
      {symbolPosition === 'end' && <> {symbolNode}</>}
      {/* eslint-disable-next-line no-nested-ternary */}
      {showColon ? (showColon === true ? ':' : showColon) : ''}
    </label>
  ) : null;
};

export default FormItemLabel;
