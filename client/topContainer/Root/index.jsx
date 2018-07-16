import { ConnectedRouter } from 'react-router-redux';
import { Provider } from 'react-redux';
import React from 'react';
let RealContent;
if (process.env.NODE_ENV === 'development') {
    RealContent = require('./Local').default;
}
else {
    RealContent = require('./Prod').default;
}
class ErrorCatch extends React.Component {
    componentDidCatch(err, msg) {
        console.log(err, msg);
    }
    render() {
        return this.props.children;
    }
}
const Root = (props) => {
    const { store, history, component } = props;
    return (<ErrorCatch>
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <RealContent component={component}/>
        </ConnectedRouter>
      </Provider>
    </ErrorCatch>);
};
export default Root;
//# sourceMappingURL=index.jsx.map