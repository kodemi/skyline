import React, { Component, PropTypes } from 'react';
import Dialog from 'react-toolbox/lib/dialog';
import DatePicker from 'react-toolbox/lib/date_picker';
import Input from 'react-toolbox/lib/input';
import styles from './AircraftDialog.scss';
import classNames from 'classnames/bind';
import moment from 'moment';
import { asUTCDate, asUTCISOString } from '../../utils';

const cx = classNames.bind(styles);
const dateFormat = 'DD.MM.YYYY';

export default class AircraftDialog extends Component {
    static propTypes = {
        aircraft: PropTypes.object,
        active: PropTypes.bool.isRequired,
        title: PropTypes.string.isRequired,
        hideDialog: PropTypes.func.isRequired,
        saveAircraft: PropTypes.func.isRequired
    }

    static defaultTypes = {
        aircraft: null,
        active: false
    }

    state = {
        aircraft: this.props.aircraft && {...this.props.aircraft, initial: {...this.props.aircraft.initial, date: asUTCDate(this.props.aircraft.initial.date)}} || null, 
        initialHours: this.props.aircraft && Math.floor(this.props.aircraft.initial.tsn), 
        initialMinutes: this.props.aircraft &&  Math.round(this.props.aircraft.initial.tsn % 1 * 60)
    }
    

    componentWillReceiveProps (nextProps) {
        if (this.props.active !== nextProps.active && nextProps.active) {
            this.setState({
                aircraft: nextProps.aircraft && {...nextProps.aircraft, initial: {...nextProps.aircraft.initial, date: asUTCDate(nextProps.aircraft.initial.date)}} || null,
                initialHours: nextProps.aircraft && Math.floor(nextProps.aircraft.initial.tsn),
                initialMinutes: nextProps.aircraft && Math.round(nextProps.aircraft.initial.tsn % 1 * 60)
            });
        }
    }

    hideDialog = () => this.props.hideDialog()

    saveAircraft = () => {
        this.hideDialog();
        const { aircraft, initialHours, initialMinutes } = this.state;
        const initialDate = asUTCISOString(aircraft.initial.date);
        aircraft.initial = {...aircraft.initial, date: initialDate, tsn: initialHours + initialMinutes / 60};
        delete aircraft.tsn;
        delete aircraft.csn;
        this.props.saveAircraft(aircraft);
    }
    
    onInitialCsnChange = (value) => {
        const { aircraft } = this.state;
        aircraft.initial = {...aircraft.initial, csn: parseInt(value, 10)};
        this.setState({aircraft});
    }

    onInitialDateChange = (value) => {
        const { aircraft } = this.state;
        aircraft.initial = {...aircraft.initial, date: moment(value).startOf('day').toDate()};
        this.setState({aircraft});
    }

    onInitialTsnHoursChange = (value) => this.setState({initialHours: Number(value)})

    onInitialTsnMinutesChange = (value) => this.setState({initialMinutes: Number(value)})

    onValueChange = (field, value) => this.setState({aircraft: {...this.state.aircraft, [field]: value}})

    render () {
        const { active, title } = this.props;
        const { aircraft, initialHours, initialMinutes } = this.state;
        const actions = [
            { label: 'Save', primary: true, onClick: this.saveAircraft },
            { label: 'Cancel', onClick: this.hideDialog }
        ];
        const initial = this.props.aircraft && this.props.aircraft.initial;
        
        return (
            <Dialog
                active={active}
                onEscKeyDown={this.hideDialog}
                onOverlayClick={this.hideDialog}
                title={title}
                actions={actions}
                className={cx('dialog')}
            >
                {aircraft && 
                (<div>
                    <p>TSN: {initial && initial.tsn && initial.tsn.toFixed(2) || '-'} (initial) + {initial && initial.tsn && (this.props.aircraft.tsn - initial.tsn).toFixed(2) || '-'} (cycles) = {this.props.aircraft.tsn.toFixed(2)} (total)</p>
                    <p>CSN: {initial && initial.csn || '-'} (initial) + {initial && (this.props.aircraft.csn - initial.csn) || '-'} (cycles) = {this.props.aircraft.csn} (total)</p>
                    
                    <DatePicker 
                        label='Initial Date' 
                        autoOk 
                        value={aircraft.initial && moment(aircraft.initial.date).toDate() || ''} 
                        onChange={this.onInitialDateChange} 
                        inputFormat={value => moment(value).format(dateFormat)} />

                    <p>Initial TSN</p>
                    <div style={{display: 'flex'}}>
                        <Input 
                            type='number' 
                            label='Hours' 
                            value={initialHours || ''} 
                            onChange={this.onInitialTsnHoursChange} />
                        <Input 
                            type='number' 
                            label='Minutes' 
                            value={initialMinutes || ''} 
                            onChange={this.onInitialTsnMinutesChange} />
                    </div>
                    
                    <p>Initial CSN</p>                   
                    <Input 
                        type='number' 
                        label='Cycles' 
                        value={aircraft.initial && aircraft.initial.csn || ''} 
                        onChange={this.onInitialCsnChange} />      
                </div>)}                             
            </Dialog>
        );
    }
}