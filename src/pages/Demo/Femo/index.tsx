import {
  FC, useCallback, useRef,
} from 'react';
import { useIndividualModel, useModel } from 'femo';
import { safeCrash } from '@/hocs';
import { PrepareDataInjectProps } from '@/components/PrepareData';

import Say from './Say';
import model from './model';
import service from './service';
import './index.less';

interface Props extends PrepareDataInjectProps {
}
const Demo: FC<Props> = (props) => {
  const { control } = props;
  console.log('props', props);
  const refName = useRef<HTMLInputElement>();
  const refCountry = useRef<HTMLInputElement>();
  const [country] = useModel(model.country);
  const [person] = useModel(model.person);
  const getList = useCallback(() => {
    console.log('执行组件内部的getList');
    return service.getList({
      name: '名字',
      condition: '条件',
    });
  }, []);
  const [preparedData,,, status] = useIndividualModel(null, [getList], {
    control,
  });
  console.log('preparedData', preparedData, status);

  const onClick = useCallback(() => {
    const { value } = refName.current;
    model.person({
      title: value,
    });
    const { value: country } = refCountry.current;
    model.country(country);
  }, []);

  return (
    <div className="demo-container">
      <form action="/" method="get">
        <label htmlFor="input">
          人名：
          <input ref={refName} type="text" id="input" />
        </label>
        <label htmlFor="country">
          国家：
          <input ref={refCountry} type="text" id="country"/>
        </label>
        <button type="button" onClick={onClick}>
          提交
        </button>
      </form>
       <p>
        添加的人名为：
        {person.title}
        <br/>
        添加的国家为：
        {country}
       </p>
      <Say />
    </div>
  );
};
export default safeCrash(Demo);
