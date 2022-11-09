import AgeField from '@/pages/Demo/Wusong/fields/AgeField';
import Test, { Text } from '@/pages/Demo/Wusong/components/Test';
import { Button } from 'antd';
import React, {
  FC, useContext, useEffect, useState,
} from 'react';
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

const WuSong: FC<Props> = (_props) => {
  const [n, update] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(() => {
      update((prevState) => {
        if (prevState > 10) {
          window.clearInterval(timer);
        }
        return prevState + 1;
      });
    }, 2000);
    return () => {
      window.clearInterval(timer);
    };
  }, []);
  return (
    <FormProvider>
      <FormComponent>
        <NameField />
        <AgeField />
      </FormComponent>
      <Test>
        <Text n={n} text='hello' />
      </Test>
    </FormProvider>
  );
};

export default WuSong;
