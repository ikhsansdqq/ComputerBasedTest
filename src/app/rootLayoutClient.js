// src/app/RootLayoutClient.js
'use client';

import { Provider } from 'react-redux';
import store from '../../redux';

const RootLayoutClient = ({ children }) => (
  <Provider store={store}>
    {children}
  </Provider>
);

export default RootLayoutClient;
