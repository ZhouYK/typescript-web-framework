import { FormState } from '@/pages/Demo/Form/lib/interface';
import React from 'react';

const FormContext = React.createContext<FormState>(null);

export default FormContext;
