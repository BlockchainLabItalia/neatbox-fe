import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import 'antd/dist/antd.css';
import { Auth0Provider } from '@auth0/auth0-react';



ReactDOM.render(
<Auth0Provider  domain="con-cert.eu.auth0.com" cacheLocation='localstorage' clientId="nggSblJxgGosWrd4oSHZrTdfCSKmeeko" redirectUri={window.location.origin}>
  <React.StrictMode>
  <App />
</React.StrictMode>
</Auth0Provider>,
  document.getElementById('root')
);

