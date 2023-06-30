import AgeField from '@/pages/Demo/Form/fields/AgeField';
import NameField from '@/pages/Demo/Form/fields/NameField';
import Field from '@/pages/Demo/Form/lib/Field';
import { Button } from '@arco-design/web-react';
import React, { FC, useState } from 'react';

interface Props {

}

const ArrayField: FC<Props> = () => {
  const [arr, setArr] = useState(() => {
    return [0, 1, 2, 3, 4];
  });

  const onClick = () => {
    setArr((preArr) => {
      const tmp = [...preArr];
      if (preArr.length > 2) {
        tmp.shift();
      } else {
        tmp.unshift(1);
      }
      return tmp;
    });
  };

  return (
    <>
      <Button onClick={onClick}>随机改变顺序</Button>
      <Field name='list'>
        {
          arr.map((n, index) => {
            return (
              <Field key={n} name={`${index}`}>
                <NameField name='name' ageFieldPath={['list', `${n}`, 'age']} />
                <AgeField label='年龄' name='age' nameFieldPath={['list', `${n}`, 'name']} />
              </Field>
            );
          })
        }
      </Field>
    </>
  );
};

export default ArrayField;
