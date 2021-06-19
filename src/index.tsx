import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import { ThemeProvider } from '@material-ui/core/styles';
import { LightTheme } from 'theme';
import store from 'helpers/store';
import App from './App';
import 'index.css';

import common_en from 'translations/en/common.json';
import errors_en from 'translations/en/errors.json';

import common_vi from 'translations/vi/common.json';
import errors_vi from 'translations/vi/errors.json';

i18next.init({
  interpolation: { escapeValue: false },
  lng: 'vi',
  resources: {
    en: {
      common: common_en,
      errors: errors_en,
    },

    vi: {
      common: common_vi,
      errors: errors_vi,
    },
  },
});

ReactDOM.render(
  <Provider store={store}>
    <I18nextProvider i18n={i18next}>
      <ThemeProvider theme={LightTheme}>
        <App />
      </ThemeProvider>
    </I18nextProvider>
  </Provider>,
  document.getElementById('root')
);
