import React, { Suspense } from 'react';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';

const Main = React.lazy(() => import('../components/Main'));

const publicPaths = [{ exact: true, path: '/', component: Main }];

const publicRoutes = publicPaths.map(({ path, ...props }) => (
  <Route key={path} path={path} {...props} />
));

const Routes = () => (
  <Router>
    <Switch>
      <Suspense fallback={<div />}>
        {publicRoutes}
        {/* <Route component={NotFound} /> */}
      </Suspense>
    </Switch>
  </Router>
);

export default Routes;
