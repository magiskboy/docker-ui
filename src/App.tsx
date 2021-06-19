import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import axios from 'axios';
import { AppContainer } from 'shared';
import { DOCKER_ENGINE_API_HOST } from 'constants/api';
import routes from 'routes';

axios.interceptors.request.use((config) => {
  config.baseURL = DOCKER_ENGINE_API_HOST;
  return config;
});

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppContainer>
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
      </AppContainer>
    </BrowserRouter>
  );
};

export default App;
