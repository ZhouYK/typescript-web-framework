import React, { Fragment, Suspense, lazy } from 'react';
import { Route } from 'react-router';
import Loader from '../../components/Loader';
import 'normalize.css';

const Demo = lazy(() => import('../../pages/Demo'));

const App = () => (
  <Fragment>
    <Suspense fallback={<Loader/>}>
      <Route path="*" component={Demo} />
    </Suspense>
  </Fragment>
);
export default App;
