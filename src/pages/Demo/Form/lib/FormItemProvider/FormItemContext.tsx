import { FieldState } from '@/pages/Demo/Form/lib/interface';
import React from 'react';

const FormItemContext = React.createContext<FieldState>(null);

export default FormItemContext;
