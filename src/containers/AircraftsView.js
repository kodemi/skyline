import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import MediaQuery from 'react-responsive';
import { injectIntl, defineMessages } from 'react-intl';
import { push } from 'react-router-redux';
import classNames from 'classnames/bind';

import * as dataActions from '../ducks/data';
import * as authActions from '../ducks/auth';

import AircraftsList from '../components/AircraftsList';
import AircraftView from './AircraftView';
import styles from './AircraftsView.scss';

const DATA_FETCH_TIMEOUT = 60000;
const cx = classNames.bind(styles);

export class AircraftsView extends Component {
    static propTypes = {
        actions: PropTypes.object,
        data: PropTypes.any,
        auth: PropTypes.any,
        intl: PropTypes.any,
        dispatch: PropTypes.func
    };

    componentWillMount() {
        this.fetchData();
    }

    componentDidMount() {
        const periodicFetchData = () => {
            this.fetchData();
            this.dataTimerId = setTimeout(
                periodicFetchData,
                DATA_FETCH_TIMEOUT
            );
        };
        this.dataTimerId = setTimeout(periodicFetchData, DATA_FETCH_TIMEOUT);
    }

    componentWillUnmount() {
        clearTimeout(this.dataTimerId);
    }

    fetchData() {
        let token = this.props.auth.token;
        this.props.actions.data.fetchAircrafts(token);
    }

    onAircraftClick = (aircraft) => {
        this.props.actions.data.selectAircraft(aircraft);
        this.props.dispatch(push(`/aircrafts/${aircraft.tailNumber}`));
    };

    render() {
        const { aircrafts } = this.props.data;
        const { selectAircraft } = this.props.actions.data;
        const { locale } = this.props.intl;
        if (!aircrafts) {
            return <h4>No aircrafts</h4>;
        }
        return (
            <div style={{ height: '100%' }}>
                <MediaQuery minWidth={760}>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            height: '100%'
                        }}
                    >
                        <div className={cx('leftPane')}>
                            <AircraftsList
                                aircrafts={aircrafts}
                                locale={locale}
                                onAircraftClick={selectAircraft}
                            />
                        </div>
                        <div className={cx('rightPane')}>
                            <AircraftView />
                        </div>
                    </div>
                </MediaQuery>
                <MediaQuery maxWidth={759}>
                    <AircraftsList
                        aircrafts={aircrafts}
                        locale={locale}
                        onAircraftClick={this.onAircraftClick}
                    />
                </MediaQuery>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    data: state.data,
    auth: state.auth,
    intl: state.intl
});

const mapDispatchToProps = (dispatch) => ({
    actions: {
        auth: bindActionCreators(authActions, dispatch),
        data: bindActionCreators(dataActions, dispatch)
    },
    dispatch
});

export default injectIntl(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(AircraftsView),
    { intlPropName: '_intl' }
);
