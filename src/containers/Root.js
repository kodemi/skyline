import React, { Component, PropTypes } from 'react';
import { Router } from 'react-router';
import { connect } from 'react-redux';
import { Provider } from 'react-intl-redux';
import ReduxToastr from 'react-redux-toastr';
import Spinner from '../components/Spinner';

import routes from '../routes';
import 'react-redux-toastr/src/less/index.less';

export class Root extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    };

    render() {
        const { store, history } = this.props;
        const loading = this.props.auth.isAuthenticating;
        return (
            <Provider store={store}>
                <div>
                    <Router history={history}>{routes}</Router>
                    <ReduxToastr timeOut={0} />
                    {loading ? <Spinner wait={1000} /> : null}
                </div>
            </Provider>
        );
    }
}

const mapStateToProps = (state) => ({
    data: state.data,
    auth: state.auth
});

export default connect(mapStateToProps)(Root);
