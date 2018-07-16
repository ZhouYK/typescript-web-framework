import React from 'react';
import Loadable from 'react-loadable';
const loadingComponent = (Loading) => (props) => <Loading {...props}/>;
export default (prefix, Loading) => (path) => Loadable({
    loader: () => import(`../../pages/${prefix}${path}`),
    loading: loadingComponent(Loading),
    timeout: 10000,
});
//# sourceMappingURL=index.jsx.map