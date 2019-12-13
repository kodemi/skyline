import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Input } from 'react-toolbox/lib/input';
import { Button } from 'react-toolbox/lib/button';
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl';
import * as actionCreators from '../ducks/auth';
import styles from './LoginView.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const messages = defineMessages({
    LoginViewTitle: {
        id: 'LoginView.title',
        defaultMessage: 'Entrance to the application'
    },
    LoginViewUsername: {
        id: 'LoginView.username',
        defaultMessage: 'Username'
    },
    LoginViewPassword: {
        id: 'LoginView.password',
        defaultMessage: 'Password'
    },
    LoginViewLoginButton: {
        id: 'LoginView.loginButton',
        defaultMessage: 'Log In'
    }
});

export class LoginView extends Component {
    static propTypes = {
        auth: PropTypes.object,
        actions: PropTypes.object,
        _intl: PropTypes.object
    }

    state = {
        username: '',
        password: '',
        redirectTo: this.props.location.query.redirect || '/'
    }

    login = (event) => {
        event.preventDefault();
        this.props.actions.loginUser({username: this.state.username, password: this.state.password}, this.state.redirectTo);
    }

    onUsernameChange = (value) => {
        this.onValueChange('username', value);
    }

    onPasswordChange = (value) => {
        this.onValueChange('password', value);
    }

    onValueChange(field, value) {
        this.setState({
            [field]: value
        });
    }
    
    render() {
        const { formatMessage } = this.props._intl;
        return (
            <div>
                <hgroup className={cx('hgroup')}>
                    <h3 className={cx('title')}><FormattedMessage {...messages.LoginViewTitle} /></h3>
                </hgroup>
                <form className={cx('form')}>
                    <Input 
                        type='text' 
                        label={formatMessage(messages.LoginViewUsername)} 
                        name='username' 
                        value={this.state.username || ''} 
                        onChange={this.onUsernameChange} />
                    <Input 
                        type='password' 
                        label={formatMessage(messages.LoginViewPassword)} 
                        name='password' 
                        value={this.state.password || ''} 
                        onChange={this.onPasswordChange} /> 
                    <Button 
                        className={cx('button')} 
                        label={formatMessage(messages.LoginViewLoginButton)} 
                        raised 
                        accent 
                        onClick={this.login} />
                </form>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    auth: state.auth
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(actionCreators, dispatch)
});

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(LoginView), {intlPropName: '_intl'});