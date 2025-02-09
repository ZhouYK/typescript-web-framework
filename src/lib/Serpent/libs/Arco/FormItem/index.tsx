import type { FC, ReactElement, ReactNode } from 'react';
import React, { useRef } from 'react';

import { Grid } from '@arco-design/web-react';
import { useSerpentContext } from '../../../Context';
import classNames from 'classnames';

import { getClassName } from '../../../constants';
import type { SerpentFormItemProps } from '../../../interface';
import { ValidateStatus } from '../../../interface';
import FormItemLabel from '../FormItemLable';

const { Row } = Grid;
const { Col } = Grid;

const FormItem: FC<SerpentFormItemProps> = (props) => {
  const { children, onChange, fieldState, id } = props;

  const serpentContext = useSerpentContext();
  const { prefix } = serpentContext;

  const propsRef = useRef(props);
  propsRef.current = props;

  const count = React.Children.count(children);

  let element: ReactElement | ReactNode = children;
  if (React.isValidElement(children)) {
    element = React.cloneElement(children, {
      // @ts-expect-error value 没有在 children 上定义
      value: Object.is(fieldState?.value, undefined) ? null : fieldState?.value, // undefined 会被认为没有传 value，从而达不到受控的目的
      onChange,
      id,
      disabled: fieldState?.disabled,
    });
  }

  if (count > 1 || count <= 0) {
    element = <>{children}</>;
  }

  const hasError = fieldState?.validateStatus === ValidateStatus.error;

  const { supportedArcoFormItemProps } = fieldState || {};
  const {
    labelCol = { span: 5, offset: 0 },
    wrapperCol = { span: 19, offset: 0 },
  } = supportedArcoFormItemProps || {};

  return (
    <Row
      className={classNames(
        getClassName('form-item', prefix),
        {
          [getClassName('form-item-error', prefix)]: hasError,
          [getClassName('form-item-status-error', prefix)]: hasError,
        },
        getClassName(`layout-${fieldState?.layout || 'horizontal'}`, prefix),
      )}
    >
      <Col
        {...labelCol}
        className={classNames(
          getClassName('form-label-item', prefix),
          labelCol?.className,
          {
            [getClassName('label-item-flex', prefix)]: !labelCol,
          },
        )}
      >
        <FormItemLabel
          label={fieldState.label}
          htmlFor={id}
          rules={fieldState.rules}
          showColon={supportedArcoFormItemProps?.colon}
          prefix={prefix}
          requiredSymbol={supportedArcoFormItemProps?.requiredSymbol}
          required={supportedArcoFormItemProps?.required}
        />
      </Col>
      <Col
        className={classNames(getClassName('form-item-wrapper', prefix), {
          [getClassName('item-wrapper-flex', prefix)]: !wrapperCol,
        })}
        {...wrapperCol}
      >
        <section className={getClassName('form-item-control-wrapper', prefix)}>
          <section
            className={getClassName('form-item-control', prefix)}
            id={id}
          >
            <section
              className={getClassName('form-item-control-children', prefix)}
            >
              {element}
            </section>
          </section>
        </section>
        {hasError ? (
          <section className={getClassName('form-message', prefix)}>
            <section>
              {fieldState?.errors
                ?.map((error) => {
                  return error?.message;
                })
                ?.join?.('\n')}
            </section>
          </section>
        ) : null}
      </Col>
    </Row>
  );
};

export default FormItem;
