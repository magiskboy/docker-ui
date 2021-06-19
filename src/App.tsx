import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { Home, Login, Register } from 'pages';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
