import React, { PureComponent, RefObject } from 'react';
import { connect } from '../../store';
import demoModel from '../models/demo';
import './index.less';

interface Person {
  title: string;
}
interface Props {
  person: Person;
  country: string;
}
class DemoClass extends PureComponent<Props> {
  refName: RefObject<any>;
  refCountry: RefObject<any>;
  constructor(props: Props) {
    super(props);
    this.refName = React.createRef();
    this.refCountry = React.createRef();
  }

  onClick = async () => {
    const { value } = this.refName.current;
    demoModel.person({title: value});
    const { value: country } = this.refCountry.current;
    demoModel.country(country);
  }

  render() {
    const { person, country } = this.props;
    return (
      <div className="demo-container">
        <form action="/" method="get">
          <label htmlFor="input">
              人名：
            <input ref={this.refName} type="text" id="input" />
          </label>
          <label htmlFor="country">
            国家：
            <input ref={this.refCountry} type="text" id="country"/>
          </label>
          <button type="button" onClick={this.onClick}>
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
      </div>
    );
  }
}
export default connect(demoModel)(DemoClass);
