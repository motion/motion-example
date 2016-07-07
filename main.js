import React from 'react'
import ReactDOM from 'react-dom'
import Routes from './routes'

ReactDOM.render(React.createElement(Routes), document.getElementById('app'))

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept()
}
