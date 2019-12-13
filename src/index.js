// React
require('babel-polyfill');
import React from 'react';
import { render } from 'react-dom';
import { browserHistory } from 'react-router';
import { addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';
import ru from 'react-intl/locale-data/ru';
import localeData from './i18n';

import Root from './containers/Root';
import configureStore from './store/configureStore';
import { loginUserSuccess } from './ducks/auth';

addLocaleData([...en, ...ru]);

// const locale = localStorage.getItem('locale') || (navigator.languages && navigator.languages[0]) ||
//                      navigator.language ||
//                      navigator.userLanguage;
const locale = 'en';
const languageWithoutRegionCode = locale.toLowerCase().split(/[_-]+/)[0];
const messages =
    localeData[languageWithoutRegionCode] ||
    localeData[locale] ||
    localeData.en;

const initial_state = {
    intl: {
        locale,
        messages
    }
};
const { store, history } = configureStore(browserHistory, initial_state);
const root = document.getElementById('root');

let token = localStorage.getItem('token');
if (token !== null) {
    store.dispatch(loginUserSuccess(token));
}

// If browser doesn't support Intl (i.e. Safari), then we manually import
// the intl polyfill and locale data.
if (!window.intl) {
    require.ensure(
        [
            'intl',
            'intl/locale-data/jsonp/en.js',
            'intl/locale-data/jsonp/ru.js'
        ],
        (require) => {
            require('intl');
            require('intl/locale-data/jsonp/en.js');
            require('intl/locale-data/jsonp/ru.js');
            render(<Root store={store} history={history} />, root);
        }
    );
} else {
    render(<Root store={store} history={history} />, root);
}

// render(<Root store={store} history={history}/>, root);

if (module.hot) {
    module.hot.accept('./containers/Root', () => {
        render(<Root store={store} history={history} />, root);
    });
}
