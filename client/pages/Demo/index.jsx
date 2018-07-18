var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import demoAction from './glue';
import './index.less';
class DemoClass extends PureComponent {
    constructor(props) {
        super(props);
        this.onClick = () => __awaiter(this, void 0, void 0, function* () {
            const { value } = this.ref.current;
            const ac = yield demoAction.asyncGetPerson({
                title: value,
            }).then((action) => {
                console.log('返回的action：', action);
                return action;
            });
            console.log('awaite 后获取到的数据：', ac);
        });
        this.ref = React.createRef();
    }
    render() {
        const { person } = this.props;
        return (<div className="demo-container">
        <form action="/" method="get">
          <label htmlFor="input">
              输入任意内容：
            <input ref={this.ref} type="text" id="input"/>
          </label>
          <button type="button" onClick={this.onClick}>
              提交
          </button>
        </form>
        <p>
            添加的人名为：
          {person.title}
        </p>
      </div>);
    }
}
const mapStateToProps = (state) => {
    const { demo } = state;
    const { person } = demo;
    return {
        person,
    };
};
export default connect(mapStateToProps)(DemoClass);
//# sourceMappingURL=index.jsx.map