import React, { Component, PropTypes } from 'react';
import Dialog from 'react-toolbox/lib/dialog';
import DatePicker from 'react-toolbox/lib/date_picker';
import TimePicker from 'react-toolbox/lib/time_picker';
import Slider from 'react-toolbox/lib/slider';
import Input from 'react-toolbox/lib/input';
import styles from './AircraftCycleDialog.scss';
import classNames from 'classnames/bind';
import moment from 'moment';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';
import { asUTCDate, asUTCISOString } from '../../utils';

const cx = classNames.bind(styles);
const dateFormat = 'DD.MM.YYYY';

export default class AircraftCycleDialog extends Component {
    static propTypes = {
        cycle: PropTypes.object,
        active: PropTypes.bool.isRequired,
        title: PropTypes.string.isRequired,
        hideDialog: PropTypes.func.isRequired,
        addCycle: PropTypes.func.isRequired,
        saveCycle: PropTypes.func.isRequired,
        deleteCycle: PropTypes.func.isRequired
    }

    static defaultProps = {
        active: false,
        cycle: null
    }

    state = {
        cycle: this.props.cycle && {
            ...this.props.cycle, 
            takeoffTime: asUTCDate(this.props.cycle.takeoffTime),
            takeoffDate: asUTCDate(this.props.cycle.takeoffDate)
        } || null,
        showConfirmDeleteDialog: false
    }

    componentWillReceiveProps (nextProps) {
        if (this.props.active !== nextProps.active && nextProps.active) {
            this.setState({cycle: nextProps.cycle && {...nextProps.cycle, takeoffTime: asUTCDate(nextProps.cycle.takeoffTime), takeoffDate: asUTCDate(nextProps.cycle.takeoffDate)} || null});
        }
    }

    hideDialog = () => {
        this.props.hideDialog();
    }

    addCycle = () => {
        const takeoffTime = asUTCISOString(this.state.cycle.takeoffTime);
        const takeoffDate = asUTCISOString(this.state.cycle.takeoffDate);
        this.props.addCycle({...this.state.cycle, takeoffTime,  takeoffDate});
        this.hideDialog();
    }

    saveCycle = () => {
        const takeoffTime = asUTCISOString(this.state.cycle.takeoffTime);
        const takeoffDate = asUTCISOString(this.state.cycle.takeoffDate);
        this.props.saveCycle({...this.state.cycle, takeoffTime, takeoffDate});
        this.hideDialog();
    }

    deleteCycle = () => {
        this.props.deleteCycle(this.state.cycle);
        this.setState({
            showConfirmDeleteDialog: false
        });
        this.hideDialog();
    }

    onTakeoffDateChange = (value) => {
        this.onValueChange('takeoffDate', value);
    }

    onTakeoffTimeChange = (value) => {
        this.onValueChange('takeoffTime', value);
    }

    onHoursChange = (value) => {
        this.onValueChange('hours', value);
    }

    onMinutesChange = (value) => {
        this.onValueChange('minutes', value);
    }

    onDepartureAirportChange = (value) => {
        this.onValueChange('departureAirport', value.toUpperCase());
    }

    onArrivalAirportChange = (value) => {
        this.onValueChange('arrivalAirport', value.toUpperCase());
    }

    onValueChange = (field, value) => {
        this.setState({cycle: {...this.state.cycle, [field]: value}});
    }

    render () {
        const { active, title } = this.props;
        const { cycle, showConfirmDeleteDialog } = this.state;
        const actions = cycle ? (!cycle.id 
            ? [
                { label: 'Add cycle', icon: 'add', primary: true, onClick: this.addCycle },
                { label: 'Cancel', onClick: this.hideDialog }
            ]
            : [
                { label: 'Save cycle', primary: true, onClick: this.saveCycle },
                { label: 'Delete cycle', onClick: () => this.setState({showConfirmDeleteDialog: true}) },
                { label: 'Cancel', onClick: this.hideDialog }
            ]) : [];
        cycle && console.log(cycle.takeoffDate, cycle.takeoffTime);
        return (
            <div>
                <Dialog
                    active={active}
                    onEscKeyDown={this.hideDialog}
                    onOverlayClick={this.hideDialog}
                    title={title}
                    actions={actions}
                    className={cx('dialog')} >
                    {cycle && (<div>
                    <DatePicker 
                        label='Takeoff Date' 
                        autoOk 
                        value={cycle.takeoffDate} 
                        onChange={this.onTakeoffDateChange} 
                        inputFormat={value => moment(value).format(dateFormat)} />
                    
                    <TimePicker 
                        label='Takeoff Time (UTC)' 
                        value={cycle.takeoffTime} 
                        onChange={this.onTakeoffTimeChange} />
                    
                    <p>Flight Time (hours)</p>
                    
                    <Slider 
                        value={cycle.hours} 
                        min={0} 
                        max={48} 
                        step={1} 
                        editable 
                        onChange={this.onHoursChange} />
                    
                    <p>Flight Time (minutes)</p>
                    
                    <Slider 
                        value={cycle.minutes} 
                        min={0} 
                        max={59} 
                        step={1} 
                        editable 
                        onChange={this.onMinutesChange} />
                    
                    <p>Route</p>
                    
                    <div style={{display: 'flex'}}>
                        <Input 
                            type='text' 
                            label='Departure' 
                            value={cycle.departureAirport || ''} 
                            onChange={this.onDepartureAirportChange} />
                        
                        <Input 
                            type='text' 
                            label='Arrival' 
                            value={cycle.arrivalAirport || ''} 
                            onChange={this.onArrivalAirportChange} />
                    </div>
                    </div>)}
                </Dialog>

                <ConfirmDeleteDialog
                    title='Delete Cycle' 
                    active={showConfirmDeleteDialog} 
                    onYes={this.deleteCycle} 
                    onNo={() => this.setState({showConfirmDeleteDialog: false})}
                />
            </div>
        );
    }
}