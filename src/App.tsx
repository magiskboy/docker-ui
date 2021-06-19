import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import routes from 'routes';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        {routes.map(([path, component]) => (
          <Route
            path={path as string}
            key={path as string}
            component={component as React.ComponentType}
            exact
          />
        ))}
      </Switch>
    </BrowserRouter>
  );
};

export default App;
