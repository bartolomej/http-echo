import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { SWRConfig } from "swr";


const BASE_URL = 'https://http-echo-node.herokuapp.com';

const fetcher = async (url, options) => {
  const res = await fetch(`${BASE_URL}${url}`, options);
  const body = await res.json();
  if (res.status >= 400) {
    throw new Error(body.message || 'Unknown error')
  } else {
    return body;
  }
}

ReactDOM.render(
  <React.StrictMode>
    <SWRConfig value={{ fetcher }}>
      <App/>
    </SWRConfig>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
