import { UserAuthWrapper } from 'redux-auth-wrapper';
import { push } from 'react-router-redux';
import moment from 'moment';

export const requireAuthentication = UserAuthWrapper({
    authSelector: state => state.auth,
    predicate: auth => auth.isAuthenticated,
    redirectAction: push,
    wrapperDisplayName: 'UserIsJWTAuthenticated'
});

export function checkHttpStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response
    } else {
        var error = new Error(response.statusText)
        error.response = response
        throw error
    }
}

export function parseJSON(response) {
    return response.json()
}

export function asUTCDate(value) {
    if (!value) { return value };
    return new Date(moment.utc(value).format(`YYYY-MM-DDTHH:mm:ss[${moment().format('Z')}]`));
}

export function asUTCISOString(value) {
    if (!value) { return value };
    return moment(value).format('YYYY-MM-DDTHH:mm:ss[Z]')
}