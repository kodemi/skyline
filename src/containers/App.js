import React, { Component, PropTypes } from 'react';
import { Layout, Panel } from 'react-toolbox/lib/layout';
import { AppBar } from 'react-toolbox/lib/app_bar';
import { Navigation } from 'react-toolbox/lib/navigation';
import { IconMenu, MenuItem } from 'react-toolbox/lib/menu';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { injectIntl, defineMessages } from 'react-intl';
import { updateIntl } from 'react-intl-redux';
import moment from 'moment';
import classNames from 'classnames/bind';

import * as authActions from '../ducks/auth';
import * as dataActions from '../ducks/data';
import 'react-toolbox/lib/commons.scss';
import styles from './App.scss';
import localeData from '../i18n';

const cx = classNames.bind(styles);

const messages = defineMessages({
    AppBarLogOut: {
        id: 'App.AppBar.logOut',
        defaultMessage: 'Log Out'
    },
    AppBarLogIn: {
        id: 'App.AppBar.logIn',
        defaultMessage: 'Log In'
    },
    AppBarMenuLanguage: {
        id: 'App.AppBarMenu.language',
        defaultMessage: 'Change language'
    },
    AppBarMenuAircrafts: {
        id: 'App.AppBarMenu.aircrafts',
        defaultMessage: 'Aircrafts'
    },
    AppBarMenuHelicopters: {
        id: 'App.AppBarMenu.helicopters',
        defaultMessage: 'Helicopters'
    }
});

export class App extends Component {
    static propTypes = {
        auth: PropTypes.object,
        intl: PropTypes.object,
        actions: PropTypes.object,
        dispatch: PropTypes.func
    };

    handleLoginClick = () => {
        this.props.dispatch(push('/login'));
    };

    handleLogoutClick = () => {
        this.props.actions.auth.logoutUserAndRedirect('/');
    };

    changeLanguage = () => {
        const locale = this.props.intl.locale === 'en' ? 'ru' : 'en';
        const messages = localeData[locale];
        this.props.dispatch(updateIntl({ locale, messages }));
        moment.locale(locale);
        try {
            localStorage.setItem('locale', locale);
        } catch (e) {}
    };

    navigateToDashboard = () => {
        this.props.dispatch(push('/dashboard'));
    };

    render() {
        const { formatMessage } = this.props._intl;
        const actions = [];
        const pathname = this.props.location.pathname;
        const indexRoute =
            pathname !== '/aircrafts' &&
            pathname !== '/login' &&
            pathname !== '/dashboard';
        if (
            !this.props.auth.isAuthenticated &&
            this.props.location.pathname !== '/login'
        ) {
            actions.push({
                label: formatMessage(messages.AppBarLogIn),
                icon: 'exit_to_app',
                flat: true,
                inverse: true,
                onClick: this.handleLoginClick
            });
        } else if (this.props.auth.isAuthenticated) {
            actions.push({
                label: this.props.auth.user.username,
                icon: 'account_circle',
                flat: true,
                inverse: true
            });
        }
        const Menu = this.props.auth.isAuthenticated ? (
            <IconMenu
                icon="more_vert"
                position="topRight"
                menuRipple
                theme={styles}
                selectable
            >
                {/*<MenuItem icon='language' caption={formatMessage(messages.AppBarMenuLanguage)} onClick={this.changeLanguage}/>*/}
                {/*<MenuItem caption='Dashboard' onClick={this.navigateToDashboard}/>*/}
                <MenuItem
                    icon="power_settings_new"
                    caption={formatMessage(messages.AppBarLogOut)}
                    onClick={this.handleLogoutClick}
                />
            </IconMenu>
        ) : null;
        return (
            <div>
                <Layout theme={styles}>
                    <Panel>
                        <AppBar
                            fixed
                            leftIcon={indexRoute ? 'arrow_back' : null}
                            onLeftIconClick={this.props.history.goBack}
                        >
                            <span className={cx('logo')} />
                            <Navigation
                                actions={actions}
                                className={cx('navigation')}
                            />
                            {Menu}
                        </AppBar>
                        <div className={cx('appPanel')}>
                            {this.props.children}
                        </div>
                    </Panel>
                </Layout>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    intl: state.intl
});

const mapDispatchToProps = (dispatch) => ({
    dispatch,
    actions: {
        auth: bindActionCreators(authActions, dispatch),
        data: bindActionCreators(dataActions, dispatch)
    }
});

export default injectIntl(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(App),
    { intlPropName: '_intl' }
);
