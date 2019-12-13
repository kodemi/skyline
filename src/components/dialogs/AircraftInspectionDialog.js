import React, { Component, PropTypes } from 'react';
import Dialog from 'react-toolbox/lib/dialog';
import DatePicker from 'react-toolbox/lib/date_picker';
import Input from 'react-toolbox/lib/input';
import { IconButton } from 'react-toolbox/lib/button';
import styles from './AircraftInspectionDialog.scss';
import classNames from 'classnames/bind';
import moment from 'moment';

const cx = classNames.bind(styles);
const dateFormat = 'DD.MM.YYYY';

export default class AircraftInspectionDialog extends Component {
    static propTypes = {
        inspection: PropTypes.object,
        active: PropTypes.bool.isRequired,
        hideDialog: PropTypes.func.isRequired,
        title: PropTypes.string.isRequired,
        saveInspection: PropTypes.func.isRequired
    }

    static defaultProps = {
        active: false,
        inspection: null,
        title: ''
    }

    state = {
        inspection: this.props.inspection && {...this.props.inspection} || null,
        actions: [
            { label: 'Save', primary: true, onClick: () => this.saveInspection() },
            { label: 'Cancel', onClick: () => this.hideDialog() }
        ]
    }

    componentWillReceiveProps (nextProps) {
        if (this.props.active !== nextProps.active && nextProps.active) {
            this.setState({inspection: nextProps.inspection && {...nextProps.inspection} || null});
        }
    }

    hideDialog = () => {
        this.props.hideDialog();
    }

    saveInspection = () => {
        this.props.saveInspection(this.state.inspection);
        this.hideDialog();
    }

    onRequiredEveryHoursChange = (value) => {
        this.onValueChange('requiredEvery', 'hours', Number(value) || null);
    }

    onRequiredEveryLdgsChange = (value) => {
        this.onValueChange('requiredEvery', 'ldgs', Number(value) || null);
    }

    onRequiredEveryMosChange = (value) => {
        this.onValueChange('requiredEvery', 'mos', Number(value) || null);
    }

    onLastComplianceHoursChange = (value) => {
        this.onValueChange('lastCompliance', 'hours', Number(value) || null);
    }

    onLastComplianceLdgsChange = (value) => {
        this.onValueChange('lastCompliance', 'ldgs', Number(value) || null);
    }

    onLastComplianceDateChange = (value) => {
        this.onValueChange('lastCompliance', 'date', value);
    }

    clearLastComplianceDate = () => {
        this.onValueChange('lastCompliance', 'date', null);
    }

    onValueChange = (group, field, value) => {
        this.setState({
            inspection: {
                ...this.state.inspection, 
                [group]: {...this.state.inspection[group], [field]: value}
            }
        });
    }

    render () {
        const { active, title } = this.props;
        const { inspection, actions } = this.state;

        return (
            <Dialog
                active={active}
                onEscKeyDown={this.hideDialog}
                onOverlayClick={this.hideDialog}
                title={title}
                actions={actions}
                className={cx('dialog')} >   
                
                {inspection && <div>
                
                <p>Required Every</p>
                <div style={{display: 'flex'}}>
                    <Input 
                        type='number' 
                        label='Hours' 
                        value={inspection.requiredEvery.hours || ''} 
                        onChange={this.onRequiredEveryHoursChange} />
                    <Input 
                        type='number' 
                        label='LDGS' 
                        value={inspection.requiredEvery.ldgs || ''} 
                        onChange={this.onRequiredEveryLdgsChange} />
                    <Input 
                        type='number' 
                        label='MOS' 
                        value={inspection.requiredEvery.mos || ''} 
                        onChange={this.onRequiredEveryMosChange} />
                </div>
                <p>Last Compliance</p>
                <div style={{display: 'flex'}}>
                    <Input 
                        type='number' 
                        label='Hours' 
                        value={inspection.lastCompliance.hours || ''} 
                        onChange={this.onLastComplianceHoursChange} />
                    <Input 
                        type='number' 
                        label='LDGS' 
                        value={inspection.lastCompliance.ldgs || ''} 
                        onChange={this.onLastComplianceLdgsChange} />
                    <div className={cx('datePickerWithAction')}>
                        <div className={cx('datePickerWrapper')}>
                            <DatePicker 
                                label='Date' 
                                autoOk 
                                value={inspection.lastCompliance.date && moment(inspection.lastCompliance.date).toDate() || ''} 
                                onChange={this.onLastComplianceDateChange} 
                                inputFormat={value => moment(value).format(dateFormat)} />
                        </div>
                        <IconButton icon='clear' onClick={this.clearLastComplianceDate} />
                    </div>
                </div>           

                </div>}                
                </Dialog>
        );
    }
}