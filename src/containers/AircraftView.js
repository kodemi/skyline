import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ListItem, List } from 'react-toolbox/lib/list';
import Input from 'react-toolbox/lib/input';
import { Button } from 'react-toolbox/lib/button';
import DatePicker from 'react-toolbox/lib/date_picker';
import { Tab, Tabs } from 'react-toolbox';
import { Scrollbars } from 'react-custom-scrollbars';
import moment from 'moment';
import classNames from 'classnames/bind';
import config from '../../config';
import AircraftCycleDialog from '../components/dialogs/AircraftCycleDialog';
import AircraftDefectDialog from '../components/dialogs/AircraftDefectDialog';
import AircraftDialog from '../components/dialogs/AircraftDialog';
import AircraftMaintenanceDialog from '../components/dialogs/AircraftMaintenanceDialog';
import AircraftInspectionDialog from '../components/dialogs/AircraftInspectionDialog';
import CycleListItem from '../components/CycleListItem';
import DefectListItem from '../components/DefectListItem';
import MaintenancesTable from '../components/MaintenancesTable';
import InspectionsTable from '../components/InspectionsTable';

import * as dataActions from '../ducks/data';
import styles from './AircraftView.scss';

const cx = classNames.bind(styles);
const dateFormat = 'DD.MM.YYYY';

export class AircraftView extends Component {
    static propTypes = {
        data: PropTypes.object,
        auth: PropTypes.object,
        intl: PropTypes.object,
        aircraft: PropTypes.object,
        cycles: PropTypes.object,
        defects: PropTypes.object,
        actions: PropTypes.object
    };

    state = {
        showCycleDialog: false,
        showDefectDialog: false,
        showAircraftDialog: false,
        showMaintenanceDialog: false,
        showInspectionDialog: false,
        cycle: null,
        defect: null,
        aircraft: null,
        selectedMaintenance: null,
        selectedInspection: null,
        tabIndex: 0
    };

    showCycleDialog = (cycle) => {
        if (cycle) {
            const flightTime = moment.duration(cycle.flightTime, 'seconds');
            this.setState({
                showCycleDialog: true,
                cycle: {
                    id: cycle._id,
                    takeoffDate: moment(cycle.takeoff).toDate(),
                    takeoffTime: moment(cycle.takeoff).toDate(),
                    hours: Math.floor(flightTime.asHours()),
                    minutes: Math.floor(
                        flightTime
                            .subtract(
                                moment.duration(
                                    Math.floor(flightTime.asHours()),
                                    'hours'
                                )
                            )
                            .asMinutes()
                    ),
                    departureAirport: cycle.departureAirport,
                    arrivalAirport: cycle.arrivalAirport
                }
            });
        } else {
            this.setState({
                showCycleDialog: true,
                cycle: {}
            });
        }
    };

    addCycle = (cycle) =>
        this.props.actions.data.addCycle(this.props.aircraft, cycle);

    saveCycle = (cycle) =>
        this.props.actions.data.saveCycle(this.props.aircraft, cycle);

    deleteCycle = (cycle) =>
        this.props.actions.data.deleteCycle(this.props.aircraft, cycle);

    showDefectDialog = (defect) => {
        if (defect) {
            this.setState({
                showDefectDialog: true,
                defect: {
                    id: defect._id,
                    defectDate: moment(defect.defectDate).toDate(),
                    defectTime: moment(defect.defectDate).toDate(),
                    defectType: defect.defectType,
                    description: defect.description,
                    resolveBefore:
                        defect.resolveBefore &&
                        moment(defect.resolveBefore).toDate(),
                    resolveBeforeTime:
                        defect.resolveBefore &&
                        moment(defect.resolveBefore).toDate(),
                    status: defect.status,
                    resolveDate:
                        defect.resolveDate &&
                        moment(defect.resolveDate).toDate(),
                    resolveTime:
                        defect.resolveDate &&
                        moment(defect.resolveDate).toDate()
                }
            });
        } else {
            this.setState({
                showDefectDialog: true,
                defect: {
                    defectDate: new Date(),
                    status: 'new',
                    defectType: 'mechanic'
                }
            });
        }
    };

    addDefect = (defect) =>
        this.props.actions.data.addDefect(this.props.aircraft, defect);

    saveDefect = (defect) =>
        this.props.actions.data.saveDefect(this.props.aircraft, defect);

