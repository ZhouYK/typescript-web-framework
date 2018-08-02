import React, { PureComponent, RefObject } from 'react';
import { Action } from "glue-redux";
import { State } from '../../reducers/reducers';
import { connect } from 'react-redux';
import demoAction from './glue';
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
    const ac = await demoAction.asyncGetPerson({
      title: value,
    }).then((action: Action) => {
      console.log('返回的action：', action);
      return action;
    });
    console.log('awaite 后获取到的数据：', ac);
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

const mapStateToProps = (state: State) => {
  const { demo } = state;
  const { person } = demo;
  return {
    person,
  };
};
export default connect(mapStateToProps)(DemoClass);
