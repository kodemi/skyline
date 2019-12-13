import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styles from './DashboardView.scss';
import * as dataActions from '../ducks/data';
import classNames from 'classnames/bind';
import DefectsDialog from '../components/dialogs/DefectsDialog';
import AircraftCard from '../components/AircraftCard';

const cx = classNames.bind(styles);
const DATA_FETCH_TIMEOUT = 60000;

export class DashboardView extends Component {
    static propTypes = {
        auth: PropTypes.object,
        intl: PropTypes.object,
        data: PropTypes.object,
        actions: PropTypes.object,
        dispatch: PropTypes.func
    }

    state = {
        showDefectsDialog: false,
        defectsDialogTitle: '',
        defects: []
    }

    componentWillMount() {
        this.fetchData();
    }

    componentDidMount() {
        const periodicFetchData = () => {
            this.fetchData();
            this.dataTimerId = setTimeout(periodicFetchData, DATA_FETCH_TIMEOUT);
        }
        this.dataTimerId = setTimeout(periodicFetchData, DATA_FETCH_TIMEOUT);
    }

    componentWillUnmount() {
        clearTimeout(this.dataTimerId);
    }

    fetchData() {
        let token = this.props.auth.token;
        this.props.actions.data.fetchAircrafts(token, true);
    }

    showNewDefects = (aircraft) => {
        this.setState({
            showDefectsDialog: true,
            defectsDialogTitle: `New Defects of ${aircraft.tailNumber}`,
            defects: aircraft.defects.filter(defect => defect.status === 'new')
        });
    }

    showWorkDefects = (aircraft) => {
        this.setState({
            showDefectsDialog: true,
            defectsDialogTitle: `Defects in Work of ${aircraft.tailNumber}`,
            defects: aircraft.defects.filter(defect => defect.status === 'work')            
        });

    }

    hideDefectsDialog = () => {
        this.setState({showDefectsDialog: false});
    }

    render() {
        const { aircrafts } = this.props.data;
        return (
            <div>
                <div className={cx('cards')}>
                    { aircrafts.map(aircraft => (
                        <AircraftCard 
                            key={ aircraft.tailNumber } 
                            aircraft={ aircraft } 
                            showNewDefects={() => this.showNewDefects(aircraft) } 
                            showWorkDefects={ () => this.showWorkDefects(aircraft) }
                            className={cx('card')}
                        />
                    )) }
                </div>
                
                <DefectsDialog 
                    title={this.state.defectsDialogTitle} 
                    active={this.state.showDefectsDialog} 
                    hideDialog={this.hideDefectsDialog} 
                    defects={this.state.defects} 
                />
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    intl: state.intl,
    data: state.data
});

const mapDispatchToProps = (dispatch) => ({
    actions: {
        data: bindActionCreators(dataActions, dispatch),
    },
    dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(DashboardView);