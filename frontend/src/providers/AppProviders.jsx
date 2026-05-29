import React from 'react';
import { Provider } from 'react-redux';
import { store } from '@/app/store';
import { injectStore } from '@/services/api';

injectStore(store);

export default function AppProviders({ children }) {
  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
}
