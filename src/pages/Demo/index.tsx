import React, { PureComponent, ReactElement, RefObject } from 'react';
import { subscribe } from 'femo';
import model from './model';
import './index.less';

interface Person {
    title: string;
}
interface State {
    person: Person;
    country: string;
}
interface Props {
}
class DemoClass extends PureComponent<any, State> {
    public refName: RefObject<any>;

    public refCountry: RefObject<any>;

    public constructor(props: Props) {
      super(props);
      this.refName = React.createRef();
      this.refCountry = React.createRef();
      subscribe([model.country, model.person], (country: string, person: Person): void => {
        if (!this.state) {
          this.state = {
            country,
            person,
          };
        } else {
          this.setState({
            country,
            person,
          });
        }
      });
    }

    public onClick = async (): Promise<any> => {
      const { value } = this.refName.current;
      model.person({ title: value });
      const { value: country } = this.refCountry.current;
      model.country(country);
    };

    public render(): ReactElement {
      const { person, country } = this.state;
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
export default DemoClass;
