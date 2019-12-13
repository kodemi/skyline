import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as toastrReducer } from 'react-redux-toastr';
import { intlReducer } from 'react-intl-redux';
import auth from './auth';
import data from './data';

export const rootReducer = combineReducers({
    auth,
    data,
    routing: routerReducer,
    toastr: toastrReducer,
    intl: intlReducer
});