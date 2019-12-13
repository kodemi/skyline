import jwtDecode from 'jwt-decode';
import React from 'react';
import { push } from 'react-router-redux';
import { toastr } from 'react-redux-toastr';
import { defineMessages, FormattedMessage } from 'react-intl';
import api from '../api';

const LOGIN_REQUEST = 'ba/auth/LOGIN_REQUEST';
const LOGIN_SUCCESS = 'ba/auth/LOGIN_SUCCESS';
const LOGIN_FAILURE = 'ba/auth/LOGIN_FAILURE';
const LOGOUT_SUCCESS = 'ba/auth/LOGOUT_SUCCESS';
const LOGOUT_REQUEST = 'ba/auth/LOGOUT_REQUEST';

const LOGIN_SUCCESS_MESSAGE = 'Welcome!';
const LOGIN_FAILURE_MESSAGE =  'Authentication error: wrong username or password';
const LOGOUT_SUCCESS_MESSAGE = 'See you';

const messages = defineMessages({
    AuthLoginSuccess: {
        id: 'Auth.Login.success',
        defaultMessage: LOGIN_SUCCESS_MESSAGE
    },
    AuthLoginFailure: {
        id: 'Auth.Login.failure',
        defaultMessage: LOGIN_FAILURE_MESSAGE
    },
    AuthLogoutSuccess: {
        id: 'Auth.Logout.success',
        defaultMessage: LOGOUT_SUCCESS_MESSAGE
    }
});

const initialState = {
    token: null,
    user: {},
    isAuthenticated: false,
    isAuthenticating: false,
    statusText: null
}

export default function auth(state=initialState, action) {
    const payload = action.payload;
    switch(action.type) {
        case LOGIN_REQUEST:
            return {...state, isAuthenticating: true};
        case LOGIN_SUCCESS:
            return {
                ...state, 
                isAuthenticated: true, 
                isAuthenticating: false,
                user: payload.user,
                token: payload.token,
                statusText: payload.statusText
            };
        case LOGIN_FAILURE:
            return {
                ...state,
                isAuthenticated: false,
                isAuthenticating: false,
                token: null,
                user: {},
                statusText: payload.statusText
            };
        case LOGOUT_SUCCESS:
            return {
                ...state,
                isAuthenticated: false,
                isAuthenticating: false,
                token: null,
                user: {},
                statusText: payload.statusText
            };
        default:
            return state;
    }
}

export function loginUserRequest() {
    return {
        type: LOGIN_REQUEST,
        payload: {
            isFetching: true,
            isAuthenticated: false
        }
    }
}

export function loginUserSuccess(token, redirect='/') {
    try {
        localStorage.setItem('token', token);
    } catch (e) {}
    return (dispatch) => {
        const user = jwtDecode(token);
        dispatch({
            type: LOGIN_SUCCESS,
            payload: {
                isFetching: false,
                isAuthenticated: true,
                token,
                user,
                statusText: LOGIN_SUCCESS_MESSAGE
            }
        });
        if (user.role === 'manager') {
            dispatch(push('/dashboard'));
        } else {
            redirect !== false && dispatch(push(redirect));
        }
    }
}

export function loginUserFailure(message) {
    return {
        type: LOGIN_FAILURE,
        payload: {
            isFetching: false,
            isAuthenticated: false,
            statusText: LOGIN_FAILURE_MESSAGE
        }
    }
}

export function logoutUserRequest() {
    return {
        type: LOGOUT_REQUEST,
        payload: {
            isFetching: true,
            isAuthenticated: true
        }
    }
}

export function logoutUserSuccess() {
    try {
        localStorage.removeItem('token');
    } catch (e) {}
    return {
        type: LOGOUT_SUCCESS,
        payload: {
            isFetching: false,
            isAuthenticated: false,
            statusText: LOGOUT_SUCCESS_MESSAGE
        }
    }
}

export function loginUser(creds, redirect = '/') {
    return async (dispatch) => {
        dispatch(loginUserRequest());
        try {
            const response = await api.authenticate(creds);
            dispatch(loginUserSuccess(response.token, redirect));
            toastr.success('', '', { timeOut: 3000, component: <FormattedMessage {...messages.AuthLoginSuccess} /> });
        } catch (e) {
            console.log(e);
            const error = {
                status: e.response && e.response.status,
                statusText: LOGIN_FAILURE_MESSAGE
            }
            dispatch(loginUserFailure(error));
            toastr.error('', '', { component: <FormattedMessage {...messages.AuthLoginFailure} /> });
        }
    }
}

export function logoutUser() {
    return dispatch => {
        dispatch(logoutUserRequest());
        dispatch(logoutUserSuccess());
        toastr.success('', '', { component: <FormattedMessage {...messages.AuthLogoutSuccess} />, timeOut: 3000 });
    }
}

export function logoutUserAndRedirect(redirect) {
    return (dispatch) => {
        logoutUser()(dispatch);
        dispatch(push(redirect || '/login'));
    }
}