    deleteDefect = (defect) =>
        this.props.actions.data.deleteDefect(this.props.aircraft, defect);

    hideDialog = () => {
        this.setState({
            showCycleDialog: false,
            showDefectDialog: false,
            showAircraftDialog: false,
            showMaintenanceDialog: false,
            showInspectionDialog: false
        });
    };

    onCyclesDateChange = (field, value) =>
        this.props.actions.data.changeCyclesDate({ [field]: value });

    onDefectsDateChange = (field, value) =>
        this.props.actions.data.changeDefectsDate({ [field]: value });

    handleTabChange = (index) => {
        this.setState({ tabIndex: index });
    };

    showAircraftDialog = () => {
        this.setState({
            showAircraftDialog: true,
            aircraft: {
                tsn: this.props.aircraft.tsn,
                csn: this.props.aircraft.csn,
                initial: this.props.aircraft.initial
            }
        });
    };

    saveAircraft = (aircraft) =>
        this.props.actions.data.saveAircraft(this.props.aircraft, aircraft);

    saveMaintenance = (maintenance) =>
        this.props.actions.data.saveMaintenance(
            this.props.aircraft,
            maintenance
        );

    saveInspection = (inspection) =>
        this.props.actions.data.saveInspection(this.props.aircraft, inspection);

    openMaintenanceDialog = (maintenance) => {
        this.setState({
            showMaintenanceDialog: true,
            selectedMaintenance: maintenance
        });
    };

    openInspectionDialog = (inspection) => {
        this.setState({
            showInspectionDialog: true,
            selectedInspection: inspection
        });
    };

