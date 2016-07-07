import React from 'react'
import { Router, browserHistory, Route, IndexRoute } from 'react-router'

import Layout from './layout'
import Home from './pages/home'

export default () => (
  <Router history={browserHistory}>
    <Route path="/">
      <Route component={Layout}>
        <IndexRoute component={Home} />
      </Route>
    </Route>
  </Router>
)
