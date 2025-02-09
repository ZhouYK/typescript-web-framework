import type { FieldState } from '../interface';

export const fieldStateKeysRecord: Record<keyof FieldState, keyof FieldState> =
  {
    label: 'label',
    name: 'name',
    value: 'value',
    valueType: 'valueType',
    visible: 'visible',
    preserve: 'preserve',
    errors: 'errors',
    validateStatus: 'validateStatus',
    rules: 'rules',
    initialValue: 'initialValue',
    supportedArcoFormItemProps: 'supportedArcoFormItemProps',
    disabled: 'disabled',
    layout: 'layout',
  };

export const fieldStateKeys: (keyof FieldState)[] =
  Object.values(fieldStateKeysRecord);