    render() {
        const aircraft = this.props.aircraft;
        const cyclesStartDate =
            this.props.cycles && this.props.cycles.startDate;
        const cyclesEndDate = this.props.cycles && this.props.cycles.endDate;
        const defectsStartDate =
            this.props.defects && this.props.defects.startDate;
        const defectsEndDate = this.props.defects && this.props.defects.endDate;
        if (!aircraft) {
            return (
                <h3 className={cx('emptyAircraft')}>Please Select Aircraft</h3>
            );
        }
        const reportUrl = `${config.API_ROOT}/api/aircrafts/${
            aircraft.tailNumber
        }/status.pdf?token=${this.props.auth.token}`;

        return (
            <div style={{ position: 'relative' }}>
                <h3
                    onClick={this.showAircraftDialog}
                    className={cx('tailNumber')}
                >
                    {aircraft.tailNumber}
                    <span className={cx('acType')}>{aircraft.acType}</span>
                </h3>
                <p>
                    <span>TSN: </span>
                    {aircraft.tsn.toFixed(2)}
                </p>
                <p>
                    <span>CSN: </span>
                    {aircraft.csn}
                </p>
                {this.state.tabIndex === 0 || this.state.tabIndex === 1 ? (
                    <Button
                        icon="add"
                        floating
                        accent
                        className={cx('action_btn')}
                        onClick={() =>
                            this.state.tabIndex === 0
                                ? this.showCycleDialog()
                                : this.showDefectDialog()
                        }
                    />
                ) : null}

                <Tabs
                    index={this.state.tabIndex}
                    onChange={this.handleTabChange}
                >
                    <Tab label="Cycles">
                        <div style={{ display: 'flex' }}>
                            <DatePicker
                                label="Start Date"
                                autoOk
                                value={cyclesStartDate}
                                onChange={this.onCyclesDateChange.bind(
                                    this,
                                    'startDate'
                                )}
                                inputFormat={(value) =>
                                    moment(value).format(dateFormat)
                                }
                            />
                            <DatePicker
                                label="End Date"
                                autoOk
                                value={cyclesEndDate}
                                onChange={this.onCyclesDateChange.bind(
                                    this,
                                    'endDate'
                                )}
                                inputFormat={(value) =>
                                    moment(value).format(dateFormat)
                                }
                            />
                        </div>

                        <Scrollbars className={styles.listContainer}>
                            <List selectable ripple>
                                {(aircraft.cycles &&
                                    aircraft.cycles.length &&
                                    aircraft.cycles.map((cycle) => (
                                        <ListItem
                                            theme={styles}
                                            key={cycle._id}
                                            itemContent={
                                                <CycleListItem cycle={cycle} />
                                            }
                                            onClick={() =>
                                                this.showCycleDialog(cycle)
                                            }
                                        />
                                    ))) || <p>No cycles for the period</p>}
                            </List>
                        </Scrollbars>
                    </Tab>

                    <Tab label="Defects">
                        <div style={{ display: 'flex' }}>
                            <DatePicker
                                label="Start Date"
                                autoOk
                                value={defectsStartDate}
                                onChange={this.onDefectsDateChange.bind(
                                    this,
                                    'startDate'
                                )}
                                inputFormat={(value) =>
                                    moment(value).format(dateFormat)
                                }
                            />
                            <DatePicker
                                label="End Date"
                                autoOk
                                value={defectsEndDate}
                                onChange={this.onDefectsDateChange.bind(
                                    this,
                                    'endDate'
                                )}
                                inputFormat={(value) =>
                                    moment(value).format(dateFormat)
                                }
                            />
                        </div>

                        <Scrollbars className={cx('listContainer')}>
                            <List selectable ripple>
                                {(aircraft.defects &&
                                    aircraft.defects.length &&
                                    aircraft.defects.map((defect) => (
                                        <ListItem
                                            theme={styles}
                                            key={defect._id}
                                            itemContent={
                                                <DefectListItem
                                                    defect={defect}
                                                />
                                            }
                                            onClick={() =>
                                                this.showDefectDialog(defect)
                                            }
                                        />
                                    ))) || <p>No defects for the period</p>}
                            </List>
                        </Scrollbars>
                    </Tab>

                    <Tab label="Maintenance">
                        <MaintenancesTable
                            onRowClick={this.openMaintenanceDialog}
                            aircraft={aircraft}
                        />
                    </Tab>

                    <Tab label="Inspections">
                        <Scrollbars className={cx('listContainer')}>
                            <InspectionsTable
                                inspections={aircraft.inspections || []}
                                onRowClick={this.openInspectionDialog}
                            />
                        </Scrollbars>
                    </Tab>
                </Tabs>

                <AircraftCycleDialog
                    cycle={this.state.cycle}
                    active={this.state.showCycleDialog}
                    hideDialog={this.hideDialog}
                    title={
                        this.state.cycle && this.state.cycle.id
                            ? 'Edit Cycle'
                            : 'New Cycle'
                    }
                    addCycle={this.addCycle}
                    saveCycle={this.saveCycle}
                    deleteCycle={this.deleteCycle}
                />

                <AircraftDefectDialog
                    defect={this.state.defect}
                    active={this.state.showDefectDialog}
                    hideDialog={this.hideDialog}
                    title={
                        this.state.defect && this.state.defect.id
                            ? 'Edit Defect'
                            : 'New Defect'
                    }
                    addDefect={this.addDefect}
                    saveDefect={this.saveDefect}
                    deleteDefect={this.deleteDefect}
                />

                <AircraftDialog
                    aircraft={this.state.aircraft}
                    active={this.state.showAircraftDialog}
                    hideDialog={this.hideDialog}
                    title={'Edit Aircraft Info'}
                    saveAircraft={this.saveAircraft}
                />

                <AircraftMaintenanceDialog
                    maintenance={this.state.selectedMaintenance}
                    active={this.state.showMaintenanceDialog}
                    hideDialog={this.hideDialog}
                    title={'Edit Maintenance Info'}
                    saveMaintenance={this.saveMaintenance}
                />

                <AircraftInspectionDialog
                    inspection={this.state.selectedInspection}
                    active={this.state.showInspectionDialog}
                    hideDialog={this.hideDialog}
                    title={
                        (this.state.selectedInspection &&
                            `Edit ${
                                this.state.selectedInspection.name
                            } Info`) ||
                        ''
                    }
                    saveInspection={this.saveInspection}
                />
            </div>
        );
    }
}

const mapStateToProps = (state, props) => ({
    data: state.data,
    auth: state.auth,
    intl: state.intl,
    aircraft: state.data.selectedAircraft.aircraft,
    cycles: state.data.selectedAircraft && state.data.selectedAircraft.cycles,
    defects: state.data.selectedAircraft && state.data.selectedAircraft.defects
});

const mapDispatchToProps = (dispatch) => ({
    actions: {
        data: bindActionCreators(dataActions, dispatch)
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AircraftView);
