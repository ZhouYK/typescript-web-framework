import AgeField from '@/pages/Demo/Wusong/fields/AgeField';
import { Button } from 'antd';
import React, { FC, useContext } from 'react';
import NameField from '@/pages/Demo/Wusong/fields/NameField';
import WuSongFormContextCons from '@/pages/Demo/Wusong/FormProvider/WuSongFormContext';
import FormProvider from './FormProvider';

interface Props {

}

const FormComponent = (p: { children?: any }) => {
  const formContext = useContext(WuSongFormContextCons);
  const onClick = () => {
    formContext.fields.forEach((f) => {
      console.log(f());
    });
  };
  return (
    <>
      {p.children}
      <Button onClick={onClick}>提交</Button>
    </>
  );
};

const WuSong: FC<Props> = (_props) => (
    <FormProvider>
      <FormComponent>
        <NameField />
        <AgeField />
      </FormComponent>
    </FormProvider>
);

export default WuSong;
