import React, { PureComponent, RefObject } from 'react';
import { connect } from '../../store';
import demoModel from '../models/demo';
import './index.less';

interface Person {
  title: string;
}
interface Props {
  person: Person;
}
class DemoClass extends PureComponent<Props> {
  ref: RefObject<any>;
  constructor(props: Props) {
    super(props);
    this.ref = React.createRef();
  }

  onClick = async () => {
    const { value } = this.ref.current;
    demoModel.person({title: value});
  }

  render() {
    const { person } = this.props;
    return (
      <div className="demo-container">
        <form action="/" method="get">
          <label htmlFor="input">
              输入任意内容：
            <input ref={this.ref} type="text" id="input" />
          </label>
          <button type="button" onClick={this.onClick}>
              提交
          </button>
        </form>
        <p>
            添加的人名为：
          {person.title}
        </p>
      </div>
    );
  }
}
export default connect(demoModel)(DemoClass);
