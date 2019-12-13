import React, { Component, PropTypes } from 'react';
import Dialog from 'react-toolbox/lib/dialog';
import DatePicker from 'react-toolbox/lib/date_picker';
import Input from 'react-toolbox/lib/input';
import { IconButton } from 'react-toolbox/lib/button';
import styles from './AircraftMaintenanceDialog.scss';
import classNames from 'classnames/bind';
import moment from 'moment';

const cx = classNames.bind(styles);
const dateFormat = 'DD.MM.YYYY';

export default class AircraftMaintenanceDialog extends Component {
    static propTypes = {
        maintenance: PropTypes.object,
        active: PropTypes.bool.isRequired,
        hideDialog: PropTypes.func.isRequired,
        title: PropTypes.string.isRequired,
        saveMaintenance: PropTypes.func.isRequired
    }

    static defaultProps = {
        active: false,
        maintenance: null,
        title: ''
    }

    state = {
        maintenance: this.props.maintenance && {...this.props.maintenance} || null,
        actions: [
            { label: 'Save', primary: true, onClick: () => this.saveMaintenance() },
            { label: 'Cancel', onClick: () => this.hideDialog() }
        ]
    }


    componentWillReceiveProps (nextProps) {
        if (this.props.active !== nextProps.active && nextProps.active) {
            this.setState({maintenance: nextProps.maintenance && {...nextProps.maintenance} || null});
        }
    }

    hideDialog = () => {
        this.props.hideDialog();
    }

    saveMaintenance = () => {
        this.props.saveMaintenance(this.state.maintenance);
        this.hideDialog();
    }

    onFhChange = (value) => {
        this.onValueChange('fh', value);
    }

    onCyclesChange = (value) => {
        this.onValueChange('cycles', value);
    }

    onCalendarChange = (value) => {
        this.onValueChange('calendar', value);
    }

    clearCalendar = () => {
        this.onValueChange('calendar', null);
    }

    onValueChange = (field, value) => {
        this.setState({maintenance: {...this.state.maintenance, [field]: value}});
    }

    render () {
        const { active, title } = this.props;
        const { maintenance, actions } = this.state;

        return (
            <Dialog
                active={active}
                onEscKeyDown={this.hideDialog}
                onOverlayClick={this.hideDialog}
                title={title}
                actions={actions}
                className={cx('dialog')} >   
                
                {maintenance && <div>
                <Input 
                    type='number' 
                    label='FH' 
                    value={maintenance.fh || ''} 
                    onChange={this.onFhChange} />                   
                
                <Input 
                    type='number' 
                    label='Cycles' 
                    value={maintenance.cycles || ''} 
                    onChange={this.onCyclesChange} />

                <div className={cx('datePickerWithAction')}>
                    <div className={cx('datePickerWrapper')}>
                        <DatePicker 
                            label='Calendar' 
                            autoOk 
                            value={maintenance.calendar && moment(maintenance.calendar).toDate() || ''} 
                            onChange={this.onCalendarChange} 
                            inputFormat={value => moment(value).format(dateFormat)} />
                    </div>
                    <IconButton icon='clear' onClick={this.clearCalendar} />
                </div>   
                </div>}                
                </Dialog>
        );
    }
}